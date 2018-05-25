$(document).ready(() => {
    function trimSpace(str) {
        return str.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, "").replace(/\s+/g, " ");
    }
    $(".button-close-notification").click(() => {
        $(".errPopup").fadeOut();
    });
    var btndelete = document.getElementsByClassName("more-menu");
    var deleteuser = document.getElementsByClassName("box-more-menu");
    var elementdelete = document.getElementsByClassName("element-delete");
    var emaildelete = document.getElementsByClassName("text-email");

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
    ////////////////////////////////////////////////////////////////////////////]

    $('.btn-enable-multi').click(() => {
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
        var jIDApp = $('#sidapp').val();
        $.ajax({
            type: "POST",
            url: "/admin/apps/version/enablemultiversion",
            dataType: "json",
            data: {
                arrapps: arrApps,
                idapp: jIDApp
            },
            success: (data) => {
                if (data.status == 1) {
                    window.location.reload();
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
        var jIDApp = $('#sidapp').val();
        $.ajax({
            type: "POST",
            url: "/admin/apps/version/disablemultiversion",
            dataType: "json",
            data: {
                arrapps: arrApps,
                idapp: jIDApp
            },
            success: (data) => {
                if (data.status == 1) {
                    window.location.reload();
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

    // /////////////////// Delete Apps Multi
    $('.btn-delete-multi').click(() => {
        var arrApps = [];
        $('#table-appversion input[type=checkbox]').each(function() {
            if ($(this).is(":checked")) {
                var id = $(this).attr("id");
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
        var jIDApp = $('#sidapp').val();
        $.ajax({
            type: "POST",
            url: "/admin/apps/version/deletemultiversion",
            dataType: "json",
            data: {
                arrapps: arrApps,
                idapp: jIDApp
            },
            success: (data) => {
                if (data.status == 1) {
                    window.location.reload();
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

});

function enableVersionApp(idVer, idApp) {
    $('#mymodal-enableapp').modal('show');
    $('#enable-ok').click(() => {
        $("#mymodal-enableapp").modal('hide');
        $('#loading').show();
        $.ajax({
            type: "POST",
            url: "/admin/apps/version/enableversion",
            dataType: "json",
            data: {
                idapp: idApp,
                idversion: idVer
            },
            success: (data) => {
                if (data.status == 1) {
                    window.location.reload();
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
}

function disableVersionApp(idVer, idApp) {
    // alert(idApps);
    $('#mymodal-disableapp').modal('show');
    $('#disable-ok').click(() => {
        $("#mymodal-disableapp").modal('hide');
        $('#loading').show();
        $.ajax({
            type: "POST",
            url: "/admin/apps/version/disableversion",
            dataType: "json",
            data: {
                idapp: idApp,
                idversion: idVer
            },
            success: (data) => {
                if (data.status == 1) {
                    window.location.reload();
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
}

function deleteVersionApp(idVer, idApp) {
    $('#mymodal-deleteapp').modal('show');
    $('#delete-ok').click(() => {
        $("#mymodal-deleteapp").modal('hide');
        $('#loading').show();
        $.ajax({
            type: "POST",
            url: "/admin/apps/version/deleteversion",
            dataType: "json",
            data: {
                idapp: idApp,
                idversion: idVer
            },
            success: (data) => {
                if (data.status == 1) {
                    window.location.reload();
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
}