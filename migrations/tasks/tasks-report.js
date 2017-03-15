var migrationName = 'taks-report.js';
var authorName = 'ThehollidayInn'; // in case script author needs to know when their ...
var authorUuid = ''; //... own data is done

/*
 * Generates a csv of task history
 */
import stringify from 'csv-stringify';
import fs from 'fs';

import * as Tasks from '../../website/server/models/task';


module.exports = async function tasksReport () {
  let tasks = await Tasks.Task.find().exec();
  let input = [];

  input.push(['User', 'Task', 'Date', 'Value', 'ScoreNotes'])

  tasks.forEach(function (task) {
    if (!task.history) return;

    let user = task.userId;
    let taskText = task.text;

    task.history.forEach(function (history) {
      input.push([
        user,
        taskText,
        history.date,
        history.value,
        history.scoreNotes
      ])
    });
  });

  stringify(input, function(err, output) {
    console.log(output)
    
    fs.writeFile('./report.csv', output, function(err) {
      if(err) {
        return console.log(err);
      }

      console.log("The file was saved!");
    }); 
  });
}