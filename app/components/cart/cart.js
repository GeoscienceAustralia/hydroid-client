(function () {
    "use strict";

    var module = angular.module('cart', ['config']);

    module.directive('shoppingCart', ['hydroidConfig', function(hydroidConfig) {
        return {
            restrict: 'E',
            scope: {
                cartList: "="
            },
            templateUrl: 'components/cart/cart.html',
            controller: ['$scope', function($scope) {

                $scope.removeItemFromCart = function(item) {
                    var index = $scope.cartList.indexOf(item);
                    $scope.cartList.splice(index, 1);
                }

                $scope.getDownloadUrl = function(item) {
                    if (item.docType == "IMAGE") return hydroidConfig.s3ImagesUrl + item.about;
                    return hydroidConfig.s3RdfsUrl + item.about;
                }

                $scope.buildDownloadString = function() {
                    var downloadString = "";
                    for(var item in $scope.cartList) {
                        downloadString += $scope.cartList[item].about + ",";
                    }
                    return downloadString.slice(0, -1);
                }

                $scope.downloadCartItems = function() {
                    location.href = hydroidConfig.s3BundlesUrl + $scope.buildDownloadString($scope.cartList);
                }

                $scope.clearCartItems = function() {
                    $scope.cartList.length = 0;
                }
            }]
        }
    }]);
})();