var migrationName = 'comed-weekly-report.js';
var authorName = 'ThehollidayInn'; // in case script author needs to know when their ...
var authorUuid = ''; //... own data is done

/*
 * Generates a report on user activiy
 */
import stringify from 'csv-stringify';
import fs from 'fs';
import moment from 'moment';
import Bluebird from 'bluebird';

import { model as User } from '../../website/server/models/user';
import * as Tasks from '../../website/server/models/task';

// Get total number of users
let totalNumberOfUsers = 20;
// Get total number of users in VP area 1
let vpArea1Count = 10;
// Get total number of users in VP area 2
let vpArea2Count = 10;

let taskCompletedInLastWeek = {
  $elemMatch: { 
    date: {
      $gte: moment().subtract(60, 'days').unix()
    },
  },
};

async function getAvgCompletedTasksPerUser () {
  let query = {};

  // Compelted in the last week
  query['history'] = taskCompletedInLastWeek;

  // if (challengeShortName) query['challenge.shortName'] = challengeShortName;

  // db.tasks.aggregate(
  // [
  //     { 
  //       $project : { 
  //         name: {$toUpper:"$userId"}, 
        
  //         history: {
  //           $filter: {
  //               input: "$history",
  //               as: "history",
  //               cond: { $gte: [ "$$history.value", 100000 ] },
  //           },
  //         },
  //     },
  //       },
  //     { $group : { _id : {name:"$name", history: "$history"} , number : { $sum : 1 } } },
  //     { $sort : { "name" : 1 } }
  //   ]
  // )

  let tasks = await Tasks.Task.aggregate(
  [
      { 
        $project : { 
          name: {$toUpper:"$userId"} , _id:0 },
          history: {
            // $filter: {
            //    input: "$history",
            //    as: "history",
            //    cond: { $gte: [ "$$history.date", moment().subtract(60, 'days').unix() ] },
            // }
          }
      },
      { $group : { _id : {name:"$name"} , number : { $sum : 1 } } },
      { $sort : { "name" : 1 } }
    ]
  ).exec();
  
  // let tasks = await Tasks.Task.find(query).group('userId').exec();
  console.log(tasks)
  return tasks;
};

async function getNumberOfTasksCompleted(challengeShortName) {
  let query = {};

  // Compelted in the last week
  query['history'] = taskCompletedInLastWeek;

  if (challengeShortName) query['challenge.shortName'] = challengeShortName;
  
  let count = await Tasks.Task.find(query).count();

  return count;
}

async function getNumberOfEmployees (challengeShortName) {
  let query = {};

  // Compelted in the last week
  query['history'] = taskCompletedInLastWeek;

  query['challenge.shortName'] = challengeShortName;
  
  let count = await Tasks.Task.find(query).distinct('userId').count();

  return count;
}

async function getTaskCompeltedPercentages (challengeShortName) {
  let numberOfVp1EmployeesCompletedTask = await getNumberOfEmployees(challengeShortName, 'vp1');
  let numberOfVp2EmployeesCompletedTask = await getNumberOfEmployees(challengeShortName, 'vp2');
  let numberOfEmployeesCompletedTask = await getNumberOfEmployees(challengeShortName);

  let percentOfVp1Completed = (numberOfVp1EmployeesCompletedTask/vpArea1Count) * 100;
  let percentOfVp2Completed = (numberOfVp2EmployeesCompletedTask/vpArea2Count) * 100
  let percentOfCompleted = (numberOfEmployeesCompletedTask/totalNumberOfUsers) * 100;
  let numberOfTasksCompleted = await getNumberOfEmployees(challengeShortName);

  return [percentOfVp1Completed, percentOfVp2Completed, percentOfCompleted, numberOfTasksCompleted]
};

module.exports = async function generateWeeklyReports () {

  //  Get average tasks completed per employee
  await getAvgCompletedTasksPerUser();

  return;

  // Challenge tasks completd percentages
  let challengeShortNames = ['Power Quality & Reliability', 'Billing & Pay', 'Price', 'Corporate Citizenship', 'Communications', 'Customer Service'];
  let challengePercentagePromises = challengeShortNames.map(function (shortName) {
    return getTaskCompeltedPercentages(shortName);
  })
  let results = await Bluebird.all(challengePercentagePromises);
  console.log(results)

  //Total tasks completed
  let numberOfTasksCompleted = await getNumberOfTasksCompleted();
  console.log(numberOfTasksCompleted);
};