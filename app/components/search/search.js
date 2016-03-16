/* global angular */
(function () {
    "use strict";

    var module = angular.module('search', ['search-services']);

    module.directive('hydroidSearch', ['$http', '$timeout', 'SearchServices','$location', function ($http, $timeout, SearchServices, $location) {
        return {
            restrict: 'E',
            scope: {
                results: '=',
                menuItems: '=',
                solrUrl: '@',
                solrCollection: '@'
            },
            templateUrl: 'components/search/search.html',
            controller: ['$scope', function ($scope) {

                $scope.query = '';
                var searchTimeout;
                $scope.$watch('query', function (newVal, oldVal) {
                    if (newVal) {
                        if (newVal != oldVal) {
                            if(searchTimeout != null) {
                                $timeout.cancel(searchTimeout);
                            }
                            searchTimeout = $timeout(function () {
                                $scope.search(newVal);
                            },200)
                        }
                    } else if (oldVal) {
                        $scope.resetSearch();
                    }
                });

                $scope.search = function (query) {
                    $http.get($scope.solrUrl + '/' + $scope.solrCollection +
                            '/select?q=*' + query + '*&facet=true&facet.field=label_s&facet.mincount=1&wt=json')
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

                $scope.resetSearch = function() {
                    if ($scope.query) {
                        $scope.query = null;
                    }
                    $location.search('facet',null);
                    $scope.results = [];
                    SearchServices.resetMenuCounters($scope.menuItems);
                };

            }],
            link: function (scope, element, attrs) {

            }
        };
    }]);
})();