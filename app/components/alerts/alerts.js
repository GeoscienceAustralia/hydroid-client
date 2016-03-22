(function () {
    "use strict";

    var module = angular.module('hydroid-alerts', []);

    module.service('hydroidAlertsService', function() {

        var alerts = [];

        var service = {};

        service.showInfo = function(message) {
            console.log('INFO: ', message);
            alerts.push({msg: message, type: 'success'});

        };

        service.showError = function(message) {
            console.log('ERROR: ', message);
            alerts.push({msg: message, type: 'danger'});
        };

        service.debug = function(message) {
            console.log('DEBUG: ', message);
        };

        service.getAlerts = function() {
            return alerts;
        };

        service.clear = function() {
            alerts = [];
        };

        service.delete = function(index) {
            alerts.splice(index, 1);
            return alerts;
        };

        return service;

    });

    module.directive('hydroidAlerts', ['hydroidAlertsService', function(hydroidAlertsService) {
        return {
            restrict: 'E',
            scope: {},
            templateUrl: 'components/alerts/alerts.html',
            controller: ['$scope', function($scope) {

                $scope.alerts = hydroidAlertsService.getAlerts();

                $scope.close = function(index) {
                    $scope.alerts = hydroidAlertsService.delete(index);
                };
            }]
        };
    }]);

})();