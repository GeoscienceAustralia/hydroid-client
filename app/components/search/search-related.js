/* global angular */
(function () {
    "use strict";
    var module = angular.module('search-related', [

    ]);

    module .directive('hydroidSearchRelated', ['$http', '$timeout', function ($http, $timeout) {
        return {
            restrict: 'E',
            scope: {
                menuItems:'=',
                queryUrl: '@'
            },
            templateUrl: 'components/search/search-related.html',
            controller: ['$scope', function($scope) {

                $scope.buildMenu = function () {
                    $http.get($scope.queryUrl)
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

            }]
        };
    }]);
})();