import nconf from 'nconf';
import moment from 'moment';
import { model as User } from '../../../../../../website/server/models/user';
import { cron } from '../../../../../../website/server/libs/cron';
import analytics from '../../../../../../website/server/libs/analyticsService';

describe('login incentives', () => {
  let user;
  let tasksByType = {habits: [], dailys: [], todos: [], rewards: []};
  let daysMissed = 0;

  let petNames = [
    'Wolf',
    'TigerCub',
    'PandaCub',
    'LionCub',
    'Fox',
    'FlyingPig',
    'Dragon',
    'Cactus',
    'BearCub',
  ];

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

    user._statsComputed = {
      mp: 10,
    };

    sinon.spy(analytics, 'track');
  });

  afterEach(() => {
    analytics.track.restore();
  });

  describe('set 1', () => {
    it('increments incentive counter each cron', () => {
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(1);
      user.lastCron = moment(new Date()).subtract({days: 1});
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(2);
    });

    it('pushes a notification of the day\'s incentive each cron', () => {
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.notifications.length).to.be.greaterThan(1);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('replaces previous notifications', () => {
      cron({user, tasksByType, daysMissed, analytics});
      cron({user, tasksByType, daysMissed, analytics});
      cron({user, tasksByType, daysMissed, analytics});

      let filteredNotifications = user.notifications.filter(n => n.type === 'LOGIN_INCENTIVE');

      expect(filteredNotifications.length).to.equal(1);
    });

    it('increments loginIncentives by 1 even if days are skipped in between', () => {
      daysMissed = 3;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(1);
    });

    it('increments loginIncentives by 1 even if user has Dailies paused', () => {
      user.preferences.sleep = true;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(1);
    });

    it('awards user bard robes if login incentive is 1', () => {
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(1);
      expect(user.items.gear.owned.armor_special_bardRobes).to.eql(true);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user incentive backgrounds if login incentive is 2', () => {
      user.loginIncentives = 1;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(2);
      expect(user.purchased.background.blue).to.eql(true);
      expect(user.purchased.background.green).to.eql(true);
      expect(user.purchased.background.purple).to.eql(true);
      expect(user.purchased.background.red).to.eql(true);
      expect(user.purchased.background.yellow).to.eql(true);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user Bard Hat if login incentive is 3', () => {
      user.loginIncentives = 2;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(3);
      expect(user.items.gear.owned.head_special_bardHat).to.eql(true);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user RoyalPurple Hatching Potion if login incentive is 4', () => {
      user.loginIncentives = 3;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(4);
      expect(user.items.hatchingPotions.RoyalPurple).to.eql(1);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user a Chocolate, Meat and Pink Contton Candy if login incentive is 5', () => {
      user.loginIncentives = 4;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(5);

      expect(user.items.food.Chocolate).to.eql(1);
      expect(user.items.food.Meat).to.eql(1);
      expect(user.items.food.CottonCandyPink).to.eql(1);

      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user moon quest if login incentive is 7', () => {
      user.loginIncentives = 6;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(7);
      expect(user.items.quests.moon1).to.eql(1);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user RoyalPurple Hatching Potion if login incentive is 10', () => {
      user.loginIncentives = 9;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(10);
      expect(user.items.hatchingPotions.RoyalPurple).to.eql(1);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user a Strawberry, Patato and Blue Contton Candy if login incentive is 14', () => {
      user.loginIncentives = 13;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(14);

      expect(user.items.food.Strawberry).to.eql(1);
      expect(user.items.food.Potatoe).to.eql(1);
      expect(user.items.food.CottonCandyBlue).to.eql(1);

      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user a bard instrument if login incentive is 18', () => {
      user.loginIncentives = 17;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(18);
      expect(user.items.gear.owned.weapon_special_bardInstrument).to.eql(true);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user second moon quest if login incentive is 22', () => {
      user.loginIncentives = 21;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(22);
      expect(user.items.quests.moon2).to.eql(1);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user a RoyalPurple hatching potion if login incentive is 26', () => {
      user.loginIncentives = 25;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(26);
      expect(user.items.hatchingPotions.RoyalPurple).to.eql(1);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user Fish, Milk, Rotten Meat and Honey if login incentive is 30', () => {
      user.loginIncentives = 29;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(30);

      expect(user.items.food.Fish).to.eql(1);
      expect(user.items.food.Milk).to.eql(1);
      expect(user.items.food.RottenMeat).to.eql(1);
      expect(user.items.food.Honey).to.eql(1);

      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user a RoyalPurple hatching potion if login incentive is 35', () => {
      user.loginIncentives = 34;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(35);
      expect(user.items.hatchingPotions.RoyalPurple).to.eql(1);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user the third moon quest if login incentive is 40', () => {
      user.loginIncentives = 39;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(40);
      expect(user.items.quests.moon3).to.eql(1);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user a RoyalPurple hatching potion if login incentive is 45', () => {
      user.loginIncentives = 44;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(45);
      expect(user.items.hatchingPotions.RoyalPurple).to.eql(1);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user a saddle if login incentive is 50', () => {
      user.loginIncentives = 49;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(50);
      expect(user.items.food.Saddle).to.eql(1);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });
  });

  describe('set 2', () => {
    beforeEach(() => {
      sandbox.stub(nconf, 'get').withArgs('GAME:LOGIN_INCENTIVE_SET').returns('2');
    });

    afterEach(() => {
      nconf.get.restore();
    });

    it('awards user royal purple gryphon pet if login incentive is 1', () => {
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(1);
      expect(user.items.pets['Gryphon-RoyalPurple']).to.eql(5);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user winter 2016 gear if login incentive is 2', () => {
      user.loginIncentives = 1;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(2);
      expect(user.items.gear.owned.head_special_winter2016Mage).to.eql(true);
      expect(user.items.gear.owned.armor_special_winter2016Mage).to.eql(true);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user polar bear cub pet if login incentive is 3', () => {
      user.loginIncentives = 2;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(3);
      expect(user.items.pets['BearCub-Polar']).to.eql(5);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user spring rogue gear if login incentive is 4', () => {
      user.loginIncentives = 3;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(4);
      expect(user.items.gear.owned.head_special_springRogue).to.eql(true);
      expect(user.items.gear.owned.armor_special_springRogue).to.eql(true);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user mammoth pet pet if login incentive is 5', () => {
      user.loginIncentives = 4;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(5);
      expect(user.items.pets['Mammoth-Base']).to.eql(5);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user winter 2016 warrior gear if login incentive is 6', () => {
      user.loginIncentives = 5;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(6);
      expect(user.items.gear.owned.head_special_winter2016Warrior).to.eql(true);
      expect(user.items.gear.owned.armor_special_winter2016Warrior).to.eql(true);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user MantisShrimp pet if login incentive is 7', () => {
      user.loginIncentives = 6;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(7);
      expect(user.items.pets['MantisShrimp-Base']).to.eql(5);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user winter 2016 mage gear if login incentive is 8', () => {
      user.loginIncentives = 7;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(8);
      expect(user.items.gear.owned.head_special_winter2016Mage).to.eql(true);
      expect(user.items.gear.owned.armor_special_winter2016Mage).to.eql(true);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user Phoenix pet if login incentive is 9', () => {
      user.loginIncentives = 8;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(9);
      expect(user.items.pets['Phoenix-Base']).to.eql(5);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user winter 2016 healer gear if login incentive is 10', () => {
      user.loginIncentives = 9;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(10);
      expect(user.items.gear.owned.head_special_winter2016Healer).to.eql(true);
      expect(user.items.gear.owned.armor_special_winter2016Healer).to.eql(true);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user Gryphon-RoyalPurple mount if login incentive is 11', () => {
      user.loginIncentives = 10;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(11);
      expect(user.items.mounts['Gryphon-RoyalPurple']).to.eql(true);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user spring 2016 mage gear if login incentive is 12', () => {
      user.loginIncentives = 11;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(12);
      expect(user.items.gear.owned.head_special_spring2016Mage).to.eql(true);
      expect(user.items.gear.owned.armor_special_spring2016Mage).to.eql(true);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user BearCub-Polar mount if login incentive is 13', () => {
      user.loginIncentives = 12;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(13);
      expect(user.items.mounts['BearCub-Polar']).to.eql(true);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user spring 2015 mage gear if login incentive is 14', () => {
      user.loginIncentives = 13;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(14);
      expect(user.items.gear.owned.head_special_spring2015Mage).to.eql(true);
      expect(user.items.gear.owned.armor_special_spring2015Mage).to.eql(true);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user Mammoth-Base mount if login incentive is 15', () => {
      user.loginIncentives = 14;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(15);
      expect(user.items.mounts['Mammoth-Base']).to.eql(true);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user mystery set 2014-02 gear if login incentive is 16', () => {
      user.loginIncentives = 15;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(16);
      expect(user.items.gear.owned.head_mystery_201402).to.eql(true);
      expect(user.items.gear.owned.armor_mystery_201402).to.eql(true);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user MantisShrimp-Base mount if login incentive is 17', () => {
      user.loginIncentives = 16;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(17);
      expect(user.items.mounts['MantisShrimp-Base']).to.eql(true);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user mystery set 2014-05 gear if login incentive is 18', () => {
      user.loginIncentives = 17;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(18);
      expect(user.items.gear.owned.head_mystery_201405).to.eql(true);
      expect(user.items.gear.owned.armor_mystery_201405).to.eql(true);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user Phoenix-Base mount if login incentive is 19', () => {
      user.loginIncentives = 18;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(19);
      expect(user.items.mounts['Phoenix-Base']).to.eql(true);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user mystery set 2014-03 gear if login incentive is 20', () => {
      user.loginIncentives = 19;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(20);
      expect(user.items.gear.owned.armor_mystery_201403).to.eql(true);
      expect(user.items.gear.owned.headAccessory_mystery_201493).to.eql(true);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user Holly pets if login incentive is 21', () => {
      user.loginIncentives = 20;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(21);
      let potion = 'Holly';
      petNames.forEach((petName) => {
        expect(user.items.pets[`${petName}-${potion}`]).to.eql(5);
      });

      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user mystery set 2015-01 gear if login incentive is 22', () => {
      user.loginIncentives = 21;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(22);
      expect(user.items.gear.owned.head_mystery_201501).to.eql(true);
      expect(user.items.gear.owned.armor_mystery_201501).to.eql(true);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user Ghost pets if login incentive is 23', () => {
      user.loginIncentives = 22;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(23);

      let potion = 'Ghost';
      petNames.forEach((petName) => {
        expect(user.items.pets[`${petName}-${potion}`]).to.eql(5);
      });

      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user special winter 2017 rogue gear if login incentive is 24', () => {
      user.loginIncentives = 23;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(24);
      expect(user.items.gear.owned.head_special_winter2017Rogue).to.eql(true);
      expect(user.items.gear.owned.armor_special_winter2017Rogue).to.eql(true);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user Peppermint pets if login incentive is 25', () => {
      user.loginIncentives = 24;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(25);

      let potion = 'Peppermint';
      petNames.forEach((petName) => {
        expect(user.items.pets[`${petName}-${potion}`]).to.eql(5);
      });

      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user special spring warrior gear if login incentive is 26', () => {
      user.loginIncentives = 25;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(26);
      expect(user.items.gear.owned.head_special_springWarrior).to.eql(true);
      expect(user.items.gear.owned.armor_special_springWarrior).to.eql(true);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user Floral pets if login incentive is 27', () => {
      user.loginIncentives = 26;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(27);

      let potion = 'Floral';
      petNames.forEach((petName) => {
        expect(user.items.pets[`${petName}-${potion}`]).to.eql(5);
      });

      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user special summer 2015 rogue gear if login incentive is 28', () => {
      user.loginIncentives = 27;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(28);
      expect(user.items.gear.owned.head_special_summer2015Rogue).to.eql(true);
      expect(user.items.gear.owned.armor_special_summer2015Rogue).to.eql(true);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user RoyalPurple pets if login incentive is 29', () => {
      user.loginIncentives = 28;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(29);

      let potion = 'RoyalPurple';
      petNames.forEach((petName) => {
        expect(user.items.pets[`${petName}-${potion}`]).to.eql(5);
      });

      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user special summer healer gear if login incentive is 30', () => {
      user.loginIncentives = 29;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(30);
      expect(user.items.gear.owned.head_special_summerHealer).to.eql(true);
      expect(user.items.gear.owned.armor_special_summerHealer).to.eql(true);
      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user Thunderstorm mounts if login incentive is 31', () => {
      user.loginIncentives = 30;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(31);

      let potion = 'Thunderstorm';
      petNames.forEach((petName) => {
        expect(user.items.mounts[`${petName}-${potion}`]).to.eql(true);
      });

      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user Holly mounts if login incentive is 32', () => {
      user.loginIncentives = 31;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(32);

      let potion = 'Holly';
      petNames.forEach((petName) => {
        expect(user.items.mounts[`${petName}-${potion}`]).to.eql(true);
      });

      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user Ghost mounts if login incentive is 33', () => {
      user.loginIncentives = 32;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(33);

      let potion = 'Ghost';
      petNames.forEach((petName) => {
        expect(user.items.mounts[`${petName}-${potion}`]).to.eql(true);
      });

      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user Peppermint mounts if login incentive is 34', () => {
      user.loginIncentives = 33;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(34);

      let potion = 'Peppermint';
      petNames.forEach((petName) => {
        expect(user.items.mounts[`${petName}-${potion}`]).to.eql(true);
      });

      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user Floral mounts if login incentive is 35', () => {
      user.loginIncentives = 34;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(35);

      let potion = 'Floral';
      petNames.forEach((petName) => {
        expect(user.items.mounts[`${petName}-${potion}`]).to.eql(true);
      });

      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });

    it('awards user RoyalPurple mounts if login incentive is 36', () => {
      user.loginIncentives = 35;
      cron({user, tasksByType, daysMissed, analytics});
      expect(user.loginIncentives).to.eql(36);

      let potion = 'RoyalPurple';
      petNames.forEach((petName) => {
        expect(user.items.mounts[`${petName}-${potion}`]).to.eql(true);
      });

      expect(user.notifications[0].type).to.eql('LOGIN_INCENTIVE');
    });
  });
});
