# Story Circle

[Welcome to Story Circle!](http://story-circle.herokuapp.com/)

Story Circle is a collaborative story telling app. Only one story is being written at a time, by anyone who wants to join in on the fun! Your browser will get instant updates so you'll know exactly what the current story looks like.

Write collaborative stories with our [online app](http://story-circle.herokuapp.com/).

![story-circle-new-story](https://github.com/SamuelLangenfeld/nov-hackaton-studious-chainsaw/blob/master/public/assets/images/white-rabbit.png?raw=true)

As soon as someone else writes another part of the story, your page will automatically update, so you won't miss out on all of the amazing contributions headed your way.

![story-circle-collaboration](https://github.com/SamuelLangenfeld/nov-hackaton-studious-chainsaw/blob/master/public/assets/images/ivy.png?raw=true)

Story Circle was created in a one day hackathon. It relies on MongoDB and Mongoose for the database, Express for the server, and Socket.Io for web sockets. The package.json file has the full list of dependencies.

Story Circle is run in a node environment, specifically [version 8.5.0](https://nodejs.org/en/download/), and uses [npm](https://www.npmjs.com/) for installation. To install story circle and run it locally, simply download or clone this repository, then run "npm install" from the repository's command line. This will install everything needed to run story circle. You'll also need to have [MongoDB](https://docs.mongodb.com/getting-started/shell/installation/) installed on your machine. Once you have everything installed make sure MongoDB is running, then run "npm start" from the repository's command line and you'll be up and running.

This was a really fun, one day hackathon project. I have a wish list of ways I would improve this project that I may implement in the future.

1. Refactor to use a Redis database instead of MongoDB. It would let me avoid having race case scenarios when it comes to multiple authors trying to save the last section of a story at the same time. Redis has atomic operations, while MongoDB does not.

2. Implement another socket io emitter to display a counter with the number of remaining section to a story before the story will be completed.

3. Major overhaul of the styling to give make it more unique and flavorful instead of running the basic bootstrap configurations.

4. More explicit error handling and more validation checks. I have validations in the html and on the database level, but I would like to add some more to the server, as well as ways to handle cases where models did not save correctly to the database.

5. User login and validation. I'm not certain I actually want this one. I think the anonymous nature of the app is a lot of fun, and there's much less friction when you don't need to create an account.
