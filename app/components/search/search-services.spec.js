/* global describe, beforeEach, it */

describe('hydroid search services tests', function () {
    var $compile,
        $rootScope,
        SearchServices;

    angular.module('mockApp', ['ngMock', 'search-services']);

    // Load the myApp module, which contains the service
    beforeEach(module('mockApp'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function(_$compile_, _$rootScope_,_SearchServices_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        SearchServices = _SearchServices_;
    }));

    it('service should not be available', function () {
        var theService = null;
        expect(theService).toBe(null);
    });

    it('should be able to collect facet stats', function () {
        var dummyFacetResponse = {
            facet_fields: {
                label_s: [
                    'Marine',
                    5,
                    'Coral',
                    12
                ]
            }
        };
        var facetStats = SearchServices.getFacetStats(dummyFacetResponse);
        expect(facetStats).not.toBe(null);
        expect(facetStats[0].count).toBe(5);
        expect(facetStats[1].count).toBe(12);
    });

    it('should be able to find a menu item given a facet match', function () {
        var menuData = readJSON('app/data/menu.json');
        expect(menuData).not.toBe(null);
        expect(menuData.length).toBeGreaterThan(0);
        var menuItem = SearchServices.findMenuItemByLabel('sponges', menuData);
        expect(menuItem).not.toBe(null);
    });

    it('should get and set menu counts from facet stats and reset them', function () {
        var menuData = readJSON('app/data/menu.json');
        expect(menuData).not.toBe(null);
        expect(menuData.length).toBeGreaterThan(0);
        var dummyFacetResponse = {
            facet_fields: {
                label_s: [
                    'sponges',
                    5,
                    'macroalgae',
                    12
                ]
            }
        };
        var facetStats = SearchServices.getFacetStats(dummyFacetResponse);
        SearchServices.setMenuCounters(facetStats,menuData);
        var menuItem = SearchServices.findMenuItemByLabel('sponges',menuData);
        expect(menuItem).not.toBe(null);
        expect(menuItem.nodeLabel).toBe('sponges');
        expect(menuItem.count).toBe(5);
        SearchServices.setMenuTotalCounters(menuData);
        expect(menuData[4].count).toBeGreaterThan(0);
        SearchServices.resetMenuCounters(menuData);
        expect(menuItem.count).toBe(0);
        expect(menuData[4].count).toBe(0);
    });

});