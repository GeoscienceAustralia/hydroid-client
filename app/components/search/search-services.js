/* global angular */
(function () {
    "use strict";

    var module = angular.module('search-services', []);

    module.service('SearchServices', [function() {

        var getFacetStats = function(facets) {
            var facetStats = [];
            for (var i=0; i < facets.facet_fields.label_s.length; i=i+2) {
                facetStats.push({ facet: facets.facet_fields.label_s[i], count: facets.facet_fields.label_s[i+1]});
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

        var setMenuCounters = function(facetStats, menuItems) {
            for (var i=0; i < facetStats.length; i++) {
                var menuItem = findMenuItemByLabel(facetStats[i].facet, menuItems);
                if (menuItem) {
                    menuItem.count = facetStats[i].count;
                    if (menuItem.children) {
                        setMenuCounters(facetStats, menuItem.children);
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
            findMenuItemByLabel: findMenuItemByLabel,
            resetMenuCounters: resetMenuCounters,
            setMenuCounters: setMenuCounters,
            setMenuTotalCounters: setMenuTotalCounters
        };

    }]);

})();