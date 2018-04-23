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
})