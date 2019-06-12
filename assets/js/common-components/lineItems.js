var storefrontApp = angular.module('storefrontApp');

storefrontApp.controller('digitalContentPasswordCheckDialogController', ['$scope', '$window', '$uibModalInstance', 'dialogData', '$sce', 'catalogService' , function ($scope, $window, $uibModalInstance, dialogData, $sce, catalog) {

    $scope.dialogData = dialogData;

    $scope.close = function () {
        $uibModalInstance.close();
    }

    $scope.checkPassword = function () {
        $scope.dialogData.passwordCheckError = "";
        $scope.dialogData.digitalContent = "";

        $scope.dialogData.account.checkPassword({ CurrentPassword: $scope.dialogData.password }).then(

            function (result) {
                if (result.isValid) {

                    catalog.getProduct($scope.dialogData.productId).then(
                        function (product) {
                            $scope.dialogData.digitalContent = product.data[0].assets[0];
                        }
                    );

                } else {
                    $scope.dialogData.passwordCheckError = "Password is not match!";
                }
            }
        ); 
    }
}]);

storefrontApp.component('vcLineItems', {
    templateUrl: "themes/assets/js/common-components/lineItems.tpl.liquid",
    bindings: {
        items: '='
    },
    require: {
        accountManager: '^vcAccountManager'
    },
    controller:
        ['dialogService', function (dialogService) {

            var $ctrl = this;
            $ctrl.type = null;
            $ctrl.password = "";

            $ctrl.openDigitalContent = function (productId) {
                var dialogData = {
                    lists: $ctrl.password,
                    type: $ctrl.type,
                    account: $ctrl.accountManager,
                    productId: productId
                 }
                dialogService.showDialog(dialogData, 'digitalContentPasswordCheckDialogController', 'storefront.digital-content-password-check-dialog.tpl');
            };
        }
    ]
});
