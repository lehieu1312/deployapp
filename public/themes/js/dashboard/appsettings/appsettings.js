$(document).ready(function() {
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
            //   $('#loading').show();
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
        var checkValid;
        // $(".form-group").each(function() {
        var rules = $(this).find('input').attr("rules");
        var require = $(this).find('input').prop("required");

        if (require == true && $(this).find('input').val() == '' && rules.toLowerCase() == "string") {
            //   $(this).find('input').val('');
            $(this).find('input').attr('placeholder', '');
            $(this).find('input').addClass('input-holder').addClass('border-bottom-red');
            //   $(this).find('#icon-err').removeClass('display-none').addClass('display-inline');
            checkValid = false;
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
                //   $(this).find('#icon-err').removeClass('display-none').addClass('display-inline');
                checkValid = false;

            } else {
                $(this).find('input').removeClass('input-holder').removeClass('border-bottom-red');
            }
        } else if (rules.toLowerCase() == "email") {
            var checkmail = validateEmail($(this).find('input').val());
            if ($(this).find('input').val() == '') {
                $(this).find('input').attr('placeholder', 'Enter valid email');
                $(this).find('input').addClass('input-holder').addClass('border-bottom-red');
            } else if (checkmail == false) {
                $(this).find('input').val('');
                $(this).find('input').attr('placeholder', 'Enter valid email');
                $(this).find('input').addClass('input-holder').addClass('border-bottom-red');
                //   $(this).find('#icon-err').removeClass('display-none').addClass('display-inline');
                checkValid = false;

            } else {
                $(this).find('input').removeClass('input-holder').removeClass('border-bottom-red');
                //   $(this).find('#icon-err').removeClass('display-inline').addClass('display-none');
                //   $(this).find('.help-block').html('');
                //   $(this).removeClass('has-error').addClass('has-success');
            }

        } else if (rules.toLowerCase() == "number") {
            var val = $(this).find('input').val();
            var checkNumber = isNumber(val);

            if (val == '') {
                $(this).find('input').attr('placeholder', 'Enter valid number [0-9]');
                $(this).find('input').addClass('input-holder').addClass('border-bottom-red');
                checkValid = false;
            } else if (checkNumber == false) {
                $(this).find('input').val('');
                $(this).find('input').attr('placeholder', 'Enter valid number [0-9]');
                $(this).find('input').addClass('input-holder').addClass('border-bottom-red');
                //   $(this).find('#icon-err').removeClass('display-none').addClass('display-inline');
                checkValid = false;

                // $(this).focus();
            } else {
                $(this).find('input').removeClass('input-holder').removeClass('border-bottom-red');
                //   $(this).find('#icon-err').removeClass('display-inline').addClass('display-none');
            }

        } else if (rules.toLowerCase() == "onesignalid") {
            if ($(this).find('input').val() == '') {
                $(this).find('input').attr('placeholder', 'Enter valid OneSignal App ID, like: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
                $(this).find('input').addClass('input-holder').addClass('border-bottom-red');
                checkValid = false;
            } else if (validateIdentifier($(this).find('input').val()) == false) {
                $(this).find('input').val('');
                $(this).find('input').attr('placeholder', 'Enter valid OneSignal App ID, like: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
                $(this).find('input').addClass('input-holder').addClass('border-bottom-red');
                //   $(this).find('#icon-err').removeClass('display-none').addClass('display-inline');
                checkValid = false;

                // $(this).focus();
            } else {
                $(this).find('input').removeClass('input-holder').removeClass('border-bottom-red');
                //   $(this).find('#icon-err').removeClass('display-inline').addClass('display-none');
            }

        } else if (rules.toLowerCase() == "wordpressurl") {
            var val = $(this).find('input').val();

            if (val == '') {
                $(this).find('input').attr('placeholder', 'Enter valid URL to your wordpress, like: http(s)://your_website.com');
                $(this).find('input').addClass('input-holder').addClass('border-bottom-red');
                checkValid = false;
            } else if (ValidURL(val) == false) {
                $(this).find('input').val('');
                $(this).find('input').attr('placeholder', 'Enter valid URL to your wordpress, like: http(s)://your_website.com');
                $(this).find('input').addClass('input-holder').addClass('border-bottom-red');
                checkValid = false;
            } else {
                $(this).find('input').removeClass('input-holder').removeClass('border-bottom-red');
            }
        } else {
            $(this).find('input').removeClass('input-holder').removeClass('border-bottom-red');
            //   $(this).find('#icon-err').removeClass('display-inline').addClass('display-none');
        }
        // });

        if (checkValid == false) {
            return false;
        } else {
            return true;
        }
    }

    function checkAppSetting() {
        var checkApp = true;

        if ($('#packageid').val() == '') {
            $('#packageid').attr('placeholder', 'This ID uniquely identifies your app on the device and in Google Play, like: com.example.myapp');
            $('#packageid').addClass('input-holder').addClass('border-bottom-red');
            checkValid = false;
        } else if (validPackageID($('#packageid').val()) == false) {
            $('#packageid').val('');
            $('#packageid').attr('placeholder', 'This ID uniquely identifies your app on the device and in Google Play, like: com.example.myapp');
            $('#packageid').addClass('input-holder').addClass('border-bottom-red');
            checkValid = false;
        } else {
            $('#packageid').removeClass('input-holder').removeClass('border-bottom-red');
        }
        if ($('#appname').val() == "") {
            $('#appname').val('');
            $('#appname').attr('placeholder', 'Can not be empty');
            $('#appname').addClass('input-holder').addClass('border-bottom-red');
            checkApp = false;
        } else {
            $('#appname').removeClass('input-holder').removeClass('border-bottom-red');
        }
        if ($('#version').val() == "") {
            $('#version').val('');
            $('#version').attr('placeholder', 'Can not be empty');
            $('#version').addClass('input-holder').addClass('border-bottom-red');
            checkApp = false;
        } else {
            $('#version').removeClass('input-holder').removeClass('border-bottom-red');
        }
        if ($('#description').val() == "") {
            $('#description').val('');
            $('#description').attr('placeholder', 'Can not be empty');
            $('#description').addClass('input-holder').addClass('border-bottom-red');
            checkApp = false;
        } else {
            $('#description').removeClass('input-holder').removeClass('border-bottom-red');
        }
        if ($('#email').val() == "") {
            $('#email').val('');
            $('#email').attr('placeholder', 'Can not be empty');
            $('#email').addClass('input-holder').addClass('border-bottom-red');
            checkApp = false;
        } else if (validateEmail($('#email').val()) == false) {
            $('#email').val('');
            $('#email').attr('placeholder', 'Enter valid email');
            $('#email').addClass('input-holder').addClass('border-bottom-red');
            checkApp = false;
        } else {
            $('#email').removeClass('input-holder').removeClass('border-bottom-red');
        }
        if ($('#href').val() == "") {
            $('#href').val('');
            $('#href').attr('placeholder', 'Can not be empty');
            $('#href').addClass('input-holder').addClass('border-bottom-red');
            checkApp = false;
        } else if (ValidURL($('#href').val()) == false) {
            $('#href').val('');
            $('#href').attr('placeholder', 'Enter valid URL to your wordpress, like: http(s)://your_website.com');
            $('#href').addClass('input-holder').addClass('border-bottom-red');
            checkApp = false;
        } else {
            $('#href').removeClass('input-holder').removeClass('border-bottom-red');
        }

        if ($('#auth').val() == "") {
            $('#auth').val('');
            $('#auth').attr('placeholder', 'Can not be empty');
            $('#auth').addClass('input-holder').addClass('border-bottom-red');
            checkApp = false;
        } else {
            $('#auth').removeClass('input-holder').removeClass('border-bottom-red');
        }

        if ($('#onesignalapikey').val() == "") {
            $('#onesignalapikey').val('');
            $('#onesignalapikey').attr('placeholder', 'Can not be empty');
            $('#onesignalapikey').addClass('input-holder').addClass('border-bottom-red');
            checkApp = false;
        } else {
            $('#onesignalapikey').removeClass('input-holder').removeClass('border-bottom-red');
        }


        if ($('#onesignalappid').val() == "") {
            $('#onesignalappid').val('');
            $('#onesignalappid').attr('placeholder', 'Can not be empty');
            $('#onesignalappid').addClass('input-holder').addClass('border-bottom-red');
            checkApp = false;
        } else {
            $('#onesignalappid').removeClass('input-holder').removeClass('border-bottom-red');
        }


        if ($('#onesignalid').val() == "") {
            $('#onesignalid').val('');
            $('#onesignalid').attr('placeholder', 'Can not be empty');
            $('#onesignalid').addClass('input-holder').addClass('border-bottom-red');
            checkApp = false;
        } else {
            $('#onesignalid').removeClass('input-holder').removeClass('border-bottom-red');
        }
        if ($('#onesignalapikey').val() == "") {
            $('#onesignalapikey').val('');
            $('#onesignalapikey').attr('placeholder', 'Can not be empty');
            $('#onesignalapikey').addClass('input-holder').addClass('border-bottom-red');
            checkApp = false;
        } else {
            $('#onesignalapikey').removeClass('input-holder').removeClass('border-bottom-red');
        }
        if ($('#onesignaluserid').val() == "") {
            $('#onesignaluserid').val('');
            $('#onesignaluserid').attr('placeholder', 'Can not be empty');
            $('#onesignaluserid').addClass('input-holder').addClass('border-bottom-red');
            checkApp = false;
        } else {
            $('#onesignaluserid').removeClass('input-holder').removeClass('border-bottom-red');
        }
        if (checkApp == false)
            return false;

        return true;
    }
    //   btn-setting-app
    $('#btn-save-setting-app').click(function() {
        if (checkAppSetting() == true) {
            var obj = {};
            console.log('send form');
            $.ajax({
                url: "/dashboard/appsettings",
                type: "POST",
                data: $("#fSettingApps").serialize(),
                //  processData: false,
                //contentType: false,
                success: function(result) {
                    if (result.status == 1) {
                        console.log(result.content);
                        $('.successPopup').show();
                        $('.contenemail').html('SAVED');
                        $("#success-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                            $("#success-alert").slideUp(1000);
                            $('.successPopup').hide();
                        });
                        // $('.errPopup').show();
                        // $('.alert-upload').html('Saved');
                    } else if (result.status == 2) {
                        $('.errPopup').show();
                        $('.alert-upload').html(result.content[0]['msg']);

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

    //   function send_data_setting() {}
    $(function() {
        $('.editor').froalaEditor()
    });
});