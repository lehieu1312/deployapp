$(document).ready(() => {

    // khai báo
    var title = {
        value: $("[name='title-notification-en']").val(),
        country: "en"
    };
    var content = {
        value: trimSpace($(".textarea-content-en").val()),
        country: "en"
    }
    var country = ["en", "vn", "cn", "sx", "ge"]

    var colorTitle = $('#cp1').children('input').val();
    var colorContent = $('#cp2').children('input').val();
    var colorLed = $('#cp3').children('input').val();
    var colorAccent = $('#cp4').children('input').val();

    var typeUrl = "Product Url";
    var url = $('#internal-link').find('input').val();
    var sendToUser = ["All"];
    var exclude = [];

    // remove space
    function trimSpace(str) {
        return str.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, "").replace(/\s+/g, " ");
    }
    // togle platform    
    $('.select-platform-ios').click(() => {
        $('.platform-ios').hide();
        $('.platform-ios-active').show();
        $('.platform-android').show();
        $('.platform-android-active').hide();
        $(".ios-ok").show();
        $(".android-ok").hide();


    });
    $('.select-platform-android').click(() => {
        $('.platform-android').hide();
        $('.platform-android-active').show();
        $('.platform-ios').show();
        $('.platform-ios-active').hide();
        $(".ios-ok").hide();
        $(".android-ok").show();

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
                                title = {
                                    value: $("[name='title-notification-en']").val(),
                                    country: "en"
                                }
                            })
                        }
                        if (j == 1) {
                            $(this).click((e) => {
                                $("[name='title-notification-en']").hide();
                                $("[name='title-notification-vn']").show();
                                $("[name='title-notification-china']").hide();
                                $("[name='title-notification-dutch']").hide();
                                $("[name='title-notification-georgian']").hide();

                                title = {
                                    value: $("[name='title-notification-vn']").val(),
                                    country: "vn"
                                }
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
                                title = {
                                    value: $("[name='title-notification-china']").val(),
                                    country: "cn"
                                }
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

                                title = {
                                    value: $("[name='title-notification-dutch']").val(),
                                    country: "sx"
                                }
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

                                title = {
                                    value: $("[name='title-notification-georgian']").val(),
                                    country: "ge"
                                }
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

                                var content = {
                                    value: trimSpace($(".textarea-content-en").val()),
                                    country: "en"
                                }
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
                                var content = {
                                    value: trimSpace($(".textarea-content-vn").val()),
                                    country: "vn"
                                }
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
                                var content = {
                                    value: trimSpace($(".textarea-content-china").val()),
                                    country: "cn"
                                }
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
                                var content = {
                                    value: trimSpace($(".textarea-content-dutch").val()),
                                    country: "sx"
                                }
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
                                var content = {
                                    value: trimSpace($(".textarea-content-georgian").val()),
                                    country: "ge"
                                }
                            })
                        }
                    })
                    numbershow = 'content';
                }
            }
            event.stopPropagation();
        })
    });


    // type url
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
                        typeUrl = "Product Url"
                    })
                }
                if (i == 1) {
                    $(this).click(() => {
                        typeUrl = "Category Url"
                    })
                }
                if (i == 2) {
                    $(this).click(() => {
                        typeUrl = "About Us Url"
                    })
                }

                if (i == 3) {
                    $(this).click(() => {
                        typeUrl = "Bookmark Url"
                    })
                }
                if (i == 4) {
                    $(this).click(() => {
                        typeUrl = "Term & Conditions"
                    })
                }
                if (i == 5) {
                    $(this).click(() => {
                        typeUrl = "Privacy Policy"
                    })
                }
            })
        }
        event.stopPropagation();
    });

    //-------------------------------------------
    // cholse sent to
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
    $('#internal-link').find('input').keyup(function (e) {
        url = $('#internal-link').find('input').val();
    })
    $('.input-title-notification').each(function (i) {
        $(this).keyup(function (e) {
            let textEnter = $(this).val();
            if (textEnter == "") {
                textEnter = "Name app"
            }
            title = {
                value: textEnter,
                country: country[i]
            }

            $('#title-mobile').text(textEnter);
        });
    })
    $('.textarea-content-notification').each(function (i) {
        $(this).keyup(function (e) {
            let textEnter = $(this).val();
            if (textEnter == "") {
                textEnter = "Content..."
            }
            content = {

                value: trimSpace(textEnter),
                country: country[i]
            }
            $('#content-mobile').text(textEnter);
        });
    })

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
            $("#img-small-circle").attr("src", "/themes/img/settingnotification/testicon.png");
        }
        cancelSmall = $(".boder-icon-small-notification").children("input").val();
        $("#btn-cancel-small-icon").hide();
        $('.boder-icon-small-notification').hide();
    })
    $("#btn-cancel-large-icon").click(() => {
        valicon = "";
        if (valiconmall.length < 1) {
            $("#img-small-circle").attr("src", "/themes/img/settingnotification/testicon.png");
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
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
    $('#cp1').colorpicker().on('colorpickerChange colorpickerCreate', function (e) {
        $('#title-mobile').css("color", e.color.toHexString())
        colorTitle = e.color.toHexString();
        console.log(e.color.toHexString())

    });;
    $('#cp2').colorpicker().on('colorpickerChange colorpickerCreate', function (e) {
        $('#content-mobile').css("color", e.color.toHexString())
        colorContent = e.color.toHexString();
    });;
    $('#cp3').colorpicker().on('colorpickerChange colorpickerCreate', function (e) {
        colorLed = e.color.toHexString();
    });;
    $('#cp4').colorpicker().on('colorpickerChange colorpickerCreate', function (e) {
        colorAccent = e.color.toHexString();
    });;

    // choolse url

    //-----------------------------------------------------------


    $('.show-send-to').each(function (i) {
        if (i == 0) {
            $(this).click((event) => {
                let offset = $(this).offset();
                $("#select-send-to").toggle().offset({
                    top: offset.top + 25,
                    left: offset.left
                });
                event.stopPropagation();
            })
        } else {
            $(this).click((event) => {
                let offset = $(this).offset();
                $("#select-exclude").toggle().offset({
                    top: offset.top + 25,
                    left: offset.left
                });
                event.stopPropagation();
            })
        }

    })
    $('#select-send-to').find('li').each(function (i) {
        let arraysegments = [];
        $(this).click((e) => {
            arraysegments = [];
            if ($(this).children('input').is(":checked")) {
                $(this).children('input').prop('checked', false);
            } else {
                $(this).children('input').prop('checked', true);
            }
            $('#select-send-to').find('li').children('input').each(function (index) {
                if ($(this).is(":checked")) {
                    arraysegments.push($(this).val())
                }
            })
            sendToUser = arraysegments;
            $('#notification-sent').val(arraysegments)
            console.log(arraysegments)
            e.stopPropagation();
        })
    })
    $('#select-exclude').find('li').each(function (i) {
        let arrayexclude = [];
        $(this).click((e) => {
            arrayexclude = [];
            if ($(this).children('input').is(":checked")) {
                $(this).children('input').prop('checked', false);
            } else {
                $(this).children('input').prop('checked', true);
            }
            $('#select-exclude').find('li').children('input').each(function (index) {
                if ($(this).is(":checked")) {
                    arrayexclude.push($(this).val())
                }
            })
            exclude = arrayexclude;
            console.log(arrayexclude)
            $('#notification-exclude').val(arrayexclude)
            e.stopPropagation();
        })
    })
    //----------------------------------


    $('[name="notiradio"]').change(() => {
        console.log($('[name="notiradio"]:checked').val());
        if ($('[name="notiradio"]:checked').val() == "1") {
            sendToUser = ["All"];
            exclude = [];
        }
        if ($('[name="notiradio"]:checked').val() == "2") {

        }
        if ($('[name="notiradio"]:checked').val() == "3") {
            sendToUser = []
            exclude = [];
        }
    })
    //-----------------------------------------------------------
    // cholse devices test
    var devices_test = [];
    let id_devices = document.getElementsByClassName("value-device-id");
    $('#checkbox-allusser').change(() => {
        devices_test = [];
        if ($('#checkbox-allusser').is(":checked")) {
            $('[name="sub-user-test"]').each(function (i) {
                $(this).prop('checked', true);
                devices_test.push(id_devices[i].value)
            })
        } else {
            $('[name="sub-user-test"]').each(function (i) {
                $(this).prop('checked', false);
                devices_test = [];
            })
        }
        console.log(devices_test);
    })
    $('[name="sub-user-test"]').each(function (i) {
        $(this).click(() => {
            devices_test = [];
            $('[name="sub-user-test"]').each(function (i) {
                if ($(this).is(":checked")) {
                    devices_test.push(id_devices[i].value);
                }
            })
            console.log(devices_test);
        })
    })
    var value_device = document.getElementsByClassName('value-device');
    $("#ok-user").click(() => {
        $("#use-sent-to-player").html('');
        $('[name="sub-user-test"]').each(function (i) {
            if ($(this).is(":checked")) {
                let device_model = value_device[i].value;
                if (i == 0) {
                    $("#use-sent-to-player").append(
                        `  
                        <div class="infor-mobile-using ">
                            <span>
                            ${device_model}
                                <img class="cancel-mobile-using" src="/themes/img/notification/icondelete.png">
                            </span>
                        </div>
                        `
                    )
                } else {
                    $("#use-sent-to-player").append(
                        `  
                        <div class="infor-mobile-using set-infor-mobile-using">
                            <span>
                            ${device_model}
                                <img class="cancel-mobile-using" src="/themes/img/notification/icondelete.png">
                            </span>
                        </div>
                        `
                    )
                }

            }
        })
        $('#myModal-chooleUser').modal('hide');
    })

    $("#seach-device").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $(".item-device-add-test").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    })
    //-----------------------------------------------------------



    $("#save-notification").click(() => {
        if (checknotification() == true) {
            $('#loading').show();
            $.when(savenoti()).then(() => {
                $('#loading').hide();
                $('#successPopup').show(500);
                $(".contenemail").text("");
                $(".contenemail").text("Saved !");
                $("#success-alert").fadeTo(5000, 1000).slideUp(1000, function () {
                    $("#success-alert").slideUp(1000);
                    $('.successPopup').hide();
                });
            })
        }
    });


    function checknotification() {

        if (trimSpace(title[Object.getOwnPropertyNames(title)[0]]) == "") {
            $('#loading').hide()
            $('#errPopup').show();
            $('.alert-upload').text("The title can not be empty");
            $("#errPopup").fadeTo(5000, 1000).slideUp(1000, function () {
                $("#errPopup").slideUp(1000);
                $('#errPopup').hide();
            });
            return false;
        }
        if (trimSpace(content[Object.getOwnPropertyNames(content)[0]]) == "") {
            $('#loading').hide()
            $('#errPopup').show();
            $('.alert-upload').text("The content can not be empty");
            $("#errPopup").fadeTo(5000, 1000).slideUp(1000, function () {
                $("#errPopup").slideUp(1000);
                $('#errPopup').hide();
            });
            return false;
        }
        if (trimSpace(url) == "") {
            $('#loading').hide()
            $('#errPopup').show();
            $('.alert-upload').text("The url can not be empty");
            $("#errPopup").fadeTo(5000, 1000).slideUp(1000, function () {
                $("#errPopup").slideUp(1000);
                $('#errPopup').hide();
            });
            return false;
        }
        return true;
    }

    $("#send-notification").click(() => {
        if (checknotification() == true) {
            $('#loading').show();
            $.when(savenoti(),
                (() => {
                    $.ajax({
                        url: "/dashboard/send-notification/" + idApp,
                        data: {
                            idApp
                        },
                        dataType: "json",
                        async: false,
                        type: 'POST',
                        success: function (data) {
                            if (data.status == 1) {
                                window.location.href = "/dashboard/notification/" + idApp
                            }
                            if (data.status == 2) {
                                $('.errPopup').show();
                                $('.alert-upload').text(data.message);
                                $("#danger-alert").fadeTo(5000, 1000).slideUp(1000, function () {
                                    $("#danger-alert").slideUp(1000);
                                    $('.errPopup').hide();
                                });
                            }
                        }
                    })
                })()
            ).then(() => {
                $('#loading').hide();
                $('#successPopup').show(500);
                $(".contenemail").text("");
                $(".contenemail").text("Sent !");
                $("#success-alert").fadeTo(5000, 1000).slideUp(1000, function () {
                    $("#success-alert").slideUp(1000);
                    $('.successPopup').hide();
                });
            })
        }
    })


    // save notification
    function savenoti() {
        $.when(
            (() => {
                if (formData1 != null) {
                    $.ajax({
                        url: '/dashboard/iconnotification/' + idApp,
                        data: formData1,
                        contentType: false,
                        processData: false,
                        async: false,
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
                        async: false,
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
                        async: false,
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
                        async: false,
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
                        async: false,
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
                        async: false,
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
                        async: false,
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
                        async: false,
                        type: 'POST',
                        success: function (data) {}
                    })
                }
            })(),
            (() => {
                $.ajax({
                    url: "/dashboard/save-data-notification/" + idApp,
                    data: JSON.stringify({
                        title,
                        content,
                        colorTitle,
                        colorContent,
                        colorLed,
                        colorAccent,
                        internalLink: [{
                            typeUrl,
                            url
                        }],
                        sendToUser,
                        exclude,
                        devices_test

                    }),
                    dataType: "json",
                    async: false,
                    type: 'POST',
                    success: function (data) {}
                })
                // }
            })()
        )
    }
    //----------------------------------


});