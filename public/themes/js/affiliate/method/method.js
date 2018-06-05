// function showFile(blob) {

//     var newBlob = new Blob([blob], {
//         type: "application/video"
//     })

//     if (window.navigator && window.navigator.msSaveOrOpenBlob) {
//         window.navigator.msSaveOrOpenBlob(newBlob);
//         return;
//     }

//     const data = window.URL.createObjectURL(newBlob);
//     var link = document.createElement('a');
//     link.href = data;
//     link.download = "video.mp4";
//     link.click();
//     setTimeout(() => {
//         window.URL.revokeObjectURL(data);
//     }, 100);
// }



$(document).ready(() => {
    // showFile("blob:http://kenh14.vn/58330089-4ad1-4518-9e4c-e5cbe68e6fae");
    var get_val = "";
    var id_method_use = document.getElementsByClassName("id-method-use");
    var btndelete = document.getElementsByClassName("deleteuser");
    var deleteuser = document.getElementsByClassName("delete-user");
    var elementdelete = document.getElementsByClassName("element-delete");
    var emaildelete = document.getElementsByClassName("text-email");
    var trmyteam = document.getElementsByClassName('tr-content-appversion');
    var email;
    var settr;
    for (let i = 0; i < $('.deleteuser').length; i++) {
        btndelete[i].addEventListener('click', (event) => {
            console.log("abc")
            if (deleteuser[i].style.display === "none") {
                deleteuser[i].style.display = "block";
            } else {
                deleteuser[i].style.display = "none";
            }
            settr = i;
            event.stopPropagation();
        })
        elementdelete[i].addEventListener('click', () => {
            get_val = id_method_use[i].value
        })
    }
    $(body).click(() => {
        $('.delete-user').hide();
    })


    $("#delete-ok").click(() => {
        $.ajax({
            url: "/affiliate/payment-method/delete",
            dataType: "json",
            type: "POST",
            data: {
                id: get_val
            },
            success: function (data) {
                window.location.href = "/affiliate/payment-method";
            }
        })
    })

    var accountnumber = $("#account-number-method");
    var method = "paypal";

    var errempty = "Can not be empty";

    function trimSpace(str) {
        return str.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, "").replace(/\s+/g, " ");
    }

    function errAccount(a, b) {
        a.val("");
        a.attr({
            "class": "resetinputloginerr",
            "placeholder": errempty
        });
        b.attr("src", "/themes/img/login/iconerr.png");
        a.focus();
    }

    function checkPaymentMethod() {
        if (trimSpace(accountnumber.val()) == "") {
            errAccount(accountnumber, $("#iconerr1"));
            return false;
        }
        return true;
    }

    $("#form-method").submit(() => {
        if (checkPaymentMethod() == true) {
            $("#loading").show();
            $.ajax({
                url: "/affiliate/payment-method/add/ok",
                dataType: "json",
                type: "POST",
                data: {
                    accountNumber: accountnumber.val(),
                    method
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log('jqXHR:');
                    console.log(jqXHR);
                    console.log('textStatus:');
                    console.log(textStatus);
                    console.log('errorThrown:');
                    console.log(errorThrown);
                },
                success: function (data) {
                    if (data.status == "1") {
                        window.location.href = "/affiliate/payment-method";
                    }
                }
            }).always(() => {
                $("#loading").hide();
            })
        }
    })
})