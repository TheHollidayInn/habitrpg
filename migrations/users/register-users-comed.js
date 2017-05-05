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
import { model as Group } from '../../website/server/models/group';
import * as passwordUtils from '../../website/server/libs/password';
import common from '../../website/common';
// import newUsers from './newUsers';


let challengeIds = [
  'de61fb54-d200-42bc-a917-70b70d8cd408',
  '033c5270-0cc6-4a51-b62d-e61450d1fde8',
  'cb0c29f1-7468-4126-876e-f6b97881016a',
  'e1661681-d25c-4471-a4cb-e6eb25915f66',
  '0afd0d36-39e4-49a0-ad2f-fa7479df99e9',
  'd9f86ef5-46ea-4634-acee-ac4aff67b89d',
];

let challengeNames = [
  'Power Quality and Reliability',
  'Price',
  'Billing and Pay',
  'Corporate Citizenship',
  'Communications',
  'Customer Service'
];

let challengesFoundHash = {};

async function addUserToChallenges(user) {
  for (let challengeId of challengeNames) {
    let promises = [];
    let challenge = challengesFoundHash[challengeId];
    if (!challenge) challenge = await Challenge.findOne({ name: challengeId }).exec();
    console.log(challenge._id)
    challenge.memberCount += 1;

    promises.push(challenge.syncToUser(user)); /// @TODO: Check this out with tag syncing
    promises.push(challenge.save());
    promises.push(user.save());
    await Bluebird.all(promises);
  }
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
  let password = 'PowerUpJD';
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

async function addUserToGroup(user, team) {
  // @TODO: cache groups
  let group = await Group.find({name: team}, '_id').exec();
  if (group[0] && user.guilds.indexOf(group[0]._id) === -1) user.guilds.push(group[0]._id);
}

let count = 0;

async function registerUsers (userToRegister) {
  let email = userToRegister.displayName;
  let user = await User.findOne({'auth.local.username': email}).exec();
  if (!user) {
    let newUser = await createNewUser(userToRegister);
    user = new User(newUser);
    user.tags = [];
    await user.save();
  }

  count += 1;
  console.log(userToRegister.displayName, count)

  addAllItems(user);
  await addUserToGroup(user, userToRegister.Team)
  user.auth.local.email = userToRegister.email;
  user.tags = [
    {
        "name" : "Price",
        "challenge" : "true",
        "id" : "033c5270-0cc6-4a51-b62d-e61450d1fde8"
    },
    {
        "name" : "Power Quality and Reliability",
        "challenge" : "true",
        "id" : "de61fb54-d200-42bc-a917-70b70d8cd408"
    },
    {
        "name" : "Billing and Pay",
        "challenge" : "true",
        "id" : "cb0c29f1-7468-4126-876e-f6b97881016a"
    },
    {
        "name" : "Corporate Citizenship",
        "challenge" : "true",
        "id" : "e1661681-d25c-4471-a4cb-e6eb25915f66"
    },
    {
        "name" : "Communications",
        "challenge" : "true",
        "id" : "0afd0d36-39e4-49a0-ad2f-fa7479df99e9"
    },
    {
        "name" : "Customer Service",
        "challenge" : "true",
        "id" : "d9f86ef5-46ea-4634-acee-ac4aff67b89d"
    }
  ];
  user.flags.communityGuidelinesAccepted = true;
  user.preferences.suppressModals.levelUp = true;
  user.preferences.tasks.confirmScoreNotes = true;
  user.preferences.tasks.groupByChallenge = true;
  user.vicePresidentName = userToRegister.VicePresidentName;

  await user.save();

  await addUserToChallenges(user);
}


module.exports = async function regiserComedUsers () {
  var users = [
    // {
    //   email: 'keith@habit.com',
    //   displayName: 'Keith',
    // },
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
    // {
    //   "displayName": "Maricela Lubash (Prin Work Plan Coordinator)",
    //   "email": "maricela.mendoza@comed.com",
    //   "Team": "Erika Bonelli(43385)",
    //   "VicePresidentName": "David Perez"
    // },
    // {
    //   "displayName": "Emilio Pasqua",
    //   "Team": "	Ronald Donovan(47843)",
    //   "VicePresidentName": "Val Jensen"
    // },
    // {
    //   "displayName": "Anton Zmolek",
    //   "Team": "Anne Pramaggiore(57467)",
    //   "VicePresidentName": "Anne Pramaggiore"
    // },
    // {
    //   "email": "erica.borggren@comed.com",
    //   "displayName": "Erica Borggren",
    //   "Team": "Anne Pramaggiore(57467)",
    //   "VicePresidentName": "Anne Pramaggiore"
    // },

    {
      "displayName": "Amy Donnelly",
      "email": "amy.donnelly@habit.com",
      "Team": "Ronald Donovan(47843)",
      "VicePresidentName": "Val Jensen"
    },
    {
      "displayName": "Trinette Wynne",
      "email": "trinette.wynne@habit.com",
      "Team": "Ronald Donovan(47843)",
      "VicePresidentName": "Val Jensen"
    },
  ];

  // users = newUsers;

  let beginIndex = 2671 + 3112;
  count = beginIndex;
  let endIndex = 6500;

  console.log("start")

  // let usersToProcess = users.slice(beginIndex, endIndex);
  for(let user of users) {
    // console.log(user);
    await registerUsers(user)
  }
  // usersToProcess.forEach(registerUsers);
};
