/* global angular */
(function () {
    "use strict";
    var module = angular.module('search-related', ['search-services'

    ]);

    module .directive('hydroidSearchRelated', ['$http', '$timeout', 'SearchServices', function ($http, $timeout, SearchServices) {
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
                    $http.get($scope.menuUrl)
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

                $scope.buildMenu();

                $scope.filterByFacet = function(facet) {
                    $http.get($scope.solrUrl + '/' + $scope.solrCollection +
                        '/select?q=' + getChildrenFacets(facet) + '&facet=true&facet.field=label_s&facet.mincount=1&wt=json')
                        .then(function (response) {
                            console.log(response.data);
                            $timeout(function () {
                                $scope.results = {docs: response.data.response.docs, facets: response.data.facet_counts};
                                var facetStats = SearchServices.getFacetStats($scope.results.facets);
                                var menuItem = SearchServices.findMenuItemByLabel(facet,$scope.menuItems);
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

            }]
        };
    }]);
})();