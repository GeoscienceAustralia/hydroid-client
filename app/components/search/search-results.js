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
                    return '//hydroid-output.s3-website-ap-southeast-2.amazonaws.com/rdfs/' + urn;
                };

                $scope.getDownloadImageUrl = function(urn) {
                    return '//hydroid-output.s3-website-ap-southeast-2.amazonaws.com/images/' + urn;
                };

                $scope.isItemInCart = function(urn) {
                    for(var i = 0; i < $scope.cartList.length; i++) {
                        if (urn == $scope.cartList[i].about) return true;
                    }
                    return false;
                }

                $scope.addToCart = function(item) {
                    if (!$scope.isItemInCart(item.about)){
                        $scope.cartList.push(item);
                    }
                }
            }]
        };
    }]);
})();