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
        'anchor',
        'header',
        'hydroid-alerts'
    ]);

    mod.controller('anchorCtrl', ['$scope', function ($scope) {
        $scope.cartItems = [];
    }]);

    mod.config(['$routeProvider', '$locationProvider', '$provide',
        function ($routeProvider, $locationProvider, $provide) {
            $routeProvider.when('/', {template: '<hydroid-home cart-items="cartItems"></hydroid-home>',reloadOnSearch:false});
            $routeProvider.otherwise({redirectTo: '/'});
            $locationProvider.html5Mode(false);

            $provide.decorator('$log', ['$delegate', 'hydroidAlertsService', function ($delegate, hydroidAlertsService) {

                $delegate.info = function(msg) {
                    hydroidAlertsService.showInfo(msg);
                };

                $delegate.error = function(msg) {
                    hydroidAlertsService.showError(msg);
                };

                $delegate.debug = function(msg) {
                    hydroidAlertsService.debug(msg);
                };

                return $delegate;
            }]);

        }]);

})();