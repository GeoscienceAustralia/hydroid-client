(function () {
    "use strict";

    var module = angular.module('cart', []);

    module.directive('shoppingCart', ['$http', function($http) {
        return {
            restrict: 'E',
            scope: { cartList: "="
            },
            templateUrl: 'components/cart/cart.html',
            controller: ['$scope', function($scope) {

//                $scope.getTotalBytes = function() {
//                    //Implement total (MB, GB) download size??
//                    var totalBytes = 0;
//                    for(var i = 0; i < $scope.cartList.length; i++) {
//                        totalBytes += $scope.cartList[i].bytes;
//                    }
//                    return totalBytes;
//                }
                $scope.removeItemFromCart = function(item) {
                    var index = $scope.cartList.indexOf(item);
                    $scope.cartList.splice(index, 1);
                }

                $scope.buildItemsArray = function() {
                    var items = "";
                    for(var item in $scope.cartList) {
                        items += $scope.cartList[item].about + ",";
                    }
                    return items.slice(0, -1);
                }

                $scope.downloadCartItems = function() {
                    location.href = "/api/download/bundle/" + $scope.buildItemsArray($scope.cartList);
                }
            }]
        }
    }]);
})();