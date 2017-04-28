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

let totalUserCount = 0;
let groupTotalCountHased = {};
let rows = [];

async function getVpAreaCounts() {
  // Get all users count
  totalUserCount = await User.find().count();

  // Get all users grouped by VP
  let groupCounts = await User.aggregate(
    [
      { $group : { _id : "$vicePresidentName", count:{$sum: 1} }  },
    ]
  );

  groupCounts.forEach((result) => {
    groupTotalCountHased[result._id] = result.count; 
  });

  // console.log(totalCount, groupCountHased)
}

async function getCountOfLoggedIn () {
  let begginningOfWeek = moment().startOf('isoweek');

  let totalCount = await User.find({
    'auth.timestamps.loggedin' : {$gte: begginningOfWeek.toDate()}
  }).count();

  let groupCounts = await User.aggregate(
    [
      { $match : {
        'auth.timestamps.loggedin' : {$gte: begginningOfWeek.toDate()} 
      }},
      { $group : { _id : "$vicePresidentName", count:{$sum: 1} }  },
    ]
  );

  let groupHashed = {};
  groupCounts.forEach((result) => {
    let vp = result._id;
    if (!vp) vp = "null";
    groupHashed[vp] = result.count;  
  });

  let groupPercentages = {};
  let groupPercentagesRow = [];
  let titleRow = ['Total'];
  for (let vp in groupTotalCountHased) {
    let vpCount = 0;
    if (groupHashed[vp]) vpCount = groupHashed[vp];
    groupPercentages[vp] = (vpCount / groupTotalCountHased[vp]) * 100;
    titleRow.push(vp);
    groupPercentagesRow.push((vpCount / groupTotalCountHased[vp]) * 100);
  }

  let precentLoggedInThisWeek = (totalCount / totalUserCount) * 100;

  titleRow.push('Total Count')
  rows.push(titleRow);
  let values = [precentLoggedInThisWeek].concat(groupPercentagesRow)
  values.push(totalCount)
  rows.push(values)
  // console.log(titleRow, [precentLoggedInThisWeek].concat(groupPercentagesRow))
}

async function getNumberOfUserWhoCompletedAtLeastOneTask () {
  let begginningOfWeek = moment().startOf('isoweek');

  let completedThisWeek = await Tasks.Task.find({
    userId: { $exists: true},
    'history': { $elemMatch: { date: {$gt: begginningOfWeek.unix()} } }
  }).distinct('userId');

  let groupCounts = await Tasks.Task.aggregate(
    [
      { $match :  {
        userId: { $exists: true},
        'history': { $elemMatch: { date: {$gt: begginningOfWeek.unix()} } }
      } },
      {
          $lookup:
            {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user_docs"
            }
       },
      { 
          $group : { 
              _id : "$userId",
              vp: { $first: "$user_docs.vicePresidentName" }
          }
      },
      { 
          $group : { 
              _id : '$vp',
              count: {
                  $sum: 1,
                }
          }
      }
    ]
  );

  let groupHashed = {};
  groupCounts.forEach((result) => {
    let vp = result._id[0];
    if (!vp) vp = "null";
    groupHashed[vp] = result.count;
  });

  let groupPercentages = {};
  let groupPercentagesRow = [];
  let titleRow = ['Total'];
  for (let vp in groupTotalCountHased) {
    let vpCount = 0;
    if (groupHashed[vp]) vpCount = groupHashed[vp];
    groupPercentages[vp] = (vpCount / groupTotalCountHased[vp]) * 100;
    titleRow.push(vp);
    groupPercentagesRow.push((vpCount / groupTotalCountHased[vp]) * 100);
  }

  let precentLoggedInThisWeek = (completedThisWeek.length / totalUserCount) * 100
  // console.log(titleRow, [completedThisWeek.length].concat(groupPercentagesRow))
  let values = [precentLoggedInThisWeek].concat(groupPercentagesRow)
  values.push(completedThisWeek.length)
  rows.push(values);
}

async function getAvgOfCompletedTasks () {
  let begginningOfWeek = moment().startOf('isoweek');

  let avgByUser = await Tasks.Task.aggregate(
    [
      { $match :  {
        userId: { $exists: true},
        'history': { $elemMatch: { date: {$gt: begginningOfWeek.unix()} } }
      } },
      { 
          $group : { 
              _id : "$userId",
              tasks: {
                  $push: {name: "$text"},
                }
          }
      },
      { 
          $group : { 
              _id : null,
              avg: {
                  $avg: {$size: "$tasks"},
                },
              count: {
                  $sum: {$size: "$tasks"},
                }
          }
      }
    ]
  )

  let avgByGroup = await Tasks.Task.aggregate(
    [
      { $match :  {
        userId: { $exists: true},
        'history': { $elemMatch: { date: {$gt: begginningOfWeek.unix()} } }
      } },
      {
          $lookup:
            {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user_docs"
            }
       },
      { 
          $group : { 
              _id : "$userId",
              tasks: {
                  $push: {name: "$text"},
                },
              vp: { $first: "$user_docs.vicePresidentName" }
          }
      },
      { 
          $group : { 
              _id : '$vp',
              avg: {
                  $avg: {$size: "$tasks"},
                }
          }
      }
    ]
  );

  let groupHashed = {};
  avgByGroup.forEach((result) => {
    let vp = result._id[0];
    if (!vp) vp = "null";
    groupHashed[vp] = result.avg; 
  });

  let groupPercentages = {};
  let groupPercentagesRow = [];
  let titleRow = ['Total'];
  for (let vp in groupTotalCountHased) {
    let vpCount = 0;
    if (groupHashed[vp]) vpCount = groupHashed[vp];
    groupPercentages[vp] = vpCount;
    titleRow.push(vp);
    groupPercentagesRow.push(vpCount);
  }

  // console.log([avgByUser[0].avg].concat(groupPercentagesRow))
  let values = [avgByUser[0].avg].concat(groupPercentagesRow)
  values.push(avgByUser[0].count)
  rows.push(values)
}

