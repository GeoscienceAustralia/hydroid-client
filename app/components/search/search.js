/* global angular */
(function () {
    "use strict";

    var module = angular.module('search', ['search-services']);

    module.directive('hydroidSearch', ['$http', '$timeout', 'SearchServices','$location', function ($http, $timeout, SearchServices, $location) {
        return {
            restrict: 'E',
            scope: {
                onQuery: '&',
                onReset: '&'
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
                                if ($scope.onQuery) {
                                    $scope.onQuery({query: $scope.query});
                                }
                            },200)
                        }
                    } else if (oldVal) {
                        if ($scope.onReset) {
                            $scope.onReset();
                        }
                    }
                });

                /*
                $scope.search = function (query) {
                    $http.get($scope.solrUrl + '/' + $scope.solrCollection +
                            '/select?q="*' + query + '*"&rows=50&facet=true&facet.field=label_s&facet.mincount=1&wt=json')
                        .then(function (response) {
                                console.log(response.data);
                                $timeout(function () {
                                    $scope.results = {
                                        docs: response.data.response.docs,
                                        facets: response.data.facet_counts,
                                        imageRows: SearchServices.getResultImageRows(response.data.response.docs)
                                    };
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
                */

                $scope.resetSearch = function() {
                    /*
                    if ($scope.query) {
                        $scope.query = null;
                    }
                    $location.search('facet',null);
                    $scope.results = [];
                    SearchServices.resetMenuCounters($scope.menuItems);
                    */
                    if ($scope.onReset()) {
                        $scope.onReset();
                    }
                };

            }],
            link: function (scope, element, attrs) {

            }
        };
    }]);
})();