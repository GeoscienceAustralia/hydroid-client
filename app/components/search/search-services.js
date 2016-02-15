/* global angular */
(function () {
    "use strict";

    var module = angular.module('search-services', []);

    module.service('SearchServices', [function() {

        var getFacetStats = function(facets) {
            var facetStats = [];
            for (var i=0; i < facets.facet_fields.label.length; i=i+2) {
                facetStats.push({ facet: facets.facet_fields.label[i], count: facets.facet_fields.label[i+1]});
            }
            return facetStats;
        };

        var resetMenuCounters = function(menuItems) {
            for (var i=0; i < menuItems.length; i++) {
                menuItems[i].count = 0;
                if (menuItems[i].children) {
                    resetMenuCounters(menuItems[i].children);
                }
            }
        };

        var setMenuCounters = function(facetStats, menuItems) {
            for (var i=0; i < facetStats.length; i++) {
                for (var j=0; j < menuItems.length; j++) {
                    if (menuItems[j].nodeLabel === facetStats[i].facet) {
                        menuItems[j].count = facetStats[i].count;
                    }
                    if (menuItems[j].children) {
                        setMenuCounters(facetStats, menuItems[j].children);
                    }
                }
            }
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

        return {
            getFacetStats: getFacetStats,
            resetMenuCounters: resetMenuCounters,
            setMenuCounters: setMenuCounters,
            setMenuTotalCounters: setMenuTotalCounters
        };

    }]);

})();