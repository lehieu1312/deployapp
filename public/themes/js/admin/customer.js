$(document).ready(() => {
    function trimSpace(str) {
        return str.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, "").replace(/\s+/g, " ");
    }
    var btndelete = document.getElementsByClassName("more-menu");
    var deleteuser = document.getElementsByClassName("box-more-menu");
    var elementdelete = document.getElementsByClassName("element-delete");
    var emaildelete = document.getElementsByClassName("text-email");

    // $('.deleteuser').click(() => {
    //     if ($(this).find('.delete-use').style.display === "none") {
    //         // alert('1');
    //         $(this).find('.delete-use').style.display = "block";
    //     } else {
    //         // alert('2');
    //         $(this).find('.delete-use').style.display = "none";
    //     }

    // });

    for (let i = 0; i < $('.more-menu').length; i++) {

        btndelete[i].addEventListener('click', (event) => {
            // $('.deleteuser').style.display === "none";
            // alert(deleteuser[i].style.display);

            if (deleteuser[i].style.display === "none") {
                // alert('1');
                deleteuser[i].style.display = "block";
            } else {
                // alert('2');
                deleteuser[i].style.display = "none";
            }
            settr = i;
            event.stopPropagation();
        });

    }
    $(body).click(() => {
        $('.box-more-menu').hide();
    });

    var emailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var erremail = "Your email is not valid";
    var errempty = "Can not empty";

    function checkformadduser() {
        if (trimSpace($(".textarea-adduser").val()) == "") {
            $(".textarea-adduser").addClass("textarea-err")
            $(".textarea-adduser").attr({
                "placeholder": errempty
            });
            return false;
        } else if (emailReg.test($(".textarea-adduser").val()) == false) {
            $(".textarea-adduser").val("")
            $(".textarea-adduser").addClass("textarea-err")
            $(".textarea-adduser").attr({
                "placeholder": erremail
            });
            return false;
        }
        return true;
    }

    $('#form-adduser').submit(() => {
        if (checkformadduser() == true) {
            $('#myModa-adduser').modal('hide');
            $('#loading').show();
            $.ajax({
                type: "POST",
                url: "/admin/customer/addcustomer",
                dataType: "json",
                data: {
                    email: $("#input-add-customer").val()
                },
                success: (data) => {
                    if (data.status == 1) {
                        window.location.href = "/admin/customer";
                    } else if (data.status == 2) {
                        $('#errPopup').show();
                        $('.alert-upload').text(data.msg[0].msg);
                        // $("#errPopup").fadeTo(5000, 1000).slideUp(1000, function() {
                        // $("#errPopup").slideUp(1000);
                        // $('#errPopup').hide();
                        // });
                    } else {
                        $('#errPopup').show();
                        $('.alert-upload').text(data.msg);
                        // $("#errPopup").fadeTo(5000, 1000).slideUp(1000, function() {
                        //     $("#errPopup").slideUp(1000);
                        //     $('#errPopup').hide();
                        // });
                    }
                }
            }).always(function(data) {
                $('#loading').hide();
            });
        }
    })
    $(".button-close-notification").click(() => {
        $(".errPopup").fadeOut();
    })

    $("#checkboxall").change(() => {
        var checkboxes = document.getElementsByName('name[]');
        var checkboxall = document.getElementById('checkboxall');
        var chkBox = checkboxall.checked;
        // alert(chkBox);
        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = chkBox;
        }
    });
    $('#btn-block-multi').click(() => {
        // alert('1');
        var arrUser = [];
        $('#table-appversion input[type=checkbox]').each(function() {
            if ($(this).is(":checked")) {
                var id = $(this).attr("id");
                // console.log(id);
                arrUser.push(id);
            }
        });

        if (arrUser.length < 1) {
            $('#mymodal-warring').modal('show');
        } else {
            $('#mymodal-blockusermulti').modal('show');
        }
    });

    $('#block-ok-multi').click(() => {
        var arrUser = [];
        $('#table-appversion input[type=checkbox]').each(function() {
            if ($(this).is(":checked")) {
                var id = $(this).attr("id");
                // console.log(id);
                arrUser.push(id);
            }
        });
        $("#mymodal-blockusermulti").modal('hide');
        $('#loading').show();
        $.ajax({
            type: "POST",
            url: "/admin/customer/blockmulti",
            dataType: "json",
            data: {
                arruser: arrUser
            },
            success: (data) => {
                if (data.status == 1) {
                    window.location.href = "/admin/customer";
                } else if (data.status == 2) {
                    $('#errPopup').show();
                    $('.alert-upload').text(data.msg[0].msg);
                    // $("#errPopup").fadeTo(5000, 1000).slideUp(1000, function() {
                    // $("#errPopup").slideUp(1000);
                    // $('#errPopup').hide();
                    // });
                } else {
                    $('#errPopup').show();
                    $('.alert-upload').text(data.msg);
                    // $("#errPopup").fadeTo(5000, 1000).slideUp(1000, function() {
                    //     $("#errPopup").slideUp(1000);
                    //     $('#errPopup').hide();
                    // });
                }
            }
        }).always(function(data) {
            $('#loading').hide();
        });
    });

    $('#btn-delete-multi').click(() => {
        var arrUser = [];
        $('#table-appversion input[type=checkbox]').each(function() {
            if ($(this).is(":checked")) {
                var id = $(this).attr("id");
                // console.log(id);
                arrUser.push(id);
            }
        });
        if (arrUser.length < 1) {
            $('#mymodal-warring').modal('show');
        } else {
            $('#mymodal-deleteusermulti').modal('show');
        }
    });
    $('#delete-ok-multi').click(() => {
        var arrUser = [];
        $('#table-appversion input[type=checkbox]').each(function() {
            if ($(this).is(":checked")) {
                var id = $(this).attr("id");
                // console.log(id);
                arrUser.push(id);
            }
        });
        $("#mymodal-deleteusermulti").modal('hide');
        $('#loading').show();
        $.ajax({
            type: "POST",
            url: "/admin/customer/delmulti",
            dataType: "json",
            data: {
                arruser: arrUser
            },
            success: (data) => {
                if (data.status == 1) {
                    window.location.href = "/admin/customer";
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
    });

    // function unblockUser(idUser) {
    //     alert(idUser);
    //     $('#mymodal-unblockuser').modal('show');

    // }

    $(window).on("load", function() {
        $(".adminfilldate").each(function() {
            var strDate = $(this).find('input').val();
            $(this).find('span').text(moment(strDate).format('DD/MM/YYYY HH:mm:ss'));
        })
    })
});

function unblockUser(idUser) {
    // alert(idUser);
    $('#mymodal-unblockuser').modal('show');
    $('#unblock-ok').click(() => {
        $("#mymodal-unblockuser").modal('hide');
        $('#loading').show();
        $.ajax({
            type: "POST",
            url: "/admin/customer/unblockuser",
            dataType: "json",
            data: {
                iduser: idUser
            },
            success: (data) => {
                if (data.status == 1) {
                    window.location.href = "/admin/customer";
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
        // alert('Deleted: ' + idUser);
    });
}

function deleteUser(idUser) {
    // alert(idUser);
    $('#mymodal-deleteuser').modal('show');
    $('#delete-ok').click(() => {
        $("#mymodal-deleteuser").modal('hide');
        $('#loading').show();
        $.ajax({
            type: "POST",
            url: "/admin/customer/deleteuser",
            dataType: "json",
            data: {
                iduser: idUser
            },
            success: (data) => {
                if (data.status == 1) {
                    window.location.href = "/admin/customer";
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
        // alert('Deleted: ' + idUser);
    });
}

function blockUser(idUser) {
    // alert(idUser);
    console.log(idUser);
    $('#mymodal-blockuser').modal('show');
    $('#block-ok').click(() => {
        $("#mymodal-blockuser").modal('hide');
        $('#loading').show();
        $.ajax({
            type: "POST",
            url: "/admin/customer/blockuser",
            dataType: "json",
            data: {
                iduser: idUser
            },
            success: (data) => {
                if (data.status == 1) {
                    window.location.href = "/admin/customer";
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
        // alert('Deleted: ' + idUser);
    });
}

function searchFunc() {

    var input, filter, table, tr, td, i, j;
    input = document.getElementById("inputsearch-customer");
    filter = input.value.toUpperCase();
    table = document.getElementById("table-appversion");
    tr = table.getElementsByTagName("tr");
    console.log(filter);

    for (i = 1; i < tr.length; i++) {
        span = tr[i].getElementsByTagName("span");
        for (j = 0; j < span.length; j++) {
            if (span[j]) {
                console.log(span[j].innerHTML.toUpperCase().indexOf(filter));
                if (span[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                    break;
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
}