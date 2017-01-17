angular.module('habitrpg')
  .controller('LeaderboardCtrl', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {
    $scope.rankedUsers = [];

    // An array of lederboards used for the menu. For now, this is a hardcoded list of Challenge ids
    $scope.leaderboards = [
      {
        id: '8011a72e-8b0d-4619-a314-2491d741c3b5',
        title: 'Category 1',
      }
    ];

    var apiV3Prefix = '/api/v3';

    if ($stateParams.cid || $stateParams.leaderboardId) {
      $scope.cid = $stateParams.cid || $stateParams.leaderboardId;
    }

    if ($stateParams.cid) {
      $scope.challengeDetail = true;
    }

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
  }]);
