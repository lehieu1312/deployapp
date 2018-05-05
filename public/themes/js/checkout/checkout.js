$(document).ready(() => {

    // add_and_removeProduct();

    $('#deploy-detail-content').click(() => {
        $('#country1').hide();
    })
    $(".clickcountry").click((event) => {
        $('#country1').toggle();
        event.stopPropagation();
    });
    $('#country1>li').click(function () {
        $("#checkout-country").text($(this).text());
        $("#checkout-country").val($(this).val());
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

    $('#form-checkout').submit(function () {
        let total_price_product = document.getElementsByClassName("total-price-product");
        if (form_checkout() == true) {
            $("#loading").show();
            $.ajax({
                url: "/checkout/ok",
                type: "POST",
                dataType: "json",
                data: {
                    firstname: firstname.val(),
                    lastname: lastname.val(),
                    company: company.val(),
                    address: address.val(),
                    city: city.val(),
                    state: state.val(),
                    zipcode: zipcode.val(),
                    mobiphone: mobiphone.val(),
                    email: email.val(),
                    total: Number(trimSpace(total_price_product[0].textContent).split("$")[1])
                },
                succsess: function () {

                }
            }).always(() => {
                $("#loading").hide();
            })
        }
    })


})