describe('Hydroid anchor component tests', function () {
    var $compile,
        $httpBackend,
        $timeout,
        $rootScope,
        hydroidAnchorService;

    angular.module('mockAnchorApp', ['ngMock','anchor']);

    // Load the templates
    beforeEach(module('components/cart/anchor.html'));

    // Load the myApp module, which contains the directive
    beforeEach(module('mockAnchorApp'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function (_$compile_, _$httpBackend_, _$timeout_, _$rootScope_, _hydroidAnchorService_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        $rootScope = _$rootScope_;
        hydroidAnchorService = _hydroidAnchorService_;
    }));

    it('Should have isolated scope', function () {
        $rootScope.cartItems = [];
        var element = $compile('<cart-anchor cart-items="cartItems"></cart-anchor>')($rootScope);
        $rootScope.$digest();
        var directiveScope = element.isolateScope();
        expect(directiveScope).not.toBe(null);
    });
});