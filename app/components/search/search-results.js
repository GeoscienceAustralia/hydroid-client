/* global angular */
(function () {
    "use strict";
    var module = angular.module('search-results', [

    ]);

    module .directive('hydroidSearchResults', [function() {
        return {
            restrict: 'E',
            scope: {
                results:'=',
                cartList: "="
            },
            templateUrl: 'components/search/search-results.html',
            controller: ['$scope', function($scope) {

                $scope.getDownloadUrl = function(urn) {
                    return '/api/download/single/' + urn;
                };

                $scope.getDownloadImageUrl = function(urn) {
                    return '/api/download/image/' + urn;
                };

                $scope.addToCart = function(item) {
                    if ($scope.cartList.indexOf(item) == -1) {
                        console.log("test " + item);
                        $scope.cartList.push(item);
                    }
                }
            }]
        };
    }]);
})();