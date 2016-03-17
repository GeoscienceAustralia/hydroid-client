/* global describe, beforeEach, it */

describe('hydroid modal service tests', function () {
    var $compile,
        $rootScope,
        $timeout,
        $httpBackend,
        modalService;

    angular.module('modalMockApp', ['ngMock','hydroid.modal']);

    // Load the myApp module, which contains the service
    beforeEach(module('modalMockApp'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function($injector,_$compile_, _$rootScope_,_hydroidModalService_,_$timeout_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        modalService = _hydroidModalService_;
        $timeout = _$timeout_;
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.when('GET','components/modal/modal.html')
            .respond('<div id="headerTextTest" ng-bind="modalOptions.headerText">');
    }));

    it('should have confirm and show functions', function () {
        expect(modalService).not.toBe(null);
        expect(modalService.show).not.toBe(null);
        expect(modalService.confirm).not.toBe(null);
        expect(typeof modalService.confirm).toBe('function');
        expect(typeof modalService.show).toBe('function');
    });

    it('should bind header text for confirm modal', function () {
        modalService.confirm('header text test', 'body text test');
        $timeout.flush();
        $httpBackend.flush();
        $timeout.flush();
        expect($('#headerTextTest')[0].innerHTML).toBe('header text test');
    });

    it('should bind header text for show modal', function () {
        modalService.show('header text test1', 'body text test');
        $timeout.flush();
        $httpBackend.flush();
        $timeout.flush();
        expect($('#headerTextTest')[0].innerHTML).toBe('header text test1');
    });
});