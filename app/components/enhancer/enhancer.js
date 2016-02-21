(function () {
    "use strict";

    var module = angular.module('enhancer', [

    ]);

    module.directive('hydroidEnhancer', ['$http', function ($http) {
        return {
            restrict: 'E',
            scope: { },
            templateUrl: 'components/enhancer/enhancer.html',
            controller: ['$scope', function($scope) {

                $scope.document = {docType: 'DOCUMENT'};

                $scope.enhance = function() {
                    $scope.responseMessage = null;
                    $http.post('/api/enhancer', $scope.document).
                        then(function(response) {
                            $scope.alertCss = 'alert-success';
                            $scope.responseMessage = response.data.message;
                        }, function(response) {
                            $scope.alertCss = 'alert-danger';
                            if (response.data) {
                                $scope.responseMessage = response.data.message;
                            } else {
                                $scope.responseMessage = 'There has been a problem enhancing your document, please try again later.';
                            }
                        });
                };

            }]
        };
    }]);
})();