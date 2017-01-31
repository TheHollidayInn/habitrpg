var redis = require('redis');
var nconf = require('nconf');
var bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

var api = {};

api.constants = {
  LEADERBOARD: 'leaderboard',
  LEADERBOARD_OVERALL: 'leaderboard-overall',
};

api.client = redis.createClient(nconf.get('REDIS_URL'));

module.exports = api;
