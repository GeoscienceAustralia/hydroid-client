/* global angular */
(function () {
    "use strict";

    var module = angular.module('search-results', ['hydroid.modal']);

    module.directive('hydroidSearchResults', ['$http', '$timeout', 'SearchServices', 'hydroidModalService',
        function($http, $timeout, SearchServices, modalService) {
        return {
            restrict: 'E',
            scope: {
                solrUrl: '@',
                solrCollection: '@',
                query: "=",
                docType: '@',
                sectionTitle: '@',
                onResults: '&'
            },
            templateUrl: function(elements, attributes) {
                return attributes.templatePath || 'components/search/search-results.html';
            },
            controller: ['$scope', function($scope) {

                $scope.$watch('query', function (newVal, oldVal) {
                    if (newVal) {
                        if (newVal != oldVal) {
                            $scope.search(newVal);
                        }
                    } else if (oldVal) {
                        //$scope.resetSearch();
                    }
                });

                $scope.showResults = true;

                $scope.toggleShowResults = function() {
                    $scope.showResults = !$scope.showResults;
                };

                $scope.search = function (query) {
                    var totalsRows = ($scope.docType === 'IMAGE' ? 12 : 5);
                    $http.get($scope.solrUrl + '/' + $scope.solrCollection + '/select?q="*' + query + '*" AND docType:'
                                + $scope.docType + '&rows=' + totalsRows + '&facet=true&facet.field=label_s&facet.mincount=1&wt=json')
                        .then(function (response) {
                            console.log(response.data);
                            $timeout(function () {
                                // The results that get displayed
                                $scope.results = { docs: response.data.response.docs };
                                // The matrix of image rows/cols
                                if ($scope.docType === 'IMAGE') {
                                    $scope.results.imageRows = SearchServices.getResultImageRows(response.data.response.docs);
                                }
                                // The push results up to add up
                                if ($scope.onResults) {
                                    $scope.onResults({
                                        results: {
                                            docs: response.data.response.docs,
                                            facets: response.data.facet_counts
                                        }
                                    });
                                }
                                //var facetStats = SearchServices.getFacetStats($scope.results.facets);
                                //SearchServices.resetMenuCounters($scope.menuItems);
                                //SearchServices.setMenuCounters(facetStats, $scope.menuItems);
                                //SearchServices.setMenuTotalCounters($scope.menuItems);
                            });
                        },
                        function (response) {
                            console.log('error in api request');
                        });
                };

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