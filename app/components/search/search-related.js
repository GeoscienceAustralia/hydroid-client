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
                        '/select?q=*&facet=true&facet.field=label&fq=' + getRelatedFacets(facet) + '&wt=json')
                        .then(function (response) {
                            console.log(response.data);
                            $timeout(function () {
                                $scope.results = {docs: response.data.response.docs, facets: response.data.facet_counts};
                                var facetStats = SearchServices.getFacetStats($scope.results.facets);
                                SearchServices.resetMenuCounters($scope.menuItems);
                                SearchServices.setMenuCounters(facetStats, $scope.menuItems);
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

                var getRelatedFacets = function(facet) {
                    return facet;
                }

            }]
        };
    }]);
})();