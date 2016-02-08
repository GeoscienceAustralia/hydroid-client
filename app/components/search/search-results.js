/* global angular */
(function () {
    "use strict";
    var module = angular.module('search-results', [

    ]);

    module .directive('hydroidSearchResults', [function() {
        return {
            restrict: 'E',
            scope: {
                results:'='
            },
            templateUrl: 'components/search/search-results.html',
            controller: ['$scope', function($scope) {
                $scope.getDownloadUrl = function(urn) {
                    return 'http://localhost:8080/document/' + urn + '/download';
                }
            }]
        };
    }]);
})();