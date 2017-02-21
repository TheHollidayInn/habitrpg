'use strict';

describe('Groups Controller', function() {
  var scope, ctrl, groups, user, guild,
    $rootScope, User, Members, $state, Groups;

  beforeEach(function() {
    module(function($provide) {
      User = {
        clearPMs: sandbox.stub(),
      };

      Members = {
        selectMember: sandbox.stub(),
      };

      $state = {
        is: sandbox.stub(),
        go: sandbox.stub(),
      };

      Groups = {
        Group: {
          removeMember: sandbox.stub(),
        },
      };

      $rootScope = {
        openModal: sandbox.stub(),
      };

      $provide.value('User', User);
      $provide.value('Members', Members)
      $provide.value('$state', $state);
    });

    inject(function($rootScope, $controller, Groups) {
      user = specHelper.newUser();
      user._id = "unique-user-id";
      User.user = user;

      scope = $rootScope.$new();

      // Load RootCtrl to ensure shared behaviors are loaded
      $controller('RootCtrl',  {$scope: scope, User: User});

      ctrl = $controller('GroupsCtrl', {$scope: scope, User: User});

      groups = Groups;
    });
  });

  describe("isMemberOfPendingQuest", function() {
    var party;
    var partyStub;

    beforeEach(function () {
      party = specHelper.newGroup({
        _id: "unique-party-id",
        type: 'party',
        members: ['leader-id'] // Ensure we wouldn't pass automatically.
      });

      partyStub = sandbox.stub(groups, "party", function() {
        return party;
      });
    });

    it("returns false if group is does not have a quest", function() {
      expect(scope.isMemberOfPendingQuest(user._id, party)).to.not.be.ok;
    });

    it("returns false if group quest has not members", function() {
      party.quest = {
        'key': 'random-key',
      };
      expect(scope.isMemberOfPendingQuest(user._id, party)).to.not.be.ok;
    });

    it("returns false if group quest is active", function() {
      party.quest = {
        'key': 'random-key',
        'members': {},
        'active': true,
      };
      party.quest.members[user._id] = true;
      expect(scope.isMemberOfPendingQuest(user._id, party)).to.not.be.ok;
    });

    it("returns true if user is a member of a pending quest", function() {
      party.quest = {
        'key': 'random-key',
        'members': {},
      };
      party.quest.members[user._id] = true;
      expect(scope.isMemberOfPendingQuest(user._id, party)).to.be.ok;
    });
  });

  describe("isMemberOfRunningQuest", () => {
    it('returns true if user is member of group quest', () => {
      let userId = 'user-id'
      let group = {
        quest: {
          members: {},
          active: true,
        },
      };
      group.quest.members[userId] = true;

      let result = scope.isMemberOfRunningQuest(userId, group);

      expect(result).to.be.true;
    });

    it('returns false if group has no quest', () => {
      let userId = 'user-id'
      let group = {
      };

      let result = scope.isMemberOfRunningQuest(userId, group);

      expect(result).to.be.false;
    });

    it('returns false if group quest is not active', () => {
      let userId = 'user-id'
      let group = {
        quest: {
          members: {},
          active: false,
        },
      };
      group.quest[userId] = true;

      let result = scope.isMemberOfRunningQuest(userId, group);

      expect(result).to.be.false;
    });
  });

  describe("isMemberOfGroup", function() {
    it("returns true if group is the user's party retrieved from groups service", function() {
      var party = specHelper.newGroup({
        _id: "unique-party-id",
        type: 'party',
        members: ['leader-id'] // Ensure we wouldn't pass automatically.
      });

      var partyStub = sandbox.stub(groups, "party", function () {
        return party;
      });

      expect(scope.isMemberOfGroup(user._id, party)).to.be.ok;
    });

    it('returns true if guild is included in myGuilds call', function () {
      var guild = specHelper.newGroup({
        _id: "unique-guild-id",
        type: 'guild',
        members: [user._id]
      });

      user.guilds = [guild._id];

      expect(scope.isMemberOfGroup(user._id, guild)).to.be.ok;
    });

    it('does not return true if guild is not included in myGuilds call', function(){
      var guild = specHelper.newGroup({
        _id: "unique-guild-id",
        type: 'guild',
        members: ['not-user-id']
      });

      user.guilds = [];

      expect(scope.isMemberOfGroup(user._id, guild)).to.not.be.ok;
    });

    it('returns false if group has no members', () => {
      let group = {};
      let userId = 'user-id';

      let result = scope.isMemberOfGroup(userId, group);

      expect(result).to.be.false;
    });

    it('returns true if userid is in member list', () => {
      let userId = 'user-id';
      let group = {
        members: [
          {
            _id: userId,
          }
        ],
      };

      let result = scope.isMemberOfGroup(userId, group);

      expect(result).to.be.true;
    });
  });

  describe('isMember', () => {
    it('returns true if user is a member', () => {
      let userId = 'user-id';
      let user = {
        _id: userId,
      };
      let group = {
        members: [userId],
      };

      let result = scope.isMember(user, group);

      expect(result).to.be.true;
    });

    it('returns false if user is not a member', () => {
      let userId = 'user-id';
      let user = {
        _id: userId,
      };
      let group = {
        members: [],
      };

      let result = scope.isMember(user, group);

      expect(result).to.be.false;
    });
  });

  describe('editGroup', () => {
    var guild;

    beforeEach(() => {
      guild = specHelper.newGroup({
        _id: 'unique-guild-id',
        leader: 'old leader',
        type: 'guild',
        members: ['not-user-id'],
        $save: sandbox.spy(),
      });
    });

    it('marks group as being in edit mode', () => {
      scope.editGroup(guild);

      expect(guild._editing).to.eql(true);
    });

    it('copies group to groupCopy', () => {
      scope.editGroup(guild);

      for (var key in scope.groupCopy) {
        expect(scope.groupCopy[key]).to.eql(guild[key]);
      }
    });

    it('does not change original group when groupCopy is changed', () => {
      scope.editGroup(guild);

      scope.groupCopy.leader = 'new leader';
      expect(scope.groupCopy.leader).to.not.eql(guild.leader);
    });
  });

  describe('saveEdit', () => {
    let guild;

    beforeEach(() => {
      guild = specHelper.newGroup({
        _id: 'unique-guild-id',
        name: 'old name',
        leader: 'old leader',
        type: 'guild',
        members: ['not-user-id'],
        $save: () => {},
      });

      scope.editGroup(guild);
    });

    it('calls group update', () => {
      let guildUpdate = sandbox.spy(groups.Group, 'update');

      scope.saveEdit(guild);

      expect(guildUpdate).to.be.calledOnce;
    });

    it('calls cancelEdit', () => {
      sandbox.stub(scope, 'cancelEdit');

      scope.saveEdit(guild);

      expect(scope.cancelEdit).to.be.calledOnce;
    });

    it('applies changes to groupCopy to original group', () => {
      scope.groupCopy.name = 'new name';

      scope.saveEdit(guild);

      expect(guild.name).to.eql('new name');
    });

    it('assigns leader id to group if leader has changed', () => {
      scope.groupCopy._newLeader = { _id: 'some leader id' };

      scope.saveEdit(guild);

      expect(guild.leader).to.eql('some leader id');
    });

    it('does not assign new leader id if leader object is not passed in', () => {
      scope.groupCopy._newLeader = 'not an object';

      scope.saveEdit(guild);

      expect(guild.leader).to.eql('old leader');
    });
  });

  describe('cancelEdit', () => {
    beforeEach(() => {
      guild = specHelper.newGroup({
        _id: 'unique-guild-id',
        name: 'old name',
        leader: 'old leader',
        type: 'guild',
        members: ['not-user-id'],
        $save: () => {},
      });

      scope.editGroup(guild);
    });

    it('sets _editing to false on group', () => {
      expect(guild._editing).to.eql(true);

      scope.cancelEdit(guild);

      expect(guild._editing).to.eql(false);
    });

    it('reset groupCopy to an empty object', () => {
      expect(scope.groupCopy).to.not.eql({});

      scope.cancelEdit(guild);

      expect(scope.groupCopy).to.eql({});
    });
  });

  describe("deleteAllMessages", function () {
    it('clears private messages', () => {
      sandbox.stub(window, 'confirm').returns(true);

      scope.deleteAllMessages();

      expect(User.clearPMs).to.be.calledOnce;
    });

    it('does not clear pms when confirm is false', () => {
      sandbox.stub(window, 'confirm').returns(false);

      scope.deleteAllMessages();

      expect(User.clearPMs).to.not.be.called;
    });
  });

  describe("clickMember", function () {
    it('calls select member', () => {
      let uid = 'member-uid';
      Members.selectMember.returnsPromise({}).resolves({});

      scope.clickMember(uid);

      expect(Members.selectMember).to.be.called;
      // expect($rootScope.openModal).to.be.called;
    });

    it('goes to profile if user is uid and we are on task page', () => {
      let uid = User.user._id;
      $state.is.returns(true);

      scope.clickMember(uid);

      expect($state.go).to.be.calledOnce;
      expect($state.go).to.be.calledWith('options.profile.avatar');
    });

    it('goes to tasks page if user is uid', () => {
      let uid = User.user._id;
      $state.is.returns(false);

      scope.clickMember(uid);

      expect($state.go).to.be.calledOnce;
      expect($state.go).to.be.calledWith('tasks');
    })
  });

  describe("removeMember", function () {
    it('opens remove member', () => {
      scope.removeMember();

      // expect(rootScope.openModal).to.be.calledOnce;
    });
  });

  describe("confirmRemoveMember", function () {
    it('marks remove member data as undefined if confirm is false', () => {
      let confirm = false;

      scope.confirmRemoveMember(confirm);

      expect(scope.removeMemberData).to.not.exist;
    });

    it('removes member from group', () => {
      let confirm = true;
      scope.removeMemberData = {
        group: {
          _id: '',
        },
        member: {
          _id: '',
        },
        message: '',
      };
      let removeMemberStub = sandbox.stub(groups.Group, "removeMember");
      removeMemberStub.returnsPromise({}).resolves({});

      scope.confirmRemoveMember(confirm);

      expect(removeMemberStub).to.be.calledOnce;
    });
  });

  describe("quickReply", function () {
    it('should select member', () => {
      let uid = 'member-id';
      Members.selectMember.returnsPromise({}).resolves({});

      scope.quickReply(uid);

      // expect($rootScope.openModal).to.be.calledOnce;
      expect(Members.selectMember).to.be.calledOnce;
    })
  });
});