async function getPercentOfTasksCompletedForShortName (shortName) {
  let begginningOfWeek = moment().startOf('isoweek');

  let completedThisWeek = await Tasks.Task.find({
    userId: { $exists: true},
    'history': { $elemMatch: { date: {$gt: begginningOfWeek.unix()} } },
    'challenge.shortName': shortName,
  }).distinct('userId');

  let groupCounts = await Tasks.Task.aggregate(
    [
      { $match :  {
        userId: { $exists: true},
        'history': { $elemMatch: { date: {$gt: begginningOfWeek.unix()} } },
        'challenge.shortName': shortName,
      } },
      {
          $lookup:
            {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user_docs"
            }
       },
      { $group : { _id : {
            "vp": "$user_docs.vicePresidentName",
            "user": "$userId"
            }, count:{$sum: 1} }  },
    ]
  );

  let groupHashed = {};
  groupCounts.forEach((result) => {
    let vp = result._id.vp[0];
    if (!vp) vp = "null";
    groupHashed[vp] = result.count;  
  });

  let groupPercentages = {};
  let groupPercentagesRow = [];
  let titleRow = ['Total'];
  for (let vp in groupTotalCountHased) {
    let vpCount = 0;
    if (groupHashed[vp]) vpCount = groupHashed[vp];
    groupPercentages[vp] = (vpCount / groupTotalCountHased[vp]) * 100;
    titleRow.push(vp);
    groupPercentagesRow.push((vpCount / groupTotalCountHased[vp]) * 100);
  }

  let precentLoggedInThisWeek = (completedThisWeek.length / totalUserCount) * 100
  // console.log(titleRow, [completedThisWeek.length].concat(groupPercentagesRow))
  let values = [precentLoggedInThisWeek].concat(groupPercentagesRow)
  values.push(completedThisWeek.length)
  rows.push(values)
}

async function getTotalTasksCompleted () {
  let begginningOfWeek = moment().startOf('isoweek');

  let completedThisWeek = await Tasks.Task.find({
    userId: { $exists: true},
    'history': { $elemMatch: { date: {$gte: begginningOfWeek.unix()} } }
  }).count();

  let groupCounts = await Tasks.Task.aggregate(
    [
      { $match :  {
        userId: { $exists: true},
        'history': { $elemMatch: { date: {$gte: begginningOfWeek.unix()} } }
      } },
      {
          $lookup:
            {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user_docs"
            }
       },
      { $group : { _id : {
            "vp": "$user_docs.vicePresidentName",
            }, count:{$sum: 1} }  },
    ]
  );

  let groupHashed = {};
  groupCounts.forEach((result) => {
    let vp = result._id.vp[0];
    if (!vp) vp = "null";
    groupHashed[vp] = result.count; 
  });

  let groupCountsByVP = [];
  for (let vp in groupTotalCountHased) {
    let vpCount = 0;
    if (groupHashed[vp]) vpCount = groupHashed[vp];
    groupCountsByVP.push({ vp, vpCount});
  }

  let groupMap = groupCountsByVP.map((item) =>{return item.vpCount});

  // console.log([completedThisWeek].concat(groupMap))
  let values = [completedThisWeek].concat(groupMap)
  values.push(completedThisWeek)
  rows.push(values)
}

module.exports = async function generateWeeklyReports () {
  await getVpAreaCounts();
  await getCountOfLoggedIn();
  await getNumberOfUserWhoCompletedAtLeastOneTask();

  await getAvgOfCompletedTasks();

  let shortNames = [
    "Customer Service",
    "Power Quality and Reliability",
    "Price",
    "Billing and Pay",
    "Corporate Citizenship",
    "Communications"
  ];
  for (let shortName of shortNames) {
    await getPercentOfTasksCompletedForShortName(shortName);
  }

  await getTotalTasksCompleted();

  console.log(rows);

  stringify(rows, function(err, output) {
    console.log(output)
    
    fs.writeFile('./weekly.csv', output, function(err) {
      if(err) {
        return console.log(err);
      }

      console.log("The file was saved!");
    }); 
  });
};