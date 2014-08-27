(function ($) {
    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
})(jQuery);


(function (ctx) {
    'use strict';
    var _options;
    var isCalling;
    var submitPurchase = function (e) {
        var $form = $('form#purchase');
        if ($form.find('input:visible').length == 0) {
            //  this is the repeat flow, let it happen naturally
            return;
        }
        e.preventDefault();

        resetForm($form);

        //  build data to submit
        var cardData = $form.serializeObject();

        for (var key in cardData) {
            var trimmedKey = key.replace('guest-', '').replace('purchase-', '');
            cardData[trimmedKey] = cardData[key];
            delete cardData[key];
        }

        var name = $('[name$="name"]', $form).val();
        var emailAddress = $('[name$="email_address"]', $form).val();

        //  validate form
        if (!name) {
            addErrorToField($form, 'name');
        }
        if (!balanced.emailAddress.validate(emailAddress)) {
            addErrorToField($form, 'email_address');
        }
        if (!balanced.card.isCardNumberValid(cardData.number)) {
            addErrorToField($form, 'number');
        }
        if (!balanced.card.isExpiryValid(cardData.expiration_month, cardData.expiration_year)) {
            addErrorToField($form, 'expiration_month');
            addErrorToField($form, 'expiration_year');
        }

        if ($form.find('.control-group.error').length) {
            return;
        }

        // submit
        disableForm($form);
        showProcessing('Processing payment...', 33);
        balanced.card.create(cardData, completePurchase);
    };
    var completePurchase = function (response) {
        var $form = $('form#purchase');
        var sensitiveFields = ['number', 'cvv', 'expiration_month', 'expiration_year'];
        hideProcessing();
        switch (response.status_code) {
            case 201:
                showProcessing('Renting bike...', 66);
                // IMPORTANT - remove sensitive data to remain PCI compliant
                removeSensitiveFields($form, sensitiveFields);
                $form.find('input').removeAttr('disabled');
                $('<input type="hidden" name="card_href" value="' + response.cards[0].href + '">').appendTo($form);
                $form.unbind('submit', submitPurchase).submit();
                break;
            case 400:
                var fields = ['number', 'expiration_month', 'expiration_year', 'cvv'];
                var found = false;
                for (var i = 0; i < fields.length; i++) {
                    var isIn = response.error.description.indexOf(fields[i]) >= 0;
                    console.log(isIn, fields[i], response.error.description);
                    if (isIn) {
                        resetForm($form);
                        addErrorToField($form, fields[i]);
                    }
                }
                if (!found) {
                    console.warn('missing field - check response.error for details');
                    console.warn(response.error);
                }
                break;
            case 500:
                console.error('Balanced did something bad, this will never happen, but if it does please retry the request');
                console.error(response.error);
                showError('Balanced did something bad, please retry the request');
                break;
        }
    };
    var submitKYC = function (e) {
        var $form = $('form#kyc');
        $form.find('.control-group').removeClass('error');

        //  validate form
        var merchantData = $form.serializeObject();

        for (var key in merchantData) {
            var trimmedKey = key.replace('guest-', '').replace('listing-', '');
            merchantData[trimmedKey] = merchantData[key];
            if (key != trimmedKey) {
                delete merchantData[key];
            }
        }

        merchantData.dob = merchantData.date_of_birth_year + '-' + merchantData.date_of_birth_month;
        delete merchantData.date_of_birth_year;
        delete merchantData.date_of_birth_month;

        if (!merchantData.name) {
            addErrorToField($form, 'name');
        }

        if (!balanced.emailAddress.validate(merchantData.email_address)) {
            addErrorToField($form, 'email_address');
        }

        if (!merchantData.street_address) {
            addErrorToField($form, 'street_address');
        }

        if (!merchantData.postal_code) {
            addErrorToField($form, 'postal_code');
        }

        if (!merchantData.phone_number) {
            addErrorToField($form, 'phone_number');
        }

        var hasBankAccount = false;
        if (merchantData.account_number || merchantData.routing_number) {
            hasBankAccount = true;
            if (!balanced.bankAccount.validateRoutingNumber(merchantData.routing_number)) {
                addErrorToField($form, 'routing_number');
            }
            if (!merchantData.account_number) {
                addErrorToField($form, 'account_number');
            }
        }

        if ($form.find('.control-group.error').length) {
            e.preventDefault();
            return;
        }

        if (hasBankAccount) {
            e.preventDefault();
            disableForm($form);
            showProcessing('Adding bank account...', 33);
            balanced.bankAccount.create(merchantData, onBankAccountTokenized);
        }
    };
    var onBankAccountTokenized = function (response) {
        var $form = $('#kyc');
        hideProcessing();
        console.log(response);
        switch (response.status_code) {
            case 201:
                $form.find('input,select').removeAttr('disabled');
                showProcessing('Performing identity check...', 66);
                $('<input type="hidden" name="bank_account_href" value="' + response.bank_accounts[0].href + '">').appendTo($form);
                $form.unbind('submit', submitKYC).submit();
            //  todo - what if we have a 409?
        }
    };
    var showProcessing = function (message, progress) {
        progress = progress || 50;
        var $loader = $('.loading');
        if (!$loader.length) {
            $loader = $(
                '<div class="loading">' +
                    '<div class="progress progress-striped active">' +
                    '<div class="bar"></div>' +
                    '</div>' +
                    '<p>&nbsp;</p>' +
                    '</div>');
            $loader.appendTo('body');
        }
        $loader.find('.bar').css({width:progress + '%'});
        $loader.find('p').text(message);
        $loader.css({
            left:$('body').width() / 2 - $loader.width() / 4,
            top:'400px'
        }).show();
    };
    var hideProcessing = function () {
        $('.loading').hide();
    };
    var showError = function (message) {
        var $alert = $('.alert:visible');
        if ($alert.length) {
            $alert.remove();
        }
        $alert = $(
            '<div class="alert alert-absolute alert-block alert-error">' +
                '<button class="close" data-dismiss="alert">&times;</button>' +
                '<h4 class="alert-heading">Error!</h4>' +
                message +
                '</div>');
        $alert.appendTo('body').css({
            left:$('body').width() / 2 - $alert.width() / 4,
            top:'400px'
        }).show();
    };
    var hideError = function () {
        $('.alert').hide();
    };
    var resetForm = function ($form) {
        if (!$form) {
            $form = $('form');
        }
        $form.find('.control-group').removeClass('error');
        $form.find('input,button,select').removeAttr('disabled');
    };
    var disableForm = function ($form) {
        $form.find('input, button, select').attr('disabled', 'disabled');
    };
    var addErrorToField = function ($form, fieldName) {
        $form.find('[name$="' + fieldName + '"]')
            .closest('.control-group')
            .addClass('error');
    };
    var removeSensitiveFields = function ($form, sensitiveFields) {
        for (var i = 0; i < sensitiveFields.length; i++) {
            sensitiveFields[i] = '[name$="' + sensitiveFields[i] + '"]';
        }
        sensitiveFields = sensitiveFields.join(',');
        $form.find(sensitiveFields).remove();
    };
    ctx.rentmybike = {
        init:function (options) {
            _options = options;
            $('form#purchase').submit(submitPurchase);
            $('form#kyc').submit(submitKYC);
            $('[data-dismiss="alert"]').on('click', function (e) {
                $(this).closest('.alert').fadeOut('fast');
                resetForm();
                e.preventDefault();
            });
        }
    };
})(this);
