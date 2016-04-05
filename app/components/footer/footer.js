(function () {
    "use strict";

    var module = angular.module('footer', [

    ]);

    module.directive('applicationFooter', [function() {
        return {
            restrict: 'E',
            scope: { },
            templateUrl: 'components/footer/footer.html',
            controller: ['$scope', function($scope) {

            }]
        }
    }]);
})();