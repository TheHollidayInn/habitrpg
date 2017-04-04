import _ from 'lodash';
import Bluebird from 'bluebird';

import * as Tasks from '../../website/server/models/task';
import { model as Challenge } from '../../website/server/models/challenge';

let challenges = [
  {
    "shortName": "Power Quality & Reliability",
    "name": "Power Quality & Reliability",
  },
  {
    "shortName": "Price",
    "name": "Price",
  },
  {
    "shortName": "Billing and Pay",
    "name": "Billing and Pay",
  },
  {
    "shortName": "Corporate Citizenship",
    "name": "Corporate Citizenship",
  },
  {
    "shortName": "Communications",
    "name": "Communications",
  },
  {
    "shortName": "Customer Service",
    "name": "Customer Service",
  },
];

module.exports = async function uploadTasks () {

  let promises = [];
  challenges.forEach(async (challenge) => {

    //@TODO: make params
    challenge.group = '00000000-0000-4000-A000-000000000000';
    challenge.leader = '0d2942b5-bedf-4643-9fe5-473dbc0c8b89';

    let challengeSanatized = new Challenge(Challenge.sanitize(challenge));
    promises.push(challengeSanatized.save());
  });

  try {
    let result = await Bluebird.all(promises)
  } catch (e) {
    console.log(e)
  }
  
}