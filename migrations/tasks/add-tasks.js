import _ from 'lodash';
import Bluebird from 'bluebird';

import * as Tasks from '../../website/server/models/task';
import { model as Challenges } from '../../website/server/models/challenge';

let tasks = [
  {
    text: '**Take a picture of yourself** next to an appliance with a sign showing how much it costs to run it in a normal month. Post it to your favorite social media channel (Facebook, Twitter, Instagram or Pinterest) and use tags *@ComEd, #DollarPower, #Emp*.',
    type: 'habit',
    up: true,
    down: false,
    challengeId: '033c5270-0cc6-4a51-b62d-e61450d1fde8',
    challenge: {
      id: '033c5270-0cc6-4a51-b62d-e61450d1fde8',
      shortName: 'Price',
    },
    question: 'Total monthly cost of your electric service',
    value: 40,
  },
  {
    text: '**Participate in a ComEd charity or organization** event and log your volunteer hours.   Download the Energy for the Community Mobile App. *Use tags  #ComEdVolunteers, #WeAreComEd*',
    type: 'habit',
    up: true,
    down: false,
    challengeId: 'e1661681-d25c-4471-a4cb-e6eb25915f66',
    challenge: {
      // id: '033c5270-0cc6-4a51-b62d-e61450d1fde8',
      shortName: 'Corporate Citizenship',
    },
    question: 'Involvement in local charities and civic organizations',
    value: 50,
  },
  {
    text: '**How do You Power Lives?** We are all in  Customer Service even if you don\'t deal directly with the customers. What you do powers lives. Review the [Leadership and Values tab](https://www.comed.com/AboutUs/Pages/LeadershipValues.aspx) at ComEd.com then tell us how you POWER LIVES in the pop up.',
    type: 'habit',
    up: true,
    down: false,
    challengeId: 'd9f86ef5-46ea-4634-acee-ac4aff67b89d',
    challenge: {
      // id: '033c5270-0cc6-4a51-b62d-e61450d1fde8',
      shortName: 'Customer Service',
    },
    question: 'Representative\'s knowledge',
    value: 20,
  },
];

module.exports = async function uploadTasks () {
  let tasksGroupedByChallenge = _.groupBy(tasks, 'challengeId');
  let challengeIds = _.uniq(_.keys(tasksGroupedByChallenge));
  
  let challenges = await Challenges.find({_id: challengeIds}).exec();
  let challengesById = _.groupBy(challenges, '_id');
  // @TODO: We could iterate through the tasksGroupedByChallenge but we need to sanatize the tasks
  let taskPromises = [];
  tasks.forEach(async (task) => {
    let shortName = task.challenge.shortName;
    let taskSanatized = new Tasks[`${task.type}`](Tasks.Task.sanitize(task));
    
    taskSanatized.challenge = {
      id: task.challengeId,
      shortName,
    };
    await taskSanatized.save();
    let challengeToAddTask = challengesById[task.challengeId];

    if (challengeToAddTask[0]) taskPromises.push(challengeToAddTask[0].addTasks([taskSanatized]));
  });

  try {
    let taskedSaved = await Bluebird.all(taskPromises)
  } catch (e) {
    console.log(e)
  }
  
}