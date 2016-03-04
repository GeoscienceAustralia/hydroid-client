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

                $scope.addToCart = function(item) {
                    if ($scope.cartList.indexOf(item) == -1) {
                        $scope.cartList.push(item);
                    } else {
                        alert("Duplicate item in cart " + $scope.cartList[$scope.cartList.indexOf(item)].title);
                    }

                }
            }]
        };
    }]);
})();
