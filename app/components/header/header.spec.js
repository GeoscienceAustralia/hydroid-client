/* global describe, beforeEach, it */

describe('Hydroid header components tests', function () {
    var $compile,
        $httpBackend,
        $timeout,
        $rootScope;

    angular.module('mockHeaderApp', [
        'ngMock',
        'header'
    ]);

    // load the templates
    beforeEach(
        module(
            'components/header/header.html'
        ));

    // Load the myApp module, which contains the directive
    beforeEach(module('mockHeaderApp'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function(_$compile_, _$httpBackend_, _$timeout_, _$rootScope_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        $rootScope = _$rootScope_;
    }));

    it('Should have isolated scope', function () {
        var element = $compile('<application-header></application-header>')($rootScope);
        $rootScope.$digest();
        var directiveScope = element.isolateScope();
        expect(directiveScope).not.toBe(null);
    });

    it('Should have Hydroid as header title.', function () {
        var element = $compile('<application-header app-logo="img/geoscience_inline_padded_small.png" app-title="Hydroid"></application-header>')($rootScope);
        $rootScope.$digest();
        $timeout.flush();
        expect(element.find('.applicationTitle')[0].innerHTML.trim()).toBe('<h1 class="ng-binding">Hydroid</h1>');
    });
});