'use strict';

describe('HallPatrons Controller', function() {
  var scope, ctrl, user, $rootScope, Hall;

  beforeEach(function() {
    module(function($provide) {
      Hall = {
        getPatrons: sandbox.stub(),
      };

      Hall.getPatrons.returnsPromise({}).resolves({});

      $provide.value('User', {});
      $provide.value('Hall', Hall);
    });

    inject(function($rootScope, $controller){
      user = specHelper.newUser();

      scope = $rootScope.$new();

      // Load RootCtrl to ensure shared behaviors are loaded
      $controller('RootCtrl',  {$scope: scope, User: {user: user}});

      ctrl = $controller('HallPatronsCtrl', {$scope: scope, User: {user: user}});
    });
  });

  describe('loadMore', () => {
    it('gets more patrons', () => {
      Hall.getPatrons.returnsPromise({}).resolves({});

      scope.loadMore();

      expect(Hall.getPatrons).to.be.called;
    });
  });
});
