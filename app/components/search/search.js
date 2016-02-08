/* global angular */
(function () {
    "use strict";

    var module = angular.module('search', []);

    module.directive('hydroidSearch', ['$http', '$timeout', 'SearchServices', function ($http, $timeout, SearchServices) {
        return {
            restrict: 'E',
            scope: {
                results: '=',
                menuItems: '=',
                queryUrl: '@',
                solrCollection: '@'
            },
            templateUrl: 'components/search/search.html',
            controller: ['$scope', function ($scope) {

                $scope.search = function (query) {
                    $http.get($scope.queryUrl + '/' + $scope.solrCollection +
                            '/select?q=' + query + '*&facet=true&facet.field=label&wt=json')
                        .then(function (response) {
                                console.log(response.data);
                                $timeout(function () {
                                    $scope.results = {docs: response.data.response.docs, facets: response.data.facet_counts};
                                    var facetStats = SearchServices.getFacetStats($scope.results.facets);
                                    SearchServices.updateCounters(facetStats, $scope.menuItems);
                                });
                            },
                            function (response) {
                                console.log('error in api request');
                            });
                };

            }],
            link: function (scope, element, attrs) {

            }
        };
    }]);
})();