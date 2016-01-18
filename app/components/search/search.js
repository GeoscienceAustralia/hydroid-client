/* global angular */
(function () {
    "use strict";

    var module = angular.module('search', []);

    module.directive('hydroidSearch', ['$http', '$timeout', function ($http, $timeout) {
        return {
            restrict: 'E',
            scope: {
                results: '=',
                queryUrl: '@',
                contentHubName: '@'
            },
            templateUrl: 'components/search/search.html',
            controller: ['$scope', function ($scope) {
                $scope.factAliases = {
                    'organizations_t':'Organisations',
                    'people_t': 'People',
                    'places_t': 'Places'
                };
                $scope.search = function (query) {
                    $http.get($scope.queryUrl + '/contenthub/' +
                            $scope.contentHubName +
                            '/search/featured?queryTerm=' + query)
                        .then(function (response) {
                                console.log(response.data);
                                $timeout(function () {
                                    $scope.results = {data: response.data.documents, categories: response.data.facets};
                                    for(var i = 0; i < $scope.results.categories.length - 1; i++) {
                                        var cat = $scope.results.categories[i];
                                        cat.facet.alias = getFacetAlias(cat.facet.name);
                                    }
                                });
                            },
                            function (response) {
                                console.log('error in api request');
                            });
                };

                function getFacetAlias(facetName) {
                    return $scope.factAliases[facetName];
                }
            }],
            link: function (scope, element, attrs) {

            }
        };
    }]);
})();