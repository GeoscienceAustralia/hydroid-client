/* global describe, beforeEach, it */

describe('hydroid search services tests', function () {
    var $compile,
        $rootScope;

    angular.module('mockApp', ['ngMock', 'search-services']);

    // Load the myApp module, which contains the service
    beforeEach(module('mockApp'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function(_$compile_, _$rootScope_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('service should not be available', function () {
        var theService = null;
        expect(theService).toBe(null);
    })

});