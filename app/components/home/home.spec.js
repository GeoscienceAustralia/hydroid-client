/* global describe, beforeEach, it */

describe('Hydroid home components tests', function () {
    var $compile,
        $httpBackend,
        $timeout,
        $rootScope;

    angular.module('mockHomeApp', [
        'ngMock',
        'home',
        'search-results'
    ]);

    // load the templates
    beforeEach(
        module(
            'components/home/home.html',
            'components/search/search-results.html',
            'components/search/search-results-images.html'
        ));

    // Load the myApp module, which contains the directive
    beforeEach(module('mockHomeApp'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function(_$compile_, _$rootScope_,_$httpBackend_,_$timeout_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
        $httpBackend.when('GET','/solr/hydroid/select?q=docType:DOCUMENT AND "*sharks*"&rows=5&start=0&facet=true&facet.field=label_s&facet.mincount=1&wt=json')
            .respond(JSON.stringify({ response: { docs: [ {}]}}));
        $httpBackend.when('GET','/solr/hydroid/select?q=docType:DATASET AND "*sharks*"&rows=5&start=0&facet=true&facet.field=label_s&facet.mincount=1&wt=json')
            .respond(JSON.stringify({ response: { docs: [ {}]}}));
        $httpBackend.when('GET','/solr/hydroid/select?q=docType:MODEL AND "*sharks*"&rows=5&start=0&facet=true&facet.field=label_s&facet.mincount=1&wt=json')
            .respond(JSON.stringify({ response: { docs: [ {}]}}));
        $httpBackend.when('GET','/solr/hydroid/select?q=docType:IMAGE AND "*sharks*"&rows=6&start=0&facet=true&facet.field=label_s&facet.mincount=1&wt=json')
            .respond(JSON.stringify({ response: { docs: [ {}]}}));
    }));

    it('Should have isolated scope', function () {
        var element = $compile('<hydroid-home></hydroid-home>')($rootScope);
        $rootScope.$digest();
        var directiveScope = element.isolateScope();
        expect(directiveScope).not.toBe(null);
    });

    it('Should have `onQueryFunction` that takes a search query.', function () {
        var element = $compile('<hydroid-home></hydroid-home>')($rootScope);
        $rootScope.$digest();
        var directiveScope = element.isolateScope();
        expect(directiveScope).not.toBe(null);
        directiveScope.onQueryFunction('sharks');
        expect(directiveScope.query).toBe('sharks');
        directiveScope.$digest();
        $rootScope.$digest();
        $httpBackend.flush();
    });
});