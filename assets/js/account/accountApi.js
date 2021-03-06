angular.module('storefront.account')
    .factory('storefront.accountApi', ['$resource', function ($resource) {
        return $resource('storefrontapi/account', null, {
            updateAccount: { url: 'storefrontapi/account', method: 'POST' },
            changePassword: { url: 'storefrontapi/account/password', method: 'POST' },
            checkPassword: { url: 'storefrontapi/account/checkpassword', method: 'POST' },
            searchQuotes: { url: 'storefrontapi/quoterequests/search', method: 'POST' },
            updateAddresses: { url: 'storefrontapi/account/addresses', method: 'POST' },
            getCountries: { url: 'storefrontapi/countries', isArray: true },
            getCountryRegions: { url: 'storefrontapi/countries/:code3/regions', isArray: true },
            deletePhoneNumber: { url: "storefrontapi/account/phonenumber", method: "DELETE" },
            changeTwoFactorAuth: { url: "storefrontapi/account/twofactorauthentification", method: "POST" },
            updatePhoneNumber: { url: "storefrontapi/account/phonenumber", method: "POST" },
            updateEmailAddress: { url: "storefrontapi/account/email", method: "POST" },
            sendVerificationCode: { url: "storefrontapi/account/verificationcode", method: "POST" },
            validateVerificationCode: { url: "storefrontapi/account/validatecode", method: "POST" },
            upload: { url: "storefrontapi/account/upload", method: "POST" }
        });
    }])
    .factory('storefront.orderApi', ['$resource', function ($resource) {
        return $resource('storefrontapi/orders/:number', null, {
            search: { url: 'storefrontapi/orders/search', method: 'POST' },
            getNewPaymentData: { url: 'storefrontapi/orders/:number/newpaymentdata' },
            addOrUpdatePayment: { url: 'storefrontapi/orders/:number/payments', method: 'POST' },
            processPayment: { url: 'storefrontapi/orders/:number/payments/:paymentNumber/process', method: 'POST' },
            cancelPayment: { url: 'storefrontapi/orders/:number/payments/:paymentNumber/cancel', method: 'POST' }
        });
    }])
    .factory('storefront.subscriptionApi', ['$resource', function ($resource) {
        return $resource('storefrontapi/subscriptions/:number', null, {
            search: { url: 'storefrontapi/subscriptions/search', method: 'POST' },
            cancel: { url: 'storefrontapi/subscriptions/:number/cancel', method: 'POST' }
        });
    }]);
