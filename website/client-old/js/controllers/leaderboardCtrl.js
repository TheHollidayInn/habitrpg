angular.module('habitrpg')
  .controller('LeaderboardCtrl', ['$scope', '$http', '$stateParams', 'User', '$rootScope',
    function ($scope, $http, $stateParams, User, $rootScope) {
      $scope.rankedUsers = [];

      // An array of lederboards used for the menu. For now, this is a hardcoded list of Challenge ids
      $scope.leaderboards = [
        {
          id: 'de61fb54-d200-42bc-a917-70b70d8cd408',
          title: 'Power Quality and Reliability',
        },
        {
          id: '033c5270-0cc6-4a51-b62d-e61450d1fde8',
          title: 'Price',
        },
        {
          id: 'cb0c29f1-7468-4126-876e-f6b97881016a',
          title: 'Billing and Pay',
        },
        {
          id: 'e1661681-d25c-4471-a4cb-e6eb25915f66',
          title: 'Corporate Citizenship',
        },
        {
          id: '0afd0d36-39e4-49a0-ad2f-fa7479df99e9',
          title: 'Communications',
        },
        {
          id: 'd9f86ef5-46ea-4634-acee-ac4aff67b89d',
          title: 'Customer Service',
        },
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
