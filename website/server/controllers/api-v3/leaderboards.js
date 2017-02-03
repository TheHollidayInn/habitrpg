import { findIndex } from 'lodash';

import { authWithHeaders } from '../../middlewares/auth';
import {
  model as User,
  publicFields as memberFields,
 } from '../../models/user';
import redis from '../../libs/redis';

let api = {};

/**
 * @api {get} /api/v3/leaderboard Get the site wide leaderboard
 * @apiDescription Only the first 50 ranks are returned. More can be accessed passing ?page=n
 * @apiName GetLeaderboard
 * @apiGroup leaderboards
 *
 * @apiParam {Number} page Query Parameter - The result page. Default is 0
 *
 * @apiSuccess {Array} data An array of ranked users
 */
api.getLeaderboard = {
  method: 'GET',
  url: '/leaderboard',
  middlewares: [authWithHeaders()],
  async handler (req, res) {
    req.checkQuery('page', res.t('pageMustBeNumber')).optional().isNumeric();

    let validationErrors = req.validationErrors();
    if (validationErrors) throw validationErrors;

    let user = res.locals.user;

    let page = req.query.page ? Number(req.query.page) : 0;
    const perPage = 10;

    let args1 = [redis.constants.LEADERBOARD_OVERALL, 0, 9];
    let redisSet = await redis.client.zrevrangeAsync(args1);

    if (redisSet.indexOf(user._id) === -1) {
      redisSet.push(user._id);
    }

    let rankedUsers = await User
      .find({_id: {$in: redisSet}})
      .select(`${memberFields} stats`)
      .sort('-stats.score.overall')
      .skip(page * perPage)
      .limit(perPage)
      .lean()
      .exec();

    let zrevrankArgs = [redis.constants.LEADERBOARD_OVERALL, user._id];
    let userRank = await redis.client.zrevrankAsync(zrevrankArgs);

    rankedUsers.forEach(function rankUsers (rankedUser, index) {
      rankedUser.rank = index + 1;
    });

    let userIndex = findIndex(rankedUsers, function findUserInRank (rankedUser) {
      return rankedUser._id === user._id;
    });
    if (userIndex !== -1) rankedUsers[userIndex].rank = userRank + 1;

    res.respond(200, rankedUsers);
  },
};

/**
 * @api {get} /api/v3/leaderboard/:category Get the leader for a specified category
 * @apiDescription Only the first 50 ranks are returned. More can be accessed passing ?page=n
 * @apiName GetLeaderboardCategory
 * @apiGroup leaderboards
 *
 * @apiParam {Number} page Query Parameter - The result page. Default is 0
 *
 * @apiSuccess {Array} data An array of ranked users
 */
api.getLeaderboardCategory = {
  method: 'GET',
  url: '/leaderboard/:category',
  middlewares: [authWithHeaders()],
  async handler (req, res) {
    req.checkParams('category').notEmpty();
    req.checkQuery('page', res.t('pageMustBeNumber')).optional().isNumeric();

    let validationErrors = req.validationErrors();
    if (validationErrors) throw validationErrors;

    let user = res.locals.user;

    let page = req.query.page ? Number(req.query.page) : 0;
    const perPage = 10;

    let category = req.params.category;
    let categoryStatString = `stats.score.${category}`;

    let findQuery = {};
    findQuery[categoryStatString] = {$exists: true};

    let args1 = [`${redis.constants.LEADERBOARD}-${category}`, 0, 9];
    let redisSet = await redis.client.zrevrangeAsync(args1);

    if (redisSet.indexOf(user._id) === -1) {
      redisSet.push(user._id);
    }

    findQuery._id = {$in: redisSet};

    let rankedUsers = await User
      .find(findQuery)
      .select(`${memberFields} stats`)
      .sort(`-${categoryStatString}`)
      .skip(page * perPage)
      .limit(perPage)
      .lean()
      .exec();

    let zrevrankArgs = [`${redis.constants.LEADERBOARD}-${category}`, user._id];
    let userRank = await redis.client.zrevrankAsync(zrevrankArgs);

    rankedUsers.forEach(function rankUsers (rankedUser, index) {
      rankedUser.rank = index + 1;
    });

    let userIndex = findIndex(rankedUsers, function findUser (rankedUser) {
      return rankedUser._id === user._id;
    });
    if (userIndex !== -1) rankedUsers[userIndex].rank = userRank + 1;

    res.respond(200, rankedUsers);
  },
};

module.exports = api;
