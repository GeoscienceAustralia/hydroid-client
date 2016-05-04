(function () {
    "use strict";

    var module = angular.module('home', ['search-services', 'hydroid-alerts']);

    module.directive('hydroidHome', ['SearchServices', '$location', '$log','$q','$timeout', function(SearchServices, $location, $log, $q,$timeout) {
        return {
            restrict: 'E',
            scope: {
                cartItems: '='
            },
            templateUrl: 'components/home/home.html',
            controller: ['$scope', '$anchorScroll', function($scope, $anchorScroll) {
                $scope.menuReady = false;
                SearchServices.getMenu().then(function (menu) {
                    $timeout(function () {
                        $scope.menuItems = menu;
                    });

                    $scope.menuReady = true;
                });

                var resultsCounter = 0;

                $scope.menuItems = [];
                $scope.facetStats = [];
                $scope.hasSearchResults = false;

                var consolidateStats = function(results) {
                    var allFacetStats = {};
                    for(var i = 0; i < results.length; i++) {
                        var result = results[i];
                        var facetStats = result.facets.facet_fields.label_s;
                        for(var j = 0; j < facetStats.length; j=j+2) {
                            allFacetStats[facetStats[j]] = facetStats[j + 1] || allFacetStats[facetStats[j]] + facetStats[j + 1];
                        }

                    }
                    return allFacetStats;
                };

                $scope.onSearch = function () {
                    $scope.hasSearchResults = true;
                    var queryParams = $location.search();
                    var query = queryParams.query;
                    var facet = queryParams.facet;
                    if (facet && facet.indexOf('_') > -1) {
                        facet = facet.split('_').join(' ');
                    }
                    var docTypes = ['DOCUMENT','DATASETS', 'MODEL', 'IMAGE'];
                    var promises = [];
                    for(var i = 0; i < docTypes.length; i++) {
                        promises.push(SearchServices.search(query,facet,docTypes[i],$scope.menuItems));
                    }
                    SearchServices.resetMenuCounters($scope.menuItems);
                    $scope.facetStats = [];
                    $q.all(promises).then(function (results) {

                        $timeout(function () {
                            var currentPage = null;
                            for(var i = 0; i < results.length; i++) {
                                var result = results[i];
                                currentPage = currentPage || result.currentPage;
                                $scope[result.docType.toLowerCase() + 'NumFound'] = result.numFound;
                                $scope[result.docType.toLowerCase() + 'Results'] = result.docs;
                            }

                            if (currentPage === 0) {
                                var keyValFacetStats = consolidateStats(results);
                                $scope.facetStats = SearchServices.getFacetStats(keyValFacetStats);

                                if (facet) {
                                    var menuItem = SearchServices.findMenuItemByLabel(facet, $scope.menuItems);
                                    var facetArray = SearchServices.getAllFacetsForMenuItem(menuItem);
                                    SearchServices.setMenuCounters($scope.facetStats, $scope.menuItems, facetArray);
                                } else {
                                    SearchServices.setMenuCounters($scope.facetStats, $scope.menuItems);
                                }
                                SearchServices.setMenuTotalCounters($scope.menuItems);
                            }
                        });
                    });
                };

                $scope.hasCartItems = function() {
                    return $scope.cartItems.length > 0;
                };

                $scope.$on('$locationChangeSuccess', function () {
                    $scope.onSearch();
                });
                $scope.$watch('menuReady', function () {
                    if($scope.menuReady) {
                        var queryParams = $location.search();
                        if(queryParams.query || queryParams.facet) {
                            $scope.onSearch();
                        }
                    }
                });
            }]
        };
    }]);
})();