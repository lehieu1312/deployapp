$(document).ready(() => {
    // interface
    $('.select-platform-ios').click(() => {
        $('.platform-ios').hide();
        $('.platform-ios-active').show();
        $('.platform-android').show();
        $('.platform-android-active').hide();
    });
    $('.select-platform-android').click(() => {
        $('.platform-android').hide();
        $('.platform-android-active').show();
        $('.platform-ios').show();
        $('.platform-ios-active').hide();
    });
    $('body').click(() => {
        $(".select-country-notification").hide();
        $(".select-product-url").hide();
    })
    $('.country-notification').each(function (i) {
        $(this).click((event) => {
            let offset = $(this).children('.img-arow-notification').offset();
            $(".select-country-notification").toggle().offset({
                top: offset.top + 15,
                left: offset.left - 162
            });
            event.stopPropagation();
        })
    });
    $('.select-product').click((event) => {
        let offset = $('.select-product').children('.set-img-product-url').offset();
        $(".select-product-url").toggle().offset({
            top: offset.top + 22,
            left: offset.left - 128
        });
        event.stopPropagation();
    });

    $('#send-to-everyone').click(() => {
        $('.sent-to-segment').hide();
        $('.infor-mobile-using').hide();
    })
    $('#send-to-segment').click(() => {
        $('.infor-mobile-using').hide();
        $('.sent-to-segment').show();
    })
    $('#send-to-test-device').click(() => {
        $('.sent-to-segment').hide();
        $('.infor-mobile-using').show();
    })
    // choole file
    document.getElementById('btn-choose-small-icon').onclick = function () {
        document.getElementById('file-img-small').click();
    };
    document.getElementById('btn-choose-large-icon').onclick = function () {
        document.getElementById('file-img-large').click();
    };
    document.getElementById('btn-choose-bigimages-icon').onclick = function () {
        document.getElementById('file-img-bigimages').click();
    };
    document.getElementById('btn-choose-background-icon').onclick = function () {
        document.getElementById('file-img-background').click();
    };
    // feature mobile
    $('.input-title-notification').keyup(function (e) {
        let textEnter = $('.input-title-notification').val();
        if (textEnter == "") {
            textEnter = "Name app"
        }
        $('#title-mobile').text(textEnter);
    });
    $('.textarea-content-notification').keyup(function (e) {
        let textEnter = $('.textarea-content-notification').val();
        if (textEnter == "") {
            textEnter = "Content..."
        }
        $('#content-mobile').text(textEnter);
    });

    var formData1;
    var formData2;
    var formData3;
    var formData4;
    var cancelSmall;
    var cancelIcon;
    var cancelBig;
    var cancelBackground;
    var idApp = $("#idapp-using").val();
    const setvalicon = $(".boder-icon-large-notification").children('input').val();
    var valicon = $(".boder-icon-large-notification").children('input').val();
    var valiconmall = $(".boder-icon-small-notification").children('input').val();
    var small = document.getElementById('btn-cancel-small-icon');
    $('#file-img-small').on('change', function (event) {
        valiconmall = URL.createObjectURL(event.target.files[0]);
        let formData = new FormData();
        let file = $(this).get(0).files[0];
        formData.append('iconnotification', file, file.name);
        formData1 = formData;
        if (file.size > 10485760) {
            alert("size max");
        } else {
            if (valicon.length > 0) {
                $('.img-large-mobile').children('img').attr("src", valicon)
                $(".img-large-mobile").show();
                $('.boder-icon-large-notification').children('img').attr("src", valicon)
                $('.boder-icon-large-notification').show();
                $("#btn-cancel-large-icon").show();
            }
            $('#img-small-circle').attr("src", URL.createObjectURL(event.target.files[0]));
            $('.boder-icon-small-notification').children('img').attr("src", URL.createObjectURL(event.target.files[0]));
            $('.boder-icon-small-notification').show();
            $("#btn-cancel-small-icon").show();
        }
    })
    $('#file-img-large').on('change', function (event) {
        valicon = URL.createObjectURL(event.target.files[0]);
        let formData = new FormData();
        let file = $(this).get(0).files[0];
        formData.append('imglarge', file, file.name);
        formData2 = formData;
        if (file.size > 10485760) {
            alert("size max");
        } else {
            if (valiconmall.length > 0) {
                $('.img-large-mobile').children('img').attr("src", URL.createObjectURL(event.target.files[0]))
                $(".img-large-mobile").show();
            } else {
                $("#img-small-circle").attr("src", URL.createObjectURL(event.target.files[0]));
            }
            $('.boder-icon-large-notification').children('img').attr("src", URL.createObjectURL(event.target.files[0]))
            $('.boder-icon-large-notification').show();
            $("#btn-cancel-large-icon").show();
        }
    })
    $('#file-img-bigimages').on('change', function (event) {
        let formData = new FormData();
        let file = $(this).get(0).files[0];
        formData.append('bigimages', file, file.name);
        formData3 = formData;
        if (file.size > 10485760) {
            alert("size max");
        } else {
            $('.img-big-mobile').children('img').attr("src", URL.createObjectURL(event.target.files[0]))
            $(".img-big-mobile").show();
            $('.boder-icon-big-notification').children('img').attr("src", URL.createObjectURL(event.target.files[0]))
            $('.boder-icon-big-notification').show();
            $("#btn-cancel-bigimages-icon").show();
        }
    })
    $('#file-img-background').on('change', function (event) {
        let formData = new FormData();
        let file = $(this).get(0).files[0];
        formData.append('background', file, file.name);
        formData4 = formData;
        if (file.size > 10485760) {
            alert("size max");
        } else {
            $('.boder-icon-background-notification').children('img').attr("src", URL.createObjectURL(event.target.files[0]))
            $('.boder-icon-background-notification').show();
            $("#btn-cancel-background-icon").show();
        }
    })
    var large = document.getElementById('btn-cancel-large-icon');
    $("#btn-cancel-small-icon").click(() => {
        valiconmall = "";
        if (valicon.length > 0) {
            if (valicon == setvalicon) {
                valicon = "/themes/img/settingnotification/" + setvalicon;
            }
            $("#img-small-circle").attr("src", valicon);
            $(".img-large-mobile").hide();
        } else {
            $("#img-small-circle").attr("src", "/themes/img/settingnotification/testicon.jpg");
        }
        cancelSmall = $(".boder-icon-small-notification").children("input").val();
        $("#btn-cancel-small-icon").hide();
        $('.boder-icon-small-notification').hide();
    })
    $("#btn-cancel-large-icon").click(() => {
        valicon = "";
        if (valiconmall.length < 1) {
            $("#img-small-circle").attr("src", "/themes/img/settingnotification/testicon.jpg");
        }
        cancelIcon = $(".boder-icon-large-notification").children("input").val();
        $("#btn-cancel-large-icon").hide();
        $('.boder-icon-large-notification').hide();
        $(".img-large-mobile").hide();
    })
    $("#btn-cancel-bigimages-icon").click(() => {
        cancelBig = $(".boder-icon-big-notification").children("input").val();
        $("#btn-cancel-bigimages-icon").hide();
        $('.boder-icon-big-notification').hide();
        $(".img-big-mobile").hide();
    })
    $("#btn-cancel-background-icon").click(() => {
        cancelBackground = $(".boder-icon-background-notification").children("input").val();
        $("#btn-cancel-background-icon").hide();
        $('.boder-icon-background-notification').hide();
        console.log(cancelBackground)
    })

    console.log($('#cp1').children('input').val());

    $("#save-notification").click(() => {
        $('#loading').show();
        $.when(
            (() => {
                if (formData1 != null) {
                    $.ajax({
                        url: '/iconnotification/' + idApp,
                        data: formData1,
                        contentType: false,
                        processData: false,
                        type: 'POST',
                        success: function (data) {
                            if (data.status == 1) {
                                $('.boder-icon-small-notification').children('img').attr("src", "/themes/img/settingnotification/" + data.message)
                                $('.boder-icon-small-notification').show();
                            }
                        }
                    })
                }
            })(),
            (() => {
                if (formData2 != null) {
                    $.ajax({
                        url: '/iconlargenotification/' + idApp,
                        data: formData2,
                        contentType: false,
                        processData: false,
                        type: 'POST',
                        success: function (data) {
                            $('.boder-icon-large-notification').children('img').attr("src", "/themes/img/settingnotification/" + data.message)
                            $('.boder-icon-large-notification').show();
                        }
                    })
                }
            })(),
            (() => {
                if (formData3 != null) {
                    $.ajax({
                        url: '/iconbigimagesnotification/' + idApp,
                        data: formData3,
                        contentType: false,
                        processData: false,
                        type: 'POST',
                        success: function (data) {
                            $('.boder-icon-big-notification').children('img').attr("src", "/themes/img/settingnotification/" + data.message)
                            $('.boder-icon-big-notification').show();
                        }
                    })
                }
            })(),
            (() => {
                if (formData4 != null) {
                    $.ajax({
                        url: '/iconbackgroundnotification/' + idApp,
                        data: formData4,
                        contentType: false,
                        processData: false,
                        type: 'POST',
                        success: function (data) {
                            $('.boder-icon-background-notification').children('img').attr("src", "/themes/img/settingnotification/" + data.message)
                            $('.boder-icon-background-notification').show();
                        }
                    })
                }
            })(),
            (() => {
                if (cancelSmall != null) {
                    $.ajax({
                        url: '/canceliconnotification/' + idApp,
                        data: {
                            cancelSmall
                        },
                        dataType: "json",
                        type: 'POST',
                        success: function (data) {}
                    })
                }
            })(),
            (() => {
                if (cancelIcon != null) {
                    $.ajax({
                        url: '/canceliconlargenotification/' + idApp,
                        data: {
                            cancelIcon
                        },
                        dataType: "json",
                        type: 'POST',
                        success: function (data) {}
                    })
                }
            })(),
            (() => {
                if (cancelBig != null) {
                    $.ajax({
                        url: '/canceliconbigimagesnotification/' + idApp,
                        data: {
                            cancelBig
                        },
                        dataType: "json",
                        type: 'POST',
                        success: function (data) {}
                    })
                }
            })(),
            (() => {
                if (cancelBackground != null) {
                    $.ajax({
                        url: '/canceliconbackgroundnotification/' + idApp,
                        data: {
                            cancelBackground
                        },
                        dataType: "json",
                        type: 'POST',
                        success: function (data) {}
                    })
                }
            })()
        ).then(() => {
            $('#loading').hide();
            $('#successPopup').show(500);
            $(".contenemail").text("");
            $(".contenemail").text("Saved !");
            $("#success-alert").fadeTo(5000, 1000).slideUp(1000, function () {
                $("#success-alert").slideUp(1000);
                $('.successPopup').hide();
            });
        })
    })


});