'use strict';

describe('Hall of Heroes Controller', function() {
  var scope, ctrl, user, $rootScope, Hall;

  beforeEach(function() {
    module(function($provide) {
      Hall = {
        getHeroes: sandbox.stub(),
        getHero: sandbox.stub(),
        updateHero: sandbox.stub(),
      };

      Hall.getHeroes.returnsPromise({}).resolves({});

      $provide.value('User', {});
      $provide.value('Hall', Hall);
    });

    inject(function($rootScope, $controller){
      user = specHelper.newUser();

      scope = $rootScope.$new();

      // Load RootCtrl to ensure shared behaviors are loaded
      $controller('RootCtrl',  {$scope: scope, User: {user: user}});

      ctrl = $controller('HallHeroesCtrl', {$scope: scope, User: {user: user}});
    });
  });

  it('calls getHeros', () => {
    expect(Hall.getHeroes).to.be.called;
  });

  describe('loadHero', () => {
    it('loads a hero', () => {
      Hall.getHero.returnsPromise({}).resolves({});

      scope.loadHero();

      expect(Hall.getHero).to.be.called;
    });
  });

  describe('saveHero', () => {
    it('updates a hero', () => {
      scope.hero = {
        contributor: {
          admin: {},
        },
      };
      Hall.updateHero.returnsPromise({}).resolves({
        data: {
          data: {},
        },
      });

      scope.saveHero();

      expect(Hall.updateHero).to.be.called;
    });
  });

  it('populates contributor input with selected hero id', function(){
    var loadHero = sandbox.spy(scope, "loadHero");
    var scrollTo = sandbox.spy(window, "scrollTo");
    Hall.getHero.returnsPromise({}).resolves({});

    scope.populateContributorInput(user._id);

    expect(scope._heroID).to.eql(user._id);
    expect(loadHero.callCount).to.eql(1);
    expect(scrollTo.callCount).to.eql(1);
  });
});
