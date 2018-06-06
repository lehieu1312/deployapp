var th = ['', 'thousand', 'million', 'billion', 'trillion'];
var dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
var tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
var tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function toWords(s) {
    s = s.toString();
    s = s.replace(/[\, ]/g, '');
    if (s != parseFloat(s)) return 'not a number';
    var x = s.indexOf('.');
    if (x == -1)
        x = s.length;
    if (x > 15)
        return 'too big';
    var n = s.split('');
    var str = '';
    var sk = 0;
    for (var i = 0; i < x; i++) {
        if ((x - i) % 3 == 2) {
            if (n[i] == '1') {
                str += tn[Number(n[i + 1])] + ' ';
                i++;
                sk = 1;
            } else if (n[i] != 0) {
                str += tw[n[i] - 2] + ' ';
                sk = 1;
            }
        } else if (n[i] != 0) { // 0235
            str += dg[n[i]] + ' ';
            if ((x - i) % 3 == 0) str += 'hundred ';
            sk = 1;
        }
        if ((x - i) % 3 == 1) {
            if (sk)
                str += th[(x - i - 1) / 3] + ' ';
            sk = 0;
        }
    }

    if (x != s.length) {
        var y = s.length;
        str += 'point ';
        for (var i = x + 1; i < y; i++)
            str += dg[n[i]] + ' ';
    }
    return str.replace(/\s+/g, ' ');
}

function IsNumeric(input) {
    return (input - 0) == input && ('' + input).trim().length > 0;
}





$(document).ready(() => {
    var amount = $("#amount-withdrawal");
    var currency = "USD";
    var method = "paypal";
    var note = $(".textarea-withdrawal");
    var balance = $("#balance-withdrawal").val();

    var errAmount = "Your account is not suffcient to perform this transaction.";
    var errnumber = "Please enter number";

    function errBalance(a, b) {
        a.val("");
        a.attr({
            "class": "resetinputloginerr",
            "placeholder": errAmount
        });
        b.attr("src", "/themes/img/login/iconerr.png");
        a.focus();
    }

    function fnerrNumber(a, b) {
        a.val("");
        a.attr({
            "class": "resetinputloginerr",
            "placeholder": errnumber
        });
        b.attr("src", "/themes/img/login/iconerr.png");
        a.focus();
    }

    function hideerr(a, b) {
        a.attr({
            "class": "resetinputlogin"
        });
        b.attr("src", "");
    }


    $('.select-product').click((event) => {
        let offset = $('.select-product').children('.set-img-product-url').offset();
        $("#select-product-url").toggle().offset({
            top: offset.top + 22,
            left: offset.left - 115
        });
        if (document.getElementById('select-product-url').style.display != "none") {
            $('.select-product-url').find('li').each(function (i) {
                if (i == 0) {
                    $(this).click(() => {
                        currency = "USD";
                        $(".text-currency").text("USD");
                    })
                }
                if (i == 1) {
                    $(this).click(() => {
                        currency = "GBP";
                        $(".text-currency").text("GBP");
                        console.log("GBP")
                    })
                }
                if (i == 2) {
                    $(this).click(() => {
                        currency = "EUR";
                        $(".text-currency").text("EUR");
                    })
                }

                if (i == 3) {
                    $(this).click(() => {
                        currency = "AUD";
                        $(".text-currency").text("AUD");
                    })
                }

            })
        }
        event.stopPropagation();
    });
    $('body').click(() => {
        $(".select-product-url").hide();
    })


    function checkFormWithdrawal() {
        // console.log(IsNumeric(amount.val()))
        if (IsNumeric(amount.val()) == false) {
            fnerrNumber(amount, $('#iconerr1'));
            return false;
        } else {
            if (amount.val() > Number(balance)) {
                errBalance(amount, $('#iconerr1'));
                return false;
            } else {
                hideerr(amount, $('#iconerr1'))
            }
        }
        if (currency != "USD") {
            $('#errPopup').show();
            $('.alert-upload').text("Currently, the service only pays in dollars !");
            $("#errPopup").fadeTo(5000, 1000).slideUp(1000, function () {
                $("#errPopup").slideUp(1000);
                $('#errPopup').hide();
            });
            return false;
        }
        return true;
    }
    $("#continue-withdrawal").click(() => {
        if (checkFormWithdrawal() == true) {
            $("#continue-withdrawal").hide();
            $("#back-withdrawal").show();
            $("#submit-withdrawal").text("Withdrawal: $" + amount.val());
            $("#submit-withdrawal").show();
            $(".withdrawal-affiliate").hide();
            $(".right-content-detail-affiliate").html("");
            $(".right-content-detail-affiliate").append(
                `
                    <span>
                     ${method}
                    </span>
                    <br>
                    <span>${"$" + (balance - amount.val() - amount.val()*3/100).toFixed(1) } </span>
                    <br>
                    <span>
                    ${method}
                    </span>
                    <br>
                    <span>
                    ${method}
                    </span>
                    <br>
                    <span>
                        ${$("#fullname-withdrawal").val()}
                    </span>
                    <br>
                    <span>
                    ${"$" + amount.val()}
                            <br>
                            <span>(
                                ${toWords(amount.val())} dollars)</span>
                    </span>
                    <br>

                    <span>
                       ${"$" + amount.val()*3/100}
                    </span>
                    <br>
                    <span>
                       ${method}
                    </span>
                    <br>
                    <span>
                       ${note.val()}
                    </span>
                    <br>
                `
            );
            $("#detail-withdrawal").show();
        }
    })
    $("#back-withdrawal").click(() => {
        $("#continue-withdrawal").show();
        $("#back-withdrawal").hide();
        $("#submit-withdrawal").hide();
        $(".withdrawal-affiliate").show();
        $("#detail-withdrawal").hide();

    })

    $('#form-withdrawal').submit(() => {
        if (checkFormWithdrawal() == true) {
            $("#loading").show();
            $.ajax({
                url: "/affiliate/withdrawal/ok",
                dataType: "json",
                type: "POST",
                data: {
                    amount: amount.val(),
                    currency: currency,
                    method: method,
                    note: note.val(),
                    balance: balance
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
                        $("#myModal-success-withdrawal").find(".content-success").html("");
                        $("#myModal-success-withdrawal").find(".content-success").append(
                            `
                            <span>Thank you! You tranferred  <span class= "set-text-money">${"$" + amount.val()}</span> to account <span class= "set-text-money">${$("#codeShare-withdrawal").val()}</span> </span>
                            <br>
                            <span>(Fee <span class= "set-text-money">${"$" + amount.val()*3/100}</span>)</span>
                            <br>
                            <br>
                            <span>Balance account is : <span class= "set-text-money">${"$" +  data.balance}</span></span>
                            `
                        )
                        $("#myModal-success-withdrawal").modal("show");
                    }
                    if (data.status == "2") {
                        $('#errPopup').show();
                        $('.alert-upload').text(data.message);
                        $("#errPopup").fadeTo(5000, 1000).slideUp(1000, function () {
                            $("#errPopup").slideUp(1000);
                            $('#errPopup').hide();
                        });
                    }
                }
            }).always(() => {
                $("#loading").hide();
                $("#done-withdrawal").click(() => {
                    window.location.href = "/affiliate/withdrawal";
                })
                $('#myModal-success-withdrawal').on('hidden.bs.modal', function () {
                    window.location.href = "/affiliate/withdrawal";
                });
            })
        }
    })

})