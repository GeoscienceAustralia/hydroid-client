(function () {
    "use strict";

    var module = angular.module('cart', []);

    module.directive('shoppingCart', function() {
        return {
            restrict: 'E',
            scope: { },
            templateUrl: 'components/cart/cart.html',
            controller: ['$scope', function($scope) {

                //Dummy items
                $scope.cartItems =
                [
                    {
                        name: "Marine 1",
                        type: "DOC",
                        bytes: 192938
                    },
                    {
                        name: "Marine 2",
                        type: "PDF",
                        bytes: 247112
                    },
                    {
                        name: "Marine 3",
                        type: "RTF",
                        bytes: 250445
                    }
                ]
                $scope.getTotalBytes = function() {
                    var totalBytes = 0;
                    for(var i = 0; i < $scope.cartItems.length; i++) {
                        totalBytes += $scope.cartItems[i].bytes;
                    }
                    return totalBytes;
                }
            }]
        }
    });
})();