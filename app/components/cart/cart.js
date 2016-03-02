(function () {
    "use strict";

    var module = angular.module('cart', []);

    module.directive('shoppingCart', function() {
        return {
            restrict: 'E',
            scope: { cartList: "="
            },
            templateUrl: 'components/cart/cart.html',
            controller: ['$scope', function($scope) {

                $scope.getTotalBytes = function() {
                    //Implement total (MB, GB) download size??
                    var totalBytes = 0;
//                    for(var i = 0; i < $scope.cartList.length; i++) {
//                        totalBytes += $scope.cartList[i].bytes;
//                    }
                    return totalBytes;
                }
                $scope.removeItemFromCart = function(item) {
                    var index = $scope.cartList.indexOf(item);
                    $scope.cartList.splice(index, 1);
                }
                $scope.downloadCartItems = function() {
                    //Send $http request to server here

                    //Dummy id (SHA) iteration test
                    for(var item in $scope.cartList) {
                        console.log("Downloading item .. " + $scope.cartList[item].about);
                    }
                }
            }]
        }
    });
})();