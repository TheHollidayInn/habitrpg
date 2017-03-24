'use strict';

(function(){
  angular
    .module('habitrpg')
    .directive('task', task);

  task.$inject = [
    'Shared',
    '$modal',
    'User',
  ];

  function task(Shared, $modal, User) {
    return {
      restrict: 'E',
      templateUrl: 'templates/task.html',
      scope: true,
      link: function($scope, element, attrs) {
        $scope.getClasses = function (task, user, list, main) {
          return Shared.taskClasses(task, User.user.filters, user.preferences.dayStart, user.lastCron, list.showCompleted, main);
        }

        $scope.taskFiltered = function (task) {
          var filters = User.user.filters;
          for (var filter in filters) {
            var enabled = filters[filter];
            if (!task.tags) task.tags = [];
            if (enabled && task.tags.indexOf(filter) === -1) {
              return true;
            }
          }
        };

        $scope.showNoteDetails = function (task) {
          task.popoverOpen = false;

          $modal.open({
            templateUrl: 'modals/task-extra-notes.html',
            controller: function ($scope, task) {
              $scope.task = task;
            },
            resolve: {
              task: function() {
                return task;
              }
            }
          })
        };
      }
    }
  }
}());
