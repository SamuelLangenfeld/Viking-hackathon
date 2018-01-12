const mongoose = require("mongoose");
const mongooseeder = require("mongooseeder");
const models = require("./../models/index.js");

var env = process.env.NODE_ENV || "development";
var config = require("./../config/mongo")[env];

const mongodbUrl =
  process.env.NODE_ENV === "production" ?
  process.env[config.use_env_variable] :
  `mongodb://${config.host}/${config.database}`;

mongooseeder.seed({
  mongodbUrl: mongodbUrl,
  models: models,
  clean: true,
  mongoose: mongoose,
  seeds: () => {
    // --------------------------------------
    // Create Stories
    // --------------------------------------

    /*
      Just clears database,
      starts with a clean slate
    */
  }
});