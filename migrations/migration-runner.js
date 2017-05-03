require("babel-register");
require("babel-polyfill");

// This file must use ES5, everything required can be in ES6

function setUpServer () {
  var nconf = require('nconf');
  var mongoose = require('mongoose', {server: { poolSize: 5 },});
  var Bluebird = require('bluebird');
  var setupNconf = require('../website/server/libs/setupNconf');
  setupNconf();
  // We require src/server and npt src/index because
  // 1. nconf is already setup
  // 2. we don't need clustering
  require('../website/server/server'); // eslint-disable-line global-require
}
setUpServer();

var regiserComedUsers = require('./users/register-users-comed');
// var regiserComedUsers = require('./tasks/add-tasks');
// var regiserComedUsers = require('./challenges/add-challenges');
// var regiserComedUsers = require('./groups/create-groups');
// var regiserComedUsers = require('./users/sync-users');
// var regiserComedUsers = require('./users/comed-weekly-report');
// var regiserComedUsers = require('./users/generate-report');

try {
  regiserComedUsers()
} catch (error) {
  console.log(error)
}
