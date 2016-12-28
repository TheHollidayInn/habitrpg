import { authWithHeaders } from '../../middlewares/auth';
import { model as User } from '../../models/user';

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

    let page = req.query.page ? Number(req.query.page) : 0;
    const perPage = 50;

    let rankedUsers = await User
    .find({})
    .select('profile.name stats.score.overall')
    .sort('-stats.score.overall')
    .skip(page * perPage)
    .limit(perPage)
    .lean()
    .exec();

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

    let page = req.query.page ? Number(req.query.page) : 0;
    const perPage = 50;

    let category = req.params.category;
    let categoryStatString = `stats.score.${category}`;

    let findQuery = {};
    findQuery[categoryStatString] = {$exists: true};

    let rankedUsers = await User
    .find(findQuery)
    .select(`profile.name ${categoryStatString}`)
    .sort(`-${categoryStatString}`)
    .skip(page * perPage)
    .limit(perPage)
    .lean()
    .exec();

    res.respond(200, rankedUsers);
  },
};

module.exports = api;
