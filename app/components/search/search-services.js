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

        var updateCounters = function(facetStats, menuItems) {
            for (var i=0; i < facetStats.length; i++) {
                for (var j=0; j < menuItems.length; j++) {
                    if (menuItems[j].nodeLabel === facetStats[i].facet) {
                        menuItems[j].count = facetStats[i].count;
                    }
                    if (menuItems[j].children) {
                        updateCounters(facetStats, menuItems[j].children);
                    }
                }
            }
        };

        return {
            getFacetStats: getFacetStats,
            updateCounters: updateCounters
        };

    }]);

})();