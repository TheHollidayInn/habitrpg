import {
  generateUser,
} from '../../../../helpers/api-integration/v3';

describe.only('GET /leaderboard', () => {
  let user, user2, user3;

  let testHaitData = {
    text: 'test habit',
    type: 'todo',
  };

  before(async () => {
    user = await generateUser();
    user2 = await generateUser();
    user3 = await generateUser();
  });

  it('returns the users in the order of their rank', async () => {
    let user1Habit = await user.post('/tasks/user', testHaitData);
    let user2Habit = await user2.post('/tasks/user', testHaitData);
    let user3Habit = await user3.post('/tasks/user', testHaitData);

    await user.post(`/tasks/${user1Habit._id}/score/up`);

    await user2.post(`/tasks/${user2Habit._id}/score/up`);
    await user2.post(`/tasks/${user2Habit._id}/score/up`);
    await user2.post(`/tasks/${user2Habit._id}/score/up`);

    await user3.post(`/tasks/${user3Habit._id}/score/up`);
    await user3.post(`/tasks/${user3Habit._id}/score/up`);

    let rankedUsers = await user.get('/leaderboard');

    expect(rankedUsers[0]._id).to.equal(user2._id);
    expect(rankedUsers[1]._id).to.equal(user3._id);
    expect(rankedUsers[2]._id).to.equal(user._id);
  });
});
