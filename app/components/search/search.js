/* global angular */
(function () {
    "use strict";

    var module = angular.module('search', [

    ]);

    module.directive('hydroidSearch', ['$http',function($http) {
        return {
            restrict: 'E',
            scope: {
                results:'=',
                queryUrl:'@'
            },
            templateUrl: 'components/search/search.html',
            controller: ['$scope', function($scope) {
                $scope.search = function (query) {
                    $http.get($scope.queryUrl + '/contenthub/marine/search/featured?queryTerm=' + query)
                        .then(function (response) {
                            console.log(response.data);
                        },
                        function (response) {
                            console.log('error in api request');
                        });
                };
            }],
            link: function(scope,element, attrs) {

            }
        };
    }]);
})();