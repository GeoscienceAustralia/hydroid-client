(function () {
    "use strict";

    var module = angular.module('hydroid.modal', ['ui.bootstrap']);

    module.service('hydroidModalService', ['$uibModal', '$sce', function($uibModal, $sce) {

        var modalDefaults = {
            animation: false,
            templateUrl: 'components/modal/modal.html',
            size: 'lg'
        };

        var modalOptionsDefault = {
            closeButtonText: 'Cancel',
            actionButtonText: 'OK',
            headerText: 'Confirmation',
            bodyText: $sce.trustAsHtml('Are you sure ?'),
            imageSrc: null
        };

        var modalOptions = {};

        var service = {};

        service.modalOptions = function() {
            return modalOptions;
        };

        service.confirm = function(headerText, bodyText) {

            this.modalOptions = {};
            angular.extend(this.modalOptions, modalOptionsDefault);

            if (headerText != null) {
                this.modalOptions.headerText = headerText;
            }

            if (bodyText != null) {
                this.modalOptions.bodyText = $sce.trustAsHtml(bodyText);
            }

            modalDefaults.controller = 'hydroidModalConfirmCtrl';
            return $uibModal.open(modalDefaults).result;
        };

        service.show = function(headerText, bodyText, imageSrc) {
            this.modalOptions = {};

            if (headerText != null) {
                this.modalOptions.headerText = headerText;
            }

            if (bodyText != null) {
                this.modalOptions.bodyText = $sce.trustAsHtml(bodyText);
            }

            if (imageSrc != null) {
                this.modalOptions.imageSrc = imageSrc;
            }

            modalDefaults.controller = 'hydroidModalShowCtrl';
            $uibModal.open(modalDefaults);
        };

        return service;

    }]);

    module.controller('hydroidModalConfirmCtrl', ['$scope', '$uibModalInstance', 'hydroidModalService',
        function($scope, $uibModalInstance, hydroidModalService) {

            $scope.modalOptions = {};
            angular.extend($scope.modalOptions, hydroidModalService.modalOptions);

            $scope.modalOptions.ok = function() {
                $uibModalInstance.close('ok');
            };

            $scope.modalOptions.close = function() {
                $uibModalInstance.dismiss('cancel');
            };
        }
    ]);

    module.controller('hydroidModalShowCtrl', ['$scope', '$uibModalInstance', 'hydroidModalService',
        function($scope, $uibModalInstance, hydroidModalService) {

            $scope.modalOptions = {};
            angular.extend($scope.modalOptions, hydroidModalService.modalOptions);

            $scope.modalOptions.close = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }
    ]);

})();