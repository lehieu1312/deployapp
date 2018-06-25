$(document).ready(() => {
    var istest_client = document.getElementsByClassName('value-is-test');
    var idUser = document.getElementsByClassName('value-id-user');
    var status_test = document.getElementsByClassName("status-test");
    $(".btn-to-test").each(function (i) {
        var istest;
        $(this).click(() => {
            if (istest_client[i].value == "true") {
                istest = false;
            } else {
                istest = true;
            }
            $.ajax({
                url: "/dashboard/notification/alluser/edituser",
                data: {
                    isTest: istest,
                    id: idUser[i].value
                },
                dataType: "json",
                type: 'POST',
                success: function (data) {
                    if (data.status == 1) {
                        console.log("ok");
                        // window.location.href = "/dashboard/notification/alluser/" + $("#idapp-using").val()
                    }
                }
            }).always(()=>{
                if (istest_client[i].value == "true") {
                    $(this).addClass("btn-deploy");
                    $(this).removeClass("btn-del-to-test");
                    $(this).text("Add to Test");
                    status_test[i].text = "no";
                    istest_client[i].value = "false";
                } else {
                    $(this).addClass("btn-del-to-test");
                    $(this).removeClass("btn-deploy");
                    $(this).text("Delete to Test");
                    status_test[i].text = "yes";
                    istest_client[i].value = "true";
                }
            })
        })
    })
})