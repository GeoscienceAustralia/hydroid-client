/* global describe, beforeEach, it */

describe('Hydroid home components tests', function () {
    var $compile,
        $httpBackend,
        $rootScope;

    angular.module('mockHomeApp', [
        'ngMock',
        'home'
    ]);

    // load the templates
    beforeEach(module('components/home/home.html'));

    // Load the myApp module, which contains the directive
    beforeEach(module('mockHomeApp'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function(_$compile_, _$rootScope_,_$httpBackend_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
    }));

    it('Should have isolated scope', function () {
        var element = $compile('<hydroid-home></hydroid-home>')($rootScope);
        $rootScope.$digest();
        var directiveScope = element.isolateScope();
        expect(directiveScope).not.toBe(null);
    })
});