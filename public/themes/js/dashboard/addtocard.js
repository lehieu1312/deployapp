function addProduct(idApp) {
    $.ajax({
        url: "/add-product-cart",
        type: "POST",
        dataType: "json",
        data: {
            idApp
        },
        success: function () {

        }
    })
}

function removeProduct(idApp) {
    $.ajax({
        url: "/remove-product-cart",
        type: "POST",
        dataType: "json",
        data: {
            idApp
        },
        success: function () {

        }
    })
}

function remove_all_product() {
    var total_price_product = document.getElementsByClassName("total-price-product");
    $(".content-modal-cart").find(".item-product-in-cart").each(function (i) {
        $(this).find(".set-icon-delte-app-checkout").click(() => {
            console.log($(this).find(".number-product").text())
            $(this).hide();
            $(".total-price-product").text("$" + (Number(trimSpace(total_price_product[0].textContent).split("$")[1]) - Number($(this).find(".price-hidden").val()) * Number($(this).find(".number-product").text())))
            $.ajax({
                url: "/remove-product-all-in-cart",
                type: "POST",
                dataType: "json",
                data: {
                    idApp: $(this).find(".idApp-hidden").val()
                },
                success: function (data) {
                    if (data.status == "1") {

                    }
                }
            })
        })
    })
}



function add_and_removeProduct() {
    function trimSpace(str) {
        return str.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, "").replace(/\s+/g, " ");
    }
    var number_product = document.getElementsByClassName("number-product");
    var price_product = document.getElementsByClassName("price-product");
    var price_hidden = document.getElementsByClassName('price-hidden');
    var total_price_product = document.getElementsByClassName("total-price-product");
    var idApp_hidden = document.getElementsByClassName(' idApp-hidden');

    $('.reduce-product').each(function (i) {
        $(this).click(() => {
            if (Number(number_product[i].textContent) > 1) {
                number_product[i].innerHTML = Number(number_product[i].textContent) - 1;
                price_product[i].innerHTML = "$" + (price_hidden[i].value) * (Number(number_product[i].textContent));
                $(".total-price-product").text("$" + (Number(trimSpace(total_price_product[0].textContent).split("$")[1]) - Number(price_hidden[i].value)))
                removeProduct(idApp_hidden[i].value)
            }
        })
    })
    $('.add-product').each(function (i) {
        $(this).click(() => {
            number_product[i].innerHTML = Number(number_product[i].textContent) + 1;
            price_product[i].innerHTML = "$" + (price_hidden[i].value) * (Number(number_product[i].textContent));
            $(".total-price-product").text("$" + (Number(trimSpace(total_price_product[0].textContent).split("$")[1]) + Number(price_hidden[i].value)))
            addProduct(idApp_hidden[i].value)
        })
    })
}

$(document).ready(() => {

    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
        // console.log(sPageURL);
        // console.log(sURLVariables);
        // console.log(sPageURL);
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {

                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
            // console.log(sParameterName);
        }

    };

    var checkout = getUrlParameter("checkout");
    // console.log(checkout)

    if (checkout == "ok") {
        $("#myModal-success").modal('show');
    }


    let idappadmin = document.getElementsByClassName("id-app-admin");
    $('.add-to-cart').each(function (i) {
        $(this).click(() => {
            $('#loading').show();
            $("#content-modal-cart").html("");
            $.ajax({
                url: "/dashboard/add-to-cart",
                type: "POST",
                datatype: "json",
                data: {
                    idApp: idappadmin[i].value
                },
                success: function (data) {
                    if (data.status == "1") {
                        let tong = 0;
                        $("#content-modal-cart-id").html("");
                        if (data.cart.length > 0) {
                            $("#number-product-to-cart").text(data.cart.length);
                            $("#number-product-to-cart").show();
                        } else {
                            $("#number-product-to-cart").hide();
                        }
                        for (let i = 0; i < data.cart.length; i++) {
                            $("#content-modal-cart-id").append(
                                `<div class="item-product-in-cart">
                            <div class="left-content-product-in-cart">
                               <img src="/themes/img/app-dashboard/${data.cart[i].cart.image}">
                            </div>
                            <div class="right-content-product-in-cart">
                                <span>${data.cart[i].cart.nameApp}</span></br>
                                <span> 
                                <input hidden class="idApp-hidden" value="${data.cart[i].cart.idApp}">
                                <input hidden class="price-hidden" value="${data.cart[i].cart.price}">
                                ${"$" + data.cart[i].cart.price}
                                </span>
                                <span class="set-text-olde-price">${"$" + data.cart[i].cart.cost}</span>
                                <div class="border-add-product">
                                    <div class="set-btn-cart float-left reduce-product">-</div>
                                    <div class="set-input-add-product float-left number-product">${data.cart[i].count}</div>
                                    <div class="set-btn-cart float-left add-product">+</div>
                                    <div class="float-right">
                                    <span class="price-product">${"$" + data.cart[i].cart.price*data.cart[i].count}</span>
                                    </div>
                                </div>
                            </div>
                            <img class="set-icon-delte-app-checkout" src="/themes/img/checkout/icondeletesmallv2.png">
                        </div>`)
                            tong = tong + data.cart[i].cart.price * data.cart[i].count;
                        }
                        $(".total-price-product").text("$" + tong);
                    }
                }
            }).always(() => {
                $('#loading').hide();
                $("#modal-cart").modal('show');
                add_and_removeProduct();
                remove_all_product();
            })
        })
    })
})