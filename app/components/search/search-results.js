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
                facet: "=",
                docType: '@',
                sectionTitle: '@',
                onResults: '&',
                menuItems: '=',
                cartItems: '='
            },
            templateUrl: function(elements, attributes) {
                return attributes.templatePath || 'components/search/search-results.html';
            },
            controller: ['$scope', function($scope) {

                var currentPage = 0;
                var hasNextPage = false;
                $scope.documents = [];
                $scope.imageRows = [];

                $scope.$watch('query', function (newVal, oldVal) {
                    if (newVal) {
                        if (newVal != oldVal) {
                            currentPage = 0;
                            $scope.documents = [];
                            $scope.imageRows = [];
                            $scope.search(newVal, $scope.facet);
                        }
                    }
                });

                $scope.$watch('facet', function (newVal, oldVal) {
                    if (newVal) {
                        if (newVal != oldVal) {
                            currentPage = 0;
                            $scope.documents = [];
                            $scope.imageRows = [];
                            $scope.search($scope.query, newVal);
                        }
                    }
                });

                $scope.showResults = true;

                $scope.toggleShowResults = function() {
                    $scope.showResults = !$scope.showResults;
                };

                $scope.search = function (query, facet) {
                    var totalsRows = ($scope.docType === 'IMAGE' ? 6 : 5);
                    var start = (currentPage * 5);

                    var url = $scope.solrUrl + '/' + $scope.solrCollection + '/select?q=docType:' + $scope.docType;

                    if (query) {
                        url = url + ' AND "*' + query + '*"';
                    }

                    if (facet) {
                        url = url + ' AND (' + getChildrenFacets(facet) + ')';
                    }

                    url = url + '&rows=' + totalsRows + '&start=' + start + '&facet=true&facet.field=label_s&facet.mincount=1&wt=json'

                    $http.get(url).then(function (response) {
                            console.log(response.data);
                            $timeout(function () {

                                // The results that get displayed
                                $scope.documents = $scope.documents.concat(response.data.response.docs);
                                // The matrix of image rows/cols
                                if ($scope.docType === 'IMAGE') {
                                    $scope.imageRows = $scope.imageRows.concat(SearchServices.getResultImageRows(response.data.response.docs));
                                }
                                $scope.hasNextPage =  response.data.response.docs.length >= totalsRows;

                                // The push results up to add up
                                if ($scope.onResults) {
                                    $scope.onResults({
                                        results: {
                                            docs: response.data.response.docs,
                                            facets: response.data.facet_counts,
                                            currentPage: currentPage
                                        }
                                    });
                                }
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
                    for(var i = 0; i < $scope.cartItems.length; i++) {
                        if (urn == $scope.cartItems[i].about) return true;
                    }
                    return false;
                };

                $scope.addToCart = function(item) {
                    if (!$scope.isItemInCart(item.about)){
                        $scope.cartItems.push(item);
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

                $scope.nextPage = function() {
                    currentPage ++;
                    $scope.search($scope.query, $scope.facet);
                };

                var getAllChildrenFacets = function(menuItem, facets) {
                    if (facets != '') {
                        facets = facets + ' OR ';
                    }
                    facets = facets + 'label:"' + menuItem.nodeLabel + '"';
                    if (menuItem.children) {
                        for (var i=0; i < menuItem.children.length; i++) {
                            facets = getAllChildrenFacets(menuItem.children[i], facets);
                        }
                    }
                    return facets;
                };

                var getChildrenFacets = function(facet) {
                    // find menuItem for this facet
                    var menuItem = SearchServices.findMenuItemByLabel(facet, $scope.menuItems);
                    if (menuItem) {
                        return getAllChildrenFacets(menuItem, '');
                    }
                    return 'label:"' + facet + '"';
                };

            }]
        };
    }]);

})();