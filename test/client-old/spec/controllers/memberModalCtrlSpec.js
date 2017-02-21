'use strict';

describe('Header Controller', function() {
  var scope, ctrl, user, $location, $rootScope, Groups, User;

  beforeEach(function() {
    module(function($provide) {
      user = specHelper.newUser();
      user._id = "unique-user-id";
      user.party = {
        order: '',
      };
      User = {
        user: user,
      };

      Groups = {
        party: sandbox.stub(),
        inviteOrStartParty: sandbox.stub(),
      };

      let party = {
        members: [
          {
            _id: 'member-1-id',
          }
        ],
      };

      Groups.party.returnsPromise({}).resolves(party);

      $provide.value('User', User);
      $provide.value('Groups', Groups);
    });

    inject(function(_$rootScope_, _$controller_, _$location_) {
      scope = _$rootScope_.$new();
      $rootScope = _$rootScope_;

      $location = _$location_;

      // Load RootCtrl to ensure shared behaviors are loaded
      _$controller_('RootCtrl',  {$scope: scope, User: User});

      ctrl = _$controller_('HeaderCtrl', {$scope: scope, User: User});
    });
  });

  // @TODO: These tests only need to be on the service
  context('inviteOrStartParty', function(){
    beforeEach(function(){
      sandbox.stub($location, 'path');
      sandbox.stub($rootScope, 'openModal');
    });

    xit('redirects to party page if user does not have a party', function(){
      var group = {};
      scope.inviteOrStartParty(group);

      expect($location.path).to.be.calledWith("/options/groups/party");
      expect($rootScope.openModal).to.not.be.called;
    });

    xit('Opens invite-friends modal if user has a party', function(){
      var group = {
        type: 'party'
      };
      scope.inviteOrStartParty(group);

      expect($rootScope.openModal).to.be.calledOnce;
      expect($location.path).to.not.be.called;
    });
  });

  describe('syncParty', () => {
    it('syncs party immediately', () => {

    });

    it('sorts party by level', () => {
      console.log(User.user.party)
      User.user.party.order = 'level';

      scope.syncParty();

      // console.log(scope.partyMinusSelf);
    });

    it('sorts party by random', () => {
      User.user.party.order = 'random';

      scope.syncParty();

    });
  })
});
