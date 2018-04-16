
import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import pouchdbfind from 'pouchdb-find';
import blobUtil from 'blob-util';

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
  private movies = {};

  constructor() {
    this.options = {
      live: true,
      retry: true,
      continuous: true
    }
    this.sharedRemote = "http://localhost:5984/shared";
    PouchDB.plugin(pouchdbfind);
  }

  init(details) {
    this.db = new PouchDB('cloudo');
    this.remote = details.userDBs.supertest;
    this.user = details.user_id;
    this.db.sync(this.remote, this.options);
    console.log(this.remote)
    this.sdb = new PouchDB('shared');
    this.sdb.sync(this.sharedRemote, this.options)
  }

  register(user)
  {
    this.user = user.username;
    this.sdb.put({
      _id: user.username,
      friends: [],
      recommendations: []
    })
  }

  getUser() {
    return this.user;
  }

  async inviteFriend(username)
  {
    try {
      let doc = await this.sdb.get(this.user);
      let friends = doc.friends;
      friends.push({"username": username, "accepted": false, "declined": false})
      let response = await this.sdb.put({
        _id: doc._id,
        _rev: doc._rev,
        friends: friends,
        recommendations: doc.recommendations
      });

      // add to the other guy

      let otherdoc = await this.sdb.get(username);
      let otherfriends = otherdoc.friends;
      otherfriends.push({"username": this.user, "accepted": false, "declined": false})
      let response2 = await this.sdb.put({
        _id: otherdoc._id,
        _rev: otherdoc._rev,
        friends: otherfriends,
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
    // return array of usernames 
    try {
      let doc =  await this.sdb.get(this.user)
      return doc.friends.filter((friend) => {
        return (!friend.accepted && !friend.declined)
      })
    }
    catch(err) { console.log(err)}
  }


  async declineFriendInvite(username)
  {
    try {
      let doc = await this.sdb.get(this.user);
      let friends = doc.friends;

      let index = this.findFriend(friends, username);
      if (index > -1) {
        friends.splice(index, 1);
      }
      friends.push({"username": username, "accepted": false, "declined": true})
      let response = await this.sdb.put({
        _id: doc._id,
        _rev: doc._rev,
        friends: friends,
        recommendations: doc.recommendations
      });


       // decline the other guy

       let otherdoc = await this.sdb.get(username);
       let otherfriends = otherdoc.friends;
       otherfriends.push({"username": this.user, "accepted": false, "declined": true})
       let response2 = await this.sdb.put({
         _id: otherdoc._id,
         _rev: otherdoc._rev,
         friends: otherfriends,
         recommendations: otherdoc.recommendations
       });
 


    } catch (err) {
      console.log(err);
    }

  }



  async acceptFriendInvite(username)
  {
    try {
      let doc = await this.sdb.get(this.user);
      let friends = doc.friends;

      let index = this.findFriend(friends, username);
      if (index > -1) {
        friends.splice(index, 1);
      }
      friends.push({"username": username, "accepted": true, "declined": false})
      let response = await this.sdb.put({
        _id: doc._id,
        _rev: doc._rev,
        friends: friends,
        recommendations: doc.recommendations
      });

       // accept the other guy

       let otherdoc = await this.sdb.get(username);
       let otherfriends = otherdoc.friends;

       let otherindex = this.findFriend(friends, username);
       if (otherindex > -1) {
        otherfriends.splice(otherindex, 1);
       }
       otherfriends.push({"username": this.user, "accepted": true, "declined": false})
       let response2 = await this.sdb.put({
         _id: otherdoc._id,
         _rev: otherdoc._rev,
         friends: otherfriends,
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

  async addFriend(username)
  {
    try {
      let doc = await this.sdb.get(this.user);
      let friends = doc.friends;
      friends.push(username)
      let response = await this.sdb.put({
        _id: doc._id,
        _rev: doc._rev,
        friends: friends,
        recommendations: doc.recommendations
      });
    } catch (err) {
      console.log(err);
    }
  }

  async getFriends(username)
  {
    try {
      let doc =  await this.sdb.get(username)
      return doc.friends;
    }
    catch(err) { console.log(err)}
  }


  // {
  

  async addRecommendation(movie: {"id": string, "title": string, "poster": string, "overview": string}, username ) {
    try {
      let doc = await this.sdb.get(username);
      let recommendations = doc.recommendations;
      recommendations.push(movie)
      let response = await this.sdb.put({
        _id: doc._id,
        _rev: doc._rev,
        friends: doc.friends,
        recommendations: recommendations
      });
    } catch (err) {
      console.log(err);
    }

  }
  async getRecommendations(username) {
    try {
      let doc =  await this.sdb.get(username)
      console.log(doc)
      console.log(username)
      return doc.recommendations;
      
    }
    catch(err) { console.log(err)}
  }


  async addMovie(type: string, movie: any) {

    await this.db.put({
      _id: type + movie.title,
      title: movie.title
    })
    let blob = await blobUtil.imgSrcToBlob(movie.poster, 'image/jpeg','Anonymous', 1.0)
    let doc = await this.db.get(type + movie.title);
    await this.db.putAttachment(type + movie.title, movie.title + '.png', doc._rev, blob, 'image/png')
  }


  async getMovies_async(type: string)
  {
    this.movies[type] = [];
    let result = await this.db.allDocs({
      include_docs: true,
      startkey: type,
      endkey: type + '\ufff0',
      attachments: true
    })
    
    result.rows.forEach(async movieRow => {
      let blob = await this.db.getAttachment(type + movieRow.doc.title, movieRow.doc.title + '.png' )
      let posterURL = await blobUtil.blobToDataURL(blob)
      let movie = {title: movieRow.doc.title, poster: posterURL}
      this.movies[type].push(movie)
    })
    return this.movies[type];
  }

  }







  


