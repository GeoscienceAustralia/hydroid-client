(function() {
    "use strict";

    var module = angular.module('header', []);

    module.directive('hydroidHeader', [function() {
        return {
            restrict: 'E',
            scope: {
                appLogo: '@',
                appTitle: '@'
            },
            templateUrl: 'components/header/header.html',
            controller: ['$scope', function($scope) {

            }]
        }
    }]);
})();