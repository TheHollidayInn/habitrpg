'use strict';

describe('Filters Controller', function() {
  var scope, user, userService;

  beforeEach(function () {
    module(function($provide) {
      var mockWindow = {href: '', alert: sandbox.spy(), location: {search: '', pathname: '', href: ''}};

      $provide.value('$window', mockWindow);
    });

    inject(function($rootScope, $controller, Shared, User) {
      user = specHelper.newUser();
      Shared.wrap(user);
      scope = $rootScope.$new();
      // user.filters = {};
      User.setUser(user);
      User.updateTag = sandbox.stub();
      User.user.filters = {};
      userService = User;
      $controller('FiltersCtrl', {$scope: scope, User: User});
    })
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('saveOrEdit', () => {
    it('begins editing', () => {
      let result = scope.saveOrEdit();

      expect(scope._editing).to.be.true;
    });

    it('should update tags', () => {
      userService.user.tags = [
        {
          id: 1,
          name: 'beforeName',
        }
      ];

      scope.saveOrEdit();

      userService.user.tags = [
        {
          id: 1,
          name: 'afterName',
        }
      ];
      scope.saveOrEdit();

      expect(userService.updateTag).to.be.calledOnce;
      expect(scope._editing).to.be.false;
    });
  });

  describe('tags', function(){
    it('creates a tag', function(){
      scope._newTag = {name:'tagName'}
      scope.createTag();
      expect(user.tags).to.have.length(1);
      expect(user.tags[0].name).to.eql('tagName');
      expect(user.tags[0]).to.have.property('id');
    });

    it('toggles tag filtering', inject(function(Shared){
      var tag = {id: Shared.uuid(), name: 'myTag'};
      scope.toggleFilter(tag);
      expect(userService.user.filters[tag.id]).to.eql(true);
      scope.toggleFilter(tag);
      expect(userService.user.filters[tag.id]).to.not.eql(true);
    }));
  });

  describe('updateTaskFilter', function(){
    it('updatest user\'s filter query with the value of filterQuery', function () {
      scope.filterQuery = 'task';
      scope.updateTaskFilter();

      expect(userService.user.filterQuery).to.eql(scope.filterQuery);
    });
  });

  describe('showChallengeClass', () => {
    it('returns challenge class', () => {
      let challengeClass = 'test-class';
      let tag = {
        challenge: challengeClass,
      }

      let result = scope.showChallengeClass(tag);

      expect(result).to.eql(challengeClass);
    });

    it('returns group class', () => {
      let groupClass = 'test-group-class';
      let tag = {
        group: groupClass,
      }

      let result = scope.showChallengeClass(tag);

      expect(result).to.eql(groupClass);
    });
  });
});
