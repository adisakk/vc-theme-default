angular.module('storefront.account')
.component('vcAccountProfileUpdate', {
    templateUrl: "themes/assets/js/account/account-profile-update.tpl.liquid",
    bindings: {
        $router: '<'
    },
    require: {
        accountManager: '^vcAccountManager'
    },
    controller: ['storefrontApp.mainContext', '$scope', '$window', 'loadingIndicatorService', 'FileUploader', function (mainContext, $scope, $window, loader, FileUploader) {
        var $ctrl = this;
        $ctrl.loader = loader;

        // For detailForm
        $ctrl.genders = ["Male", "Female"];
        $ctrl.days = [];
        $ctrl.months = [];
        $ctrl.years = [];

        // For phoneForm
        $ctrl.isPhoneChanged = false;
        $ctrl.isPhoneCodeSent = false;
        $ctrl.isPhoneCodeSubmitted = false;
        $ctrl.isPhoneVerified = false;
        $ctrl.isPhoneUpdateFailed = false;
        $ctrl.isPhoneFormLoading = false;

        // For emailForm
        $ctrl.isEmailChanged = false;
        $ctrl.isEmailCodeSent = false;
        $ctrl.isEmailCodeSubmitted = false;
        $ctrl.isEmailVerified = false;
        $ctrl.isEmailUpdateFailed = false;
        $ctrl.isEmailFormLoading = false;

        // Mark verification flag after user has change phone number
        $ctrl.changePhoneNumber = function () {
            $ctrl.isPhoneChanged = ($ctrl.newPhoneNumber != '' && $ctrl.newPhoneNumber != $ctrl.phoneNumber);
        };

        // Mark verification flag after user has change email address
        $ctrl.changeEmailAddress = function () {
            $ctrl.isEmailChanged = ($ctrl.newEmail != '' && $ctrl.newEmail != $ctrl.changeData.email);
        };

        // Send phone verification code via SMS
        $ctrl.sendPhoneVerificationCode = function () {
            $ctrl.isPhoneFormLoading = true;
            $ctrl.accountManager.sendVerificationCode($ctrl.newPhoneNumber, '')
                .then(function () {
                    $ctrl.isPhoneFormLoading = false;
                    $ctrl.isPhoneCodeSent = true;
                });
        };

        // Send email verification code via SMTP
        $ctrl.sendEmailVerificationCode = function () {
            $ctrl.isEmailFormLoading = true;
            $ctrl.accountManager.sendVerificationCode('', $ctrl.newEmail)
                .then(function () {
                    $ctrl.isEmailFormLoading = false;
                    $ctrl.isEmailCodeSent = true;
                });
        };

        // Undo phone number change
        $ctrl.undoPhoneNumberChange = function () {
            $ctrl.isPhoneChanged = false;
            $ctrl.isPhoneCodeSent = false;
            $ctrl.isPhoneCodeSubmitted = false;
            $ctrl.isPhoneVerified = false;
            $ctrl.newPhoneNumber = $ctrl.phoneNumber;
        };

        // Undo email address change
        $ctrl.undoEmailAddressChange = function () {
            $ctrl.isEmailChanged = false;
            $ctrl.isEmailCodeSent = false;
            $ctrl.isEmailCodeSubmitted = false;
            $ctrl.isEmailVerified = false;
            $ctrl.newEmail = $ctrl.getNoEmailWorkaround($ctrl.changeData.email);
        };

        // Resend phone verification code
        $ctrl.resendPhoneVerificationCode = function () {
            $ctrl.sendPhoneVerificationCode();
            $ctrl.isPhoneCodeSubmitted = false;
            $ctrl.phoneVerificationCode = null;
        };

        // Resend email verification code
        $ctrl.resendEmailVerificationCode = function () {
            $ctrl.sendEmailVerificationCode();
            $ctrl.isEmailCodeSubmitted = false;
            $ctrl.emailVerificationCode = null;
        };

        // Verify phone number then save
        $ctrl.validatePhoneVerificationCode = function () {
            $ctrl.isPhoneFormLoading = true;
            $ctrl.accountManager
                .validateVerificationCode($ctrl.newPhoneNumber, $ctrl.phoneVerificationCode)
                .then(function (result) {
                    $ctrl.isPhoneCodeSubmitted = true;
                    if (result.succeeded == true) {
                        $ctrl.phoneNumber = $ctrl.newPhoneNumber;
                        $ctrl.isPhoneChanged = false;
                        $ctrl.isPhoneCodeSent = false;
                        $ctrl.phoneVerificationCode = null;
                        $ctrl.isPhoneVerified = true;

                        $ctrl.accountManager
                            .updatePhoneNumber($ctrl.phoneNumber)
                            .then(function (result) {
                                if (!result.succeeded) {
                                    //$ctrl.phoneNumber = null;
                                    $ctrl.isPhoneUpdateFailed = true;
                                }
                                $ctrl.isPhoneFormLoading = false;
                            });

                    } else {
                        $ctrl.isPhoneVerified = false;
                        $ctrl.isPhoneFormLoading = false;
                    }
                });
        };

        // Verity email address then save
        $ctrl.validateEmailVerificationCode = function () {
            $ctrl.isEmailFormLoading = true;
            $ctrl.accountManager
                .validateVerificationCode($ctrl.newEmail, $ctrl.emailVerificationCode)
                .then(function (result) {
                    $ctrl.isEmailCodeSubmitted = true;
                    if (result.succeeded == true) {
                        $ctrl.changeData.email = $ctrl.newEmail;
                        $ctrl.isEmailChanged = false;
                        $ctrl.isEmailCodeSent = false;
                        $ctrl.emailVerificationCode = '';
                        $ctrl.isEmailVerified = true;

                        $ctrl.accountManager
                            .updateEmailAddress($ctrl.changeData.email)
                            .then(function (result) {
                                if (!result.succeeded) {
                                    $ctrl.isEmailUpdateFailed = true;
                                }
                                $ctrl.isEmailFormLoading = false;
                            });

                    } else {
                        $ctrl.isEmailVerified = false;
                        $ctrl.isEmailFormLoading = false;
                    }
                });
        };
        
        // Convert xxxx@no.email to blank for workaround case of the platform force every user to have an email
        $ctrl.getNoEmailWorkaround = function (email) {
            if (email != null && !email.includes('no.email')) {
                return email;
            } else {
                return "";
            }
        };
        
        $scope.$watch(
            function () { return mainContext.customer; },
            function (customer) {
                $ctrl.customer = customer;
                if (customer) {
                    if (customer.isContract) {
                        $ctrl.$router.navigate(['Orders']);
                    }

                    var sex = customer.contact.dynamicProperties.find(function (element) {
                        return element.name == 'Sex';
                    });
                    var birthday = customer.contact.dynamicProperties.find(function (element) {
                        return element.name == 'Birthday';
                    });
                    var idCardNumber = customer.contact.dynamicProperties.find(function (element) {
                        return element.name == 'IdCardNumber';
                    });
                    var idCardPhoto = customer.contact.dynamicProperties.find(function (element) {
                        return element.name == 'IdCardPhoto';
                    });
                    var bankbookPhoto = customer.contact.dynamicProperties.find(function (element) {
                        return element.name == 'BankbookPhoto';
                    });
                    
                    $ctrl.changeData =
                    {
                        firstName: customer.firstName,
                        lastName: customer.lastName,
                        fullName: customer.fullName,
                        email: customer.email,
                        gender: sex != undefined && sex.values[0] != null ? sex.values[0].value : '',
                        idCardNumber: idCardNumber != undefined ? idCardNumber.values[0].value : '',
                        birthday: birthday != undefined && birthday.values[0] != null ? birthday.values[0].value : '',
                        idCardPhoto: idCardPhoto != undefined && idCardPhoto.values[0] != null ? idCardPhoto.values[0].value : null,
                        bankbookPhoto: bankbookPhoto != undefined && bankbookPhoto.values[0] != null ? bankbookPhoto.values[0].value : null
                    };
                    $ctrl.phoneNumber = customer.phoneNumber;
                    $ctrl.twoFactorEnabled = customer.twoFactorEnabled;
                    $ctrl.newPhoneNumber = $ctrl.phoneNumber;
                    $ctrl.newEmail = $ctrl.getNoEmailWorkaround($ctrl.changeData.email);
 
                    if ($ctrl.changeData.birthday != null && $ctrl.changeData.birthday != '') {
                        var dateSplit = $ctrl.changeData.birthday.split('/');
                        $ctrl.bday = dateSplit[0];
                        $ctrl.bmonth = dateSplit[1];
                        $ctrl.byear = dateSplit[2];
                    } else {
                        $ctrl.bday = '';
                        $ctrl.bmonth = '';
                        $ctrl.byear = '';
                    }
                }

                // Populate dropdown option: days, months, years for birthday
                if ($ctrl.days.length == 0) {
                    for (i = 1; i <= 31; i++) {
                        var day = '0' + i;
                        if ($ctrl.days.length >= 9) {
                            day = '' + i;
                        }
                        $ctrl.days.push(day);
                    }
                }

                if ($ctrl.months.length == 0) {
                    for (i = 1; i <= 12; i++) {
                        var month = '0' + i;
                        if ($ctrl.months.length >= 9) {
                            month = '' + i;
                        }
                        $ctrl.months.push(month);
                    }
                }

                if ($ctrl.years.length == 0) {
                    var d = new Date();
                    var n = d.getFullYear() + 543;
                    if (n > 2500) {
                        n -= 543;
                    }
                    n -= 100; // age range 1-99 years
                    for (i = 0; i < 100; i++) {
                        var year = '' + (n + i);
                        $ctrl.years.push(year);
                    }
                }
                
            });

        $ctrl.submit = function () {

            $ctrl.changeData.birthday = $ctrl.bday + '/' + $ctrl.bmonth + '/' + $ctrl.byear;
            
            // no validation
            $ctrl.accountManager.updateProfile($ctrl.changeData);
        };

        $ctrl.updatePhoneNumber = function () {
            $ctrl.accountManager
                .updatePhoneNumber($ctrl.phoneNumber)
                .then(function (result) {
                    if (!result.succeeded) {
                        $ctrl.phoneNumber = null;
                    }
                });
        };

        $ctrl.deletePhoneNumber = function () {
            $ctrl.accountManager.deletePhoneNumber().then(function (result) {
                if (result.succeeded) {
                    $ctrl.phoneNumber = null;
                }
            });
        };

        $ctrl.toggleTwoFactorAuth = function () {

            var toogledTwoFactorEnabledValue = !$ctrl.twoFactorEnabled;

            $ctrl.accountManager
                .changeTwoFactorAuth(toogledTwoFactorEnabledValue)
                .then(function (result) {
                    if (!result.succeeded && result.verificationUrl) {
                        $window.location.href = result.verificationUrl;
                    }
                    if (result.succeeded) {
                        $ctrl.twoFactorEnabled = toogledTwoFactorEnabledValue;
                    }
                });
        };

        $ctrl.isIdCardPhotoUploading = false;
        $ctrl.isBankbookPhotoUploading = false;
        var folderUrl = '/documents/';
        function initializeUploader() {
            console.log('initialize');
            if (!$scope.uploader) {
                // Create the uploader
                var uploader = $scope.uploader = new FileUploader({
                    scope: $scope,
                    url: 'storefrontapi/account/upload?folderUrl=' + folderUrl,
                    method: 'POST',
                    autoUpload: true,
                    removeAfterUpload: true
                });
                
                uploader.onSuccessItem = function (fileItem, images) {
                     if ($ctrl.isIdCardPhotoUploading) {
                        $ctrl.changeData.idCardPhoto = images[0].url;
                        $ctrl.isIdCardPhotoUploading = false;
                    }

                    if ($ctrl.isBankbookPhotoUploading) {
                        $ctrl.changeData.bankbookPhoto = images[0].url;
                        $ctrl.isBankbookPhotoUploading = false;
                    }
                };
            }
        }

        initializeUploader();

        $scope.openUrl = function (url) {
            window.open(url, '_blank');
        }

    }]
});
