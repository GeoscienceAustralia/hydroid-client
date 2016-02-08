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
                $scope.menuItems = [];

                $scope.$watch('searchResults', function () {
                    console.log($scope.searchResults);
                })

                $scope.hasSearchResults = function() {
                    return $scope.searchResults && $scope.searchResults.docs && $scope.searchResults.docs.length > 0;
                }

                $scope.hasSearchRelated = function() {
                    return $scope.menuItems && $scope.menuItems.length > 0;
                }

            }]
        };
    }]);
})();