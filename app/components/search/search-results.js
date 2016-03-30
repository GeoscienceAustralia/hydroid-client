/* global angular */
(function () {
    "use strict";

    var module = angular.module('search-results', [
        'hydroid.modal',
        'search-services'
    ]);

    module.filter('hydroidQueryResultsFilter', [function() {
        return function(text, query) {
            // Skip filter
            if(!query || !text)
                return text;
            var newText = "";
            var regEx = new RegExp(query, 'i');
            if (text.search(regEx) >= 0) {
                regEx = new RegExp(query, 'gi');
                newText = text.replace(regEx, '<b>' + query + '</b>') + '...';
            }
            return newText;
        };
    }]);

    module.filter('hydroidFacetsResultsFilter', [function() {
        return function(text, facets) {
            var newText = "";
            // Skip filter
            if(!text || !facets)
                return text;
            for (var i=0; i < facets.length; i++) {
                var facet = facets[i];
                var regEx = new RegExp(facet, 'i');
                if (text.search(regEx) >= 0) {
                    regEx = new RegExp(facet, 'gi');
                    newText = newText != "" ? newText.replace(regEx, '<b>' + facet + '</b>') : text.replace(regEx, '<b>' + facet + '</b>');
                }
            }
            newText = newText + ' ...';
            return newText;
        };
    }]);

    module.filter('hydroidTrustedText', ['$sce',function($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        }
    }]);

    module.filter('hydroidTruncateTextPreview', function () {
        function findStartOfNearestSentence(text, matchIndex) {
            var index = text.substr(0).search(/[A-Z]/);
            if(index > -1 && index < 50){
                return index;
            } else {
                return (matchIndex > 0 && matchIndex > 50) ? matchIndex - 50 : 0;
            }
        }

       return function (selectionContextArray, query, facetArray) {
           var matchContextsText = '';
           if (selectionContextArray) {
               for (var i = 0; i < selectionContextArray.length; i++) {
                   var selection = selectionContextArray[i];
                   if (query) {
                       var regEx = new RegExp(query, 'i');
                       var matchIndex = selection.search(regEx);
                       if(matchIndex > -1) {
                           var startIndex = findStartOfNearestSentence(selection,matchIndex);
                           var endIndex = (selection.length > (matchIndex + 50)) ? matchIndex + 50 : selection.length;
                           matchContextsText += selection.substr(startIndex,endIndex - startIndex) + '...';
                       }
                   } else if (facetArray) {
                       for (var j=0; j < facetArray.length; j++) {
                           var facet = facetArray[j];
                           var matchFacetIndex = selection.indexOf(facet);
                           if (matchFacetIndex >= 0) {
                               var startFacetIndex = findStartOfNearestSentence(selection,matchFacetIndex);
                               var endFacetIndex = (selection.length > (matchFacetIndex + 50)) ? matchFacetIndex + 50 : selection.length;
                               matchContextsText += selection.substr(startFacetIndex,endFacetIndex - startFacetIndex) + '...';
                               break;
                           }
                       }
                   }
                   if(matchContextsText.length > 400) {
                       break;
                   }
               }
           }
           return matchContextsText;
       }
    });

    module.filter('hydroidRelateHighlights', function() {
        return function (selectionContext, about, highlights) {
            var content = '';
            if (selectionContext) {
                return selectionContext;
            } else if (about && highlights) {
                for (var i=0; i < highlights.length; i++) {
                    var subject = highlights[i][about];
                    if (subject && subject.content) {
                        for (var j=0; j < subject.content.length; j++) {
                            content = content + subject.content[j] + '...';
                        }
                    }
                }
            }
            return content;
        }
    });

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
            controller: ['$scope', '$log', function($scope, $log) {
                $scope.isLoading = false;
                var currentPage = 0;
                $scope.documents = [];
                $scope.imageRows = [];
                $scope.highlights = [];

                $scope.$watch('query', function (newVal, oldVal) {
                    if (newVal) {
                        if (newVal != oldVal) {
                            currentPage = 0;
                            $scope.documents = [];
                            $scope.imageRows = [];
                            $scope.highlights = [];
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
                            $scope.highlights = [];
                            $scope.search($scope.query, newVal);
                        }
                    }
                });

                $scope.showResults = true;

                $scope.toggleShowResults = function() {
                    $scope.showResults = !$scope.showResults;
                };

                $scope.search = function (query, facet) {
                    $scope.isLoading = true;
                    var totalsRows = ($scope.docType === 'IMAGE' ? 6 : 5);
                    var start = (currentPage * totalsRows);
                    var highlightParams = '&hl=true&hl.simple.pre=<b>&hl.simple.post=</b>&hl.snippets=5&hl.fl=content' +
                        '&fl=extracted-from,concept,docUrl,about,imgThumb,docType,label,title,selectionContext,created,creator';

                    var url = $scope.solrUrl + '/' + $scope.solrCollection + '/select?q=docType:' + $scope.docType;

                    if (query) {
                        url = url + ' AND "*' + query + '*"';
                    }

                    if (facet) {
                        $scope.facetsArray = getChildrenFacetsArray(facet);
                        url = url + ' AND (' + getChildrenFacets() + ')';
                    }

                    url = url + '&rows=' + totalsRows + '&start=' + start + '&facet=true&facet.field=label_s&facet.mincount=1&wt=json'
                        + highlightParams;

                    $http.get(url).then(function (response) {
                            $scope.isLoading = false;
                            $timeout(function () {
                                try {
                                    // The results that get displayed
                                    $scope.documents = $scope.documents.concat(response.data.response.docs);
                                    $scope.highlights = $scope.highlights.concat(response.data.highlighting);
                                    // The matrix of image rows/cols
                                    if ($scope.docType === 'IMAGE') {
                                        $scope.imageRows = $scope.imageRows.concat(SearchServices.getResultImageRows(response.data.response.docs, totalsRows));
                                    }
                                    $scope.hasNextPage = response.data.response.numFound > (totalsRows * (currentPage + 1));

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
                                } catch (err) {
                                    $log.error('Error calling Solr API, Cause: ' + err.name + '(' + err.message + ')');
                                }
                            });
                        },
                        function (response) {
                            $log.error('Error calling Solr API, Code: ' + response.status);
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

                $scope.popupImage = function(imageTitle, imageUrl, labelArray) {
                    var labels = '';
                    for (var i=0; i < labelArray.length; i++) {
                        labels = labels + labelArray[i] + ', ';
                    }
                    labels = labels.substring(0, labels.length - 2);
                    var imageContent = '<br/><b>Labels: </b>' + labels;
                    modalService.show(imageTitle, imageContent, imageUrl);
                };

                $scope.nextPage = function() {
                    currentPage ++;
                    $scope.search($scope.query, $scope.facet);
                };

                var getAllChildrenFacetsArray = function(menuItem, facetsArray) {
                    facetsArray.push(menuItem.nodeLabel);
                    if (menuItem.children) {
                        for (var i=0; i < menuItem.children.length; i++) {
                            facetsArray = getAllChildrenFacetsArray(menuItem.children[i], facetsArray);
                        }
                    }
                    return facetsArray;
                };

                var getChildrenFacetsArray = function(facet) {
                    // find menuItem for this facet
                    var menuItem = SearchServices.findMenuItemByLabel(facet, $scope.menuItems);
                    if (menuItem) {
                        return getAllChildrenFacetsArray(menuItem, []);
                    }
                    return [facet];
                };

                var getChildrenFacets = function() {
                    var facets = "";
                    for (var i=0; i < $scope.facetsArray.length; i++) {
                        if (i > 0) {
                            facets = facets + ' OR ';
                        }
                        facets = facets + 'label:"' + $scope.facetsArray[i] + '"';
                    }
                    return facets;
                };

            }]
        };
    }]);

})();