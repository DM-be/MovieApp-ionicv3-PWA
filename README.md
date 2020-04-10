# MovieApp-ionicv3-PWA

## Description
This is a progressive web application built with Ionic v3. With this application you can keep track of movies you have seen and which movies you would like to see. Friends can be invited. Movie recommendations can be sent. 
It uses service workers and indexedDB (PouchDB) to keep a local database of movies and syncs this with a remote database.
A cache is used to keep requests when the network disconnects.

## Features
* offline cached movie lookup requests
* images are saved locally and reused
* database synchronises locally to a remote database (useable offline)
* invite based friend system
* single page application
* real time data base changes (friends and recommended movies are shown without refreshing/navigating)
* layout changes depending on detected platform (android vs desktop)
* lazy loading images

## Installation
The "add application to starter screen" can be used or a converted android application. 

## Hosting
The app is hosted on heroku with a separate node server responsible for creating users in the database. 


### demo

