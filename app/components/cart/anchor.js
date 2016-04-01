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
            controller: ['$scope', '$location', '$anchorScroll', function($scope, $location, $anchorScroll) {

                $scope.cartHasItems = function() {
                    return $scope.cartItems.length > 0;
                };

                $scope.scrollToCart = function(newHash) {
                    var oldHash = $location.hash();
                    $location.hash(newHash);
                    $anchorScroll.yOffset = 100;
                    $anchorScroll();
                    $location.hash(oldHash);
                }
            }]
        }
    }]);
})();