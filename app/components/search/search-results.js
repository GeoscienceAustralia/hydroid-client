/* global angular */
(function () {
    "use strict";
    var module = angular.module('search-results', [

    ]);

    module .directive('hydroidSearchResults', ['hydroidConfig', function(hydroidConfig) {
        return {
            restrict: 'E',
            scope: {
                results:'=',
                cartList: "="
            },
            templateUrl: 'components/search/search-results.html',
            controller: ['$scope', function($scope) {

                $scope.getDownloadUrl = function(urn) {
                    return hydroidConfig.awsRdfsUrl + urn;
                };

                $scope.getDownloadImageUrl = function(urn) {
                    return hydroidConfig.awsImagesUrl + urn;
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