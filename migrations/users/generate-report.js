var migrationName = 'restore_profile_data.js';
var authorName = 'ThehollidayInn'; // in case script author needs to know when their ...
var authorUuid = ''; //... own data is done

/*
 * Generates a list of users and some of their info at this point in time
 */
import stringify from 'csv-stringify';
import fs from 'fs';
import moment from 'moment-timezone';

import { model as User } from '../../website/server/models/user';
import { model as Group } from '../../website/server/models/group';
import * as Tasks from '../../website/server/models/task';

module.exports = async function generateUserReports () {

  let groups = await Group.find({}, {name: 1}).exec();
  let groupsHashed = {};
  groups.forEach((group) => {
    groupsHashed[group._id] = group.name;
  });

  // let begginningOfWeek = moment().startOf('isoweek');
  let day = '2017-05-01';
  let beggining = moment(day).startOf('day');
  let end = moment(day).endOf('day');
  console.log( {
    $gt: beggining.unix(),
    $lt: end.unix(),
  })
  let tasksQuery = await Tasks.Task.aggregate(
    [
      { $match :  {
        userId: { $exists: true},
        'history': { $elemMatch: {
          date: {
            $gt: beggining.unix(),
            // $lt: end.unix(),
          }
        } }
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
              _id : {
                userId: "$userId",
                displayName: "$user_docs.auth.local.username",
                email: "$user_docs.auth.local.email",
                team: "$user_docs.guilds",
                totalPoints: "$user_docs.stats.exp",
                vicePresidentName: "$user_docs.vicePresidentName",
                registeredDate: "$user_docs.auth.timestamps.created",
              },
              tasks: {
                  $push: {
                      name: "$text",
                      points: "$value",
                      category: "$challenge.shortName",
                      questions: "$question",
                      history: "$history",
                      awared: {$size: "$history"},
                      repeatable: "$repeatable",
                      },
                },
              pointsForWeek: {$sum: {$multiply: ["$value", {$size: "$history"}]}}
          }
      },
    ]
  );

  let taskInput = [];

  tasksQuery.forEach((aggItem) => {
    aggItem.tasks.forEach((task) => {
      task.history.forEach((history) => {

        let entry = {
          displayName: aggItem._id.displayName[0],
          email: aggItem._id.email[0],
          team: groupsHashed[aggItem._id.team[0][0]],
          supervisor: aggItem._id.vicePresidentName[0],
          registeredDate: moment(aggItem._id.registeredDate[0]).tz('America/Chicago').format('MMMM Do YYYY'),
          // totalPoints: Math.floor(aggItem._id.totalPoints[0]),
          pointsForWeek: aggItem.pointsForWeek,
          name: task.name,
          points: task.points,
          category: task.category,
          questions: task.questions,
          repeatable: task.repeatable,
          date: moment(history.date).tz('America/Chicago').format('MMMM Do YYYY'),
          notes: JSON.stringify(history.scoreNotes),
        };
        // console.log(entry)
        taskInput.push(entry);
      })
    })
  });

  taskInput.unshift(Object.keys(taskInput[0]));

  // console.log(taskInput)
  stringify(taskInput, {delimiter: '||'}, function(err, output) {
    // console.log(output)

    fs.writeFile('./daily-report.csv', output, function(err) {
      if(err) {
        return console.log(err);
      }

      console.log("The file was saved!");
    });
  });
};
