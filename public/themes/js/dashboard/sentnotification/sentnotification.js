$(document).ready(() => {
    var delete_noti = document.getElementsByClassName("delete-noti");
    var idApp = $("#idapp-using").val();
    $(body).click(() => {
        $(".delete-noti").hide();
    })
    $('.deleteuser').each(function (i) {
        $(this).click((e) => {
            // alert("abc")
            if (delete_noti[i].style.display == "none") {
                delete_noti[i].style.display = "block";
            } else {
                delete_noti[i].style.display = "none";
            }
            e.stopPropagation();
        })
    })
    var id_noti = document.getElementsByClassName("value-id-noti");
    var id_noti_del;
    var setNumberNoti;
    $(".delete-noti").each(function (i) {
        $(this).click(() => {
            id_noti_del = id_noti[i].value
            setNumberNoti = i;
            console.log(id_noti_del)
        })
    })
    var tr_noti = document.getElementsByClassName("tr-content-appversion");
    $("#delete-ok").click(() => {
        tr_noti[setNumberNoti].style.display = "none";
        $('#loading').show();
        $.ajax({
            url: "/dashboard/notifiction/sentnotification/delete/" + idApp,
            data: {
                id: id_noti_del
            },
            dataType: "json",
            type: 'POST',
            success: function (data) {
                if (data.status == 1) {
                    $('#successPopup').show(500);
                    $(".contenemail").text("");
                    $(".contenemail").text("Deleted!");
                    $("#success-alert").fadeTo(5000, 1000).slideUp(1000, function () {
                        $("#success-alert").slideUp(1000);
                        $('.successPopup').hide();
                    });
                } else if (data.status == 2) {
                    $('#errPopup').show();
                    $('.alert-upload').text(data.message);
                    $("#errPopup").fadeTo(5000, 1000).slideUp(1000, function () {
                        $("#errPopup").slideUp(1000);
                        $('#errPopup').hide();
                    });
                }

            }
        }).always(() => {
            $('#mymodal-delete-noti').modal('hide');
            $('#loading').hide();
        })
    })
})