$(document).ready(() => {
    let idappadmin = document.getElementsByClassName("id-app-admin");
    $('.add-to-cart').each(function (i) {
        $(this).click(() => {
            // alert(idappadmin[i].value)
            $.ajax({
                url: "/dashboard/add-to-cart",
                type: "POST",
                datatype: "json",
                data: {
                    idApp: idappadmin[i].value
                },
                success: function (data) {

                }
            })
        })
    })
})