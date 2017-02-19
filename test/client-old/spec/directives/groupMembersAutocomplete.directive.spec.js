describe('groupMembersAutocomplete Directive', function() {
  var compile, scope, directiveElem;

  beforeEach(function() {
    module('habitrpg');

    inject(function($compile, $rootScope){
      compile = $compile;
      scope = $rootScope.$new();
    });

    directiveElem = getCompiledElement();
  });

  function getCompiledElement(){
    var element = angular.element('<group-members-autocomplete></group-members-autocomplete>');
    var compiledElement = compile(element)(scope);
    scope.$digest();
    return compiledElement;
  }

  // @TODO: Begin testing directives after we cache templates
  xit('should have span element', function () {
    // var spanElement = directiveElem.find('span');
    // expect(spanElement).toBeDefined();
    // expect(spanElement.text()).toEqual('This span is appended from directive.');
  });
});
