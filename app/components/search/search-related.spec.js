/* global describe, beforeEach, it */

describe('hydroid search related tests', function () {
    var $compile,
        $rootScope,
        $timeout,
        $filter,
        $location,
        $httpBackend;

    var mod = angular.module('config', []);

    mod.constant('hydroidConfig',  {
        s3BundlesUrl: '/api/download/bundle/',
        solrUrl: '/solr',
        solrCollection:'hydroid',
        menuUrl: '/data/menu.json'
    });

    angular.module('mockSearchRelatedApp', ['ngMock', 'search-related','config']);

    beforeEach(module('components/search/search-related.html','components/search/search-related-item.html'));
    // Load the myApp module, which contains the service
    beforeEach(module('mockSearchRelatedApp'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function($injector,_$compile_, _$rootScope_,_$timeout_, _$filter_,_$location_,_$httpBackend_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
        $filter = _$filter_;
        $location = _$location_;
        $httpBackend = _$httpBackend_;
        $httpBackend.when('GET','/solr/hydroid/select?q=docType:DOCUMENT AND (label:"testing123")&rows=5&start=5&facet=true&facet.field=label_s&facet.mincount=1&wt=json&hl=true&hl.simple.pre=<b>&hl.simple.post=</b>&hl.snippets=5&hl.fl=content&fl=extracted-from,concept,docUrl,about,imgThumb,docType,docOrigin,label,title,selectionContext,created,creator')
            .respond(JSON.stringify({ "responseHeader":{"status":0,"QTime":1,"params":{"facet":"true","facet.mincount":"1","json":"","start":"0","q":"docType:IMAGE AND \"*thiswontbthe*\"","facet.field":"label_s","wt":"json","rows":"6"}},"response":{"numFound":0,"start":0,"docs":[{},{}]},"facet_counts":{"facet_queries":{},"facet_fields":{"label_s":[]},"facet_dates":{},"facet_ranges":{},"facet_intervals":{},"facet_heatmaps":{}} }));
        var menuData = readJSON('app/data/menu.json');
        $rootScope.menuItems = menuData;
        $httpBackend.when('GET','/data/menu.json')
            .respond(JSON.stringify(menuData));
    }));

    it('Should be able to render menu when hasResults is true', function () {
        $rootScope.hasSearchResults = true;
        var element = $compile('<hydroid-search-related menu-items="menuItems" has-results="hasSearchResults"' +
        '></hydroid-search-related>')($rootScope);
        $rootScope.$digest();
        var directiveScope = element.isolateScope();
        expect(directiveScope).not.toBe(null);
        directiveScope.$digest();
        expect(directiveScope.hasResults).toBe(true);
    });

    it('Should be able to render menu when hasResults is false', function () {
        $rootScope.hasSearchResults = false;
        var element = $compile('<hydroid-search-related menu-items="menuItems" has-results="hasSearchResults"' +
            '></hydroid-search-related>')($rootScope);
        $rootScope.$digest();
        var directiveScope = element.isolateScope();
        expect(directiveScope).not.toBe(null);
        directiveScope.$digest();
        expect(directiveScope.hasResults).toBe(false);
    });

});