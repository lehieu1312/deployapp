$(document).ready(() => {
    $(".button-close-notification").click(() => {
        $(".errPopup").fadeOut();
    })

    function checkFormAddVersion() {
        var check;
        var appFile = $('#source-app-fle').get(0).files[0];
        if ($('#lastversion').val() == "") {
            $('#lastversion').attr('placeholder', 'Last version can not be empty ');
            $('#lastversion').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-lastversion').removeClass('display-none').addClass('display-inline');
            check = false;
        } else {
            $('#lastversion').removeClass('input-holder').removeClass('border-bottom-red');
            $('#icon-err-lastversion').removeClass('display-inline').addClass('display-none');
        }
        if ($('#txtchangelog').val() == "") {
            $('#txtchangelog').attr('placeholder', 'Change log can not be empty ');
            $('#txtchangelog').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-changelog').removeClass('display-none').addClass('display-inline');
            check = false;
        } else {
            $('#txtchangelog').removeClass('input-holder').removeClass('border-bottom-red');
            $('#icon-err-changelog').removeClass('display-inline').addClass('display-none');
        }
        if (typeof appFile == 'undefined') {
            // console.log('anhr chuwa chon');
            $('#icon-err-imagefile').html('Please choose the app file ');
            $('#icon-err-imagefile').css('color', "red");
            $('#icon-err-imagefile').removeClass('display-none').addClass('display-inline');
            // $('#imagefile').addClass('input-holder').addClass('border-bottom-red');
            // $('#icon-err-imagefile').removeClass('display-none').addClass('display-inline');
            check = false;
        } else {
            // $('#imagefile').removeClass('input-holder').removeClass('border-bottom-red');
            $('#icon-err-imagefile').removeClass('display-inline').addClass('display-none');
        }
        if (check == false)
            return false;
        return true;
    }
    $('#btn-add-versionapp').click(() => {
        if (checkFormAddVersion() == true) {
            // alert('1');
            var formData = new FormData();
            var appFile = $('#source-app-fle').get(0).files[0];
            formData.append('idapp', $('#sidapp').val());
            formData.append('lastversion', $('#lastversion').val());
            formData.append('appfile', appFile, appFile.name);
            formData.append('changelog', $('#txtchangelog').val());
            $('#loading').show();
            $.ajax({
                url: "/admin/apps/version/add",
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
                        $('.contenemail').html('Add Version Success');
                        // location.href = "/success-ios/" + result.keyFolder;
                    } else if (result.status == 2) {
                        $('.successPopup').hide();
                        $('.errPopup').show();
                        $('.alert-upload').html(result.msg[0]['msg']);
                    } else if (result.status == 3) {
                        $('.successPopup').hide();
                        $('.errPopup').show();
                        $('.alert-upload').html(result.msg);
                    } else {
                        $('.successPopup').hide();
                        $('.errPopup').show();
                        $('.alert-upload').html('Oops, something went wrong');
                    }
                },
                xhr: function() {
                    var xhr;
                    // create an XMLHttpRequest
                    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
                        xhr = new XMLHttpRequest();
                    } else { // code for IE6, IE5
                        xhr = new ActiveXObject("Microsoft.XMLHTTP");
                    }
                    // var xhr = new XMLHttpRequest();
                    // listen to the 'progress' event
                    xhr.upload.addEventListener('progress', function(evt) {
                        var str = "";
                        if (evt.lengthComputable) {
                            // calculate the percentage of upload completed
                            var percentComplete = evt.loaded / evt.total;
                            percentComplete = parseInt(percentComplete * 100);
                            console.log(percentComplete);
                            // update the Bootstrap progress bar with the new percentage
                            // $('.progress-bar').text(percentComplete + '%');

                            // $('.progress-bar').width(percentComplete + '%');
                            // once the upload reaches 100%, set the progress bar text to done

                        }
                    }, false);
                    return xhr;
                },
                error: function(jqXHR, exception) {
                    $('.errPopup').show();
                    $('.alert-upload').html('Oops, something went wrong');
                }
            }).always(function(data) {
                $('#loading').hide();
            });

        }
        // alert('1');
    });
    $('#source-app-fle').on('change', function(e) {
        // var label = $('#provision-adhoc').nextElementSibling;
        // console.log('1asdasd');
        var fileName = '';
        fileName = e.target.value.split(/(\\|\/)/g).pop();
        // console.log(fileName);
        if (fileName) {
            // console.log('1');
            $('#text-prod-file-zip').html(fileName);
        } else {
            $('#text-prod-file-zip').html('*.zip');
        }

    });
});