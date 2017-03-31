'use strict';

(function(){
  angular
    .module('habitrpg')
    .directive('taskList', taskList);

  taskList.$inject = [
    '$state',
    'User',
    '$rootScope',
  ];

  function taskList($state, User, $rootScope) {
    return {
      restrict: 'EA',
      templateUrl: 'templates/task-list.html',
      transclude: true,
      scope: true,
      // scope: {
      //  taskList: '=list',
      //  list: '=listDetails',
      //  obj: '=object',
      //  user: "=",
      // },
      link: function($scope, element, attrs) {
        // @TODO: The use of scope with tasks is incorrect. We need to fix all task ctrls to use directives/services
        // $scope.obj = {};
        function setObj (obj, force) {
          if (!force && ($scope.obj || $scope.obj !== {} || !obj)) return;
          $scope.obj = obj;
          setUpGroupedList();
          setUpTaskWatch();
        }

        $rootScope.$on('obj-updated', function (event, obj) {
          setObj(obj, true);
        });

        function setUpGroupedList () {
          if (!$scope.obj) return;
          $scope.groupedList = {};
          ['habit', 'daily', 'todo', 'reward'].forEach(function (listType) {
            groupTasksByChallenge($scope.obj[listType + 's'], listType);
          });
        }
        setUpGroupedList();

        function groupTasksByChallenge (taskList, type) {
          $scope.groupedList[type] = _.groupBy(taskList, 'challenge.shortName');

          // ADD some config maybe or just remove
          for (var group in  $scope.groupedList[type]) {
            $scope.groupedList[type][group] = _.groupBy($scope.groupedList[type][group], 'question');
          }
        };

        function setUpTaskWatch () {
          if (!$scope.obj) return;
          $scope.$watch(function () { return $scope.obj.tasksOrder; }, function () {
            setUpGroupedList();
          }, true);
        }
        setUpTaskWatch();

        $scope.getTaskList = function (list, taskList, obj) {
          setObj(obj);
          if (!$scope.obj) return [];
          if (taskList) return taskList;
          return $scope.obj[list.type+'s'];
        };

        function objIsGroup (obj) {
          return obj && obj.type && (obj.type === 'guild' || obj.type === 'party');
        }

        $scope.showNormalList = function (obj) {
          return objIsGroup(obj) || (!$state.includes("options.social.challenges") && !User.user.preferences.tasks.groupByChallenge);
        }

        $scope.showChallengeList = function () {
          return $state.includes("options.social.challenges");
        };

        var challengeMap = {
          'Power Quality and Reliability':	'de61fb54-d200-42bc-a917-70b70d8cd408',
          'Price':	'033c5270-0cc6-4a51-b62d-e61450d1fde8',
          'Billing and Pay':	'cb0c29f1-7468-4126-876e-f6b97881016a',
          'Corporate Citizenship':	'e1661681-d25c-4471-a4cb-e6eb25915f66',
          'Communications':	'0afd0d36-39e4-49a0-ad2f-fa7479df99e9',
          'Customer Service':	'd9f86ef5-46ea-4634-acee-ac4aff67b89d',
        };

        $scope.showGroupedList = function (obj, challenge) {
          var listEnabled = Object.keys(User.user.filters).length === 0 || User.user.filters[challengeMap[challenge]];
          return listEnabled && User.user.preferences.tasks.groupByChallenge && !$state.includes("options.social.challenges") && !objIsGroup(obj);
        }

        $scope.showDoubleTaskCounter = function (task, obj) {
          var objectIsGroup = obj.type && (obj.type === 'guild' || obj.type === 'party');
          var objectIsChallenge = $state.includes("options.social.challenges");
          return !objectIsGroup && !objectIsChallenge && task.up && task.down;
        };

        $scope.showSingleTaskCounter = function (task, obj) {
          var objectIsGroup = obj.type && (obj.type === 'guild' || obj.type === 'party');
          var objectIsChallenge = $state.includes("options.social.challenges");
          return !objectIsGroup && !objectIsChallenge && task.type === "habit" && (!task.up || !task.down);
        };
      }
    }
  }
}());