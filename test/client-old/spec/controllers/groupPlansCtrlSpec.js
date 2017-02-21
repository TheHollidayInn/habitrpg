'use strict';

describe("GroupPlansCtrl controller", function() {
  var scope, ctrl, user, $rootScope, $controller, $window, Payments, User;

  beforeEach(function() {
    module(function($provide) {
      $window = {
        scrollTo: sinon.stub(),
      };

      Payments = {
        showStripe: sandbox.stub(),
        amazonPayments: {
          init: sandbox.stub(),
        },
      };

      User = {};

      $provide.value('$window', $window);
      $provide.value('Payments', Payments);
      $provide.value('User', User);
    });

    inject(function($rootScope, _$controller_) {
      user = specHelper.newUser();
      user._id = "unique-user-id";
      User = {user: user};

      scope = $rootScope.$new();

      $controller = _$controller_;

      // Load RootCtrl to ensure shared behaviors are loaded
      $controller('RootCtrl',  {$scope: scope, User: User});

      ctrl = $controller('GroupPlansCtrl', {$scope: scope});
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('changePage', () => {
    it('set activePage', () => {
      scope.changePage(scope.PAGES.CREATE_GROUP);

      expect(scope.activePage).to.eql(scope.PAGES.CREATE_GROUP);
      expect($window.scrollTo).to.be.calledOnce;
    });
  });

  describe('newGroupIsReady', () => {
    it('returns false when newGroup name is empty', () => {
      scope.newGroup = {
        name: '',
        description: '',
      };

      let result = scope.newGroupIsReady();

      expect(result).to.be.false;
    });

    it('returns true when newGroup name and description are not empty', () => {
      scope.newGroup = {
        name: 'test',
        description: 'test',
      };

      let result = scope.newGroupIsReady();

      expect(result).to.be.true;
    });
  });

  describe('createGroup', () => {
    it('changes the page to upgrade group', () => {
      scope.createGroup();

      expect(scope.activePage).to.eql(scope.PAGES.UPGRADE_GROUP);
      expect($window.scrollTo).to.be.calledOnce;
    });
  });

  describe('upgradeGroup', () => {
    it('calls show stripe', () => {
      scope.upgradeGroup(scope.PAYMENTS.STRIPE);

      expect(Payments.showStripe).to.be.calledOnce;
    });

    it('calls show amazon init', () => {
      scope.upgradeGroup(scope.PAYMENTS.AMAZON);

      expect(Payments.amazonPayments.init).to.be.calledOnce;
    });
  });
});
