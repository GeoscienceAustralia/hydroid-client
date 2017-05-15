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
                           var regEx = new RegExp(facet, 'i');
                           var matchFacetIndex = selection.search(regEx);
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
            if (selectionContext && selectionContext.length > 50) {
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
                documents: '=',
                numFound: '=',
                docType: '@',
                sectionTitle: '@',
                onNextPage: '&',
                menuItems: '=',
                cartItems: '='
            },
            templateUrl: function(elements, attributes) {
                return attributes.templatePath || 'components/search/search-results.html';
            },
            controller: ['$scope', '$log', function($scope, $log) {
                $scope.isLoading = false;
                var currentPage = 0;
                $scope.documents = $scope.documents || [];
                $scope.imageRows = $scope.imageRows || [];
                $scope.highlights = $scope.highlights || [];
                $scope.numFound = $scope.numFound || 0;

                $scope.showResults = true;

                $scope.toggleShowResults = function() {
                    $scope.showResults = !$scope.showResults;
                };

                $scope.$watchCollection('documents', function (newVal, oldVal) {
                    if(newVal) {
                        var totalsRows = ($scope.docType === 'IMAGE' ? 6 : 5);
                        // The matrix of image rows/cols
                        if ($scope.docType === 'IMAGE') {
                            $scope.imageRows = SearchServices.getResultImageRows($scope.documents, totalsRows);
                        }
                        currentPage = newVal.length < totalsRows ? 0 : Math.floor(newVal.length / totalsRows) - 1;
                        $scope.hasNextPage = $scope.numFound > newVal.length;
                        console.log($scope.numFound);
                        var menuItem = SearchServices.findMenuItemByLabel($scope.facet, $scope.menuItems);
                        var facetArray = SearchServices.getAllFacetsForMenuItem(menuItem);
                        $scope.facetsArray = facetArray;
                    }
                });

                $scope.goToDownloadUrl = function(itemUrl) {
                    window.open(itemUrl,'_blank');
                };

                $scope.downloadOriginal = function(item) {
                    var urn = item.docOrigin;
                    if ($scope.isUrl(urn)) {
                        if ($scope.isCmiUrl(urn)) {
                            window.open($scope.getCmiUrl(urn), '_blank');
                        } else {
                            window.open(urn, '_blank');
                        }
                        return;
                    }
                    window.open("/api/download/documents/" + item.about,'_blank');
                };

                $scope.isUrl = function(urn) {
                    return urn != 'undefined' && urn != null && urn.toLowerCase().startsWith('http');
                };

                $scope.isCmiUrl = function(urn) {
                    return urn.toLowerCase().includes('hydroid_export');
                };

                $scope.getCmiUrl = function(urn) {
                    return urn.toLowerCase().replace('hydroid_export','node'); // to open the document in CMI rather the (JSON) endpoint
                };

                $scope.isItemInCart = function(urn) {
                    for(var i = 0; i < $scope.cartItems.length; i++) {
                        if (urn == $scope.cartItems[i].about) return true;
                    }
                    return false;
                };

                $scope.removeItemFromCart = function(item) {
                    var index = $scope.cartItems.indexOf(item);
                    $scope.cartItems.splice(index, 1);
                };

                $scope.addToCart = function(item) {
                    if (!$scope.isItemInCart(item.about)){
                        $scope.cartItems.push(item);
                    } else {
                        $scope.removeItemFromCart(item);
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
                    SearchServices.search($scope.query, $scope.facet,$scope.docType,$scope.menuItems,currentPage + 1)
                        .then(function (result) {
                            currentPage ++;
                            $timeout(function () {
                                $scope.documents.push.apply($scope.documents,result.docs);
                            });
                        });

                };

            }]
        };
    }]);

})();