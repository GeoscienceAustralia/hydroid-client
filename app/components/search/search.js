/* global angular */
(function () {
    "use strict";

    var module = angular.module('search', []);

    module.directive('hydroidSearch', ['$timeout', '$location', function ($timeout, $location) {
        return {
            restrict: 'E',
            scope: {
                onQuery: '&',
                onReset: '&'
            },
            templateUrl: 'components/search/search.html',
            controller: ['$scope', function ($scope) {

                $scope.query = '';
                var queryParams = $location.search();
                if(queryParams.query) {
                    $scope.query = queryParams.query;
                }
                $scope.resetSearch = function() {
                    $scope.query = null;
                    $location.search('facet', null);
                    if ($scope.onReset) {
                        $scope.onReset();
                    }
                };

                $scope.search = function () {
                    $location.search('query',$scope.query);
                };

                $scope.searchKeyUp = function (event) {
                    if(event.keyCode === 13) {
                        $scope.search();
                    }
                };

                $scope.$on('$locationChangeSuccess', function () {
                    $scope.query = $location.search().query;
                });

            }],

            link: function (scope, element, attrs) {
            }
        };
    }]);

})();