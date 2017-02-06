let redis = require('redis');
let nconf = require('nconf');
let bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

let api = {};

api.constants = {
  LEADERBOARD: 'leaderboard',
  LEADERBOARD_OVERALL: 'leaderboard-overall',
  LOGGED_TODAY_SET: 'logged-in-today',
};

api.client = redis.createClient(nconf.get('REDIS_URL'));

module.exports = api;
