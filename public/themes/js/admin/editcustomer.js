$(document).ready(() => {

    function validateEmail(email) {
        var str = /^[a-z][a-zA-Z0-9_.]*(\.[a-zA-Z][a-zA-Z0-9_.]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/;
        return str.test(email);
    }

    function validateForm_edit_customer() {
        var check;
        var checkMail = validateEmail($('#email').val());

        if ($('#firstname').val() == "") {
            $('#firstname').attr('placeholder', 'First name can not be empty ');
            $('#firstname').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-firstname').removeClass('display-none').addClass('display-inline');
            check = false;
        } else {
            $('#firstname').removeClass('input-holder').removeClass('border-bottom-red');
            $('#icon-err-firstname').removeClass('display-inline').addClass('display-none');
        }
        if ($('#lastname').val() == "") {
            $('#lastname').attr('placeholder', 'Last name can not be empty ');
            $('#lastname').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-lastname').removeClass('display-none').addClass('display-inline');
            check = false;
        } else {
            $('#lastname').removeClass('input-holder').removeClass('border-bottom-red');
            $('#icon-err-lastname').removeClass('display-inline').addClass('display-none');
        }
        if ($('#username').val() == "") {
            $('#username').attr('placeholder', 'Username can not be empty ');
            $('#username').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-username').removeClass('display-none').addClass('display-inline');
            check = false;
        } else {
            $('#username').removeClass('input-holder').removeClass('border-bottom-red');
            $('#icon-err-username').removeClass('display-inline').addClass('display-none');
        }
        if ($('#email').val() == "") {
            $('#email').attr('placeholder', 'Email can not be empty ');
            $('#email').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-email').removeClass('display-none').addClass('display-inline');
            check = false;
        } else if (checkMail == false) {
            check = false;
            $('#email').val('');
            $('#email').attr('placeholder', 'Email invalid');
            $('#email').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-email').removeClass('display-none').addClass('display-inline');
        } else {
            $('#email').removeClass('input-holder').removeClass('border-bottom-red');
            $('#icon-err-email').removeClass('display-inline').addClass('display-none');
        }
        if ($('#password').val() == "") {
            $('#password').attr('placeholder', 'Password can not be empty ');
            $('#password').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-password').removeClass('display-none').addClass('display-inline');
            check = false;
        } else {
            $('#password').removeClass('input-holder').removeClass('border-bottom-red');
            $('#icon-err-password').removeClass('display-inline').addClass('display-none');
        }
        if ($('#confirmpassword').val() == "") {
            $('#confirmpassword').attr('placeholder', 'Confirm password can not be empty ');
            $('#confirmpassword').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-confirmpassword').removeClass('display-none').addClass('display-inline');
            check = false;
        } else if ($('#confirmpassword').val() != $('#password').val()) {
            check = false;
            $('#confirmpassword').val('');
            $('#confirmpassword').attr('placeholder', 'Confirm Password not match Password ');
            $('#confirmpassword').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-confirmpassword').removeClass('display-none').addClass('display-inline');
        } else {
            $('#confirmpassword').removeClass('input-holder').removeClass('border-bottom-red');
            $('#icon-err-confirmpassword').removeClass('display-inline').addClass('display-none');
        }

        if ($('#address').val() == "") {
            $('#address').attr('placeholder', 'Address can not be empty ');
            $('#address').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-address').removeClass('display-none').addClass('display-inline');
            check = false;
        } else {
            $('#address').removeClass('input-holder').removeClass('border-bottom-red');
            $('#icon-err-address').removeClass('display-inline').addClass('display-none');
        }
        if ($('#zipcode').val() == "") {
            $('#zipcode').attr('placeholder', 'zipcode can not be empty ');
            $('#zipcode').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-zipcode').removeClass('display-none').addClass('display-inline');
            check = false;
        } else {
            $('#zipcode').removeClass('input-holder').removeClass('border-bottom-red');
            $('#icon-err-zipcode').removeClass('display-inline').addClass('display-none');
        }
        // alert(checkMail);
        if (check == false) {
            return false
        }
        return true;
    }

    $('#btn-edit-customer').click(() => {
        // alert($('#slecountry').val());
        if (validateForm_edit_customer() == true) {
            $('#loading').show();
            $.ajax({
                type: "POST",
                url: "/admin/customer/edit",
                dataType: "json",
                data: {
                    id: $('#idcustomer').val(),
                    firstname: $('#firstname').val(),
                    lastname: $('#lastname').val(),
                    username: $('#username').val(),
                    email: $('#email').val(),
                    password: $('#password').val(),
                    confirmpassword: $('#confirmpassword').val(),
                    address: $('#address').val(),
                    zipcode: $('#zipcode').val(),
                    country: $('#slecountry').val(),
                },
                success: (data) => {
                    if (data.status == 1) {
                        $('#successPopup').show();
                        $('.contenemail').text('Update success.');
                        // window.location.href = "/admin/customer";
                    } else if (data.status == 2) {
                        $('#errPopup').show();
                        $('.alert-upload').text(data.msg[0].msg);
                    } else {
                        $('#errPopup').show();
                        $('.alert-upload').text(data.msg);
                    }
                }
            }).always(function(data) {
                $('#loading').hide();
            });
        }
    })
});