/* global describe, beforeEach, it */

describe('Hydroid alerts components tests', function () {
    var $compile,
        $httpBackend,
        $timeout,
        $rootScope,
        hydroidAlertsService;

    angular.module('mockAlertsApp', [
        'ngMock',
        'hydroid-alerts'
    ]);

    // load the templates
    beforeEach(
        module(
            'components/alerts/alerts.html'
        ));

    // Load the myApp module, which contains the directive
    beforeEach(module('mockAlertsApp'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function(_$compile_, _$httpBackend_, _$timeout_, _$rootScope_, _hydroidAlertsService_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        $rootScope = _$rootScope_;
        hydroidAlertsService = _hydroidAlertsService_;
    }));

    it('Should have isolated scope', function () {
        var element = $compile('<hydroid-alerts></hydroid-alerts>')($rootScope);
        $rootScope.$digest();
        var directiveScope = element.isolateScope();
        expect(directiveScope).not.toBe(null);
    });

    it('should bind header text for confirm modal', function () {
        hydroidAlertsService.showError('Error Occurred');
        var element = $compile('<hydroid-alerts></hydroid-alerts>')($rootScope);
        $rootScope.$digest();
        $timeout.flush();
        expect(element.find('.alert-danger')[0].innerHTML).toContain('Error Occurred');
    });

});