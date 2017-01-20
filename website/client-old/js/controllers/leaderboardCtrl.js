angular.module('habitrpg')
  .controller('LeaderboardCtrl', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {
    $scope.rankedUsers = [];

    // An array of lederboards used for the menu. For now, this is a hardcoded list of Challenge ids
    $scope.leaderboards = [
      {
        id: '95163a0e-98c0-4879-a2b9-c40adb6d2376',
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
