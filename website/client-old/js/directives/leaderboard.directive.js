'use strict';

(function(){
  angular
    .module('habitrpg')
    .directive('leaderboard', leaderboard);

  leaderboard.$inject = [
  ];

  function leaderboard() {

    return {
      // scope: {},
      templateUrl: "partials/options.social.leaderboards.html",
      controller: 'LeaderboardCtrl',
    };
  }
}());
