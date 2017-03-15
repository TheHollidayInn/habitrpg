var migrationName = 'restore_profile_data.js';
var authorName = 'ThehollidayInn'; // in case script author needs to know when their ...
var authorUuid = ''; //... own data is done

/*
 * Generates a list of users and some of their info at this point in time
 */
import stringify from 'csv-stringify';
import fs from 'fs';
import moment from 'moment';

import { model as User } from '../../website/server/models/user';

module.exports = async function generateUserReports () {
  let users = await User.find().exec();

  let input = [];

  input.push(['Employee ID', 'Name', 'Email', 'Level', 'Points', 'Date of Enrollment', 'Vice President', 'Manager'])

  users.forEach(function (user) {
    console.log(moment(user.auth.timestamps.created).toDate())
    input.push([
      'Example-Id',
      user.profile.name,
      user.auth.local.email,
      user.stats.lvl,
      user.stats.score.overall,
      `${moment(user.auth.timestamps.created).toDate()}`,
      'Example-VP',
      'Example-Manager',
    ])
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
};