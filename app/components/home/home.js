(function () {
    "use strict";

    var module = angular.module('home', [

    ]);

    module.directive('hydroidHome', [function() {
        return {
            restrict: 'E',
            scope: { },
            templateUrl: 'components/home/home.html',
            controller: ['$scope', function($scope) {
                $scope.searchResults = []; // Initialise empty results

                $scope.$watch('searchResults', function () {
                    console.log($scope.searchResults);
                })
            }]
        };
    }]);
})();