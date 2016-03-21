/* global describe, beforeEach, it */

describe('hydroid search results tests', function () {
    var $compile,
        $rootScope,
        modalService,
        $timeout,
        $httpBackend,
        SearchServices;

    angular.module('mockSearchResultsApp', ['ngMock', 'search-results']);

    beforeEach(module('components/search/search-results.html'));
    // Load the myApp module, which contains the service
    beforeEach(module('mockSearchResultsApp'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function($injector,_$compile_, _$rootScope_,_$timeout_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.when('GET','/solr/hydroid/select?q=docType:DOCUMENT AND "*coral*"&rows=5&start=0&facet=true&facet.field=label_s&facet.mincount=1&wt=json')
            .respond(angular.toJson({response: {docs:[{}]}}));
    }));

    it('should be able to collect facet stats', function () {
        $rootScope.query = 'fish';
        $rootScope.facet = '';
        var menuData = readJSON('app/data/menu.json');
        $rootScope.menuItems = menuData;
        $rootScope.cartItems = [];
        var element = $compile('<hydroid-search-results solr-url="/solr" solr-collection="hydroid" query="query" facet="facet"' +
        'doc-type="DOCUMENT" section-title="Reports and articles" menu-items="menuItems" cart-items="cartItems"' +
        'on-results="onResultsFunction(results)"></hydroid-search-results>')($rootScope);
        $rootScope.$digest();
        var directiveScope = element.isolateScope();
        expect(directiveScope).not.toBe(null);
        $rootScope.query = 'coral';
        directiveScope.$digest();
        $httpBackend.flush();
        $timeout.flush();
        expect(directiveScope.documents.length).toBe(1);
    });

});