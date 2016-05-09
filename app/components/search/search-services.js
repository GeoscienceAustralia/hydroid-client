/* global angular */
(function () {
    "use strict";

    var module = angular.module('search-services', []);

    module.service('SearchServices', ['$http','$q','hydroidConfig','$timeout','$log',function($http, $q, hydroidConfig,$timeout,$log) {

        var solrUrl = hydroidConfig.solrUrl; // Get from config?
        var solrCollection = hydroidConfig.solrCollection;
        var menuUrl = hydroidConfig.menuUrl;

        function search (query, facet, docType, menuItems, currentPage) {
            //$scope.isLoading = true;
            currentPage = currentPage || 0;
            var totalsRows = (docType === 'IMAGE' ? 6 : 5);
            var start = (currentPage * totalsRows);
            var highlightParams = '&hl=true&hl.simple.pre=<b>&hl.simple.post=</b>&hl.snippets=5&hl.fl=content' +
                '&fl=extracted-from,concept,docUrl,about,imgThumb,docType,label,title,selectionContext,created,creator';

            var url = solrUrl + '/' + solrCollection + '/select?q=docType:' + docType;

            if (query) {
                url = url + ' AND "*' + query + '*"';
            }
            var facetsArray = null;
            if (facet) {
                facetsArray = getChildrenFacetsArray(facet,menuItems);
                url = url + ' AND (' + getChildrenFacets(facetsArray) + ')';
            }

            url = url + '&rows=' + totalsRows + '&start=' + start + '&facet=true&facet.field=label_s&facet.mincount=1&wt=json'
                + highlightParams;
            var result = {
                docs: [],
                highlights: [],
                facets: [],
                imageRows: [],
                currentPage: currentPage,
                hasNextPage: false,
                docType: docType
            };
            var deferred = $q.defer();
            $http.get(url).then(function (response) {
                    $timeout(function () {
                        try {
                            // The results that get displayed
                            result.docs = result.docs.concat(response.data.response.docs);
                            result.highlights = result.highlights.concat(response.data.highlighting);
                            // The matrix of image rows/cols
                            if (docType === 'IMAGE') {
                                result.imageRows = result.imageRows.concat(getResultImageRows(response.data.response.docs));
                            }
                            result.hasNextPage = response.data.response.numFound > (totalsRows * (currentPage + 1));
                            result.numFound = response.data.response.numFound;
                            result.docs = response.data.response.docs;
                            result.facets = response.data.facet_counts;
                            result.currentPage = currentPage;
                            deferred.resolve(result);
                        } catch (err) {
                            $log.error('Error calling Solr API, Cause: ' + err.name + '(' + err.message + ')');
                            deferred.reject(err);
                        }
                    });
                },
                function (response) {
                    $log.error('Error calling Solr API, Code: ' + response.status);
                    deferred.reject(response.status);
                });
            return deferred.promise;
        }

        var getNextPage = function(query, facet, docType, menuItems, currentPage, existingResults) {
            var deferred = $q.defer();
            search(query,facet,docType,menuItems,currentPage + 1).then(function (result) {
                result.docs = existingResults.concat(result.docs);
                deferred.resolve(result);
            });
            return deferred.promise;
        };

        var getFacetStats = function(facets) {
            var facetStats = [];
            for(var facetName in facets) {
                if(facets.hasOwnProperty(facetName)) {
                    facetStats.push({ facet: facetName, count: facets[facetName]});
                }
            }
            return facetStats;
        };

        var findMenuItemByLabel = function(label, menuItems) {
            for (var i=0; i < menuItems.length; i++) {
                if (menuItems[i].nodeLabel === label) {
                    return menuItems[i];
                }
                if (menuItems[i].children) {
                    var menuItem = findMenuItemByLabel(label, menuItems[i].children);
                    if (menuItem != null) {
                        return menuItem;
                    }
                }
            }
            return null;
        };

        var resetMenuCounters = function(menuItems) {
            for (var i=0; i < menuItems.length; i++) {
                menuItems[i].count = 0;
                if (menuItems[i].children) {
                    resetMenuCounters(menuItems[i].children);
                }
            }
        };

        var setMenuCounters = function(facetStats, menuItems, filterFacet) {
            for (var i=0; i < facetStats.length; i++) {
                var menuItem = findMenuItemByLabel(facetStats[i].facet, menuItems);
                if (menuItem && isChildFacetOfMenuItem(menuItem,filterFacet)) {
                    menuItem.count = facetStats[i].count;
                    if (menuItem.children) {
                        setMenuCounters(facetStats, menuItem.children);
                    }
                }
            }
        };

        var isChildFacetOfMenuItem = function (menuItem, facetArray) {
            if(!facetArray) {
                return true;
            }
            for(var j = 0; j < facetArray.length; j++) {
                var facet = facetArray[j];
                if(menuItem.nodeLabel == facet) {
                    return true;
                }
                if(menuItem.children) {
                    for(var i = 0; i < menuItem.children.length; i++) {
                        var childMenu = menuItem.children[i];
                        if(isChildFacetOfMenuItem(childMenu,facet)) {
                            return true;
                        }
                    }
                }
            }

            return false;
        };

        var setMenuTotalCounters = function(menuItems) {
            var menuItem = null;
            var totalDocs = 0;
            var childrenDocs = 0;
            for (var i=0; i < menuItems.length; i++) {
                menuItem = menuItems[i];
                if (menuItem.count > totalDocs) {
                    totalDocs = menuItem.count;
                }
                //totalDocs = totalDocs + menuItem.count;
                if (menuItem.children) {
                    childrenDocs = setMenuTotalCounters(menuItem.children);
                    //menuItem.count = menuItem.count + childrenDocs;
                    menuItem.count = childrenDocs;
                    if (childrenDocs > totalDocs) {
                        totalDocs = childrenDocs;
                    }
                }
            }
            return totalDocs;
        };

        var populateFacetArray = function(menuItem, facetArray) {
            if(!menuItem)
                return;
            if(!facetArray)
                facetArray = [];

            facetArray.push(menuItem.nodeLabel);
            if(menuItem.children) {
                for(var i = 0; i < menuItem.children.length; i++) {
                    populateFacetArray(menuItem.children[i],facetArray);
                }
            }
        };

        var getAllFacetsForMenuItem = function(menuItem) {
            var facetArray = [];
            populateFacetArray(menuItem, facetArray);
            return facetArray;
        };

        var getResultImageRows = function(results) {
            if (!results) {
                return [];
            }
            var rows = [], columns = [], imageCounter = 0;
            for (var i = 0; i < results.length; i++) {
                if (results[i].docType === 'IMAGE') {
                    columns.push(results[i]);
                    imageCounter ++;
                    // this row is complete so we start the next
                    if (imageCounter === 6) {
                        rows.push(columns);
                        imageCounter = 0;
                        columns = [];
                    }
                }
            }
            if (columns.length > 0) {
                rows.push(columns);
            }
            return rows;
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

        var getChildrenFacetsArray = function(facet, menuItems) {
            // find menuItem for this facet
            var menuItem = findMenuItemByLabel(facet, menuItems);
            if (menuItem) {
                return getAllChildrenFacetsArray(menuItem, []);
            }
            return [facet];
        };

        var getChildrenFacets = function(facetsArray) {
            var facets = "";
            for (var i=0; i < facetsArray.length; i++) {
                if (i > 0) {
                    facets = facets + ' OR ';
                }
                facets = facets + 'label:"' + facetsArray[i] + '"';
            }
            return facets;
        };

        var getMenu = function () {
            var deferred = $q.defer();
            $http.get(menuUrl)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (response) {
                    $log.error('Error calling Menu API, Code: ' + response.status);
                    deferred.reject(response.status);
                });
            return deferred.promise;
        };

        var consolidateStats = function(results) {
            var allFacetStats = {};
            for(var i = 0; i < results.length; i++) {
                var result = results[i];
                var facetStats = result.facets.facet_fields.label_s;
                for(var j = 0; j < facetStats.length; j=j+2) {
                    allFacetStats[facetStats[j]] = allFacetStats[facetStats[j]] ? allFacetStats[facetStats[j]] + facetStats[j + 1] : facetStats[j + 1];
                }

            }
            return allFacetStats;
        };

        return {
            search: search,
            getMenu: getMenu,
            getNextPage: getNextPage,
            getFacetStats: getFacetStats,
            findMenuItemByLabel: findMenuItemByLabel,
            resetMenuCounters: resetMenuCounters,
            setMenuCounters: setMenuCounters,
            setMenuTotalCounters: setMenuTotalCounters,
            getAllFacetsForMenuItem: getAllFacetsForMenuItem,
            getResultImageRows: getResultImageRows,
            consolidateStats: consolidateStats
        };

    }]);

})();