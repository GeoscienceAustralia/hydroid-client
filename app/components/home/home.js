(function () {
    "use strict";

    var module = angular.module('home', ['search-services']);

    module.directive('hydroidHome', ['SearchServices', '$location', function(SearchServices, $location) {
        return {
            restrict: 'E',
            scope: {},
            templateUrl: 'components/home/home.html',
            controller: ['$scope', function($scope) {

                var resultsCounter = 0;

                $scope.query = null;
                $scope.facet = null;
                $scope.menuItems = [];
                $scope.cartItems = [];
                $scope.facetStats = [];
                $scope.hasSearchResults = false;

                var consolidateStats = function(facetCounts) {
                    if (!facetCounts) {
                        return;
                    }
                    if ($scope.facetStats.length === 0) {
                        $scope.facetStats = facetCounts;
                    } else {
                        var facetPosition;
                        for (var i=0; i < facetCounts.length; i=i+2) {
                            if ((facetPosition = $scope.facetStats.indexOf(facetCounts[i])) >= 0) {
                                $scope.facetStats[facetPosition + 1] = $scope.facetStats[facetPosition + 1] + facetCounts[i + 1];
                            } else {
                                $scope.facetStats.push(facetCounts[i]);
                                $scope.facetStats.push(facetCounts[i + 1]);
                            }
                        }
                    }
                };

                $scope.onQueryFunction = function(query) {
                    $scope.onResetFunction();
                    $scope.query = query;
                    $scope.facet = null;
                    $location.search('facet', null);
                };

                $scope.onResetFunction = function() {
                    resultsCounter = 0;
                    $scope.facetStats = [];
                    $scope.hasSearchResults = false;
                    SearchServices.resetMenuCounters($scope.menuItems);
                };

                $scope.onMenuClickFunction = function(facet) {
                    $scope.onResetFunction();
                    if (facet.indexOf('_') > -1) {
                        facet = facet.split('_').join(' ');
                    }
                    $scope.facet = facet;
                };

                $scope.onResultsFunction = function(results) {
                    if (results.docs.length > 0) {
                        $scope.hasSearchResults = results.docs.length > 0;
                        if (results.currentPage === 0) {
                            consolidateStats(results.facets.facet_fields.label_s);
                        }
                    }
                    resultsCounter ++;
                    // All doc type search finished then the totals are calculated,
                    // this happens only in the first request
                    if (results.currentPage === 0 && resultsCounter === 4) {
                        $scope.facetStats = SearchServices.getFacetStats($scope.facetStats);
                        SearchServices.resetMenuCounters($scope.menuItems);
                        if ($scope.facet) {
                            var menuItem = SearchServices.findMenuItemByLabel($scope.facet, $scope.menuItems);
                            var facetArray = SearchServices.getAllFacetsForMenuItem(menuItem);
                            SearchServices.setMenuCounters($scope.facetStats, $scope.menuItems, facetArray);
                        } else {
                            SearchServices.setMenuCounters($scope.facetStats, $scope.menuItems);
                        }
                        SearchServices.setMenuTotalCounters($scope.menuItems);
                    }
                };

                $scope.hasCartItems = function() {
                    return $scope.cartItems.length > 0;
                };

            }]
        };
    }]);

})();