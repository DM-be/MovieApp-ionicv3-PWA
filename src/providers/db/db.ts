
import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import pouchdbfind from 'pouchdb-find';

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

  async addRecommendation(movie) {
    try {
      let doc = await this.sdb.get(this.user);
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
      return doc.recommendations;
    }
    catch(err) { console.log(err)}
  }

  }







  


