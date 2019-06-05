var storefrontApp = angular.module('storefrontApp');

storefrontApp.controller('digitalContentPasswordCheckDialogController', ['$scope', '$window', '$uibModalInstance', 'dialogData', '$sce', function ($scope, $window, $uibModalInstance, dialogData, $sce) {

    $scope.dialogData = dialogData;

    $scope.close = function () {
        console.log("close");
        $uibModalInstance.close();
    }

    $scope.checkPassword = function () {
       
        if ($scope.dialogData.password == 'Test+001') {
            $scope.dialogData.digitalContent = "http://www.orimi.com/pdf-test.pdf";

        } else {
            console.log($scope.pdf.src);
            $scope.dialogData.passwordCheckError = "Password is not match!";
        }
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
           
            $ctrl.openDigitalContent = function () {
                console.log("openDigitalContent");
                 var dialogData = {
                    lists: $ctrl.password,
                    type: $ctrl.type
                 }
                dialogService.showDialog(dialogData, 'digitalContentPasswordCheckDialogController', 'storefront.digital-content-password-check-dialog.tpl', function (result) {
                    console.log(result);
                });
            };
        }
    ]
});
