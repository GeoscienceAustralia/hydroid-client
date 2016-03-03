(function () {
    "use strict";

    var module = angular.module('home', ['search-services'

    ]);

    module.directive('hydroidHome', ['SearchServices', function(SearchServices) {
        return {
            restrict: 'E',
            scope: { },
            templateUrl: 'components/home/home.html',
            controller: ['$scope', function($scope) {
                $scope.searchResults = []; // Initialise empty results
                $scope.menuItems = [];
                $scope.cartItems = [];

                $scope.$watch('searchResults', function () {
                    console.log($scope.searchResults);
                })

                $scope.hasSearchResults = function() {
                    return $scope.searchResults && $scope.searchResults.docs && $scope.searchResults.docs.length > 0;
                }

                $scope.hasSearchRelated = function() {
                    return $scope.menuItems && $scope.menuItems.length > 0;
                }

                $scope.resetSearch = function() {
                    $scope.searchResults = [];
                    SearchServices.resetMenuCounters($scope.menuItems);
                }

                $scope.hasCartItems = function() {
                    return $scope.cartItems.length > 0;
                }
            }]
        };
    }]);
})();