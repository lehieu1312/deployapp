$(document).ready(() => {
    $('.select-platform-ios').click(() => {
        $('.platform-ios').hide();
        $('.platform-ios-active').show();
        $('.platform-android').show();
        $('.platform-android-active').hide();
    });
    $('.select-platform-android').click(() => {
        $('.platform-android').hide();
        $('.platform-android-active').show();
        $('.platform-ios').show();
        $('.platform-ios-active').hide();
    });
    $('body').click(() => {
        $(".select-country-notification").hide();
        $(".select-product-url").hide();
    })
    $('.country-notification').each(function (i) {
        $(this).click((event) => {
            let offset = $(this).children('.img-arow-notification').offset();
            $(".select-country-notification").toggle().offset({
                top: offset.top + 15,
                left: offset.left - 162
            });
            event.stopPropagation();
        })
    });
    $('.select-product').click((event) => {
        let offset = $('.select-product').children('.set-img-product-url').offset();
        $(".select-product-url").toggle().offset({
            top: offset.top + 22,
            left: offset.left - 128
        });
        event.stopPropagation();
    })
})