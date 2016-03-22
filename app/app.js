/* global angular */
(function () {
    "use strict";
    var mod = angular.module('hydroidApp', [
        'ngRoute',
        'home',
        'search',
        'search-results',
        'search-related',
        'enhancer',
        'cart',
        'header'
    ]);

    mod.config(['$routeProvider', '$locationProvider',
        function ($routeProvider, $locationProvider) {
            $routeProvider.when('/', {template: '<hydroid-home></hydroid-home>',reloadOnSearch:false});
            $routeProvider.when('/enhancer', {template: '<hydroid-enhancer></hydroid-enhancer>'});
            $routeProvider.when('/cart', {template: '<shopping-cart></shopping-cart>'});
            $routeProvider.when('/header', {template: '<hydroid-header></hydroid-header>'});
            $routeProvider.otherwise({redirectTo: '/'});
            $locationProvider.html5Mode(false);
        }]);
})();