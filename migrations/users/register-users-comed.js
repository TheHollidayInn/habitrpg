var migrationName = 'restore_profile_data.js';
var authorName = 'ThehollidayInn'; // in case script author needs to know when their ...
var authorUuid = ''; //... own data is done

/*
 * Creates users for Comed and adds them to all challenges, awards them all items, pets, mounts,
 * removes defaults tags, and prevents tutorial
 */
import Bluebird from 'bluebird';

import { wrap as wrapUser } from '../../website/common/script/index';
import { model as User } from '../../website/server/models/user';
import { model as Challenge } from '../../website/server/models/challenge';
import * as passwordUtils from '../../website/server/libs/password';
import common from '../../website/common';


let challengeIds = [
  'de61fb54-d200-42bc-a917-70b70d8cd408',
  '033c5270-0cc6-4a51-b62d-e61450d1fde8',
  'cb0c29f1-7468-4126-876e-f6b97881016a',
  'e1661681-d25c-4471-a4cb-e6eb25915f66',
  '0afd0d36-39e4-49a0-ad2f-fa7479df99e9',
  'd9f86ef5-46ea-4634-acee-ac4aff67b89d',
];

let challengesFoundHash = {};

function addUserToChallenges(user) {
  challengeIds.forEach(async function (challengeId) {
    let promises = [];
    let challenge = challengesFoundHash[challengeId];
    if (!challenge) challenge = await Challenge.findOne({ _id: challengeId }).exec();

    challenge.memberCount += 1;

    promises.push(challenge.syncToUser(user));
    promises.push(challenge.save());
    promises.push(user.save());
    await Bluebird.all(promises);
  });
}

function addAllItems (user) {
  for (let gearKey in common.content.gear.flat) {
    user.items.gear.owned[gearKey] = false;
  }

  for (let petKey in common.content.pets) {
    user.items.pets[petKey] = 5;
  }

  for (let petKey in common.content.questPets) {
    user.items.pets[petKey] = 5;
  }

  for (let mountKey in common.content.mounts) {
    user.items.mounts[mountKey] = true;
  }

  for (let mountKey in common.content.questMounts) {
    user.items.mounts[mountKey] = true;
  }
}

async function createNewUser(user) {
  // @TODO: Move register user to User method or User service
  let password = '';
  let hashed_password = await passwordUtils.bcryptHash(password); // eslint-disable-line camelcase
  let newUser = {
    auth: {
      local: {
        username: user.displayName,
        lowerCaseUsername: user.displayName.toLowerCase(),
        email: user.email,
        hashed_password, // eslint-disable-line camelcase,
        passwordHashMethod: 'bcrypt',
      },
    },
    preferences: {
      language: 'en',
    },
  };

  return newUser;
}

async function registerUsers (userToRegister) {
  let email = userToRegister.email;
  let user = await User.findOne({'auth.local.email': email}).exec();
  if (!user) {
    let newUser = await createNewUser(userToRegister);
    user = new User(newUser);
    await user.save();
    user.tags = [];
    await user.save();
  }

  addUserToChallenges(user);
  addAllItems(user);

  user.flags.communityGuidelinesAccepted = true;
  user.preferences.suppressModals.levelUp = true;
  user.preferences.tasks.confirmScoreNotes = true;
  user.preferences.tasks.groupByChallenge = true;

  //Add user to correct guild
  // user.guilds.push();

  await user.save();
}


module.exports = function regiserComedUsers () {
  var users = [
    {
      email: 'keith@habit.com',
      displayName: 'Keith',
    },
    // {
    //   email: 'admin@habit.com',
    //   displayName: 'Admin',
    // },
    // {email: 'timothy.webster@exeloncorp.com', displayName: 'Timothy S Webster (Sr Tech & Process Innov Mgr)'},
    // {email: 'jared.bulloch@exeloncorp.com', displayName: 'Jared Bulloch (Staff Augmentation)'},
    // {email: 'Paula.Corey@ComEd.com', displayName: 'Paula E Corey (Prin Business Project Manager)'},
    // {email: 'pgreen@eiredirect.com', displayName: 'Patricia Green (Eire)'},
    // {email: 'amandamckinney@leoburnett.com', displayName: 'Amanda McKinney (LeoBurnett)'},
    // {email: 'trisha.kaput@leoburnett.com', displayName: 'Trisha Kaput (LeoBurnett)'},
    // {email: 'Wendy.Hines@exeloncorp.com', displayName: 'Wendy Hines (Sr Business Project Manager)'},
  ];

  users.forEach(registerUsers);
};
