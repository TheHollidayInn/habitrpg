var migrationName = 'restore_profile_data.js';
var authorName = 'ThehollidayInn'; // in case script author needs to know when their ...
var authorUuid = ''; //... own data is done

/*
 * Creates users for Comed and adds them to all challenges, awards them all items, pets, mounts,
 * removes defaults tags, and prevents tutorial
 */
import Bluebird from 'bluebird';

import { wrap as wrapUser } from '../website/common/script/index';
import { model as User } from '../website/server/models/user';
import { model as Challenge } from '../website/server/models/challenge';
import * as passwordUtils from '../website/server/libs/password';
import common from '../website/common';


let challengeIds = [
  '95163a0e-98c0-4879-a2b9-c40adb6d2376',
];

let challengesFoundHash = {};

async function addUserToChallenges(user) {
  let promises = [];
  challengeIds.forEach(async function (challengeId) {
    let challenge = challengesFoundHash[challengeId];
    if (!challenge) challenge = await Challenge.findOne({ _id: challengeId }).exec();

    challenge.memberCount += 1;

    promises.push(challenge.syncToUser(user));
    promises.push(challenge.save());
  });
  await Bluebird.all(promises);
}

function addAllItems (user) {
  for (let gearKey in common.content.gear.flat) {
    user.items.gear.owned[gearKey] = true;
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

function createNewUser(user) {
  // @TODO: Move register user to User method or User service
  let password = 'habtirpgRocks!@#$';
  let salt = passwordUtils.makeSalt();
  let hashed_password = passwordUtils.encrypt(password, salt); // eslint-disable-line camelcase
  let newUser = {
    auth: {
      local: {
        username: user.displayName,
        lowerCaseUsername: user.displayName.toLowerCase(),
        email: user.email,
        salt,
        hashed_password, // eslint-disable-line camelcase
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
    let newUser = createNewUser(userToRegister);
    user = new User(newUser);
    await user.save();
    user.tags = [];
    await user.save();
  }

  await addUserToChallenges(user);
  addAllItems(user);

  await user.save();
}


module.exports = function regiserComedUsers () {
  var users = [
    {
      email: 'testkeith@test.com',
      displayName: 'Keith',
    }
  ];

  users.forEach(registerUsers);
};
