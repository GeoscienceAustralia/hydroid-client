(function () {
    "use strict";

    var module = angular.module('modal', ['ui.bootstrap']);

    module.service('modalService', ['$uibModal', '$sce', function($uibModal, $sce) {

        var modalDefaults = {
            animation: false,
            templateUrl: 'components/modal/modal.html',
            size: 'lg'
        };

        var modalOptionsDefault = {
            closeButtonText: 'Cancel',
            actionButtonText: 'OK',
            bodyText: $sce.trustAsHtml('Are you sure ?'),
            imageSrc: null
        };

        this.confirm = function(headerText, bodyText) {

            modalDefaults.controller = function($scope, $uibModalInstance) {
                $scope.modalOptions = {};
                angular.extend($scope.modalOptions, modalOptionsDefault);

                if (headerText != null) {
                    $scope.modalOptions.headerText = headerText;
                }

                if (bodyText != null) {
                    $scope.modalOptions.bodyText = $sce.trustAsHtml(bodyText);
                }

                $scope.modalOptions.ok = function() {
                    $uibModalInstance.close('ok');
                };

                $scope.modalOptions.close = function() {
                    $uibModalInstance.dismiss('cancel');
                };
            }

            return $uibModal.open(modalDefaults).result;
        };

        this.show = function(headerText, bodyText, imageSrc) {

            modalDefaults.controller = function($scope, $uibModalInstance) {
                $scope.modalOptions = {};
                angular.extend($scope.modalOptions, modalOptionsDefault);

                // Do not display footer and buttons
                $scope.modalOptions.actionButtonText = null;
                $scope.modalOptions.closeButtonText = null;

                if (headerText != null) {
                    $scope.modalOptions.headerText = headerText;
                }

                if (bodyText != null) {
                    $scope.modalOptions.bodyText = $sce.trustAsHtml(bodyText);
                }

                if (imageSrc != null) {
                    $scope.modalOptions.imageSrc = imageSrc;
                }

                $scope.modalOptions.close = function() {
                    $uibModalInstance.dismiss('cancel');
                };
            }

            $uibModal.open(modalDefaults);
        };

    }]);

})();