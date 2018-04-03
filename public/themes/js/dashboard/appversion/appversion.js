$(document).ready(() => {
    if (window.location.pathname.toLowerCase() == "/dashboard/appversion") {
        $('#app-used-menuleft').css("background", "#00afee");
        $('#app-used-menuleft').css('color', '#fff')
        $('#appversion').css('color', '#00afee')
    }
    // $('#text-href').text("App Version");
    var nameapp = document.getElementsByClassName("nameapp-appversion");
    var version = document.getElementsByClassName("table-version");
    for (let i = 0; i < $('.tr-content-appversion').length; i++) {
        $("#more-changelog" + i).click(() => {
            $('.dialogdeleteapp-head-history').text($("#nameapp-appversion").val() + " " + version[i].innerHTML);
            $('.headlog').text("Release version" + version[i].innerHTML);
            $('.content-changelog').text($("#content-changelog-hiden" + i).val())
        })
    }
    ///////////////// ICON EYE BUILD DASHBOARD////////////
    $('#icon-eye-hide-build').hide();
    $('#icon-eye-build').click(function () {
        $('#keystore').attr("type", "text");
        // $('#iconeye').attr("src", "/themes/img/login/iconeyehide.png")
        $('#icon-eye-build').hide();
        $('#icon-eye-hide-build').show();
    });
    $('#icon-eye-hide-build').click(function () {
        $('#keystore').attr("type", "password");
        // $('#iconeye').attr("src", "/themes/img/login/iconeyehide.png")
        $('#icon-eye-hide-build').hide();
        $('#icon-eye-build').show();
    });
    ///////////////// ICON EYE BUILD UPDATE DASHBOARD////////////
    $('#icon-eye-hide-build-update').hide();
    $('#icon-eye-build-update').click(function () {
        $('#password_keystore').attr("type", "text");
        // $('#iconeye').attr("src", "/themes/img/login/iconeyehide.png")
        $('#icon-eye-build-update').hide();
        $('#icon-eye-hide-build-update').show();
    });
    $('#icon-eye-hide-build-update').click(function () {
        $('#password_keystore').attr("type", "password");
        // $('#iconeye').attr("src", "/themes/img/login/iconeyehide.png")
        $('#icon-eye-hide-build-update').hide();
        $('#icon-eye-build-update').show();
    });
    //

    // $('.btn-deploy-app-dash').click(clickdeployapp('sms_box'));
    // $('.btn-deploy-app-dash').on('click', function(sms_box) {
    //     alert(JSON.stringify(sms_box));
    // });

    var idApp, version, platform;

});

function clickdeployapp(idApp, version) {
    console.log(idApp);
    console.log(version);
    idApp = idApp;
    version = version;
    $('#idapp').val(idApp);
    $('#version').val(version);
    $('#dialog-noti-choose-android-dashboard').fadeIn();
    var platform = "";
    $("#ios").click(function () {
        $('#platformval').val('ios');
        $(".pl-ios").addClass("platform-active");
        $(".tile-pl-ios").css("color", "#00afee")
        $(".pl-android").removeClass("platform-active");
        $(".tile-pl-android").css("color", "#6e7786");
        platform = 'ios';
        $('#platform').val(platform);
        // alert(platform);
    });
    $("#android").click(function () {
        $('#platformval').val('android');
        // $(".pl-ios").removeClass("platform-active");
        $(".pl-android").addClass("platform-active");
        $(".tile-pl-android").css("color", "#00afee")

        $(".pl-ios").removeClass("platform-active");
        // $(".pl-android").addClass("platform-active");
        $(".tile-pl-ios").css("color", "#6e7786")
        platform = 'android';
        $('#platform').val(platform);
        // alert(platform);
        //Do stuff when clicked
    });

    $('#btn-next-platform-dash').click(() => {
        $(".pl-android").removeClass("platform-active");
        $(".pl-ios").removeClass("platform-active");
        if (platform == "") {
            // alert(platform);
            $('.errPopup').show();
            $('.alert-upload').html('Please choose a platform');
            $("#danger-alert").fadeTo(3000, 1000).slideUp(1000, function () {
                $("#danger-alert").slideUp(1000);
                $('.errPopup').hide();
            });
        } else {
            if (platform == 'android') {
                $('#dialog-noti-choose-android-dashboard').fadeOut();
                $("#dialog-build-android-dashboard").fadeIn();
            } else {
                $('#dialog-noti-choose-android-dashboard').fadeOut();
                $("#dialog-build-ios-dashboard").fadeIn();
            }
        }
    });
    $('#btn-close-platform-dash').click(function() {
        platform = "";
        $('#dialog-noti-choose-android-dashboard').hide();

    });
    $('#btn-close-deployapp-dash').click(function() {
        platform = "";
        $('#dialog-build-android-dashboard').hide();
    });

}