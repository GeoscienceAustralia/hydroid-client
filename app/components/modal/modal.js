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

        var service = {};

        service.confirm = function(headerText, bodyText) {

            var modalOptions = {};
            angular.extend(modalOptions, modalOptionsDefault);

            if (headerText != null) {
                modalOptions.headerText = headerText;
            }

            if (bodyText != null) {
                modalOptions.bodyText = $sce.trustAsHtml(bodyText);
            }

            modalDefaults.controller = 'hydroidModalConfirmCtrl';
            modalDefaults.resolve = { modalOptions: modalOptions };

            return $uibModal.open(modalDefaults).result;
        };

        service.show = function(headerText, bodyText, imageSrc) {

            var modalOptions = {};

            if (headerText != null) {
                modalOptions.headerText = headerText;
            }

            if (bodyText != null) {
                modalOptions.bodyText = $sce.trustAsHtml(bodyText);
            }

            if (imageSrc != null) {
                modalOptions.imageSrc = imageSrc;
            }

            modalDefaults.controller = 'hydroidModalShowCtrl';
            modalDefaults.resolve = { modalOptions: modalOptions };

            $uibModal.open(modalDefaults);
        };

        return service;

    }]);

    module.controller('hydroidModalConfirmCtrl', ['$scope', '$uibModalInstance', 'modalOptions',
        function($scope, $uibModalInstance, modalOptions) {

            $scope.modalOptions = {};
            angular.extend($scope.modalOptions, modalOptions);

            $scope.modalOptions.ok = function() {
                $uibModalInstance.close('ok');
            };

            $scope.modalOptions.close = function() {
                $uibModalInstance.dismiss('cancel');
            };
        }
    ]);

    module.controller('hydroidModalShowCtrl', ['$scope', '$uibModalInstance', 'modalOptions',
        function($scope, $uibModalInstance, modalOptions) {

            $scope.modalOptions = {};
            angular.extend($scope.modalOptions, modalOptions);

            $scope.modalOptions.close = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }
    ]);

})();