/* global describe, beforeEach, it */

describe('hydroid search results tests', function () {
    var $compile,
        $rootScope,
        modalService,
        $timeout,
        $httpBackend,
        SearchServices,
        $filter;

    angular.module('mockSearchResultsApp', ['ngMock', 'search-results']);

    beforeEach(module('components/search/search-results.html'));
    // Load the myApp module, which contains the service
    beforeEach(module('mockSearchResultsApp'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function($injector,_$compile_, _$rootScope_,_$timeout_, _$filter_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.when('GET','/solr/hydroid/select?q=docType:DOCUMENT AND "*coral*"&rows=5&start=0&facet=true&facet.field=label_s&facet.mincount=1&wt=json&hl=true&hl.simple.pre=<b>&hl.simple.post=</b>&hl.snippets=5&hl.fl=content&fl=extracted-from,concept,docUrl,about,imgThumb,docType,label,title,selectionContext,created,creator')
            .respond(angular.toJson({response: {docs:[{}]}}));
        $filter = _$filter_;
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

    it('should be able to wrap the keyword in bold tag <b>', function() {
        expect($filter('hydroidQueryResultsFilter')('shark is the keyword I am looking for', 'shark')).toContain('<b>shark</b>');
    });

    it('should be able to wrap the only the first facet in bold tag <b>', function() {
        var facets = ['seahorse', 'whale']
        expect($filter('hydroidFacetsResultsFilter')('this is a text about a seahorse and a whale', facets)).toContain('<b>seahorse</b>');
        expect($filter('hydroidFacetsResultsFilter')('this is a text about a seahorse and a whale', facets)).toContain('<b>whale</b>');
    });

    it('should truncate text looking for start of sentences.', function () {
        var sentence = ['blah. For example, the importance of deep-water coral habitat on seamounts stems from our knowledge that there are perhaps around 10,000 seamounts on Earth'];
        expect($filter('hydroidTruncateTextPreview')(sentence, 'coral',['corals']).indexOf('For example')).toBe(0);
    });

    it('should truncate text using facet array', function () {
        var sentence = ['blah. For example, the importance of deep-water coral habitat on seamounts stems from our knowledge that there are perhaps around 10,000 seamounts on Earth'];
        expect($filter('hydroidTruncateTextPreview')(sentence, '',['coral']).indexOf('For example')).toBe(0);
    });

    it('should create preview text using highlights', function () {
        var selectionContext = '';
        var about = "urn:content-item-sha1:209db084ead9ea5e7fa3ea6c19572b6da1e10e44";
        var highlights = [{
            "urn:content-item-sha1:this-is-not-a-valid-urn": {
                content: ["a sample text found in a random <b>project</b>"]
            },
            "urn:content-item-sha1:209db084ead9ea5e7fa3ea6c19572b6da1e10e44": {
                content: ["suggestions during the early phases of this <b>project</b>. Tara Anderson, Scott Nichol, Nic Bax, and two anonymous"]
            }
        }];
        var expectedValue = "suggestions during the early phases of this <b>project</b>. Tara Anderson, Scott Nichol, Nic Bax, and two anonymous...";
        expect($filter('hydroidRelateHighlights')(selectionContext, about, highlights)).toBe(expectedValue);
    });

});