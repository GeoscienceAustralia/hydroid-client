/* global angular */
(function () {
    "use strict";
    var mod = angular.module('hydroidApp', [
        'ngRoute',
        'home',
        'ngMaterial'
    ]);

    mod.config(['$routeProvider', '$locationProvider', '$mdThemingProvider',
        function ($routeProvider, $locationProvider, $mdThemingProvider) {
            $routeProvider.when('/', {template: '<hydroid-home></hydroid-home>'});
            $routeProvider.otherwise({redirectTo: '/'});
            $locationProvider.html5Mode(false);
            $mdThemingProvider.theme('default')
                .primaryPalette('light-blue');
        }]);
})();