'use strict';

describe('Auth Controller', function() {
  var scope, ctrl, user, $httpBackend, $window, $modal, alert, Auth, Analytics, location, $modal;

  beforeEach(function(){
    module(function($provide) {
      Auth = {
        runAuth: sandbox.spy(),
      };

      Analytics = {
        register: sandbox.spy(),
        track: sandbox.spy(),
      };

      location = {
        search: undefined,
      };

      $modal = {
        open: sandbox.stub(),
      };

      $provide.value('Analytics', Analytics);
      $provide.value('Chat', { seenMessage: function() {} });
      $provide.value('Auth', Auth);
      $provide.value('$location', location);
      $provide.value('$modal', $modal);
    });

    inject(function(_$httpBackend_, $rootScope, $controller, _$modal_) {
      $httpBackend = _$httpBackend_;
      scope = $rootScope.$new();
      scope.loginUsername = 'user';
      scope.loginPassword = 'pass';
      $window = { location: { href: ""}, alert: sandbox.spy() };
      $modal = _$modal_;
      user = {
        user: {},
        authenticate: sandbox.spy(),
        authenticated: sandbox.stub(),
      };
      alert = { authErrorAlert: sandbox.spy() };

      ctrl = $controller('AuthCtrl', {$scope: scope, $window: $window, User: user, Alert: alert});
    })
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('logging in', function() {
    it('should log in users with correct uname / pass', function() {
      $httpBackend.expectPOST('/api/v3/user/auth/local/login').respond({data: {id: 'abc', apiToken: 'abc'}});
      scope.auth();
      $httpBackend.flush();
      expect(Auth.runAuth).to.be.calledOnce;
      expect(alert.authErrorAlert).to.not.be.called;
    });

    it('should not log in users with incorrect uname / pass', function() {
      $httpBackend.expectPOST('/api/v3/user/auth/local/login').respond(404, '');
      scope.auth();
      $httpBackend.flush();
      expect(Auth.runAuth).to.not.be.called;
      expect(alert.authErrorAlert).to.be.calledOnce;
    });
  });

  describe('#clearLocalStorage', function () {
    var timer;

    beforeEach(function () {
      timer = sandbox.useFakeTimers();
    });

    it('opens modal with message about clearing local storage and logging out', function () {
      scope.clearLocalStorage();

      expect($modal.open).to.be.calledOnce;
      expect($modal.open).to.be.calledWith({
        templateUrl: 'modals/message-modal.html',
        scope: scope
      });

      expect(scope.messageModal.title).to.eql(window.env.t('localStorageClearing'));
      expect(scope.messageModal.body).to.eql(window.env.t('localStorageClearingExplanation'));
    });

    it('does not call $scope.logout before 3 seconds', function () {
      sandbox.stub(scope, 'logout');

      scope.clearLocalStorage();

      timer.tick(2999);

      expect(scope.logout).to.not.be.called;
    });

    it('calls $scope.logout after 3 seconds', function () {
      sandbox.stub(scope, 'logout');

      scope.clearLocalStorage();

      timer.tick(3000);

      expect(scope.logout).to.be.calledOnce;
    });

    it('does not clear local storage before 3 seconds', function () {
      sandbox.stub(localStorage, 'clear');

      scope.clearLocalStorage();

      timer.tick(2999);

      expect(localStorage.clear).to.not.be.called;
    });

    it('clears local storage after 3 seconds', function () {
      sandbox.stub(localStorage, 'clear');

      scope.clearLocalStorage();

      timer.tick(3000);

      expect(localStorage.clear).to.be.calledOnce;
    });

    it('does not redirect to /logout route before 3 seconds', function () {
      scope.clearLocalStorage();

      timer.tick(2999);

      expect($window.location.href).to.eql('');
    });

    it('redirects to /logout after 3 seconds', function () {
      scope.clearLocalStorage();

      timer.tick(3000);

      expect($window.location.href).to.eql('/logout');
    });
  });

  describe('register', function () {
    let registerVals = {};
    let url = '/api/v3/user/auth/local/register';

    beforeEach(() => {
      sandbox.stub(angular, 'element').returns({
        scope: function () {
          return {
            registrationForm: {
              $invalid: false,
            },
            registerVals,
          };
        },
      });
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('does not register a user when form is invalid', () => {
      sandbox.restore();
      sandbox.stub(angular, 'element').returns({
        scope: function () {
          return {
            registrationForm: {
              $invalid: true,
            },
          };
        },
      });
      scope.register();

      expect(Auth.runAuth).to.be.not.be.called;
      expect(analyticsMock.register).to.not.be.called;
    });

    it('should register a users with correct uname / pass', function() {
      $httpBackend.expectPOST(url)
        .respond({data: {id: 'abc', apiToken: 'abc'}});
      scope.register();
      $httpBackend.flush();
      expect(Auth.runAuth).to.be.calledOnce;
      expect(Analytics.register).to.be.calledOnce;
    });

    xit('adds a location string to url', function() {
      location.search = 'groupInvite';
      $httpBackend.expectPOST(url)
        .respond({data: {id: 'abc', apiToken: 'abc'}});
      scope.register();
      $httpBackend.flush();
      expect(Auth.runAuth).to.be.calledOnce;
      expect(Analytics.register).to.be.calledOnce;
    });
  });

  describe('playButtonClick', () => {
    it('opens login modal if user is not authenticated', () => {
      user.authenticated.returns(false);

      scope.playButtonClick();

      expect(Analytics.track).to.be.calledOnce;
      expect($modal.open).to.be.calledOnce;
    });

    xit('redirects user if user is authenticated', () => {
      user.authenticated.returns(true);

      scope.playButtonClick();

      expect(Analytics.track).to.be.calledOnce;
      expect(window.location.href).to.eql('http://localhost:8080/context.html');
    });
  });

  describe('passwordReset', () => {
    it('alerts invalid email', () => {
      sandbox.spy(window, 'alert');

      scope.passwordReset();

      expect(window.alert).to.be.calledOnce;
    });

    it('calls password reset', () => {
      sandbox.spy(window, 'alert');
      $httpBackend.expectPOST('/api/v3/user/reset-password')
        .respond({});

      scope.passwordReset('email');
      $httpBackend.flush();

      expect(window.alert).to.be.calledOnce;
    });
  });

  describe('socialLogin', () => {
    xit('logs in with facebook', () => {
      let hello = {
        login: sinon.stub().returnsPromise().resolves({}),
      };
      let helloStub = sandbox.stub(window, 'hello');
      helloStub.returns(hello);
      $httpBackend.expectPOST('/api/v3/user/auth/social')
        .respond({});

      scope.socialLogin();

      expect(Auth.runAuth).to.be.calledOnce;
    });
  });
});
