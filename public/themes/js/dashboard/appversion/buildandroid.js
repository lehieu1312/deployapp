$(document).ready(function() {
    $('.button-close-notification').click(function() {
        $('.errPopup').hide();
    });

    $('#btn-close-platform-dash').click(function() {
        $('#dialog-noti-choose-android-dashboard').hide();
    });
    $('#btn-close-platform-dash').click(function() {
        $('#dialog-build-android-dashboard').hide();
    });

    function validateEmail(email) {
        var str = /^[a-z][a-zA-Z0-9_.]*(\.[a-zA-Z][a-zA-Z0-9_.]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/;
        return str.test(email);
    }

    function checkCharSpecialTwo(str) {
        var regex = /[!@#$%^&*()~_`+\- =\[\]{};':"\\|,<>\/?¿§«»ω⊙¤°℃℉€¥£¢¡®©1234567890]+/;
        //   var regexNumber = /[0123456789]+/;
        if (str.search(regex) != -1) {

            return checkF = false;
        } else return true;
    }

    function checkCharSpecialText(str) {
        var regex = /[!@#$%^&*()~`+\=\[\]{};':"\\|<>\/?¿§«»ω⊙¤°℃℉€¥£¢¡®©1234567890]+/;
        //   var regexNumber = /[0123456789]+/;
        if (str.search(regex) != -1) {

            return checkF = false;
        } else return true;
    }

    function checkCharSpecialAlias(str) {
        var regex = /[!@#$%^&*()~`+\ =\[\]{};':"\\|,<>\/?¿§«»ω⊙¤°℃℉€¥£¢¡®©]+/;
        //   var regexNumber = /[0123456789]+/;
        if (str.search(regex) != -1) {

            return checkF = false;
        } else return true;
    }

    function validateForm_build_android() {
        // var checkmail = validateEmail($('#email').val());
        var check;
        // if ($('#email').val() == "") {
        //     $('#email').attr('placeholder', 'Email can not be empty ');
        //     $('#email').addClass('input-holder').addClass('border-bottom-red');
        //     $('#icon-err-email').removeClass('display-none').addClass('display-inline');
        //     check = false;
        // } else if (checkmail == false) {
        //     $('#email').val('');
        //     $('#email').attr('placeholder', 'Email invalid');
        //     $('#email').addClass('input-holder').addClass('border-bottom-red');
        //     $('#icon-err-email').removeClass('display-none').addClass('display-inline');
        //     check = false;
        // } else {
        //     $('#email').removeClass('input-holder').removeClass('border-bottom-red');
        //     $('#icon-err-email').removeClass('display-inline').addClass('display-none');
        // }
        if ($('#keystore').val() == "") {
            $('#keystore').attr('placeholder', 'Key Store Password can not be empty ');
            $('#keystore').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-keystore').removeClass('display-none').addClass('display-inline');
            check = false;
        } else if ($('#keystore').val().length < 8) {
            $('#keystore').val('');
            $('#keystore').attr('placeholder', 'Key Store Password must be longer than 8 characters');
            $('#keystore').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-keystore').removeClass('display-none').addClass('display-inline');
            check = false;
        } else {
            $('#keystore').removeClass('input-holder').removeClass('border-bottom-red');
            $('#icon-err-keystore').removeClass('display-inline').addClass('display-none');
        }
        if ($('#confirmkeystore').val() == "") {
            $('#confirmkeystore').attr('placeholder', 'Key Store Confirm Password can not be empty ');
            $('#confirmkeystore').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-confirmkeystore').removeClass('display-none').addClass('display-inline');
            check = false;
        } else if ($('#confirmkeystore').val() != $('#keystore').val()) {
            $('#confirmkeystore').val('');
            $('#confirmkeystore').attr('placeholder', 'Key Store Confirm Password not match Key Store Password ');
            $('#confirmkeystore').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-confirmkeystore').removeClass('display-none').addClass('display-inline');
            check = false;
        } else {
            $('#confirmkeystore').removeClass('input-holder').removeClass('border-bottom-red');
            $('#icon-err-confirmkeystore').removeClass('display-inline').addClass('display-none');
        }
        if ($('#CN').val() == "") {
            $('#CN').attr('placeholder', 'First and last name can not be empty ');
            $('#CN').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-CN').removeClass('display-none').addClass('display-inline');
            check = false;
        } else {
            $('#CN').removeClass('input-holder').removeClass('border-bottom-red');
            $('#icon-err-CN').removeClass('display-inline').addClass('display-none');
        }
        if ($('#OU').val() == "") {
            $('#OU').attr('placeholder', 'Organizational unit can not be empty ');
            $('#OU').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-OU').removeClass('display-none').addClass('display-inline');
            check = false;
        } else {
            $('#OU').removeClass('input-holder').removeClass('border-bottom-red');
            $('#icon-err-OU').removeClass('display-inline').addClass('display-none');
        }
        if ($('#O').val() == "") {
            $('#O').attr('placeholder', 'Organizational can not be empty ');
            $('#O').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-O').removeClass('display-none').addClass('display-inline');
            check = false;
        } else {
            $('#O').removeClass('input-holder').removeClass('border-bottom-red');
            $('#icon-err-O').removeClass('display-inline').addClass('display-none');
        }
        if ($('#L').val() == "") {
            $('#L').attr('placeholder', 'City or location can not be empty ');
            $('#L').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-L').removeClass('display-none').addClass('display-inline');
            check = false;
        } else if (checkCharSpecialText($('#L').val()) == false) {
            $('#L').val('');
            $('#L').attr('placeholder', 'City or location is contain character special ');
            $('#L').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-L').removeClass('display-none').addClass('display-inline');
            check = false;
        } else {
            $('#L').removeClass('input-holder').removeClass('border-bottom-red');
            $('#icon-err-L').removeClass('display-inline').addClass('display-none');
        }
        if ($('#ST').val() == "") {
            $('#ST').attr('placeholder', 'State or Province can not be empty ');
            $('#ST').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-ST').removeClass('display-none').addClass('display-inline');
            check = false;
        } else if (checkCharSpecialText($('#ST').val()) == false) {
            $('#ST').val('');
            $('#ST').attr('placeholder', 'State or Province is contain character special ');
            $('#ST').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-ST').removeClass('display-none').addClass('display-inline');
            check = false;
        } else {
            $('#ST').removeClass('input-holder').removeClass('border-bottom-red');
            $('#icon-err-ST').removeClass('display-inline').addClass('display-none');
        }
        if ($('#C').val() == "") {
            $('#C').attr('placeholder', 'Two-letter country can not be empty ');
            $('#C').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-C').removeClass('display-none').addClass('display-inline');
            check = false;
        } else if (checkCharSpecialTwo($('#C').val()) == false) {
            $('#C').val('');
            $('#C').attr('placeholder', 'Two-letter is contain character special ');
            $('#C').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-C').removeClass('display-none').addClass('display-inline');
            check = false;
        } else {
            $('#C').removeClass('input-holder').removeClass('border-bottom-red');
            $('#icon-err-C').removeClass('display-inline').addClass('display-none');
        }
        if ($('#alias').val() == "") {
            $('#alias').attr('placeholder', 'Alias name can not be empty ');
            $('#alias').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-alias').removeClass('display-none').addClass('display-inline');
            check = false;
        } else if (checkCharSpecialAlias($('#alias').val()) == false) {
            $('#alias').val('');
            $('#alias').attr('placeholder', 'Alias can only contain alphanumeric characters ([a-z], [A-Z], [0-9], _)');
            $('#alias').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-alias').removeClass('display-none').addClass('display-inline');
            check = false;
        } else {
            $('#alias').removeClass('input-holder').removeClass('border-bottom-red');
            $('#icon-err-alias').removeClass('display-inline').addClass('display-none');
        }
        if (check == false) {
            return false
        }
        return true;
    }
    $('#btn-deploy-android-dash').click(function() {
        // alert(idApp);
        if (validateForm_build_android() == true) {
            $('#loading').show();
            $.ajax({
                url: "/build-android-dash",
                type: "POST",
                data: {
                    // email: $('#email').val(),
                    platform: 'android',
                    version: $('#version').val(),
                    idapp: $('#idapp').val(),
                    confirmkeystore: $('#confirmkeystore').val(),
                    CN: $('#CN').val(),
                    OU: $('#OU').val(),
                    O: $('#O').val(),
                    L: $('#L').val(),
                    ST: $('#ST').val(),
                    C: $('#C').val(),
                    alias: $('#alias').val(),
                },
                success: function(result) {
                    if (result.status == 1) {
                        $('.errSuccess').show();
                        $('.alert-upload').html(result.content[0]['msg']);
                    } else if (result.status == 2) {
                        $('.errPopup').show();
                        $('.alert-upload').html(result.content[0]['msg']);
                    } else if (result.status == 3) {
                        $('.errPopup').show();
                        $('.alert-upload').html(result.content);
                    } else {
                        $('.errPopup').show();
                        $('.alert-upload').html('Oops, something went wrong');
                    }
                },
                error: function(jqXHR, exception) {
                        $('.errPopup').show();
                        $('.alert-upload').html('Oops, something went wrong');
                    }
                    // timeout: 300000
            }).always(function(data) {
                $('#loading').hide();
            });
        }
    });
});