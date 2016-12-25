angular.module('habitrpg')
  .controller('LeaderboardCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.rankedUsers = [];

    var apiV3Prefix = '/api/v3';

    function getSiteLeaderboard () {
      return $http({
        method: 'GET',
        url: apiV3Prefix + '/leaderboard',
      });
    }

    getSiteLeaderboard()
      .then(function (response) {
        $scope.rankedUsers = response.data.data;
      })
  }]);
