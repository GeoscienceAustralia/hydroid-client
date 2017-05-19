/* global describe, beforeEach, it */

describe('hydroid search results tests', function () {
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

    angular.module('mockSearchResultsApp', ['ngMock', 'search-results','config']);

    beforeEach(module('components/search/search-results.html'));
    // Load the myApp module, which contains the service
    beforeEach(module('mockSearchResultsApp'));

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
        $httpBackend.when('GET','/solr/hydroid/select?q=docType:DOCUMENT AND (label:"testing123")&rows=5&start=5&facet=true&facet.field=label_s&facet.mincount=1&wt=json&hl=true&hl.simple.pre=<b>&hl.simple.post=</b>&hl.snippets=5&hl.fl=content&fl=extracted-from,concept,docUrl,about,imgThumb,docType,docOrigin,label,title,selectionContext,created,creator,content')
            .respond(JSON.stringify({ "responseHeader":{"status":0,"QTime":1,"params":{"facet":"true","facet.mincount":"1","json":"","start":"0","q":"docType:IMAGE AND \"*thiswontbthe*\"","facet.field":"label_s","wt":"json","rows":"6"}},"response":{"numFound":0,"start":0,"docs":[{},{}]},"facet_counts":{"facet_queries":{},"facet_fields":{"label_s":[]},"facet_dates":{},"facet_ranges":{},"facet_intervals":{},"facet_heatmaps":{}} }));
        var menuData = readJSON('app/data/menu.json');
        $httpBackend.when('GET','/data/menu.json')
            .respond(JSON.stringify(menuData));
        $rootScope.menuItems = menuData;
    }));

    it('should be able to collect facet stats', function () {
        $location.search('query','fish');
        $rootScope.cartItems = [];
        $rootScope.documents = [{},{}];
        $rootScope.documentNumFound = 2;
        var element = $compile('<hydroid-search-results solr-url="/solr" solr-collection="hydroid" query="query" facet="facet"' +
        'documents="documents"' +
        'num-found="documentNumFound"' +
        'doc-type="DOCUMENT" section-title="Reports and articles" menu-items="menuItems" cart-items="cartItems"></hydroid-search-results>')($rootScope);
        $rootScope.$digest();
        var directiveScope = element.isolateScope();
        expect(directiveScope).not.toBe(null);
        directiveScope.$digest();
        expect(directiveScope.documents.length).toBe(2);
        $rootScope.documents = [];
        $rootScope.$digest();
        expect(directiveScope.documents.length).toBe(0);
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

    it('Should process "nextPage" call correctly', function () {
        $rootScope.cartItems = [];
        $rootScope.documents = [{},{}];
        $rootScope.documentNumFound = 2;
        var element = $compile('<hydroid-search-results solr-url="/solr" solr-collection="hydroid" query="query" facet="facet"' +
            'documents="documents"' +
            'num-found="documentNumFound"' +
            'doc-type="DOCUMENT" section-title="Reports and articles" menu-items="menuItems" cart-items="cartItems"></hydroid-search-results>')($rootScope);
        $rootScope.$digest();
        var directiveScope = element.isolateScope();
        expect(directiveScope).not.toBe(null);
        directiveScope.$digest();
        expect(directiveScope.documents.length).toBe(2);
        directiveScope.facet = 'testing123';
        directiveScope.nextPage();
        $httpBackend.flush();
        $timeout.flush();
    })

  // commented these tests as it fails in PhantomJS but passes in Chrome. Further investigation required
  /* it('Should process "isUrl" documents correctly', function () {
        $rootScope.cartItems = [];
        $rootScope.documents = [{"extracted-from":"urn:content-item-sha1:35097fd0a22dab4f658b87b4948085aebd","creator":"","created":"1970-01-18T05:54:20.464Z","docUrl":"//hydroid-output.s3-website-ap-southeast-2.amazonaws.com/rdfs/urn:content-item-sha1:35097fde06cba0a22dab4f658b87b4948085aebd","concept":["https://editor.vocabs.ands.org.au/GAPublicVocabsSandbox/243"],"about":"urn:content-item-sha1:35097fde06cba0a22dab948085aebd","docType":"DOCUMENT","title":"Sentinel-1 SAR","label":["forests"],"docOrigin":"http://52.64.197.68/hydroid_export/123","selectionContext":["ces: forest, wa"]},
                                {"extracted-from":"urn:content-item-sha1:3bd03df7a81f1cf244d2fbcce3db8","creator":"","created":"1970-01-18T05:54:20.464Z","docUrl":"//hydroid-output.s3-website-ap-southeast-2.amazonaws.com/rdfs/urn:content-item-sha1:511d2d473df7a81f1cf244d2fbcce3db8","concept":["https://editor.vocabs.ands.org.au/GAPublicVocabsSandbox/243"],"about":"urn:content-item-sha1:3bd01e0511d2dcf244d2fbcce3db8","docType":"DOCUMENT","title":"Sentinel-2 MSI","label":["forests"],"docOrigin":"hydroid:enhancer/input/documents/20160524/14 Research and Monitoring/Projects_Govt funded in NWSW","selectionContext":[" and forest mon"]},
                                {"extracted-from":"urn:content-item-sha1:3bd03df7a81f1cf244d2fbcce3db8","creator":"","created":"1970-01-18T05:54:20.464Z","docUrl":"//hydroid-output.s3-website-ap-southeast-2.amazonaws.com/rdfs/urn:content-item-sha1:511d2d473df7a81f1cf244d2fbcce3db8","concept":["https://editor.vocabs.ands.org.au/GAPublicVocabsSandbox/243"],"about":"urn:content-item-sha1:3bd01e0511d2dcf244d2fbcce3db8","docType":"DOCUMENT","title":"Sentinel-2 MSI","label":["forests"],"docOrigin":"http://google.com.au","selectionContext":[" and forest mon"]}];
        $rootScope.documentNumFound = 3;
        var element = $compile('<hydroid-search-results solr-url="/solr" solr-collection="hydroid" query="query" facet="facet"' +
            'documents="documents"' +
            'num-found="documentNumFound"' +
            'doc-type="DOCUMENT" section-title="Reports and articles" menu-items="menuItems" cart-items="cartItems"></hydroid-search-results>')($rootScope);

        $rootScope.$digest();
        var directiveScope = element.isolateScope();
        expect(directiveScope).not.toBe(null);
        directiveScope.$digest();
        expect(directiveScope.documents.length).toBe(3);
        expect(directiveScope.isUrl(directiveScope.documents[0].docOrigin)).toBe(true);
        expect(directiveScope.isCmiUrl(directiveScope.documents[0].docOrigin)).toBe(true);
        expect(directiveScope.getCmiUrl(directiveScope.documents[0].docOrigin)).toBe('http://52.64.197.68/node/123');
        expect(directiveScope.isUrl(directiveScope.documents[1].docOrigin)).not.toBe(true);
        expect(directiveScope.isUrl(directiveScope.documents[2].docOrigin)).toBe(true);
        expect(directiveScope.isCmiUrl(directiveScope.documents[2].docOrigin)).not.toBe(true);
    })

    it('Should process "isItemInCart" call correctly', function () {
        $rootScope.cartItems = [{"extracted-from":"urn:content-item-sha1:35097fd0a22dab4f658b87b4948085aebd","creator":"","created":"1970-01-18T05:54:20.464Z","docUrl":"//hydroid-output.s3-website-ap-southeast-2.amazonaws.com/rdfs/urn:content-item-sha1:35097fde06cba0a22dab4f658b87b4948085aebd","concept":["https://editor.vocabs.ands.org.au/GAPublicVocabsSandbox/243"],"about":"urn:content-item-sha1:35097fde06cba0a22dab948085aebd","docType":"DOCUMENT","title":"Sentinel-1 SAR","label":["forests"],"docOrigin":"http://52.64.197.68/hydroid_export/123","selectionContext":["ces: forest, wa"]}];
        $rootScope.documents = [{"extracted-from":"urn:content-item-sha1:35097fd0a22dab4f658b87b4948085aebd","creator":"","created":"1970-01-18T05:54:20.464Z","docUrl":"//hydroid-output.s3-website-ap-southeast-2.amazonaws.com/rdfs/urn:content-item-sha1:35097fde06cba0a22dab4f658b87b4948085aebd","concept":["https://editor.vocabs.ands.org.au/GAPublicVocabsSandbox/243"],"about":"urn:content-item-sha1:35097fde06cba0a22dab948085aebd","docType":"DOCUMENT","title":"Sentinel-1 SAR","label":["forests"],"docOrigin":"http://52.64.197.68/hydroid_export/123","selectionContext":["ces: forest, wa"]},
                                {"extracted-from":"urn:content-item-sha1:3bd03df7a81f1cf244d2fbcce3db8","creator":"","created":"1970-01-18T05:54:20.464Z","docUrl":"//hydroid-output.s3-website-ap-southeast-2.amazonaws.com/rdfs/urn:content-item-sha1:511d2d473df7a81f1cf244d2fbcce3db8","concept":["https://editor.vocabs.ands.org.au/GAPublicVocabsSandbox/243"],"about":"urn:content-item-sha1:3bd01e0511d2dcf244d2fbcce3db8","docType":"DOCUMENT","title":"Sentinel-2 MSI","label":["forests"],"docOrigin":"hydroid:enhancer/input/documents/20160524/14 Research and Monitoring/Projects_Govt funded in NWSW","selectionContext":[" and forest mon"]}];
        $rootScope.documentNumFound = 1;
        var element = $compile('<hydroid-search-results solr-url="/solr" solr-collection="hydroid" query="query" facet="facet"' +
            'documents="documents"' +
            'num-found="documentNumFound"' +
            'doc-type="DOCUMENT" section-title="Reports and articles" menu-items="menuItems" cart-items="cartItems"></hydroid-search-results>')($rootScope);
        $rootScope.$digest();
        var directiveScope = element.isolateScope();
        expect(directiveScope).not.toBe(null);
        directiveScope.$digest();
        expect(directiveScope.documents.length).toBe(2);
        expect(directiveScope.isItemInCart(directiveScope.documents[0].about)).toBe(true);
        expect(directiveScope.isItemInCart(directiveScope.documents[1].about)).toBe(false);
    }) */
});