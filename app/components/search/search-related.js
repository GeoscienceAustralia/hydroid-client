/* global angular */
(function () {
    "use strict";
    var module = angular.module('search-related', [

    ]);

    module .directive('hydroidSearchRelated', [function() {
        return {
            restrict: 'E',
            scope: {
                results:'='
            },
            templateUrl: 'components/search/search-related.html',
            controller: ['$scope', function($scope) {

            }]
        };
    }]);
})();