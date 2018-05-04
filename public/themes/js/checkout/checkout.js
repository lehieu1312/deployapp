$(document).ready(() => {



    add_and_removeProduct();
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

})