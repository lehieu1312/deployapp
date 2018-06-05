$(document).ready(() => {
    if ($("#value-setting").val() == "false") {
        $("#myModal-checksettting").modal("show");
    }

    $("#delete-ok").click(() => {
        window.location.href = "/dashboard/appsettings/" + $("#app-setting").val();
    })
    $('#myModal-checksettting').on('hidden.bs.modal', function() {
        window.location.href = "/dashboard/appsettings/" + $("#app-setting").val();
    });

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
    $('#icon-eye-build').click(function() {
        $('#keystore').attr("type", "text");
        // $('#iconeye').attr("src", "/themes/img/login/iconeyehide.png")
        $('#icon-eye-build').hide();
        $('#icon-eye-hide-build').show();
    });
    $('#icon-eye-hide-build').click(function() {
        $('#keystore').attr("type", "password");
        // $('#iconeye').attr("src", "/themes/img/login/iconeyehide.png")
        $('#icon-eye-hide-build').hide();
        $('#icon-eye-build').show();
    });
    ///////////////// ICON EYE BUILD UPDATE DASHBOARD////////////
    $('#icon-eye-hide-build-update').hide();
    $('#icon-eye-build-update').click(function() {
        $('#password_keystore').attr("type", "text");
        // $('#iconeye').attr("src", "/themes/img/login/iconeyehide.png")
        $('#icon-eye-build-update').hide();
        $('#icon-eye-hide-build-update').show();
    });
    $('#icon-eye-hide-build-update').click(function() {
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

    var idAppAdmin, versionAdmin, platform, idAppUser;

});

function clickdeployapp(fIDAppAdmin, fVersionAdmin, idAppUser) {
    console.log(fIDAppAdmin);
    console.log(fVersionAdmin);
    $('#idappadminplatform').val(fIDAppAdmin);
    $('#versionadminlatform').val(fVersionAdmin);
    $('#idappuserplatform').val(idAppUser);
    $('#dialog-noti-choose-android-dashboard').fadeIn();
    var platform = "";
    $("#ios").click(function() {
        $('#platformval').val('ios');
        $(".pl-ios").addClass("platform-active");
        $(".tile-pl-ios").css("color", "#00afee")
        $(".pl-android").removeClass("platform-active");
        $(".tile-pl-android").css("color", "#6e7786");
        platform = 'ios';
        $('#platform').val(platform);
        // alert(platform);
    });
    $("#android").click(function() {
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
            $("#danger-alert").fadeTo(3000, 1000).slideUp(1000, function() {
                $("#danger-alert").slideUp(1000);
                $('.errPopup').hide();
            });
        } else {

            $('#loading').show();
            $.ajax({
                url: "/dashboard/platform-dash",
                type: "POST",
                data: {
                    platform: $('#platform').val(),
                    versionadmin: $('#versionadminlatform').val(),
                    idappadmin: $('#idappadminplatform').val(),
                    idappuser: $('#idappuserplatform').val()
                },
                success: function(result) {
                    if (result.status == 1) {
                        $("#dialog-build-android-dashboard").fadeOut();
                        console.log(result);
                        var arrFile = result.arrFileParams;
                        $("#fmIDUser").val(result.keyFolder);
                        $("#fmPlatform").val(result.platformApp);
                        $("#fmversionadmin").val(result.versionAppAdmin);
                        $("#fmidappadmin").val(result.idAppAdmin);

                        for (var j = 0; j < arrFile[0].field.length; j++) {
                            var type = arrFile[0]['field'][j]['$'].type;
                            var required = arrFile[0]['field'][j]['$'].required;
                            var rules = arrFile[0]['field'][j]['$'].rules;
                            var maxLength = arrFile[0]['field'][j]['$'].maxLength;
                            var vDefault = arrFile[0]['field'][j]['$'].Default;
                            console.log(vDefault);
                            var name = arrFile[0]['field'][j]['$'].name;
                            var path = arrFile[0]['$'].path;
                            $('#fmSetting').append(`<div class="form-group group-input-setting has-feedback input-error">
                                <label class="control-label ">
                                ` + arrFile[0]['field'][j]['$'].label + `
                                </label>
                                
                                ` + (type == 'string' ? `
                                <div class="` + rules + `">
                                <input class="form-control" maxlength="` + maxLength + `" required="` + required + `" type="text" name="` + path + `=` + name + `" rules="` + rules + `"
                                value="` + (typeof vDefault != 'undefined' ? vDefault : '') + `" />

                                </div>
                                  ` : '') + `` +
                                (type == 'boolean' ? `
                                  <div class="">
                                  <label class="radio-inline">
                                   <input type="radio" name="` + path + `=` + name + `"  value="true" checked rules="` + rules + `" /> true
                              </label>
                                  <label class="radio-inline">
                                  <input type="radio" name="` + path + `=` + name + `"  value="false" rules="` + rules + `" /> false
                              </label>
                              </div>
                                  ` : '') +
                                `
                                </div>`);
                        }

                        $('#dialog-noti-choose-android-dashboard').fadeOut();
                        $("#dialog-setting-app-dashboard").fadeIn();

                    } else if (result.status == 2) {
                        // alert(result.content[0]['msg']);
                        console.log(JSON.stringify(result.content));
                        $('.errPopup').show();
                        $('.alert-upload').html(result.content[0]['msg']);
                    } else if (result.status == 3) {
                        $('.errPopup').show();
                        $('.alert-upload').html(result.content);
                    } else {
                        $('.errPopup').show();
                        $('.alert-upload').html('Oops, something went wrong');
                    }
                },
                error: function(jqXHR, exception) {
                        $('.errPopup').show();
                        $('.alert-upload').html('Oops, something went wrong');
                    }
                    // timeout: 300000
            }).always(function(data) {
                $('#loading').hide();
            });




        }
    });
    $('#btn-close-platform-dash').click(function() {
        platform = "";
        $('#dialog-noti-choose-android-dashboard').hide();

    });
    $('#btn-close-setting-app-dash').click(function() {
        platform = "";
        $('#dialog-setting-app-dashboard').hide();

    });

    $('#btn-close-deployapp-dash').click(function() {
        platform = "";
        $('#dialog-build-android-dashboard').hide();
    });
    $('#btn-close-deploy-ios-dash').click(function() {
        platform = "";
        $('#dialog-build-ios-dashboard').hide();
    });


}