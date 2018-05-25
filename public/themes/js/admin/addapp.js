$(document).ready(() => {
    $('#boxdiv-choose-file').on('click', function() {
        $('#image-app').click();
    });
    $(".button-close-notification").click(() => {
        $(".errPopup").fadeOut();
    });
    $('#btn-delete-file').click(() => {
        $('#img-of-app').removeAttr('src');
        $('#img-of-app').hide();
    });
    $('#btn-choose-file').click(() => {
        $('#image-app-edit').click();
    });
    $('#image-app-edit').on('change', function() {
        var files = $(this).get(0).files;
        $('#text-file-image').html(files[0].name + ' (' + formatBytes(files[0].size) + ')');
    });
});

function checkFormAddApp() {
    var check;
    var image_file = $('#image-app').get(0).files[0];
    // console.log(image_file);
    if ($('#appname').val() == "") {
        $('#appname').attr('placeholder', 'App name can not be empty ');
        $('#appname').addClass('input-holder').addClass('border-bottom-red');
        $('#icon-err-appname').removeClass('display-none').addClass('display-inline');
        check = false;
    } else {
        $('#appname').removeClass('input-holder').removeClass('border-bottom-red');
        $('#icon-err-appname').removeClass('display-inline').addClass('display-none');
    }
    if ($('#versionapp').val() == "") {
        $('#versionapp').attr('placeholder', 'Version can not be empty ');
        $('#versionapp').addClass('input-holder').addClass('border-bottom-red');
        $('#icon-err-versionapp').removeClass('display-none').addClass('display-inline');
        check = false;
    } else {
        $('#versionapp').removeClass('input-holder').removeClass('border-bottom-red');
        $('#icon-err-versionapp').removeClass('display-inline').addClass('display-none');
    }
    if (typeof image_file === 'undefined') {
        console.log('anhr chuwa chon');
        $('#icon-err-imagefile').html('Please choose the image file ');
        $('#icon-err-imagefile').css('color', "red");
        $('#icon-err-imagefile').removeClass('display-none').addClass('display-inline');
        // $('#imagefile').addClass('input-holder').addClass('border-bottom-red');
        // $('#icon-err-imagefile').removeClass('display-none').addClass('display-inline');
        check = false;
    } else {
        // $('#imagefile').removeClass('input-holder').removeClass('border-bottom-red');
        $('#icon-err-imagefile').removeClass('display-inline').addClass('display-none');
    }

    if (check == false) {
        return false;
    }
    return true;
}

$('#btn-add-apps').click(() => {
    if (checkFormAddApp() == true) {
        var formData = new FormData();
        var image_file = $('#image-app').get(0).files[0];
        formData.append('appname', $('#appname').val());
        formData.append('imagefile', image_file, image_file.name);
        formData.append('versionapp', $('#versionapp').val());
        formData.append('listprice', $('#listprice').val());
        formData.append('priceapp', $('#priceapp').val());
        formData.append('description', CKEDITOR.instances.description.getData());
        // console.log(CKEDITOR.instances.description.getData());
        $('#loading').show();
        console.log(image_file);
        $.ajax({
            url: "/admin/apps/addapp",
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
                    $('.contenemail').html('Add Success');
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
            error: function(jqXHR, exception) {
                $('.errPopup').show();
                $('.alert-upload').html('Oops, something went wrong');
            }
        }).always(function(data) {
            $('#loading').hide();
        });
    }
})

function formatBytes(a, b) {
    if (0 == a) return "0 Bytes";
    var c = 1e3,
        d = b || 2,
        e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        f = Math.floor(Math.log(a) / Math.log(c));
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
}
$('#image-app').on('change', function() {
    var files = $(this).get(0).files;
    $('#text-file-image').html(files[0].name + ' (' + formatBytes(files[0].size) + ')');
})

function checkFormEditApp() {
    var check;
    var image_file = $('#image-app-edit').get(0).files[0];
    // console.log(image_file);
    if ($('#appname').val() == "") {
        $('#appname').attr('placeholder', 'App name can not be empty ');
        $('#appname').addClass('input-holder').addClass('border-bottom-red');
        $('#icon-err-appname').removeClass('display-none').addClass('display-inline');
        check = false;
    } else {
        $('#appname').removeClass('input-holder').removeClass('border-bottom-red');
        $('#icon-err-appname').removeClass('display-inline').addClass('display-none');
    }
    if ($('#versionapp').val() == "") {
        $('#versionapp').attr('placeholder', 'Version can not be empty ');
        $('#versionapp').addClass('input-holder').addClass('border-bottom-red');
        $('#icon-err-versionapp').removeClass('display-none').addClass('display-inline');
        check = false;
    } else {
        $('#versionapp').removeClass('input-holder').removeClass('border-bottom-red');
        $('#icon-err-versionapp').removeClass('display-inline').addClass('display-none');
    }
    // if (typeof image_file === 'undefined') {
    //     console.log('anhr chuwa chon');
    //     $('#icon-err-imagefile').html('Please choose the image file ');
    //     $('#icon-err-imagefile').css('color', "red");
    //     $('#icon-err-imagefile').removeClass('display-none').addClass('display-inline');
    //     // $('#imagefile').addClass('input-holder').addClass('border-bottom-red');
    //     // $('#icon-err-imagefile').removeClass('display-none').addClass('display-inline');
    //     check = false;
    // } else {
    //     // $('#imagefile').removeClass('input-holder').removeClass('border-bottom-red');
    //     $('#icon-err-imagefile').removeClass('display-inline').addClass('display-none');
    // }

    if (check == false) {
        return false;
    }
    return true;
}

$('#btn-edit-apps').click(() => {
    if (checkFormEditApp() == true) {
        var formData = new FormData();
        var image_file = $('#image-app-edit').get(0).files[0];
        console.log(image_file);
        formData.append('idapp', $('#idapp').val());
        formData.append('appname', $('#appname').val());

        if (typeof image_file != 'undefined')
            formData.append('imagefile', image_file, image_file.name);
        else
            formData.append('imagefile', '');

        formData.append('versionapp', $('#versionapp').val());
        formData.append('listprice', $('#listprice').val());
        formData.append('priceapp', $('#priceapp').val());
        formData.append('description', CKEDITOR.instances.description.getData());
        // console.log(CKEDITOR.instances.description.getData());
        $('#loading').show();

        $.ajax({
            url: "/admin/apps/editapp",
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
                    $('.contenemail').html('Edit Success');
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
            error: function(jqXHR, exception) {
                $('.errPopup').show();
                $('.alert-upload').html('Oops, something went wrong');
            }
        }).always(function(data) {
            $('#loading').hide();
        });
    }
});