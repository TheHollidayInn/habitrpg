import nconf from 'nconf';
import { model as User } from '../../../../../../website/server/models/user';
import { cron } from '../../../../../../website/server/libs/cron';

describe.only('cron', () => {
  let user;
  let tasksByType = {habits: [], dailys: [], todos: [], rewards: []};
  let daysMissed = 0;

  beforeEach(() => {
    user = new User({
      auth: {
        local: {
          username: 'username',
          lowerCaseUsername: 'username',
          email: 'email@email.email',
          salt: 'salt',
          hashed_password: 'hashed_password', // eslint-disable-line camelcase
        },
      },
    });

    sinon.spy(analytics, 'track');

    user._statsComputed = {
      mp: 10,
    };

    sandbox.stub(nconf, 'get').withArgs('GAME:TASKS_AGING').returns('true');
  });

  afterEach(() => {
    analytics.track.restore();
    nconf.get.restore();
  });

  describe('login incentives 2', () => {
    it('awards user bard robes if login incentive is 1', () => {
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(1);
      expect(user.items.gear.owned.armor_special_bardRobes).to.eql(true);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });
  });
});
