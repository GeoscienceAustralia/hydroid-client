/* global describe, beforeEach, it */

describe('Hydroid home components tests', function () {
    var $compile,
        $httpBackend,
        $timeout,
        $rootScope,
        $location;

    angular.module('mockHomeApp', [
        'ngMock',
        'home',
        'search-results',
        'hydroid-alerts',
        'config'
    ]);

    // load the templates
    beforeEach(
        module(
            'components/home/home.html',
            'components/search/search-results.html',
            'components/search/search-results-images.html',
            'components/alerts/alerts.html'
        ));

    // Load the myApp module, which contains the directive
    beforeEach(module('mockHomeApp'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function(_$compile_, _$rootScope_,_$httpBackend_,_$timeout_,_$location_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
        $location = _$location_;
        $httpBackend.when('GET','/solr/hydroid/select?q=docType:DOCUMENT AND "*sharks*"&rows=5&start=0&facet=true&facet.field=label_s&facet.mincount=1&wt=json&hl=true&hl.simple.pre=<b>&hl.simple.post=</b>&hl.snippets=5&hl.fl=content&fl=extracted-from,concept,docUrl,about,imgThumb,docType,label,title,selectionContext,created,creator')
            .respond(JSON.stringify({ "responseHeader":{"status":0,"QTime":1,"params":{"facet":"true","facet.mincount":"1","json":"","start":"0","q":"docType:IMAGE AND \"*thiswontbthe*\"","facet.field":"label_s","wt":"json","rows":"6"}},"response":{"numFound":0,"start":0,"docs":[]},"facet_counts":{"facet_queries":{},"facet_fields":{"label_s":[]},"facet_dates":{},"facet_ranges":{},"facet_intervals":{},"facet_heatmaps":{}} }));
        $httpBackend.when('GET','/solr/hydroid/select?q=docType:DATASET AND "*sharks*"&rows=5&start=0&facet=true&facet.field=label_s&facet.mincount=1&wt=json&hl=true&hl.simple.pre=<b>&hl.simple.post=</b>&hl.snippets=5&hl.fl=content&fl=extracted-from,concept,docUrl,about,imgThumb,docType,label,title,selectionContext,created,creator')
            .respond(JSON.stringify({ "responseHeader":{"status":0,"QTime":1,"params":{"facet":"true","facet.mincount":"1","json":"","start":"0","q":"docType:IMAGE AND \"*thiswontbthe*\"","facet.field":"label_s","wt":"json","rows":"6"}},"response":{"numFound":0,"start":0,"docs":[]},"facet_counts":{"facet_queries":{},"facet_fields":{"label_s":[]},"facet_dates":{},"facet_ranges":{},"facet_intervals":{},"facet_heatmaps":{}} }));
        $httpBackend.when('GET','/solr/hydroid/select?q=docType:MODEL AND "*sharks*"&rows=5&start=0&facet=true&facet.field=label_s&facet.mincount=1&wt=json&hl=true&hl.simple.pre=<b>&hl.simple.post=</b>&hl.snippets=5&hl.fl=content&fl=extracted-from,concept,docUrl,about,imgThumb,docType,label,title,selectionContext,created,creator')
            .respond(JSON.stringify({ "responseHeader":{"status":0,"QTime":1,"params":{"facet":"true","facet.mincount":"1","json":"","start":"0","q":"docType:IMAGE AND \"*thiswontbthe*\"","facet.field":"label_s","wt":"json","rows":"6"}},"response":{"numFound":0,"start":0,"docs":[]},"facet_counts":{"facet_queries":{},"facet_fields":{"label_s":[]},"facet_dates":{},"facet_ranges":{},"facet_intervals":{},"facet_heatmaps":{}} }));
        $httpBackend.when('GET','/solr/hydroid/select?q=docType:IMAGE AND "*sharks*"&rows=6&start=0&facet=true&facet.field=label_s&facet.mincount=1&wt=json&hl=true&hl.simple.pre=<b>&hl.simple.post=</b>&hl.snippets=5&hl.fl=content&fl=extracted-from,concept,docUrl,about,imgThumb,docType,label,title,selectionContext,created,creator')
            .respond(JSON.stringify({ "responseHeader":{"status":0,"QTime":1,"params":{"facet":"true","facet.mincount":"1","json":"","start":"0","q":"docType:IMAGE AND \"*thiswontbthe*\"","facet.field":"label_s","wt":"json","rows":"6"}},"response":{"numFound":0,"start":0,"docs":[]},"facet_counts":{"facet_queries":{},"facet_fields":{"label_s":[]},"facet_dates":{},"facet_ranges":{},"facet_intervals":{},"facet_heatmaps":{}} }));
        $httpBackend.when('GET','/data/menu.json')
            .respond(JSON.stringify({}));
    }));

    it('Should have isolated scope', function () {
        $rootScope.cartItems = [];
        var element = $compile('<hydroid-home cart-items="cartItems"></hydroid-home>')($rootScope);
        $rootScope.$digest();
        var directiveScope = element.isolateScope();
        expect(directiveScope).not.toBe(null);
    });

    it('Should have `onSearch` function.', function () {
        $rootScope.cartItems = [];
        var element = $compile('<hydroid-home cart-items="cartItems"></hydroid-home>')($rootScope);
        $rootScope.$digest();
        var directiveScope = element.isolateScope();
        expect(directiveScope).not.toBe(null);
        $location.search('query','sharks');
        directiveScope.onSearch();
        directiveScope.$digest();
        $rootScope.$digest();
        $httpBackend.flush();
        directiveScope.$digest();
        $timeout.flush();
    });
});