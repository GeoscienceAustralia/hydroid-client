/* global angular */
(function () {
    "use strict";
    var module = angular.module('search-related', []);
    //HACK to avoid recursion
    window.searchItemMenuLevels = 0;

    module.directive('hydroidSearchRelated', ['$http', '$timeout', '$location', function ($http, $timeout, $location) {
        return {
            restrict: 'E',
            scope: {
                menuItems: '=',
                hasResults: '=',
                onMenuClick: '&'
            },
            templateUrl: 'components/search/search-related.html',
            controller: ['$scope', '$log', function ($scope, $log) {
                $scope.setFacet = function (nodeLabel) {
                    nodeLabel = nodeLabel.split(' ').join('_');
                    $location.search('facet', nodeLabel);
                };
            }]
        };
    }]);

    module.directive('hydroidSearchRelatedItem', ['$http', '$timeout', '$location', function ($http, $timeout, $location) {
        return {
            restrict: 'E',
            scope: {
                menuItem: '=',
                hasResults: '=',
                onMenuClick: '&'
            },
            templateUrl: 'components/search/search-related-item.html',
            controller: ['$scope', '$log', function ($scope, $log) {
                window.searchItemMenuLevels++;
                if(window.searchItemMenuLevels > 300)
                    throw new Error("Recursive menu error!");
                $scope.setFacet = function (nodeLabel) {
                    nodeLabel = nodeLabel.split(' ').join('_');
                    $location.search('facet', nodeLabel);
                };

                $scope.totalCount = function (menuItem) {
                    var result = menuItem.count;
                    if(menuItem.children) {
                        result += menuItem.children.reduce(function (a,b) {
                            return a.count + b.count;
                        });
                    }
                    return result;
                };
            }]
        }
    }]);

})();