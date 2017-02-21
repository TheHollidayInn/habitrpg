'use strict';

describe('GuildsCtrl Controller', function() {
  var scope, ctrl, user, rootScope,
  User, Groups, Challenges;

  beforeEach(function() {
    module(function($provide) {
      User = {
        clearPMs: sandbox.stub(),
      };

      Groups = {
        myGuilds: sandbox.stub(),
        publicGuilds: sandbox.stub(),
        Group: {
          create: sandbox.stub(),
          join: sandbox.stub(),
          rejectInvite: sandbox.stub(),
          leave: sandbox.stub(),
        },
      };

      Groups.myGuilds.returnsPromise({}).resolves({});
      Groups.publicGuilds.returnsPromise({}).resolves({});

      Challenges = {
        getGroupChallenges: sandbox.stub(),
      };

      $provide.value('User', User);
      $provide.value('Groups', Groups);
      $provide.value('Challenges', Challenges);
    });

    inject(function($rootScope, $controller) {
      user = specHelper.newUser();
      user._id = "unique-user-id";
      User.user = user;

      scope = $rootScope.$new();
      rootScope = $rootScope;

      // Load RootCtrl to ensure shared behaviors are loaded
      $controller('RootCtrl',  {$scope: scope, User: User});

      ctrl = $controller('GuildsCtrl', {
        $scope: scope,
        User: User,
        Groups: Groups,
      });
    });
  });

  describe('initial values', () => {
    it('initilize values', () => {
      // console.log(scope.groups);
      // console.log(scope.newGroup);

      expect(Groups.myGuilds).to.be.calledOnce;
      expect(Groups.publicGuilds).to.be.calledOnce;
      // expect(rootScope.openModal).to.be.calledOnce;
    });
  });

  describe('create', () => {
    it('should open gem model if user has 0 balance', () => {
      User.user.balance = 0;

      scope.create();

      // expect(rootScope.openModal).to.be.called;
    });

    it('should do nothing if conifirm is canceled', () => {
      User.user.balance = 2;
      sandbox.stub(window, 'confirm').returns(false);

      scope.create();

      expect(Groups.Group.create).to.not.be.called;
    });

    it('should create group if confirmed', () => {
      User.user.balance = 2;
      sandbox.stub(window, 'confirm').returns(true);
      Groups.Group.create.returnsPromise({}).resolves();

      scope.create();

      expect(Groups.Group.create).to.be.called;
    });
  });

  describe('join', () => {
    it('joins a group', () => {
      let group = {
        id: 'test-id',
      };
      Groups.Group.join.returnsPromise({}).resolves({});

      scope.join(group);

      expect(Groups.Group.join).to.be.calledOnce;
    });
  });

  describe('reject', () => {
    it('reject an invitation', () => {
      let group = {
        id: 'test-id',
      };
      User.user.invitations = {
        guilds: [],
      };
      Groups.Group.rejectInvite.returnsPromise({}).resolves({});

      scope.reject(group);

      expect(Groups.Group.rejectInvite).to.be.calledOnce;
    });
  });

  describe('leave', () => {
    it('leaves a group', () => {
      scope.selectedGroup = {
        _id: 'test-group-id',
      };
      Groups.Group.leave.returnsPromise({}).resolves({});

      scope.leave();

      expect(Groups.Group.leave).to.be.calledOnce;
    });
  });

  describe('clickLeave', () => {
    it('get groups challenges', () => {
      Challenges.getGroupChallenges.returnsPromise({}).resolves({});
      let event = {
        target: '',
      };
      let group = {};

      scope.clickLeave(group, event);

      expect(Challenges.getGroupChallenges).to.be.calledOnce;
    });
  });
});
