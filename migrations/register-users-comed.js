var migrationName = 'restore_profile_data.js';
var authorName = 'ThehollidayInn'; // in case script author needs to know when their ...
var authorUuid = ''; //... own data is done

/*
 * Creates users for Comed and adds them to all challenges, awards them all items, pets, mounts,
 * removes defaults tags, and prevents tutorial
 */

import { wrap as wrapUser } from '../website/common/script/index';
import { model as User } from '../website/server/models/user';
import * as passwordUtils from '../website/server/libs/password';


async function registerUsers (email) {
  // @TODO: Move register user to User method or User service
  let password = 'test';
  let salt = passwordUtils.makeSalt();
  let hashed_password = passwordUtils.encrypt(password, salt); // eslint-disable-line camelcase
  let newUser = {
    auth: {
      local: {
        username: email,
        lowerCaseUsername: email.toLowerCase(),
        email,
        salt,
        hashed_password, // eslint-disable-line camelcase
      },
    },
    preferences: {
      language: 'en',
    },
  };

  let user = new User(newUser);
  await user.save();
  console.log(user);
}


module.exports = function regiserComedUsers () {
  var emails = ['testkeith@test.com'];

  emails.forEach(registerUsers);
};
