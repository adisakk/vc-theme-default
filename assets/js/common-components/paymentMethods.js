var storefrontApp = angular.module('storefrontApp');

storefrontApp.component('vcPaymentMethods', {
    templateUrl: "themes/assets/js/common-components/paymentMethods.tpl.html",
    require: {
        checkoutStep: '?^vcCheckoutWizardStep'
    },
    bindings: {
        getAvailPaymentMethods: '&',
        onSelectMethod: '&',
        paymentMethod: '=',
        validationContainer: '='
    },
    controller: ['$scope', 'storefrontApp.mainContext', function ($scope, mainContext) {
        var ctrl = this;

        this.$onInit = function () {
            ctrl.getAvailPaymentMethods().then(function (methods) {
                ctrl.availPaymentMethods = _.sortBy(methods, function (x) { return x.priority; });
                if (ctrl.paymentMethod) {
                    ctrl.paymentMethod = _.findWhere(ctrl.availPaymentMethods, { code: ctrl.paymentMethod.code });
                }
                if (!ctrl.paymentMethod && ctrl.availPaymentMethods.length > 0) {
                    ctrl.selectMethod(ctrl.availPaymentMethods[0]);
                }
            })
            if (ctrl.validationContainer)
                ctrl.validationContainer.addComponent(this);
            if (ctrl.checkoutStep)
                ctrl.checkoutStep.addComponent(this);

            var customer = mainContext.customer;
            var idApproved = customer.contact.dynamicProperties.find(function (element) {
                return element.name == 'Id_Approve';
            });
            var bookApproved = customer.contact.dynamicProperties.find(function (element) {
                return element.name == 'Bankbook_Approve';
            });

            var isIdApproved = idApproved != undefined && idApproved.values[0] != undefined ? idApproved.values[0].value : false;
            var isBookApproved = bookApproved != undefined && bookApproved.values[0] != undefined ? bookApproved.values[0].value : false;

            if (isIdApproved == 'true' && isBookApproved == 'true') {
                ctrl.isAllowToPayByPoints = true;
            } else {
                ctrl.isAllowToPayByPoints = false;
            }
        };

        this.$onDestroy = function () {
            if (ctrl.validationContainer)
                ctrl.validationContainer.removeComponent(this);
            if (ctrl.checkoutStep)
                ctrl.checkoutStep.removeComponent(this);
        };

        ctrl.validate = function () {
            return ctrl.paymentMethod;
        }

        ctrl.selectMethod = function (method) {
            ctrl.paymentMethod = method;
            ctrl.onSelectMethod({ paymentMethod: method });
        };
    }]
});
