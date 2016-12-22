import {
  generateUser,
  createAndPopulateGroup,
  generateChallenge,
} from '../../../../helpers/api-integration/v3';
import { find } from 'lodash';

describe('GET /leaderboard/:category', () => {
  let user, user2, user3;
  let group;
  let challenge;
  let challengeTask;

  let testHaitData = {
    text: 'test habit',
    type: 'todo',
  };

  let findSyncedChallengeTask = function (task) { return task.challenge.taskId === challengeTask._id };

  before(async () => {
    let populatedGroup = await createAndPopulateGroup({
      members: 2,
    });

    user = populatedGroup.groupLeader;
    group = populatedGroup.group;
    user2 = populatedGroup.members[0];
    user3 = populatedGroup.members[1];

    challenge = await generateChallenge(user, group);
  });

  it('returns the users in the order of their rank for the category', async () => {
    challengeTask = await user.post(`/tasks/challenge/${challenge._id}`, testHaitData);

    await user2.post(`/challenges/${challenge._id}/join`);
    await user3.post(`/challenges/${challenge._id}/join`);

    let userTasks = await user.get('/tasks/user');
    let user2Tasks = await user2.get('/tasks/user');
    let user3Tasks = await user3.get('/tasks/user');

    let userChallengeTaskCopy = find(userTasks, findSyncedChallengeTask);
    let user2ChallengeTaskCopy = find(user2Tasks, findSyncedChallengeTask);
    let user3ChallengeTaskCopy = find(user3Tasks, findSyncedChallengeTask);

    await user.post(`/tasks/${userChallengeTaskCopy._id}/score/up`)
    await user.post(`/tasks/${userChallengeTaskCopy._id}/score/up`)
    await user.post(`/tasks/${userChallengeTaskCopy._id}/score/up`)
    await user.post(`/tasks/${userChallengeTaskCopy._id}/score/up`);

    await user2.post(`/tasks/${user2ChallengeTaskCopy._id}/score/up`);

    await user3.post(`/tasks/${user3ChallengeTaskCopy._id}/score/up`);
    await user3.post(`/tasks/${user3ChallengeTaskCopy._id}/score/up`);

    let rankedUsers = await user.get(`/leaderboard/${challenge._id}`);

    expect(rankedUsers[0]._id).to.equal(user._id);
    expect(rankedUsers[1]._id).to.equal(user3._id);
    expect(rankedUsers[2]._id).to.equal(user2._id);
  });
});
