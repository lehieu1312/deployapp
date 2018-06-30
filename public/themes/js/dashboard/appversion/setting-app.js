$(document).ready(() => {
    function validateEmail(email) {
        var str = /^[a-z][a-zA-Z0-9_.]*(\.[a-zA-Z][a-zA-Z0-9_.]*)?@[a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/;
        return str.test(email);
    }

    function validateIdentifier(str) {
        var id = /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/;
        return id.test(str);
    }

    function validPackageID(str) {
        var dotPackage = str.split('.');
        var checkF;
        var regex = /[!@#$%^&*()~_+\- `=\[\]{};':"\\|,<>\/?¿§«»ω⊙¤°℃℉€¥£¢¡®©]+/;
        var regexNumber = /[0123456789]+/;
        if (str.search(regex) != -1) {
            checkF = false;
        } else if (dotPackage.length == 1) {
            checkF = false;
        } else if (dotPackage.length > 1) {
            for (var i = 0; i < dotPackage.length; i++) {
                if (dotPackage[i] == '')
                    checkF = false;
                if (isNumber(dotPackage[0]) == true) {
                    checkF = false;
                }
                if (dotPackage[0].search(regexNumber) != -1)
                    checkF = false;
            }

        } else {
            checkF = true;
        }
        if (checkF == false)
            return false;
        else return true;
    }

    function checkCharSpecial(str) {
        var regex = /['&"]+/;
        if (str.search(regex) != -1) {
            return false;
        }
    }

    function validAppName(str) {
        var strSpecial = /^[a-zA-Z0-9\. ]+$/;
        return strSpecial.test(str);
    }

    function isNumber(strnumber) {
        var numberic = /^[0-9]*$/;
        return numberic.test(strnumber);
    }

    function checkDateFormat(strDate) {
        var cDate = strDate.split('-');
        var clDate = strDate.split('/');
        var checkDate;
        if (cDate.length == 3) {
            if (cDate[0] == 'dd' && cDate[1] == 'MM' && (cDate[2] == 'yyyy' || cDate[2] == 'yy')) checkDate = true;
            else if (cDate[0] == 'MM' && cDate[1] == 'dd' && (cDate[2] == 'yyyy' || cDate[2] == 'yy')) checkDate = true;
            else if ((cDate[0] == 'yy' || cDate[0] == 'yyyy') && cDate[1] == 'MM' && cDate[2] == 'dd') checkDate = true;
            else checkDate = false;
        } else if (clDate.length == 3) {
            if (cDate[0] == 'dd' && cDate[1] == 'MM' && (cDate[2] == 'yyyy' || cDate[2] == 'yy')) checkDate = true;
            else if (cDate[0] == 'MM' && cDate[1] == 'dd' && (cDate[2] == 'yyyy' || cDate[2] == 'yy')) checkDate = true;
            else if ((cDate[0] == 'yy' || cDate[0] == 'yyyy') && cDate[1] == 'MM' && cDate[2] == 'dd') checkDate = true;
            else checkDate = false;
        } else checkDate = false;
        if (checkDate == false) return false;
        else return true;
    }

    function ValidURL(str) {
        var pattern = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
        if (!pattern.test(str)) {
            return false;
        } else {
            return true;
        }
    }


    function checkWpUrl(strUrl) {
        var checkURL;
        console.log(strUrl);
        if (ValidURL(strUrl)) {
            $.ajax({
                url: strUrl + '/wp-json',
                type: "get",
                dataType: "text",
                data: {},
                async: false,
                success: function(msg) {
                    checkURL = true;
                },
                error: function(jqXHR, textStatus, err) {
                    console.log(textStatus);
                    console.log(err);
                    console.log(jqXHR);
                    console.log('ko co du lieu');
                    checkURL = false;
                }
            }).always(function() {
                $('#loading').hide();
            })
            return checkURL;
        } else return false;
    }

    function validateForm_setting_app() {
        var checkValid = true;
        $("#fmSetting .form-group").each(function() {
            var rules = $(this).find('input').attr("rules");
            var require = $(this).find('input').prop("required");

            if (require == true && $(this).find('input').val() == '' && rules.toLowerCase() == "string") {
                $(this).find('input').attr('placeholder', '');
                $(this).find('input').addClass('input-holder').addClass('border-bottom-red');
                checkValid = false;
                console.log($(this));
                console.log('1');
            } else if (rules.toLowerCase() == "packageid") {
                var value = $(this).find('input').val();
                var checkSpecial = validPackageID(value);
                if (value == '') {
                    $(this).find('input').val('');
                    $(this).find('input').attr('placeholder', 'This ID uniquely identifies your app on the device and in Google Play, like: com.example.myapp');
                    $(this).find('input').addClass('input-holder').addClass('border-bottom-red');
                } else if (checkSpecial == false) {
                    $(this).find('input').val('');
                    $(this).find('input').attr('placeholder', 'This ID uniquely identifies your app on the device and in Google Play, like: com.example.myapp');
                    $(this).find('input').addClass('input-holder').addClass('border-bottom-red');
                    checkValid = false;
                    console.log('2');
                } else {
                    $(this).find('input').removeClass('input-holder').removeClass('border-bottom-red');
                }
                console.log('3');
            } else if (rules.toLowerCase() == "email") {
                var checkmail = validateEmail($(this).find('input').val());
                if ($(this).find('input').val() == '') {
                    $(this).find('input').attr('placeholder', 'Enter valid email');
                    $(this).find('input').addClass('input-holder').addClass('border-bottom-red');
                } else if (checkmail == false) {
                    $(this).find('input').val('');
                    $(this).find('input').attr('placeholder', 'Enter valid email');
                    $(this).find('input').addClass('input-holder').addClass('border-bottom-red');
                    checkValid = false;
                    console.log('4');
                } else {
                    $(this).find('input').removeClass('input-holder').removeClass('border-bottom-red');
                }
            } else if (rules.toLowerCase() == "number") {
                var val = $(this).find('input').val();
                var checkNumber = isNumber(val);
                if (val == '') {
                    $(this).find('input').attr('placeholder', 'Enter valid number [0-9]');
                    $(this).find('input').addClass('input-holder').addClass('border-bottom-red');
                    checkValid = false;
                    console.log('5');
                } else if (checkNumber == false) {
                    $(this).find('input').val('');
                    $(this).find('input').attr('placeholder', 'Enter valid number [0-9]');
                    $(this).find('input').addClass('input-holder').addClass('border-bottom-red');
                    checkValid = false;
                    console.log('6');
                } else {
                    $(this).find('input').removeClass('input-holder').removeClass('border-bottom-red');
                }
            } else if (rules.toLowerCase() == "onesignalid") {
                if ($(this).find('input').val() == '') {
                    $(this).find('input').attr('placeholder', 'Enter valid OneSignal App ID, like: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
                    $(this).find('input').addClass('input-holder').addClass('border-bottom-red');
                    checkValid = false;
                    console.log('7');
                } else if (validateIdentifier($(this).find('input').val()) == false) {
                    $(this).find('input').val('');
                    $(this).find('input').attr('placeholder', 'Enter valid OneSignal App ID, like: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
                    $(this).find('input').addClass('input-holder').addClass('border-bottom-red');
                    checkValid = false;
                    console.log('8');
                } else {
                    $(this).find('input').removeClass('input-holder').removeClass('border-bottom-red');
                }
            } else if (rules.toLowerCase() == "wordpressurl") {
                var val = $(this).find('input').val();
                if (val == '') {
                    $(this).find('input').attr('placeholder', 'Enter valid URL to your wordpress, like: http(s)://your_website.com');
                    $(this).find('input').addClass('input-holder').addClass('border-bottom-red');
                    checkValid = false;
                    console.log('9');
                } else if (ValidURL(val) == false) {
                    $(this).find('input').val('');
                    $(this).find('input').attr('placeholder', 'Enter valid URL to your wordpress, like: http(s)://your_website.com');
                    $(this).find('input').addClass('input-holder').addClass('border-bottom-red');
                    checkValid = false;
                    console.log('10');
                } else {
                    $(this).find('input').removeClass('input-holder').removeClass('border-bottom-red');
                }
            } else {
                $(this).find('input').removeClass('input-holder').removeClass('border-bottom-red');
            }
        });

        if (checkValid == false) {
            return false;
        } else {
            return true;
        }
    }

    $('#btn-setting-app-dash').click(() => {

        console.log(validateForm_setting_app());
        if (validateForm_setting_app() == true) {
            $('#loading').show();
            var obj = {};
            $.ajax({
                url: "/dashboard/setting-app",
                type: "POST",
                data: $("#fmSetting").serialize(),
                success: function(result) {
                    if (result.status == 1) {
                        console.log('Success');
                        console.log(result);
                        if (result.platformApp == 'android') {
                            $('#idappadminandroid').val(result.idAppAdmin);
                            $('#versionadminandroid').val(result.versionAdmin);
                            $('#idappuserandroid').val(result.idUser);

                            $('#dialog-setting-app-dashboard').fadeOut();
                            $('#dialog-build-android-dashboard').fadeIn();
                        } else {
                            $('#idappadminios').val(result.idAppAdmin);
                            $('#versionadminios').val(result.versionAdmin);
                            $('#idappuserios').val(result.idUser);
                            $('#dialog-setting-app-dashboard').fadeOut();
                            $('#dialog-build-ios-dashboard').fadeIn();
                        }
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
            }).always(function(data) {

                $('#loading').hide();
            });
        }
    })
})