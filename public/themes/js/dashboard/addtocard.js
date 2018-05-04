$(document).ready(() => {
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
                        console.log(data.cart)
                        $("#number-product-to-cart").text(data.cart.length);
                        for (let i = 0; i < data.cart.length; i++) {
                            $("#content-modal-cart").append(
                                `<div class="item-product-in-cart">
                            <div class="left-content-product-in-cart">
                                <img src="/themes/img/product/test.png">
                            </div>
                            <div class="right-content-product-in-cart">
                                <span>Pretashop Import Product with</span></br>
                                <span>${"$" + data.cart[i].cart.price}</span>
                                <span class="set-text-olde-price">${"$" + data.cart[i].cart.cost}</span>
                                <div class="border-add-product">
                                    <div class="set-btn-cart float-left reduce-product">-</div>
                                    <div class="set-input-add-product float-left number-product">${data.cart[i].count}</div>
                                    <div class="set-btn-cart float-left add-product">+</div>
                                    <div class="float-right">
                                        <span>${"$" + data.cart[i].cart.price*data.cart[i].count}</span>
                                    </div>
                                </div>
                            </div>
                        </div>`)
                            tong = tong + data.cart[i].cart.price * data.cart[i].count;
                        }
                        $("#total-price").text("$" + tong);
                    }
                }
            }).always(() => {
                $('#loading').hide();
                $("#modal-cart").modal('show');
                var number_product = document.getElementsByClassName("number-product");
                $('.reduce-product').each(function (i) {
                    $(this).click(() => {
                        if (Number(number_product[i].textContent) > 1) {
                            number_product[i].innerHTML = Number(number_product[i].textContent) - 1;
                        }
                    })
                })
                $('.add-product').each(function (i) {
                    $(this).click(() => {
                        number_product[i].innerHTML = Number(number_product[i].textContent) + 1;
                    })
                })
            })
        })
    })
})