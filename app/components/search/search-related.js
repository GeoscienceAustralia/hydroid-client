/* global angular */
(function () {
    "use strict";
    var module = angular.module('search-related', ['search-services'

    ]);

    module .directive('hydroidSearchRelated', ['$http', '$timeout', 'SearchServices','$location', function ($http, $timeout, SearchServices,$location) {
        return {
            restrict: 'E',
            scope: {
                results: '=',
                menuItems:'=',
                solrUrl: '@',
                solrCollection: '@',
                menuUrl: '@'
            },
            templateUrl: 'components/search/search-related.html',
            controller: ['$scope', function($scope) {

                $scope.buildMenu = function () {
                    return $http.get($scope.menuUrl)
                        .then(function (response) {
                            console.log(response.data);
                            $timeout(function () {
                                $scope.menuItems = response.data;
                            });
                        },
                        function (response) {
                            console.log('error in menu api request');
                        });
                };

                $scope.buildMenu().then(function () {
                    var queryParams = $location.search();
                    if(queryParams.facet) {
                        $timeout(function () {
                            $scope.filterByFacet(queryParams.facet);
                        });
                    }
                });

                $scope.filterByFacet = function(facet) {
                    var queryFacet = '';
                    if(facet == null) {
                        $scope.results = [];
                        SearchServices.resetMenuCounters($scope.menuItems);
                        return;
                    }
                    if(facet.indexOf('_') > -1) {
                        queryFacet = facet.split('_').join(' ');
                    } else {
                       queryFacet = facet;
                    }
                    $http.get($scope.solrUrl + '/' + $scope.solrCollection + '/select?q=' + getChildrenFacets(queryFacet) + '&rows=50&facet=true&facet.field=label_s&facet.mincount=1&wt=json')
                            .then(function (response) {
                            console.log(response.data);
                            $timeout(function () {
                                $scope.results = {
                                    docs: response.data.response.docs,
                                    facets: response.data.facet_counts,
                                    imageRows: SearchServices.getResultImageRows(response.data.response.docs)
                                };
                                var facetStats = SearchServices.getFacetStats($scope.results.facets);
                                var menuItem = SearchServices.findMenuItemByLabel(queryFacet,$scope.menuItems);
                                var facetArray = SearchServices.getAllFacetsForMenuItem(menuItem);
                                SearchServices.resetMenuCounters($scope.menuItems);
                                SearchServices.setMenuCounters(facetStats, $scope.menuItems, facetArray);
                                SearchServices.setMenuTotalCounters($scope.menuItems);
                            });
                        },
                        function (response) {
                            console.log('error in api request');
                        });
                };

                $scope.doChildrenHaveDocs = function(menuItem) {
                    var haveDocs = SearchServices.doChildrenHaveDocs(menuItem);
                    return haveDocs;
                };

                var getAllChildrenFacets = function(menuItem, facets) {
                    if (facets != '') {
                        facets = facets + ' OR ';
                    }
                    facets = facets + 'label:"' + menuItem.nodeLabel + '"';
                    if (menuItem.children) {
                        for (var i=0; i < menuItem.children.length; i++) {
                            facets = getAllChildrenFacets(menuItem.children[i], facets);
                        }
                    }
                    return facets;
                };

                var getChildrenFacets = function(facet) {
                    // find menuItem for this facet
                    var menuItem = SearchServices.findMenuItemByLabel(facet, $scope.menuItems);
                    if (menuItem) {
                        return getAllChildrenFacets(menuItem, '');
                    }
                    return 'label:"' + facet + '"';
                };

                $scope.$on('$locationChangeSuccess', function () {
                    var queryParams = $location.search();
                    $timeout(function () {
                        $scope.filterByFacet(queryParams.facet);
                    });
                });
            }]
        };
    }]);
})();