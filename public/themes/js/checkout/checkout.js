$(document).ready(() => {
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
    $("#click-test").click(() => {
        $.ajax({
            type: "POST",
            url: "/test/data",
            dataType: "json",
            data: {
                id: "abc",
                medthod: "paypal",
                product: [{
                    id: "1",
                    name: "nam"
                }, {
                    id: "2",
                    name: "bắc"
                }, {
                    id: "3",
                    name: "trung"
                }, {
                    id: "4",
                    name: "đông"
                }]
            },
            success: (data) => {}
        })
    })

})