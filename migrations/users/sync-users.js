import Bluebird from 'bluebird';

import { model as User } from '../../website/server/models/user'
import { model as Challenge } from '../../website/server/models/challenge';

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

module.exports = async function syncUsers () {
  let users = User.find({ $where: "this.tasksOrder.habits.length < 49" }).cursor();

  // users.on('error', function (err) {
  //   console.error(err)
  // })

  // users.on('data', function (doc) {
  //   console.log(doc.auth.local.username)
  // })

  users.eachAsync(async function (user) {
    console.log(user.auth.local.username)
    await addUserToChallenges(user);
  })
}
