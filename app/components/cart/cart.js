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

                $scope.buildItemsArray = function() {
                    var items = "";
                    for(var item in $scope.cartList) {
                        items += $scope.cartList[item].about + ",";
                    }
                    return items.slice(0, -1);
                }

                $scope.downloadCartItems = function() {
                    location.href = hydroidConfig.s3BundlesUrl + $scope.buildItemsArray($scope.cartList);
                }
            }]
        }
    }]);
})();