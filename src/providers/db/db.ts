import { Events } from 'ionic-angular';
import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import pouchdbfind from 'pouchdb-find';
import blobUtil from 'blob-util';
import pouchdbadapteridb from 'pouchdb-adapter-idb';
/*
  Generated class for the DbProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DbProvider {

  private sdb: any;
  private db: any;
  private options: {live: boolean, retry: boolean, continuous: boolean};
  private sharedRemote: string;
  private remote: string;
  private user: string;
  private movies: Object;

  private loggedIn: boolean = false;
  

  private username = "";
  private password = "";
  private sharedOptions: any;

  private basicOptions;

  watchedMovies;

  constructor(public events: Events) {

    this.username = 'bdacf8d9-eac9-4a6f-bc3b-2ad16614d31d-bluemix';
    this.password = '142963408785f5c6fe057bd73c7e0db10527bd0003ab1b889bdf7421a3025c39';
    this.sharedRemote = 'https://bdacf8d9-eac9-4a6f-bc3b-2ad16614d31d-bluemix.cloudant.com/shared-new';
    this.sharedOptions =  {
      live: true,
      retry: true,
      continuous: true,
      auth: {
        username: this.username,
        password: this.password
      }
    } 
    this.basicOptions = {
      auth: {
        username: this.username,
        password: this.password
      }
    }

    this.options = {
      live: true,
      retry: true,
      continuous: true
    }

   // this.sharedRemote = "http://localhost:5984/shared";
    PouchDB.plugin(pouchdbadapteridb);



    this.events.subscribe("addedMovie", () => {
     // this.getMovies_async("watch")
    })
  }

  getlocalDb () {
    return this.db;
  }

  getMovies(type: string)
  {
    return this.movies[type];
  }
  init(details, signingUp: boolean) {
    
    if(this.movies === undefined)
    {
      this.movies = {"watch": [], "seen": []}
    }
    else {
      console.log("variables not initialized")
      console.log(this.movies)
    }

    this.db = new PouchDB('cloudo', {adapter : 'idb'});
    this.remote = details.userDBs.supertest;
    this.user = details.user_id;
    this.sdb = new PouchDB('shared', {adapter : 'idb'});
    this.db.sync(this.remote).on('complete',() => { // with the live options, complete never fires, so when its in sync, fire an event in the register page
        this.db.sync(this.remote, this.options);
        this.initializeMovies(); //todo: cleanup, call this first to get the isinseen etc working
        this.events.publish("localsync:completed");
    })
    this.sdb.sync(this.sharedRemote, this.basicOptions).on('complete', info => {
      this.sdb.sync(this.sharedRemote, this.sharedOptions);
      this.events.publish("sharedsync:completed");
    });
    this.loggedIn = true;
     if(signingUp)
      {
        this.db.put({
          _id: this.user,
          movies: []
        })

      }

    }
    
  
  async initializeMovies() {
   await this.getMoviesByType("watch");
   await this.getMoviesByType("seen");
  }
  async register(user)
  {
    this.sdb.put({
      _id: this.user,
      email: user.email,
      isPublic: true,
      avatar: "https://ionicframework.com/dist/preview-app/www/assets/img/marty-avatar.png",// set a default avatar
      friends: [],
      sentInvites: [],
      recievedInvites: [],
      recommendations: [],
    })
    let doc = await this.sdb.get("allUsers");
    doc.users.push({"username": this.user, "isPublic": true, "avatar": "https://ionicframework.com/dist/preview-app/www/assets/img/marty-avatar.png","email": user.email});
    this.sdb.put(doc);
    this.loggedIn = true;
  }

  logOut() {
    this.movies = undefined;
    this.db.destroy();
    this.sdb.destroy();
  }

  isloggedIn() {
    return this.loggedIn;
  }
  getUser() {
    return this.user;
  }
  async getAllUsers() {
    try {
      let declinedFriends =  await this.getDeclinedFriends();
      let doc = await this.sdb.get("allUsers");
      return doc.users.filter(user => {
        return ((declinedFriends.findIndex(u => u.username === user.username) === -1) && user.username !== this.user && user.isPublic) 
        // filter out declined friends in the searchbar and the logged in user
      })
      // todo add profile page to update this.public (default is now true)
    }
    catch(err) {
      console.log(err)
    }
}
  
  async inviteFriend(username)
  {
    // todo: check sentinvites of a user before allowing to send another invite
    try {
      let doc = await this.sdb.get(this.user);
      doc.sentInvites.push({"username": username, "accepted": false, "declined": false})
      this.sdb.put(doc);
      let otherdoc = await this.sdb.get(username);
      otherdoc.recievedInvites.push({"username": this.user, "accepted": false, "declined": false})
      this.sdb.put(otherdoc);
    } catch (err) {
      console.log(err);
    }
  }

  findFriend(friends, username)
  {
    for (let index = 0; index < friends.length; index++) {
      const friendObject = friends[index];
      if(friendObject.username === username)
      {
        return index;
      }
    }
  }

  async getOpenFriendInvites(){
    try {
      let doc =  await this.sdb.get(this.user)
      return doc.recievedInvites.filter((friend) => {
        return (!friend.accepted && !friend.declined)
      })
    }
    catch(err) { console.log(err)}
  }

  async declineFriendInvite(username)
  {
    try {
      let doc = await this.sdb.get(this.user);
      let index = this.findFriend(doc.recievedInvites, username);
      if (index > -1) {
        doc.recievedInvites.splice(index, 1); // remove from recievedInvites when declining
      }
      doc.friends.push({"username": username, "accepted": false, "declined": true})
      this.sdb.put(doc);
      
      let otherdoc = await this.sdb.get(username);
      otherdoc.friends.push({"username": this.user, "accepted": false, "declined": true});
      this.sdb.put(otherdoc);
      
      // you cant reinvite other friends that declined you, not very subtle
    } catch (err) {
      console.log(err);
    }
  }

  async acceptFriendInvite(username)
  {
    try {
      // todo: rename to make more sense, refactor

      // invitee gets the invite and accepts it by pushing it into his friends array
      let doc = await this.sdb.get(this.user);
      
      let index = this.findFriend(doc.recievedInvites, username);
      if (index > -1) {
        doc.recievedInvites.splice(index, 1); // remove from recievedInvites when accepting
      }
      doc.friends.push({"username": username, "accepted": true, "declined": false})
      // push the friend to the friends array
      this.sdb.put(doc);
// update recievedinvites (cleared it so we wont prompt again)
       
// add the invitee to the inviters friends array
       let otherdoc = await this.sdb.get(username);
       otherdoc.friends.push({"username": this.user, "accepted": true, "declined": false})
       this.sdb.put(otherdoc);
    } catch (err) {
      console.log(err);
    }



  }

  async getAcceptedFriends()
  {
    try {
      let doc =  await this.sdb.get(this.user)
      return doc.friends.filter(friend => {
        return (!friend.declined && friend.accepted)
      })
    }
    catch(err) { console.log(err)}

  }
  async getDeclinedFriends()
  {
    try {
      let doc =  await this.sdb.get(this.user)
      return doc.friends.filter(friend => {
        return friend.declined;
      })
    }
    catch(err) { console.log(err)}
  }

  async addRecommendation(movie: {"id": string, "title": string, "poster": string, "overview": string}, friend, recommendationText ) {
    try {
      let doc = await this.sdb.get(friend.username);
      movie["recommendationText"] = recommendationText;
      movie["recommendedBy"] = friend;
      doc.recommendations.push(movie)
      await this.sdb.put(doc);
    } catch (err) {
      console.log(err);
    }
  }
  async getRecommendations() { 
    try {
      let doc =  await this.sdb.get(this.user)
      return doc.recommendations;
    }
    catch(err) { console.log(err)}
  }

  // todo:add overview etc
  async addMovie(type: string, movie: any) {
    try {
    let doc = await this.db.get(this.user)
    movie["type"] = type;
    doc.movies.push(movie);
    await this.db.put(doc);
    this.movies[type].push(movie);
    }
    catch(err) {console.log(err)}
    
  }

  async getMoviesByType(type: string){
        let doc = await this.db.get(this.user);
        this.movies[type] = doc.movies.filter(movie => movie.type === type);
      // wrap into promise?
  }

  }







  


