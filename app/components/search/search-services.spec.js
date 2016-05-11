/* global describe, beforeEach, it */

describe('hydroid search services tests', function () {
    var $compile,
        $rootScope,
        SearchServices;

    var mod = angular.module('config', []);

    mod.constant('hydroidConfig',  {
        s3BundlesUrl: '/api/download/bundle/',
        solrUrl: '/solr',
        solrCollection:'hydroid',
        menuUrl: '/data/menu.json'
    });

    angular.module('mockApp', ['ngMock', 'search-services', 'config']);

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
        var dummyResults= [{
            facets: { facet_fields: { label_s:[
            'Marine',
            5,
            'Coral',
            12,
            'Marine',
            2
        ]}}}];
        var facetStats = SearchServices.consolidateStats(dummyResults);
        console.log(facetStats);
        expect(facetStats).not.toBe(null);
        expect(facetStats['Marine']).toBe(7);
        expect(facetStats['Coral']).toBe(12);
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
        var dummyResults= [{
            facets: { facet_fields: { label_s:[
                'sponges',
                5,
                'Coral',
                12,
                'Marine',
                2
            ]}}}];
        var facetStatsKeyVal = SearchServices.consolidateStats(dummyResults);
        var facetStats = SearchServices.getFacetStats(facetStatsKeyVal);
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

    it('should transform the image documents to a matrix of 1 row and 6 cols', function () {
        var dummyDocs = readJSON('app/data/solr-results-docs.json');
        var rows = SearchServices.getResultImageRows(dummyDocs);
        expect(rows).not.toBe(null);
        expect(rows.length).toBe(1);
        expect(rows[0].length).toBe(6);
    });
});