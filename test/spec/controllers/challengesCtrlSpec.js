'use strict';

describe('Challenges Controller', function() {
  var $rootScope, scope, user, ctrl, challenges, groups;

  beforeEach(function() {
    module(function($provide) {
      $provide.value('User', {});
    });

    inject(function($rootScope, $controller, Challenges, Groups){
      user = specHelper.newUser();
      user._id = "unique-user-id";

      scope = $rootScope.$new();

      // Load RootCtrl to ensure shared behaviors are loaded
      $controller('RootCtrl',  {$scope: scope, User: {user: user}});

      ctrl = $controller('ChallengesCtrl', {$scope: scope, User: {user: user}});

      challenges = Challenges;

      groups = Groups;
    });
  });


  it('Clones a challenge', function() {
    var copyChallenge = new challenges.Challenge({
      name: 'copyChallenge',
      description: 'copyChallenge',
      habits: [],
      dailys: [],
      todos: [],
      rewards: [],
      leader: user._id,
      group: "copyGroup",
      timestamp: +(new Date),
      members: [user],
      official: false,
      _isMember: true
    });
    scope.clone(copyChallenge)

    expect( scope.obj.name ).to.eql(copyChallenge.name );
    expect( scope.obj.description ).to.eql(copyChallenge.description );
    expect( scope.obj.habits ).to.eql(copyChallenge.habits );
    expect( scope.obj.dailys ).to.eql(copyChallenge.dailys );
    expect( scope.obj.todos ).to.eql(copyChallenge.todos );
    expect( scope.obj.rewards ).to.eql(copyChallenge.rewards );
    expect( scope.obj.leader ).to.eql(copyChallenge.leader );
    expect( scope.obj.official ).to.eql(copyChallenge.official );

  });

});
