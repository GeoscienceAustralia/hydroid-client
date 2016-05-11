/* global angular */
(function () {
    "use strict";

    var module = angular.module('search', []);

    module.directive('hydroidSearch', ['$timeout', '$location','SearchServices', function ($timeout, $location,SearchServices) {
        return {
            restrict: 'E',
            scope: {
                onQuery: '&',
                onReset: '&',
                menuItems: '='
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

                $scope.$watch('menuItems', function (newVal,oldVal) {
                    if(newVal) {
                        $scope.allLabels = flattenMenu($scope.menuItems);
                    }
                });

                function flattenMenu(menuItems) {
                    var result = [];
                    menuItems.forEach(function (menuItem) {
                        result = result.concat(SearchServices.getAllFacetsForMenuItem(menuItem));
                    });
                    return result;
                }

            }],

            link: function (scope, element, attrs) {
            }
        };
    }]);

})();