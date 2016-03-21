/* global angular */
(function () {
    "use strict";

    var module = angular.module('search', []);

    module.directive('hydroidSearch', ['$timeout', '$location', function ($timeout, $location) {
        return {
            restrict: 'E',
            scope: {
                onQuery: '&',
                onReset: '&'
            },
            templateUrl: 'components/search/search.html',
            controller: ['$scope', function ($scope) {

                $scope.query = '';
                var searchTimeout;

                $scope.$watch('query', function (newVal, oldVal) {
                    if (newVal) {
                        if (newVal != oldVal) {
                            if(searchTimeout != null) {
                                $timeout.cancel(searchTimeout);
                            }
                            searchTimeout = $timeout(function () {
                                if ($scope.onQuery) {
                                    $scope.onQuery({query: $scope.query});
                                }
                            },200)
                        }
                    } else if (oldVal) {
                        if ($scope.onReset) {
                            $scope.onReset();
                        }
                    }
                });

                $scope.resetSearch = function() {
                    $scope.query = null;
                    $location.search('facet', null);
                    if ($scope.onReset) {
                        $scope.onReset();
                    }
                };

            }],

            link: function (scope, element, attrs) {
            }
        };
    }]);

})();