angular.module('habitrpg')
  .controller('LeaderboardCtrl', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {
    $scope.rankedUsers = [];

    var apiV3Prefix = '/api/v3';

    if ($stateParams.cid) {
      $scope.cid = $stateParams.cid;
    }

    function getSiteLeaderboard () {
      var url = apiV3Prefix + '/leaderboard';

      if ($stateParams.cid) {
        url += '/' + $stateParams.cid;
      }

      return $http({
        method: 'GET',
        url: url,
      });
    }

    getSiteLeaderboard()
      .then(function (response) {
        $scope.rankedUsers = response.data.data;
      })
  }]);
