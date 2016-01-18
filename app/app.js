/* global angular */
(function () {
    "use strict";
    var mod = angular.module('hydroidApp', [
        'ngRoute',
        'home'
    ]);

    mod.config(['$routeProvider', '$locationProvider',
        function ($routeProvider, $locationProvider) {
            $routeProvider.when('/', {template: '<hydroid-home></hydroid-home>'});
            $routeProvider.otherwise({redirectTo: '/'});
            $locationProvider.html5Mode(false);
            $.material.init();
        }]);
})();