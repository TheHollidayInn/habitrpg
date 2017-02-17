'use strict';

(function(){
  angular
    .module('habitrpg')
    .directive('groupTasksActions', groupTasksActions);

  groupTasksActions.$inject = [
  ];

  function groupTasksActions() {
    return {
      scope: {
        task: '=',
        group: '=',
      },
      templateUrl: 'partials/groups.tasks.actions.html',
      controller: 'GroupTaskActionsCtrl',
    };
  }
}());
