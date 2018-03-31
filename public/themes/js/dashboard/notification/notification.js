$(document).ready(() => {
    var title = $("[name='title-notification-en']").val();
    var content = $(".textarea-content-en").val();

    var colorTitle = $('#cp1').children('input').val();
    var colorContent = $('#cp2').children('input').val();
    var colorLed = $('#cp3').children('input').val();
    var colorAccent = $('#cp4').children('input').val();

    var typeuUrl = "Product Url";
    var url = $('#internal-link').find('input').val();

    function trimSpace(str) {
        return str.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, "").replace(/\s+/g, " ");
    }



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
        $(".select-send-to").hide();
    })
    var numbershow;

    // event click country....
    $('.country-notification').each(function (i) {
        $(this).click((event) => {
            let offset = $(this).children('.img-arow-notification').offset();
            $(".select-country-notification").toggle().offset({
                top: offset.top + 15,
                left: offset.left - 162
            });
            if (document.getElementById('select-country-notification').style.display != "none") {
                if (i == 0) {
                    $('.select-country-notification').find("li").each(function (j) {
                        if (j == 0) {
                            $(this).click((e) => {
                                $("[name='title-notification-en']").show();
                                $("[name='title-notification-vn']").hide();
                                $("[name='title-notification-china']").hide();
                                $("[name='title-notification-dutch']").hide();
                                $("[name='title-notification-georgian']").hide();
                                // e.stopPropagation();
                                title = $("[name='title-notification-en']").val();
                            })
                        }
                        if (j == 1) {
                            $(this).click((e) => {
                                $("[name='title-notification-en']").hide();
                                $("[name='title-notification-vn']").show();
                                $("[name='title-notification-china']").hide();
                                $("[name='title-notification-dutch']").hide();
                                $("[name='title-notification-georgian']").hide();

                                title = $("[name='title-notification-vn']").val();
                            })
                        }
                        if (j == 2) {
                            $(this).click((e) => {
                                $("[name='title-notification-en']").hide();
                                $("[name='title-notification-vn']").hide();
                                $("[name='title-notification-china']").show();
                                $("[name='title-notification-dutch']").hide();
                                $("[name='title-notification-georgian']").hide();
                                // e.stopPropagation();

                                title = $("[name='title-notification-china']").val();
                            })
                        }
                        if (j == 3) {
                            $(this).click((e) => {
                                $("[name='title-notification-en']").hide();
                                $("[name='title-notification-vn']").hide();
                                $("[name='title-notification-china']").hide();
                                $("[name='title-notification-dutch']").show();
                                $("[name='title-notification-georgian']").hide();
                                // e.stopPropagation();

                                title = $("[name='title-notification-dutch']").val();
                            })
                        }
                        if (j == 4) {
                            $(this).click((e) => {
                                $("[name='title-notification-en']").hide();
                                $("[name='title-notification-vn']").hide();
                                $("[name='title-notification-china']").hide();
                                $("[name='title-notification-dutch']").hide();
                                $("[name='title-notification-georgian']").show();
                                // e.stopPropagation();

                                title = $("[name='title-notification-georgian']").val();
                            })
                        }
                    })

                    numbershow = 'title';
                }
                if (i == 1) {
                    $('.select-country-notification').find("li").each(function (j) {
                        if (j == 0) {
                            $(this).click((e) => {
                                $(".textarea-content-en").show();
                                $(".textarea-content-vn").hide();
                                $(".textarea-content-china").hide();
                                $(".textarea-content-dutch").hide();
                                $(".textarea-content-georgian").hide();
                                // e.stopPropagation();
                                content = $(".textarea-content-en").val();
                            })
                        }
                        if (j == 1) {
                            $(this).click((e) => {
                                $(".textarea-content-en").hide();
                                $(".textarea-content-vn").show();
                                $(".textarea-content-china").hide();
                                $(".textarea-content-dutch").hide();
                                $(".textarea-content-georgian").hide();
                                // e.stopPropagation();
                                content = $(".textarea-content-vn").val();
                            })
                        }
                        if (j == 2) {
                            $(this).click((e) => {
                                $(".textarea-content-en").hide();
                                $(".textarea-content-vn").hide();
                                $(".textarea-content-china").show();
                                $(".textarea-content-dutch").hide();
                                $(".textarea-content-georgian").hide();
                                // e.stopPropagation();
                                content = $(".textarea-content-china").val();
                            })
                        }
                        if (j == 3) {
                            $(this).click((e) => {
                                $(".textarea-content-en").hide();
                                $(".textarea-content-vn").hide();
                                $(".textarea-content-china").hide();
                                $(".textarea-content-dutch").show();
                                $(".textarea-content-georgian").hide();
                                // e.stopPropagation();
                                content = $(".textarea-content-dutch").val();
                            })
                        }
                        if (j == 4) {
                            $(this).click((e) => {
                                $(".textarea-content-en").hide();
                                $(".textarea-content-vn").hide();
                                $(".textarea-content-china").hide();
                                $(".textarea-content-dutch").hide();
                                $(".textarea-content-georgian").show();
                                // e.stopPropagation();
                                content = $(".textarea-content-georgian").val();
                            })
                        }
                    })
                    numbershow = 'content';
                }
            }
            event.stopPropagation();
        })
    });

    $('.select-product').click((event) => {
        let offset = $('.select-product').children('.set-img-product-url').offset();
        $("#select-product-url").toggle().offset({
            top: offset.top + 22,
            left: offset.left - 128
        });
        if (document.getElementById('select-product-url').style.display != "none") {
            $('.select-product-url').find('li').each(function (i) {
                if (i == 0) {
                    $(this).click(() => {
                        typeuUrl = "Product Url"
                    })
                }
                if (i == 1) {
                    $(this).click(() => {
                        typeuUrl = "Category Url"
                    })
                }
                if (i == 2) {
                    $(this).click(() => {
                        typeuUrl = "About Us Url"
                    })
                }

                if (i == 3) {
                    $(this).click(() => {
                        typeuUrl = "Bookmark Url"
                    })
                }
                if (i == 4) {
                    $(this).click(() => {
                        typeuUrl = "Term & Conditions"
                    })
                }
                if (i == 5) {
                    $(this).click(() => {
                        typeuUrl = "Privacy Policy"
                    })
                }
            })
        }
        event.stopPropagation();
    });

    //-------------------------------------------

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


    // color picker
    $('#cp1').colorpicker().on('colorpickerChange colorpickerCreate', function (e) {
        $('#title-mobile').css("color", e.color.toRgbString())
        colorTitle = e.color.toRgbString();
    });;
    $('#cp2').colorpicker().on('colorpickerChange colorpickerCreate', function (e) {
        $('#content-mobile').css("color", e.color.toRgbString())
        colorContent = e.color.toRgbString();
    });;
    $('#cp3').colorpicker().on('colorpickerChange colorpickerCreate', function (e) {
        colorLed = e.color.toRgbString();
    });;
    $('#cp4').colorpicker().on('colorpickerChange colorpickerCreate', function (e) {
        colorAccent = e.color.toRgbString();
    });;

    // choolse url

    //-----------------------------------------------------------
    // save notification
    $("#save-notification").click(() => {
        $('#loading').show();
        $.when(
            (() => {
                if (formData1 != null) {
                    $.ajax({
                        url: '/dashboard/iconnotification/' + idApp,
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
                        url: '/dashboard/iconlargenotification/' + idApp,
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
                        url: '/dashboard/iconbigimagesnotification/' + idApp,
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
                        url: '/dashboard/iconbackgroundnotification/' + idApp,
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
                        url: '/dashboard/canceliconnotification/' + idApp,
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
                        url: '/dashboard/canceliconlargenotification/' + idApp,
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
                        url: '/dashboard/canceliconbigimagesnotification/' + idApp,
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
                        url: '/dashboard/canceliconbackgroundnotification/' + idApp,
                        data: {
                            cancelBackground
                        },
                        dataType: "json",
                        type: 'POST',
                        success: function (data) {}
                    })
                }
            })(), (() => {
                if (checknotification() == true) {
                    $.ajax({
                        usl: "/dashboard/save-data-notification/" + idApp,
                        data: {
                            title,
                            content,
                            colorTitle,
                            colorContent,
                            colorLed,
                            colorAccent,
                            internalLink: [{
                                typeuUrl,
                                url
                            }],
                            sentTo: "all"
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
    });
    //----------------------------------
    $('.show-send-to').each(function (i) {
        $(this).click((event) => {
            let offset = $(this).offset();
            $("#select-send-to").toggle().offset({
                top: offset.top + 25,
                left: offset.left
            });
            event.stopPropagation();
        })
    })

    //----------------------------------
    var sentTo;

    $('[name="notiradio"]').change(() => {
        console.log($('[name="notiradio"]:checked').val());
        if ($('[name="notiradio"]:checked').val() == "1") {
            sentTo == "all"
        }
        if ($('[name="notiradio"]:checked').val() == "2") {
            sentTo == "all"
        }
        if ($('[name="notiradio"]:checked').val() == "3") {
            sentTo == "all"
        }
    })
    //-----------------------------------------------------------
    function checknotification() {
        if (trimSpace(title) == "") {
            return false;
        }
        if (trimSpace(content) == "") {
            return false;
        }
        return true;
    }





});