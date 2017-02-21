'use strict';

describe('Footer Controller', function() {
  var scope, rootScope, user, User, Notification, $httpBackend;

  beforeEach(inject(function($rootScope, $controller, _$httpBackend_) {
    $httpBackend = _$httpBackend_;

    user = specHelper.newUser();
    User = {
      log: sandbox.stub(),
      set: sandbox.stub(),
      addTenGems: sandbox.stub(),
      addHourglass: sandbox.stub(),
      setHealthLow: sandbox.stub(),
      setCron: sandbox.stub(),
      makeAdmin: sandbox.stub(),
      sync: sandbox.stub(),
      user: user
    };

    Notification = {
      text: sandbox.stub(),
    };

    scope = $rootScope.$new();
    rootScope = $rootScope;

    window.env.isStaticPage = true;
    window.env.availableLanguages = [{code: 'en'}];
    window.env.language = {code: 'en'};

    $controller('FooterCtrl', {
      $scope: scope, User: User, Social: {},
      Notification: Notification,
    });
  }));

  afterEach(() => {
    sandbox.restore();
  });

  describe('initial variables', () => {
    xit('sets up default variables from env', () => {
      scope.changeLang();

      expect(scope.languages).to.eql(window.env.availableLanguages);
      expect(scope.selectedLanguage).to.eql({code: 'en'});
      expect(rootScope.selectedLanguage).to.eql({code: 'en'});
      expect(scope.changeLang).to.exist;
      // expect(window.location).to.eql('?lang=en');
    });
  });

  describe('deferredScripts', () => {
    it('calls Scripts that should be deferred', () => {
      window.env.BASE_URL = 'base-url';
      window.env.NODE_ENV = 'development';
      let getScriptStub = sandbox.stub($, 'getScript');

      scope.deferredScripts();

      expect(getScriptStub.callCount).to.be.eql(3);
    });
  });

  context('Debug mode', function() {
    before(function() {
      window.env.NODE_ENV = 'test';
    });

    after(function() {
      delete window.env.NODE_ENV;
    });

    describe('#setHealthLow', function () {
      it('sets user health to 1', () => {
        scope.setHealthLow();

        expect(User.set).to.be.calledOnce;
      });
    });

    describe('#addMissedDay', function () {
      it('Cancels if confirm box is not confirmed', () => {
        sandbox.stub(window, 'confirm').returns(false);

        scope.addMissedDay();

        expect(User.setCron).to.not.be.called;
      });

      it('allows multiple days');

      it('sets users last cron', () => {
        sandbox.stub(window, 'confirm').returns(true);

        scope.addMissedDay();

        expect(User.setCron).to.be.called;
      });

      it('notifies uers');
    });

    describe('#addTenGems', function() {
      it('posts to /user/addTenGems', inject(function($httpBackend) {
        scope.addTenGems();

        expect(User.addTenGems).to.have.been.called;
      }));
    });

    describe('#addHourglass', function() {
      it('posts to /user/addHourglass', inject(function($httpBackend) {
        scope.addHourglass();

        expect(User.addHourglass).to.have.been.called;
      }));
    });

    describe('#addGold', function() {
      it('adds 500 gold to user', () => {
        scope.addGold();

        expect(User.set).to.be.called;
      });
    });

    describe('#addMana', function() {
      it('adds 500 mana to user', () => {
        scope.addMana();

        expect(User.set).to.be.called;
      });
    });

    describe('#addLevelsAndGold', function() {
      it('adds 10000 experience to user', () => {
        scope.addLevelsAndGold();

        expect(User.set).to.be.called;
      });

      it('adds 10000 gp to user');

      it('adds 10000 mp to user');
    });

    describe('#addOneLevel', function() {
      it('adds one level to user', () => {
        scope.addOneLevel();

        expect(User.set).to.be.called;
      });
    });

    describe('#addBossQuestProgressUp', function() {
      it('adds 1000 progress to quest.progress.up', () => {
        $httpBackend.expectPOST('api/v3/debug/quest-progress').respond({});

        scope.addQuestProgress();
        $httpBackend.flush();

        expect(User.sync).to.be.called;
        expect(Notification.text).to.be.called;
      });
    });

    describe('#makeAdmin', function() {
      it('makes a user an admin', () => {
        scope.makeAdmin();

        expect(User.makeAdmin).to.be.called;
      });
    });

    describe('#openModifyInventoryModal', function() {
      it('opens a modify inventory modal', () => {
        let modifyInventoryModalStub = rootScope.openModal = sandbox.stub();

        scope.openModifyInventoryModal();
        scope.setAllItems();

        expect(modifyInventoryModalStub).to.be.called;
      });
    });

    describe('#modifyInventory', function() {
      it('modifies a user inventory', () => {
        scope.showInv = {};
        $httpBackend.expectPOST('api/v3/debug/modify-inventory').respond({});

        scope.modifyInventory();
        $httpBackend.flush();

        expect(Notification.text).to.be.called;
      });
    });
  });
});
