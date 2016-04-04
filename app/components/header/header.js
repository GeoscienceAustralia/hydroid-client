(function() {
    "use strict";

    var module = angular.module('header', []);

    module.directive('applicationHeader', [function() {
        return {
            restrict: 'E',
            scope: {
                appLogo: '@',
                smlLogo: '@',
                appTitle: '@',
                cartItems: '='
            },
            templateUrl: function(elements, attributes) {
                return attributes.templatePath || 'components/header/header.html';
            },
            controller: ['$scope', function($scope) {

            }]
        }
    }]);
})();