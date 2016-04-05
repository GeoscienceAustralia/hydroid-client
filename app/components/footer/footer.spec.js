describe('Hydroid footer component tests', function () {
    var $compile,
        $httpBackend,
        $timeout,
        $rootScope;

    angular.module('mockFooterApp', ['ngMock','footer']);

    // Load the templates
    beforeEach(module('components/footer/footer.html'));

    // Load the myApp module, which contains the directive
    beforeEach(module('mockFooterApp'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function (_$compile_, _$httpBackend_, _$timeout_, _$rootScope_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        $rootScope = _$rootScope_;
    }));

    it('Should have isolated scope', function () {
        var element = $compile('<application-footer></application-footer>')($rootScope);
        $rootScope.$digest();
        var directiveScope = element.isolateScope();
        expect(directiveScope).not.toBe(null);
    });
});