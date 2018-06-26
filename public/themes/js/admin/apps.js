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

    $("#checkboxall").change(() => {
        var checkboxes = document.getElementsByName('name[]');
        var checkboxall = document.getElementById('checkboxall');
        var chkBox = checkboxall.checked;
        // alert(chkBox);
        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = chkBox;
        }
    });

    $('.btn-enable-multi').click(() => {
        // alert('1');
        var arrApps = [];
        $('#table-appversion input[type=checkbox]').each(function() {
            if ($(this).is(":checked")) {
                var id = $(this).attr("id");
                // console.log(id);
                arrApps.push(id);
            }
        });

        if (arrApps.length < 1) {
            $('#mymodal-warring').modal('show');
        } else {
            $('#mymodal-enableappsmulti').modal('show');
        }
    });

    $('#enable-ok-multi').click(() => {
        var arrApps = [];
        $('#table-appversion input[type=checkbox]').each(function() {
            if ($(this).is(":checked")) {
                var id = $(this).attr("id");
                // console.log(id);
                arrApps.push(id);
            }
        });
        $("#mymodal-enableappsmulti").modal('hide');
        $('#loading').show();
        $.ajax({
            type: "POST",
            url: "/admin/apps/enableappsmulti",
            dataType: "json",
            data: {
                arrapps: arrApps
            },
            success: (data) => {
                if (data.status == 1) {
                    window.location.href = "/admin/apps";
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

    // btn-disable-multi

    $('.btn-disable-multi').click(() => {
        // alert('1');
        var arrApps = [];
        $('#table-appversion input[type=checkbox]').each(function() {
            if ($(this).is(":checked")) {
                var id = $(this).attr("id");
                // console.log(id);
                arrApps.push(id);
            }
        });

        if (arrApps.length < 1) {
            $('#mymodal-warring').modal('show');
        } else {
            $('#mymodal-disableappsmulti').modal('show');
        }
    });

    $('#disable-ok-multi').click(() => {
        var arrApps = [];
        $('#table-appversion input[type=checkbox]').each(function() {
            if ($(this).is(":checked")) {
                var id = $(this).attr("id");
                arrApps.push(id);
            }
        });

        $("#mymodal-disableappsmulti").modal('hide');
        $('#loading').show();
        $.ajax({
            type: "POST",
            url: "/admin/apps/disableappsmulti",
            dataType: "json",
            data: {
                arrapps: arrApps
            },
            success: (data) => {
                if (data.status == 1) {
                    window.location.href = "/admin/apps";
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

    // /////////////////// Delete Apps Multi
    $('.btn-delete-multi').click(() => {
        // alert('1');
        var arrApps = [];
        $('#table-appversion input[type=checkbox]').each(function() {
            if ($(this).is(":checked")) {
                var id = $(this).attr("id");
                // console.log(id);
                arrApps.push(id);
            }
        });

        if (arrApps.length < 1) {
            $('#mymodal-warring').modal('show');
        } else {
            $('#mymodal-deleteappsmulti').modal('show');
        }
    });

    $('#delete-ok-multi').click(() => {
        var arrApps = [];
        $('#table-appversion input[type=checkbox]').each(function() {
            if ($(this).is(":checked")) {
                var id = $(this).attr("id");
                arrApps.push(id);
            }
        });

        $("#mymodal-deleteappsmulti").modal('hide');
        $('#loading').show();
        $.ajax({
            type: "POST",
            url: "/admin/apps/deleteappsmulti",
            dataType: "json",
            data: {
                arrapps: arrApps
            },
            success: (data) => {
                if (data.status == 1) {
                    window.location.href = "/admin/apps";
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

    ////////////////////////////////////////////



})

function enableApp(idApp) {
    // alert(idApps);
    $('#mymodal-enableapp').modal('show');
    $('#enable-ok').click(() => {
        $("#mymodal-enableapp").modal('hide');
        $('#loading').show();
        $.ajax({
            type: "POST",
            url: "/admin/apps/enableapp",
            dataType: "json",
            data: {
                idapp: idApp
            },
            success: (data) => {
                if (data.status == 1) {
                    window.location.href = "/admin/apps";
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

// function enableApp(idApp) {
//     // alert(idApps);
//     $('#mymodal-enableapp').modal('show');
//     $('#enable-ok').click(() => {
//         $("#mymodal-enableapp").modal('hide');
//         $('#loading').show();
//         $.ajax({
//             type: "POST",
//             url: "/admin/apps/enableapp",
//             dataType: "json",
//             data: {
//                 idapp: idApp
//             },
//             success: (data) => {
//                 if (data.status == 1) {
//                     window.location.href = "/admin/apps";
//                 } else if (data.status == 2) {
//                     $('#errPopup').show();
//                     $('.alert-upload').text(data.msg[0].msg);
//                 } else {
//                     $('#errPopup').show();
//                     $('.alert-upload').text(data.msg);
//                 }
//             }
//         }).always(function(data) {
//             $('#loading').hide();
//         });
//         // alert('Deleted: ' + idUser);
//     });
// }

function disableApp(idApp) {
    // alert(idApps);
    $('#mymodal-disableapp').modal('show');
    $('#disable-ok').click(() => {
        $("#mymodal-disableapp").modal('hide');
        $('#loading').show();
        $.ajax({
            type: "POST",
            url: "/admin/apps/disableapp",
            dataType: "json",
            data: {
                idapp: idApp
            },
            success: (data) => {
                if (data.status == 1) {
                    window.location.href = "/admin/apps";
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

function deleteApp(idApp) {
    // alert(idApps);
    $('#mymodal-deleteapp').modal('show');
    $('#delete-ok').click(() => {
        $("#mymodal-deleteapp").modal('hide');
        $('#loading').show();
        $.ajax({
            type: "POST",
            url: "/admin/apps/deleteapp",
            dataType: "json",
            data: {
                idapp: idApp
            },
            success: (data) => {
                if (data.status == 1) {
                    window.location.href = "/admin/apps";
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