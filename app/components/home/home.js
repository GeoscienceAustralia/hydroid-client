(function () {
    "use strict";

    var module = angular.module('home', ['search-services']);

    module.directive('hydroidHome', function() {
        return {
            restrict: 'E',
            scope: {},
            templateUrl: 'components/home/home.html',
            controller: ['$scope', function($scope) {

                var documents = [];
                var facets = [];

                $scope.query = '';
                $scope.menuItems = [];
                $scope.cartItems = [];

                $scope.onQueryFunction = function(query) {
                    documents = [];
                    $scope.query = query;
                };

                $scope.onResetFunction = function() {
                    var a = 1;
                };

                $scope.onResultsFunction = function(results) {
                    if (results.docs.length > 0) {
                        documents.push(results.docs);
                    }
                };

                /*
                $scope.$watch('searchResults', function () {
                    console.log($scope.searchResults);
                })
                */

                $scope.hasSearchResults = function() {
                    return documents.length > 0;
                }

                /*
                $scope.hasSearchRelated = function() {
                    return $scope.menuItems && $scope.menuItems.length > 0;
                }
                */

                $scope.hasCartItems = function() {
                    return $scope.cartItems.length > 0;
                }

            }]
        };
    });

})();