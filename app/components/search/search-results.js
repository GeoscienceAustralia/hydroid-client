/* global angular */
(function () {
    "use strict";
    var module = angular.module('search-results', ['hydroid.modal'

    ]);

    module.directive('hydroidSearchResults', ['hydroidModalService', function(modalService) {
        return {
            restrict: 'E',
            scope: {
                results:'=',
                cartList: "="
            },
            templateUrl: 'components/search/search-results.html',
            controller: ['$scope', function($scope) {

                $scope.goToDownloadUrl = function(itemUrl) {
                    location.href = itemUrl;
                };

                $scope.isItemInCart = function(urn) {
                    for(var i = 0; i < $scope.cartList.length; i++) {
                        if (urn == $scope.cartList[i].about) return true;
                    }
                    return false;
                };

                $scope.addToCart = function(item) {
                    if (!$scope.isItemInCart(item.about)){
                        $scope.cartList.push(item);
                    }
                };

                $scope.popupImage = function(imageTitle, imageUrl, imageContent) {
                    var labels = '';
                    var imageContent = imageContent.slice(imageContent.indexOf('\n') + 1);
                    // sanitise HTML as this could be source of XSS
                    var labelArrays = imageContent.split(',');
                    for (var i=0; i < labelArrays.length; i++) {
                        labels = labels + labelArrays[i] + ', ';
                    }
                    labels = labels.substring(0, labels.length - 2);
                    imageContent = '<br/><b>Labels: </b>' + labels;
                    modalService.show(imageTitle, imageContent, imageUrl);
                };

            }]
        };
    }]);
})();