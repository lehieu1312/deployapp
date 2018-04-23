$(document).ready(function() {

    function validateEmail(email) {
        var str = /^[a-z][a-zA-Z0-9_.]*(\.[a-zA-Z][a-zA-Z0-9_.]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/;
        return str.test(email);
    }

    function formatBytes(a, b) {
        if (0 == a) return "0 Bytes";
        var c = 1e3,
            d = b || 2,
            e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
            f = Math.floor(Math.log(a) / Math.log(c));
        return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
    }

    function validateForm_build_ios() {
        // var checkmail = validateEmail($('#email').val());
        var check;
        if (validateEmail($('#email').val()) == false || $('#email').val() == "") {
            $('#email').val('');
            $('#email').attr('placeholder', 'Please enter a valid email address');
            $('#email').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-email').removeClass('display-none').addClass('display-inline');
            check = false;
        }
        if (check == false) {
            return false
        }
        return true;
    }
    $('#btn-deploy-ios').click(() => {
        // if (validateForm_build_ios() == true) {

        var obj = {};
        var formData = new FormData();
        var adhoc_file = $('#provision-adhoc').get(0).files[0];
        var appstore_file = $('#provision-appstore').get(0).files[0];
        var certificate_file_adhoc = $('#certificate-file-adhoc').get(0).files[0];
        var certificate_file_appstore = $('#certificate-file-appstore').get(0).files[0];
        console.log(adhoc_file);
        console.log(appstore_file);
        console.log(certificate_file_adhoc);
        console.log(certificate_file_appstore);
        // formData.append('platform', $('#platform').val());
        // formData.append('version', $('#version').val());
        // formData.append('idapp', $('#idapp').val());
        // formData.append('idappuser', $('#idappuser').val());

        // platform: $('#platform').val(),
        // version: $('#version').val(),
        // idapp: $('#idapp').val(),
        // idappuser: $('#idappuser').val(),
        // formData.append('email', $('#email').val());

        var caseOne, caseTwo, caseThree;
        var checkForm = false;
        // if (typeof certificate_file_appstore == 'undefined') {
        //     console.log('day la value null');
        // }
        if (typeof appstore_file != 'undefined' && typeof certificate_file_appstore != 'undefined' &&
            typeof adhoc_file != 'undefined' && typeof certificate_file_adhoc != 'undefined') {
            caseThree = true;
            if (adhoc_file.size > 5000000) {
                $('.errPopup').show();
                $('.alert-upload').html('The "' + adhoc_file.name + '" is too large.Please upload a file less than or equal to 5MB.');
                // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                //     $("#danger-alert").slideUp(1000);
                //     $('.errPopup').hide();
                // });
                checkForm = false;
            } else if (adhoc_file.name.split('.').pop() != 'mobileprovision') {
                $('.errPopup').show();
                $('.alert-upload').html('Please upload a file with a valid extension (*.mobileprovision)');
                // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                //     $("#danger-alert").slideUp(1000);
                // });
                checkForm = false;
            } else if (certificate_file_adhoc.size > 5000000) {
                $('.errPopup').show();
                $('.alert-upload').html('The "' + certificate_file_adhoc.name + '" is too large.Please upload a file less than or equal to 5MB.');
                // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                //     $("#danger-alert").slideUp(1000);
                //     $('.errPopup').hide();
                // });
                checkForm = false;
            } else if (certificate_file_adhoc.name.split('.').pop() != 'p12') {
                $('.errPopup').show();
                $('.alert-upload').html('Please upload a file with a valid extension (*.p12)');
                // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                //     $("#danger-alert").slideUp(1000);
                // });
                checkForm = false;
            } else if (appstore_file.size > 5000000) {
                $('.errPopup').show();
                $('.alert-upload').html('The "' + appstore_file.name + '" is too large.Please upload a file less than or equal to 5MB.');
                // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                //     $("#danger-alert").slideUp(1000);
                //     $('.errPopup').hide();
                // });
                checkForm = false;
            } else if (certificate_file_appstore.size > 5000000) {
                $('.errPopup').show();
                $('.alert-upload').html('The "' + certificate_file_appstore.name + '" is too large.Please upload a file less than or equal to 5MB.');
                // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                //     $("#danger-alert").slideUp(1000);
                //     $('.errPopup').hide();
                // });
                checkForm = false;
            } else if (appstore_file.name.split('.').pop() != 'mobileprovision') {
                $('.errPopup').show();
                $('.alert-upload').html('Please upload a file with a valid extension (*.mobileprovision).');
                // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                //     $("#danger-alert").slideUp(1000);
                // });
                checkForm = false;
            } else if (certificate_file_appstore.name.split('.').pop() != 'p12') {
                $('.errPopup').show();
                $('.alert-upload').html('Please upload a file with a valid extension (*.p12)');
                // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                //     $("#danger-alert").slideUp(1000);
                // });
                checkForm = false;
            } else if ($('#platform').val() == "") {
                $('.errPopup').show();
                $('.alert-upload').html('Platform is require.');
            } else if ($('#version').val() == "") {
                $('.errPopup').show();
                $('.alert-upload').html('Version is require.');
            } else if ($('#idapp').val() == "") {
                $('.errPopup').show();
                $('.alert-upload').html('App ID is require.');
            } else if ($('#idappuser').val() == "") {
                $('.errPopup').show();
                $('.alert-upload').html('User App ID is require.');
            } else {
                checkForm = true;
                formData.append('provisionfile_adhoc', adhoc_file, adhoc_file.name);
                formData.append('certificatefile_adhoc', certificate_file_adhoc, certificate_file_adhoc.name);
                formData.append('provisionfile_appstore', appstore_file, appstore_file.name);
                formData.append('certificatefile_appstore', certificate_file_appstore, certificate_file_appstore.name);
                formData.append('platform', $('#platform').val());
                formData.append('version', $('#version').val());
                formData.append('idapp', $('#idapp').val());
                formData.append('idappuser', $('#idappuser').val());

            }
        } else {
            $('.errPopup').show();
            $('.alert-upload').html('You must upload all files in "App to the Testing" section and all files in "App to the App Store" section');
            // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
            //     $("#danger-alert").slideUp(1000);
            // });
            checkForm = false;
        }

        if (checkForm == false) {
            return;
        } else {
            $('#loading').show();
            $.ajax({
                url: "/dashboard/deployapp-ios-dash",
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                datatype: "json",
                success: function(result) {
                    if (result.status == 1) {
                        console.log(result);
                        $('.errPopup').hide();
                        $('.successPopup').show();
                        $('.contenemail').html("Success");
                        // location.href = "/success-ios/" + result.keyFolder
                    } else if (result.status == 2) {
                        $('.errPopup').show();
                        $('.alert-upload').html(result.content[0]['msg']);
                    } else if (result.status == 3) {
                        $('.errPopup').show();
                        $('.alert-upload').html(result.content);
                    } else {
                        console.log('result: ' + result);
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
            // }
        }
    })
});