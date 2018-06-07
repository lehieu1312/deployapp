$(document).ready(() => {
    $.ajax({
        url: "/delete/promo-code",
        dataType: "json",
        type: "POST",
        data: {
            promoCode: $("#promo-code").val()
        },
        success: function (data) {
            if (data.status == "1") {
                $(".set-div-promo").hide();
                $(".total-price-product").text("$" + data.message);
            }
        }
    })

    // var testObject = {
    //     a: 1,
    //     b: 2
    // }
    // var testObject1 = {
    //     c: 3,
    //     d: 4
    // }
    // testObject.merge(testObject1);
    // console.log(Object.assign(testObject, testObject1))

    // add_and_removeProduct();

    $('#deploy-detail-content').click(() => {
        $('#country1').hide();
    })
    $(".clickcountry").click((event) => {
        $('#country1').toggle();
        event.stopPropagation();
    });
    var country_checkout = $("#checkout-country").val();
    $('#country1').children("option").click(function () {
        $("#checkout-country").text($(this).text());
        $("#checkout-country").val($(this).val());
        country_checkout = $(this).val();
        $('#country1').hide();
    });

    var firstname = $('#checkout-firstname');
    var lastname = $('#checkout-lastname');
    var company = $('#checkout-company');
    var address = $('#checkout-address');
    var city = $('#checkout-city');
    var state = $('#checkout-state');
    var zipcode = $('#checkout-zipcode');
    var mobiphone = $('#checkout-mobiphone');
    var email = $('#checkout-email');

    // regex
    function trimSpace(str) {
        return str.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, "").replace(/\s+/g, " ");
    }

    var name1Reg = /([_+.!@#$%^&*();\/|<>"'])+/;
    var addressReg = /([+!@#$%^*();\|<>"'])+/;
    var nameReg = /^(([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+)|([a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*)$/;
    var numberReg = /^[a-zA-Z0-9]*$/;
    var emailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    var errname = "Syntax error";
    var errempty = "Can not be empty";
    var erremail = "Your email is not valid";
    var errpass = "Please enter at least 6 characters";
    var errconfirmpass = "Please enter the same password as above";
    var errzipcode = "Zipcode is malformed";

    function fnerrzipcode(a, b) {
        a.val("");
        a.attr({
            "class": "resetinputloginerr",
            "placeholder": errzipcode
        });
        b.attr("src", "/themes/img/login/iconerr.png");
        a.focus();
    }

    function fnerrconfirmpass(a, b) {
        a.val("");
        a.attr({
            "class": "resetinputloginerr",
            "placeholder": errconfirmpass
        });
        b.attr("src", "/themes/img/login/iconerr.png");
        a.focus();
    }

    function fnerrpass(a, b) {
        a.val("");
        a.attr({
            "class": "resetinputloginerr",
            "placeholder": errpass
        });
        b.attr("src", "/themes/img/login/iconerr.png");
        a.focus();
    }

    function fnerrempty(a, b) {
        a.val("");
        a.attr({
            "class": "resetinputloginerr",
            "placeholder": errempty
        });
        b.attr("src", "/themes/img/login/iconerr.png");
        a.focus();
    }

    function fnerrname(a, b) {
        a.val("");
        a.attr({
            "class": "resetinputloginerr",
            "placeholder": errname
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

    function hideerryey(a, b) {
        a.attr({
            "class": "resetinputlogin"
        });
        b.attr("src", "/themes/img/login/iconeye1.png");
    }

    function form_checkout() {
        //------------------------------------------
        if (trimSpace(firstname.val()) == "") {
            fnerrempty(firstname, $('#iconerr1'));
            return false;
        } else if (name1Reg.test(firstname.val()) == true) {
            fnerrname(firstname, $('#iconerr1'));
            return false;
        } else {
            hideerr(firstname, $('#iconerr1'));
        }
        //------------------------------------------
        if (trimSpace(lastname.val()) == "") {
            fnerrempty(lastname, $('#iconerr2'));
            return false;
        } else if (name1Reg.test(lastname.val()) == true) {
            fnerrname(lastname, $('#iconerr2'));
            return false;
        } else {
            hideerr(lastname, $('#iconerr2'));
        }
        //------------------------------------------
        if (trimSpace(company.val()) == "") {
            fnerrempty(company, $('#iconerr3'));
            return false;
        } else if (addressReg.test(company.val()) == true) {
            fnerrname(company, $('#iconerr3'));
            return false;
        } else {
            hideerr(company, $('#iconerr3'));
        }
        //------------------------------------------
        if (trimSpace(address.val()) == "") {
            fnerrempty(address, $('#iconerr4'));
            return false;
        } else if (addressReg.test(address.val()) == true) {
            fnerrname(address, $('#iconerr4'));
            return false;
        } else {
            hideerr(address, $('#iconerr4'));
        }
        //------------------------------------------
        if (trimSpace(city.val()) == "") {
            fnerrempty(city, $('#iconerr5'));
            return false;
        } else if (addressReg.test(city.val()) == true) {
            fnerrzipcode(city, $('#iconerr5'));
            return false;
        } else {
            hideerr(city, $('#iconerr5'));
        }
        //------------------------------------------
        if (trimSpace(state.val()) == "") {
            fnerrempty(state, $('#iconerr6'));
            return false;
        } else if (addressReg.test(state.val()) == true) {
            fnerrzipcode(state, $('#iconerr6'));
            return false;
        } else {
            hideerr(state, $('#iconerr6'));
        }
        //------------------------------------------
        if (trimSpace(zipcode.val()) == "") {
            fnerrempty(zipcode, $('#iconerr7'));
            return false;
        } else if (numberReg.test(zipcode.val()) == false) {
            fnerrzipcode(zipcode, $('#iconerr7'));
            return false;
        } else {
            hideerr(zipcode, $('#iconerr7'));
        }
        //------------------------------------------
        if (trimSpace(mobiphone.val()) == "") {
            fnerrempty(mobiphone, $('#iconerr8'));
            return false;
        } else if (numberReg.test(mobiphone.val()) == false) {
            fnerrname(mobiphone, $('#iconerr8'));
            return false;
        } else {
            hideerr(mobiphone, $('#iconerr8'));
        }
        //------------------------------------------
        if (trimSpace(email.val()) == "") {
            fnerrempty(email, $('#iconerr9'));
            return false;
        } else if (emailReg.test(email.val()) == false) {
            fnerrname(email, $('#iconerr9'));
            return false;
        } else {
            hideerr(email, $('#iconerr9'));
        }
        return true;
    };

    var promoCode = "";

    $("#apply-promo-code").click(() => {
        $.ajax({
            url: "/checkout/check-promo-code",
            dataType: "json",
            type: "POST",
            data: {
                promoCode: $("#promo-code").val()
            },
            success: function (data) {
                if (data.status == "1") {
                    var total_price_product = document.getElementsByClassName("total-price-product");
                    $(".set-div-promo").html("");
                    $(".set-div-promo").append(
                        `<span>Discount (PORMO${data.message}: -${data.message}%)
                        <img class="set-icon-delte-promo" src="/themes/img/checkout/icondeletesmall.png"> </span>
                        <span class="float-right price-promo">
                        ${"-$" + Math.round(data.message*Number(trimSpace(total_price_product[0].textContent).split("$")[1])/100)}
                        </span>`)
                    $(".set-div-promo").show();
                    $(".total-price-product").text("$" + (Number(trimSpace(total_price_product[0].textContent).split("$")[1]) - Math.round(data.message * Number(trimSpace(total_price_product[0].textContent).split("$")[1]) / 100)));
                    $('#successPopup').show(500);
                    $(".contenemail").text("");
                    $(".contenemail").text("successful");
                    $("#success-alert").fadeTo(5000, 1000).slideUp(1000, function () {
                        $("#success-alert").slideUp(1000);
                        $('.successPopup').hide();
                    });
                } else if (data.status == "2") {
                    $('#errPopup').show();
                    $('.alert-upload').text(data.message);
                    $("#errPopup").fadeTo(5000, 1000).slideUp(1000, function () {
                        $("#errPopup").slideUp(1000);
                        $('#errPopup').hide();
                    });
                }
            }
        }).always(() => {
            $(".set-icon-delte-promo").click(() => {
                $.ajax({
                    url: "/delete/promo-code",
                    dataType: "json",
                    type: "POST",
                    data: {
                        promoCode: $("#promo-code").val()
                    },
                    success: function (data) {
                        if (data.status == "1") {
                            $(".set-div-promo").hide();
                            $(".total-price-product").text("$" + data.message);
                        }
                    }
                })
            })
        })
    })

    $('#form-checkout').submit(function () {
        let total_price_product = document.getElementsByClassName("total-price-product");
        if (form_checkout() == true) {
            $("#loading").show();
            $.ajax({
                url: "/checkout/ok",
                type: "POST",
                dataType: "json",
                crossDomain: "true",
                data: {
                    firstName: firstname.val(),
                    lastName: lastname.val(),
                    company: company.val(),
                    address: address.val(),
                    city: city.val(),
                    codeCountry: country_checkout,
                    state: state.val(),
                    zipCode: zipcode.val(),
                    phoneNumber: mobiphone.val(),
                    email: email.val(),
                },
                success: function (data) {
                    // console.log(data)
                    if (data.status == "1") {
                        window.location.replace(data.message);
                    }
                },
                error: function (msg) {
                    alert('error' + msg);
                    return false;
                }
            }).always(() => {
                $("#loading").hide();
            });
        }
    });


});