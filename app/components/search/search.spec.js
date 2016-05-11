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

    angular.module('mockSearchApp', ['ngMock', 'search','config']);

    beforeEach(module('components/search/search.html'));
    // Load the myApp module, which contains the service
    beforeEach(module('mockSearchApp'));

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
        $httpBackend.when('GET','/data/menu.json')
            .respond(JSON.stringify({}));
    }));

    it('Should be able to render search', function () {
        var menuData = readJSON('app/data/menu.json');
        $rootScope.menuItems = menuData;
        $rootScope.hasSearchResults = true;
        var element = $compile('<hydroid-search></hydroid-search>')($rootScope);
        $rootScope.$digest();
        var directiveScope = element.isolateScope();
        expect(directiveScope).not.toBe(null);
        directiveScope.$digest();
    });

    it('Should be able to flatten menu data for typeahead', function () {
        var menuData = readJSON('app/data/menu.json');
        $rootScope.menuItems = menuData;
        $rootScope.hasSearchResults = true;
        var element = $compile('<hydroid-search menu-items="menuItems"></hydroid-search>')($rootScope);
        $rootScope.$digest();
        var directiveScope = element.isolateScope();
        expect(directiveScope).not.toBe(null);
        directiveScope.$digest();
        expect(directiveScope.allLabels.length).toBeGreaterThan(0);
    });

});