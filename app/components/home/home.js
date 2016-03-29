(function () {
    "use strict";

    var module = angular.module('home', ['search-services', 'hydroid-alerts']);

    module.directive('hydroidHome', ['SearchServices', '$location', '$log', function(SearchServices, $location, $log) {
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
                    $scope.onResetFunction(true);
                    $scope.query = query;
                    $scope.facet = null;
                    $location.search('facet', null);
                };

                $scope.onResetFunction = function(isQuery) {
                    resultsCounter = 0;
                    $scope.facetStats = [];
                    if(!isQuery) {
                        $scope.query = null;
                        $scope.facet = null;
                        $scope.hasSearchResults = false;
                    }
                    SearchServices.resetMenuCounters($scope.menuItems);
                };

                $scope.onMenuClickFunction = function(facet) {
                    $scope.onResetFunction(true);
                    if (facet.indexOf('_') > -1) {
                        facet = facet.split('_').join(' ');
                    }
                    $scope.facet = facet;
                    $scope.isLoading = true;
                    resultsCounter = 0;
                };

                var hasFoundResults = false;

                $scope.onResultsFunction = function(results) {
                    if (results.currentPage === 0 && results.docs.length > 0) {
                        // Only mark as loading if the UI needs updating.
                        $scope.isLoading = true;

                        if (results.currentPage === 0) {
                            consolidateStats(results.facets.facet_fields.label_s);
                        }
                    }
                    resultsCounter ++;
                    if(!hasFoundResults && results.docs.length > 0) {
                        hasFoundResults = true;
                        $scope.hasSearchResults = true;
                    }
                    if(!hasFoundResults && resultsCounter === 4) {
                        $scope.hasSearchResults = false;
                    }
                    // All doc type search finished then the totals are calculated,
                    // this happens only in the first request
                    if (results.currentPage === 0 && resultsCounter === 4) {
                        hasFoundResults = false;
                        $scope.isLoading = false;
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

                $scope.$on('$locationChangeSuccess', function () {
                    var queryParams = $location.search();
                    if(queryParams.facet) {
                        $scope.onMenuClickFunction(queryParams.facet);
                    }
                });

            }]
        };
    }]);

})();