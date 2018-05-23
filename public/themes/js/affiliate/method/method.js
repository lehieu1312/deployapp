$(document).ready(() => {
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