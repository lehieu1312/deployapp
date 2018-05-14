$(document).ready(() => {
    function validateForm_send_noti() {
        var check;
        if ($('#titlenoti').val() == "") {
            $('#titlenoti').attr('placeholder', 'Title can not be empty ');
            $('#titlenoti').addClass('input-holder').addClass('border-bottom-red');
            // $('#icon-err-firstname').removeClass('display-none').addClass('display-inline');
            check = false;
        } else {
            $('#titlenoti').removeClass('input-holder').removeClass('border-bottom-red');
            // $('#icon-err-firstname').removeClass('display-inline').addClass('display-none');
        }
        if ($('#contentsendnoti').val() == "") {
            $('#contentsendnoti').attr('placeholder', 'Content can not be empty ');
            $('#contentsendnoti').addClass('input-holder').addClass('border-bottom-red');
            // $('#icon-err-lastname').removeClass('display-none').addClass('display-inline');
            check = false;
        } else {
            $('#contentsendnoti').removeClass('input-holder').removeClass('border-bottom-red');
            // $('#icon-err-lastname').removeClass('display-inline').addClass('display-none');
        }
        if (check == false) {
            return false
        }
        return true;
    }
    $('#sendnotitouser').click(() => {
        if (validateForm_send_noti() == true) {
            $('#loading').show();
            $.ajax({
                type: "POST",
                url: "/admin/membership/send-noti-to-user",
                dataType: "json",
                data: {
                    iduser: $('#idcustomer').val(),
                    title: $('#firstname').val(),
                    content: $('#lastname').val(),
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
    });
});

function opendialogsendnoti(id) {
    // alert(id);
    $('#idusersendnoti').val(id);
    $('#myModa-sendnoti').modal();
}