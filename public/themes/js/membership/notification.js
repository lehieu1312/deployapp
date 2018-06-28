$(document).ready(() => {
    var selected = [];
    var delete_noti;
    var styledelete;
    var btndelete = document.getElementsByClassName("deleteuser");
    var deleteuser = document.getElementsByClassName("delete-user");
    var elementdelete = document.getElementsByClassName("element-delete");
    var iddelete = document.getElementsByClassName("id-noti");
    var trmyteam = document.getElementsByClassName('tr-content-appversion');
    var email;
    var settr;
    for (let i = 0; i < $('.deleteuser').length; i++) {
        btndelete[i].addEventListener('click', (event) => {
            if (deleteuser[i].style.display === "none") {
                deleteuser[i].style.display = "block";
            } else {
                deleteuser[i].style.display = "none";
            }
            styledelete = 1;
            event.stopPropagation();
        })
        elementdelete[i].addEventListener('click', () => {
            delete_noti = iddelete[i].value;
        })
    }
    $(body).click(() => {
        $('.delete-user').hide();
    })

    $("#checkboxall").change(() => {
        selected = [];
        if ($("#checkboxall").is(":checked") == true) {
            $(".checkitem").prop('checked', true);
            for (let i = 0; i < $(".checkitem").length; i++) {
                selected.push(iddelete[i].value);
            }
        } else {
            $(".checkitem").prop('checked', false);
            selected = [];
        }
    })

    $(".checkitem").each(function (i) {
        $(this).change(() => {
            console.log($(this).is(":checked"));
            if ($(this).is(":checked") == true) {
                selected.push(iddelete[i].value);
            } else {
                if (selected.indexOf(iddelete[i].value) > -1) {
                    selected.splice(selected.indexOf(iddelete[i].value), 1);
                }
            }
        })
    })

    $("#del-seleded-noti1").click(() => {
        if (selected.length > 0) {
            styledelete = 2;
        } else {
            styledelete = 3;
        }
    })


    $("#delete-ok").click(() => {
        if (styledelete == 3) {
            $("#mymodal-deletenoti").modal("hide");
        }
        if (styledelete == 1) {
            $.ajax({
                url: "/notification/delete-noti/ok",
                type: "POST",
                dataType: "json",
                data: {
                    id: [delete_noti]
                },
                success: function (data) {
                    if (data.status == "1") {
                        window.location.href = "/notification";
                    }
                }
            })
        }
        if (styledelete == 2) {
            console.log(selected);
            $.ajax({
                url: "/notification/delete-noti/ok",
                type: "POST",
                dataType: "json",
                data: {
                    id: selected
                },
                success: function (data) {
                    if (data.status == "1") {
                        window.location.href = "/notification";
                    }
                }
            })
        }
    })



})