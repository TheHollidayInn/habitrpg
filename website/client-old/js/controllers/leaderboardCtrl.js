angular.module('habitrpg')
  .controller('LeaderboardCtrl', ['$scope', '$http', '$stateParams', 'User', '$rootScope',
    function ($scope, $http, $stateParams, User, $rootScope) {
      $scope.rankedUsers = [];

      // An array of lederboards used for the menu. For now, this is a hardcoded list of Challenge ids
      $scope.leaderboards = [
      ];

      var apiV3Prefix = '/api/v3';

      if ($stateParams.cid || $stateParams.leaderboardId) {
        $scope.cid = $stateParams.cid || $stateParams.leaderboardId;
      }

      if ($stateParams.cid) {
        $scope.challengeDetail = true;
      }

      // @TODO: Add cacheing
      function getSiteLeaderboard (leaderboardId) {
        var url = apiV3Prefix + '/leaderboard';

        if (leaderboardId) {
          url += '/' + leaderboardId;
        }

        return $http({
          method: 'GET',
          url: url,
        });
      }

      getSiteLeaderboard($scope.cid)
        .then(function (response) {
          $scope.rankedUsers = response.data.data;
        })

      $scope.$watch('User.user.filters', function (newValue, oldValue) {
        var newChallengeId;

        for (tagId in newValue) {
          if (newValue[tagId] && !oldValue[tagId]) {
            newChallengeId = tagId;
            break;
          }
        }

        if (!newChallengeId) return;
        getSiteLeaderboard(newChallengeId)
          .then(function (response) {
            $scope.rankedUsers = response.data.data;
          })
      }, true);

      $rootScope.$on('userUpdated', function(event, args) {
        getSiteLeaderboard($scope.cid)
          .then(function (response) {
            $scope.rankedUsers = response.data.data;
          })
      });
    }]);
