'use strict';

(function(){
  var REQUIRED_FIELDS = ['hitType','eventCategory','eventAction'];
  var ALLOWED_HIT_TYPES = ['pageview','screenview','event','transaction','item','social','exception','timing'];

  angular
    .module('habitrpg')
    .factory('Analytics', analyticsFactory);

  analyticsFactory.$inject = [
    'User'
  ];

  function analyticsFactory(User) {

    var user = User.user;

    //Amplitude
    // var r = window.amplitude || {};
    // r._q = [];
    // function a(window) {r[window] = function() {r._q.push([window].concat(Array.prototype.slice.call(arguments, 0)));}}
    // var i = ["init", "logEvent", "logRevenue", "setUserId", "setUserProperties", "setOptOut", "setVersionName", "setDomain", "setDeviceId", "setGlobalUserProperties"];
    // for (var o = 0; o < i.length; o++) {a(i[o])}
    // window.amplitude = r;
    // amplitude.init(window.env.AMPLITUDE_KEY, user ? user._id : undefined, null, null, function (res, err) {
    //   console.log(res, err)
    // });
    //
    // console.log(window.amplitude);


    (function(e,t){var n=e.amplitude||{_q:[],_iq:{}};var r=t.createElement("script");r.type="text/javascript";
    r.async=true;r.src="https://d24n15hnbwhuhn.cloudfront.net/libs/amplitude-3.4.0-min.gz.js";
    r.onload=function(){e.amplitude.runQueuedFunctions()};var i=t.getElementsByTagName("script")[0];
    i.parentNode.insertBefore(r,i);function s(e,t){e.prototype[t]=function(){this._q.push([t].concat(Array.prototype.slice.call(arguments,0)));
    return this}}var o=function(){this._q=[];return this};var a=["add","append","clearAll","prepend","set","setOnce","unset"];
    for(var u=0;u<a.length;u++){s(o,a[u])}n.Identify=o;var c=function(){this._q=[];return this;
    };var p=["setProductId","setQuantity","setPrice","setRevenueType","setEventProperties"];
    for(var l=0;l<p.length;l++){s(c,p[l])}n.Revenue=c;var d=["init","logEvent","logRevenue","setUserId","setUserProperties","setOptOut","setVersionName","setDomain","setDeviceId","setGlobalUserProperties","identify","clearUserProperties","setGroup","logRevenueV2","regenerateDeviceId","logEventWithTimestamp","logEventWithGroups"];
    function v(e){function t(t){e[t]=function(){e._q.push([t].concat(Array.prototype.slice.call(arguments,0)));
    }}for(var n=0;n<d.length;n++){t(d[n])}}v(n);n.getInstance=function(e){e=(!e||e.length===0?"$default_instance":e).toLowerCase();
    if(!n._iq.hasOwnProperty(e)){n._iq[e]={_q:[]};v(n._iq[e])}return n._iq[e]};e.amplitude=n;
    })(window,document);

    amplitude.getInstance().init(window.env.AMPLITUDE_KEY);


    // Google Analytics (aka Universal Analytics)
    window['GoogleAnalyticsObject'] = 'ga';
    window['ga'] = window['ga'] || function() {
        (window['ga'].q = window['ga'].q || []).push(arguments)
      }, window['ga'].l = 1 * new Date();
    ga('create', window.env.GA_ID, user ? {'userId': user._id} : undefined);

    function loadScripts() {
      setTimeout(function() {
        // Amplitude
        var n = document.createElement("script");
        var s = document.getElementsByTagName("script")[0];
        n.type = "text/javascript";
        n.async = true;
        n.src = "https://d24n15hnbwhuhn.cloudfront.net/libs/amplitude-2.2.0-min.gz.js";
        s.parentNode.insertBefore(n, s);

        // Google Analytics
        var a = document.createElement('script');
        var m = document.getElementsByTagName('script')[0];
        a.async = 1;
        a.src = '//www.google-analytics.com/analytics.js';
        m.parentNode.insertBefore(a, m);
      });
    }

    function register() {
      setTimeout(function() {
        amplitude.setUserId(user._id);
        ga('set', {'userId':user._id});
      });
    }

    function login() {
      setTimeout(function() {
        amplitude.setUserId(user._id);
        ga('set', {'userId':user._id});
      });
    }

    function track(properties) {
      setTimeout(function() {
        if(_doesNotHaveRequiredFields(properties)) { return false; }
        if(_doesNotHaveAllowedHitType(properties)) { return false; }

        var result = amplitude.logEvent(properties.eventAction, properties, function (result, err) {
          console.log(result, err)
        })
          // .then((result) {
          //   console.log(result)
          // })
          // .catch((error) => {
          //   console.log(error)
          // })
        ga('send',properties);
      });
    }

    function updateUser(properties) {
      setTimeout(function() {
        properties = properties || {};

        _gatherUserStats(user, properties);

        amplitude.setUserProperties(properties);
        ga('set',properties);
      });
    }

    if (window.env.NODE_ENV === 'production') loadScripts();

    return {
      loadScripts: loadScripts,
      register: register,
      login: login,
      track: track,
      updateUser: updateUser
    };
  }

  function _gatherUserStats(user, properties) {
    if (user._id) properties.UUID = user._id;
    if (user.stats) {
      properties.Class = user.stats.class;
      properties.Experience = Math.floor(user.stats.exp);
      properties.Gold = Math.floor(user.stats.gp);
      properties.Health = Math.ceil(user.stats.hp);
      properties.Level = user.stats.lvl;
      properties.Mana = Math.floor(user.stats.mp);
    }

    properties.balance = user.balance;
    properties.balanceGemAmount = properties.balance * 4;

    properties.tutorialComplete = user.flags && user.flags.tour && user.flags.tour.intro === -2;
    if (user.habits && user.dailys && user.todos && user.rewards) {
      properties["Number Of Tasks"] = {
        habits: user.habits.length,
        dailys: user.dailys.length,
        todos: user.todos.length,
        rewards: user.rewards.length
      };
    }
    if (user.contributor && user.contributor.level) properties.contributorLevel = user.contributor.level;
    if (user.purchased && user.purchased.plan.planId) properties.subscription = user.purchased.plan.planId;
  }

  function _doesNotHaveRequiredFields(properties) {
    if (!_.isEqual(_.keys(_.pick(properties, REQUIRED_FIELDS)), REQUIRED_FIELDS)) {
      console.log('Analytics tracking calls must include the following properties: ' + JSON.stringify(REQUIRED_FIELDS));
      return true;
    }
  }

  function _doesNotHaveAllowedHitType(properties) {
    if (!_.includes(ALLOWED_HIT_TYPES, properties.hitType)) {
      console.log('Hit type of Analytics event must be one of the following: ' + JSON.stringify(ALLOWED_HIT_TYPES));
      return true;
    }
  }
}());
