(function () {
    "use strict";

    var module = angular.module('modal', ['ui.bootstrap']);

    module.service('modalService', ['$uibModal', function($uibModal) {

        var modalDefaults = {
            animation: false,
            templateUrl: 'components/modal/modal.html',
            size: 'lg'
        };

        var modalOptions = {
            closeButtonText: 'Cancel',
            actionButtonText: 'OK',
            bodyText: 'Are you sure ?'
        };

        this.confirm = function (headerText, bodyText) {

            if (headerText != null) {
                modalOptions.headerText = headerText;
            }

            if (bodyText != null) {
                modalOptions.bodyText = bodyText;
            }

            modalDefaults.controller = function ($scope, $uibModalInstance ) {
                $scope.modalOptions = modalOptions;
                $scope.modalOptions.ok = function (result) {
                    $uibModalInstance.close(result);
                };
                $scope.modalOptions.close = function (result) {
                    $uibModalInstance.dismiss('cancel');
                };
            }

            return $uibModal.open(modalDefaults).result;
        };

        this.show = function (headerText, bodyText, imageSrc) {

            modalOptions.actionButtonText = null;
            modalOptions.headerText = headerText;
            modalOptions.bodyText = bodyText;
            modalOptions.imageSrc = imageSrc;

            modalDefaults.controller = function ($scope, $uibModalInstance ) {
                $scope.modalOptions = modalOptions;
                $scope.modalOptions.close = function (result) {
                    $uibModalInstance.dismiss('cancel');
                };
            }

            $uibModal.open(modalDefaults);
        };

    }]);

})();