require("babel-register");
require("babel-polyfill");

<<<<<<< HEAD
// This file must use ES5, everything required can be in ES6

=======
>>>>>>> Added initial register user migration
function setUpServer () {
  var nconf = require('nconf');
  var mongoose = require('mongoose');
  var Bluebird = require('bluebird');
  var setupNconf = require('../website/server/libs/setupNconf');
  setupNconf();
  // We require src/server and npt src/index because
  // 1. nconf is already setup
  // 2. we don't need clustering
  require('../website/server/server'); // eslint-disable-line global-require
}
setUpServer();

<<<<<<< HEAD
// Replace this with your migration
var processUsers = require('./new_stuff');
processUsers();
=======
var regiserComedUsers = require('./register-users-comed');

regiserComedUsers();
>>>>>>> Added initial register user migration
