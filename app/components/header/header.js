(function() {
    "use strict";

    var module = angular.module('header', []);

    module.directive('hydroidHeader', [function() {
        return {
            restrict: 'E',
            scope: { },
            templateUrl: 'components/header/header.html',
            controller: ['$scope', function($scope) {


            }]
        }
    }]);
})();