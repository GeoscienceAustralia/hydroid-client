/* global angular */
(function () {
    "use strict";
    var mod = angular.module('hydroidApp', [
        'ngRoute',
        'home',
        'search',
        'search-results',
        'search-related',
        'enhancer'
    ]);

    mod.config(['$routeProvider', '$locationProvider',
        function ($routeProvider, $locationProvider) {
            $routeProvider.when('/', {template: '<hydroid-home></hydroid-home>'});
            $routeProvider.when('/enhancer', {template: '<hydroid-enhancer></hydroid-enhancer>'});
            $routeProvider..otherwise({redirectTo: '/'});
            $locationProvider.html5Mode(false);
            $.material.init();
        }]);
})();