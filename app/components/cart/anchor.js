(function () {
    "use strict";

    var module = angular.module('anchor', [

    ]);

    module.directive('cartAnchor', [function() {
        return {
            restrict: 'E',
            scope: {
                cartItems: "="
            },
            templateUrl: 'components/cart/anchor.html',
            controller: ['$scope', function($scope) {

                $scope.isCartEmpty = function() {
                    return $scope.cartItems.length == 0;
                }
            }]
        }
    }]);
})();