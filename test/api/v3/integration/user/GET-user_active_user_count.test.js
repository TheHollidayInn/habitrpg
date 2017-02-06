import {
  generateUser,
} from '../../../../helpers/api-integration/v3';

describe.only('GET /user/active-users', () => {
  let user, user2;

  before(async () => {
    user = await generateUser();
    user2 = await generateUser();
  });

  it('returns the number of active users for today', async () => {
    await user.get('/user');
    await user2.get('/user');

    let count = await user.get('/user/active-users');

    expect(count).to.exist; // @TODO: We need to mock the list to improve this test to check for an exact number
  });
});
