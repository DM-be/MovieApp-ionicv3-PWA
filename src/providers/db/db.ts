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
  init(details) {
    
    

    this.db = new PouchDB('cloudo', {adapter : 'idb'});
    this.remote = details.userDBs.supertest;
    console.log(this.remote)
    this.user = details.user_id;

    console.log(this.db.adapter)
    this.sdb = new PouchDB('shared', {adapter : 'idb'});
    console.log(this.sdb.adapter)

    this.db.sync(this.remote).on('complete', (info) => { // with the live options, complete never fires, so when its in sync, fire an event in the register page
        this.db.sync(this.remote, this.options);
        this.events.publish("localsync:completed");
        this.initializeMovies();
    })

    this.sdb.sync(this.sharedRemote, this.sharedOptions);
    this.loggedIn = true;


    }
  
  async initializeMovies() {
    await this.getMovies_async("watch");
    await this.getMovies_async("seen");
  }
  

  register(user)
  {
    console.log(user)
    this.user = user.username;
    this.sdb.put({
      _id: user.username,
      friends: [],
      sentInvites: [],
      recievedInvites: [],
      recommendations: [],
    })
    this.loggedIn = true;
  }

  logOut() {
    this.movies = undefined;
    this.db.destroy().then(() => {
      console.log("db removed")
    });
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
      let allUsers = [];
    let doc = await this.sdb.allDocs({
        include_docs: true,
        attachments: false
      })
    doc.rows.forEach(userDoc => {
      console.log(userDoc)
      allUsers.push({"username": userDoc.doc._id}); // todo add avatars
    });
    return allUsers;
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
      let sentInvites = doc.sentInvites;
      sentInvites.push({"username": username, "accepted": false, "declined": false})
      let response = await this.sdb.put({
        _id: doc._id,
        _rev: doc._rev,
        friends: doc.friends,
        sentInvites: sentInvites,
        recievedInvites: doc.recievedInvites,
        recommendations: doc.recommendations
      });
      


      let otherdoc = await this.sdb.get(username);
      let recievedInvites = otherdoc.recievedInvites;
      recievedInvites.push({"username": this.user, "accepted": false, "declined": false})
      let response2 = await this.sdb.put({
        _id: otherdoc._id,
        _rev: otherdoc._rev,
        friends: otherdoc.friends,
        sentInvites: otherdoc.sentInvites,
        recievedInvites: recievedInvites,
        recommendations: otherdoc.recommendations
      });

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
      let recievedInvites = doc.recievedInvites
      let index = this.findFriend(recievedInvites, username);
      if (index > -1) {
        recievedInvites.splice(index, 1); // remove from recievedInvites when declining
      }
      let response = await this.sdb.put({
        _id: doc._id,
        _rev: doc._rev,
        friends: doc.friends,
        sentInvites: doc.sentInvites,
        recievedInvites: recievedInvites, // update recievedinvites (one less recievedinvite)
        recommendations: doc.recommendations
      });
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
      let recievedInvites = doc.recievedInvites
      let index = this.findFriend(recievedInvites, username);
      if (index > -1) {
        recievedInvites.splice(index, 1); // remove from recievedInvites when accepting
      }
      let friends = doc.friends;
      friends.push({"username": username, "accepted": true, "declined": false})
      // push the friend to the friends array
      let response = await this.sdb.put({
        _id: doc._id,
        _rev: doc._rev,
        friends: friends,
        sentInvites: doc.sentInvites,
        recievedInvites: recievedInvites, // update recievedinvites (cleared it so we wont prompt again)
        recommendations: doc.recommendations
      });

       // add the invitee to the inviters friends array

       let otherdoc = await this.sdb.get(username);
       let otherfriends = otherdoc.friends;

       otherfriends.push({"username": this.user, "accepted": true, "declined": false})
       let response2 = await this.sdb.put({
        _id: otherdoc._id,
        _rev: otherdoc._rev,
        friends: otherfriends,
        sentInvites: otherdoc.sentInvites,
        recievedInvites: otherdoc.recievedInvites,
        recommendations: otherdoc.recommendations
       });
 

    } catch (err) {
      console.log(err);
    }



  }

  async getAcceptedFriends()
  {
    try {
      let doc =  await this.sdb.get(this.user)
      return doc.friends.filter((friend) => {
        return (!friend.declined && friend.accepted)
      })
    }
    catch(err) { console.log(err)}

  }

  // todo: blob the images of recommendations as well
  async addRecommendation(movie: {"id": string, "title": string, "poster": string, "overview": string}, username ) {
    try {
      let doc = await this.sdb.get(username);
      let recommendations = doc.recommendations;
      recommendations.push(movie)
      let response = await this.sdb.put({
        _id: doc._id,
        _rev: doc._rev,
        friends: doc.friends,
        sentInvites: doc.sentInvites,
        recievedInvites: doc.recievedInvites,
        recommendations: recommendations
      });
    } catch (err) {
      console.log(err);
    }

  }
  async getRecommendations(username) { // remove username into this.user
    try {
      let doc =  await this.sdb.get(username)
      return doc.recommendations;
      
    }
    catch(err) { console.log(err)}
  }


  // todo: rename movie ids etc, now has empty spaces..., maybe add movie id?
  async addMovie(type: string, movie: any) {
    await this.db.put({
      _id: type + movie.title,
      title: movie.title
    })
    let blob = await blobUtil.imgSrcToBlob(movie.poster, 'image/jpeg','Anonymous', 1.0);
    let dataURL = await blobUtil.blobToDataURL(blob);
    let doc = await this.db.get(type + movie.title);
    await this.db.putAttachment(type + movie.title, movie.title + '.png', doc._rev, blob, 'image/png')
    let newMovie = {title: movie.title, poster: dataURL}
    this.movies[type].push(newMovie);
      // this.events.publish("addedMovie");
    
   
    
  }

  // todo: rename, refactor, make it work for recommendations as well
  async getMovies_async(type: string)
  {


    if(this.movies)
    {
      console.log(this.movies)
      console.log(`movies of type: ${type} are loaded, no need to call the remote`)
      return Promise.resolve();
    }

    else {
    console.log(`gotta get moves of type: ${type} from the db, calling remote`)
    
    return new Promise(async resolve => {

    this.movies = {} ;
    
    let result = await this.db.allDocs({
      include_docs: true,
      startkey: type,
      endkey: type + '\ufff0',
      attachments: true,
      binary: true
    })
   // console.log(result)
    this.movies[type] = [];
    result.rows.forEach(async movieRow => {
      if((this.movies[type].findIndex(i => i.title === movieRow.doc.title)) === -1 )
      {
      let blob2 = movieRow.doc._attachments[movieRow.doc.title + '.png'].data
      // let blob = await this.db.getAttachment(type + movieRow.doc.title, movieRow.doc.title + '.png' )
      let posterURL = await blobUtil.blobToDataURL(blob2)
      let newMovie = {title: movieRow.doc.title, poster: posterURL}
      this.movies[type].push(newMovie)
      }
    })
    resolve()
  })
}
    
  }

  }







  


