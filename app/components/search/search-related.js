/* global angular */
(function () {
    "use strict";
    var module = angular.module('search-related', [

    ]);

    module .directive('hydroidSearchRelated', ['$http', '$timeout', function ($http, $timeout) {
        return {
            restrict: 'E',
            scope: {
                results: '=',
                menuItems:'=',
                queryUrl: '@',
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
                    $http.get($scope.queryUrl + '/' + $scope.solrCollection +
                        '/select?q=*&facet=true&facet.field=label&fq=' + facet + '&wt=json')
                        .then(function (response) {
                            console.log(response.data);
                            $timeout(function () {
                                $scope.results = {docs: response.data.response.docs, facets: response.data.facet_counts};
                                var facetStats = getFacetStats($scope.results.facets);
                                updateCounters(facetStats, $scope.menuItems);
                            });
                        },
                        function (response) {
                            console.log('error in api request');
                        });
                };

                function getFacetStats(facets) {
                    var facetStats = [];
                    for (var i=0; i < facets.facet_fields.label.length; i=i+2) {
                        facetStats.push({ facet: facets.facet_fields.label[i], count: facets.facet_fields.label[i+1]});
                    }
                    return facetStats;
                }

                function updateCounters(facetStats, menuItems) {
                    for (var i=0; i < facetStats.length; i++) {
                        for (var j=0; j < menuItems.length; j++) {
                            if (menuItems[j].nodeLabel === facetStats[i].facet) {
                                menuItems[j].count = facetStats[i].count;
                            }
                            if (menuItems[j].children) {
                                updateCounters(facetStats, menuItems[j].children);
                            }
                        }
                    }
                }

            }]
        };
    }]);
})();