/* global angular */
(function () {
    "use strict";
    var module = angular.module('search-related', []);

    module .directive('hydroidSearchRelated', ['$http', '$timeout', '$location', function ($http, $timeout, $location) {
        return {
            restrict: 'E',
            scope: {
                menuUrl: '@',
                menuItems:'=',
                hasResults: '=',
                onMenuClick: '&'
            },
            templateUrl: 'components/search/search-related.html',
            controller: ['$scope', function($scope) {

                $scope.buildMenu = function () {
                    return $http.get($scope.menuUrl)
                        .then(function (response) {
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
                            if ($scope.onMenuClick) {
                                $scope.onMenuClick({facet: queryParams.facet});
                            }
                        });
                    }
                });

                $scope.$on('$locationChangeSuccess', function () {
                    var queryParams = $location.search();
                    if(queryParams.facet) {
                        $timeout(function () {
                            if ($scope.onMenuClick) {
                                $scope.onMenuClick({facet: queryParams.facet});
                            }
                        });
                    }
                });

            }]
        };
    }]);

})();