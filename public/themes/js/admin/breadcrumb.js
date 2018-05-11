$(document).ready(() => {
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    var originalUrl = window.location.pathname;
    console.log(document.title);
    var nameTitle = document.title.split('-')[0].trim();
    console.log(nameTitle);
    var arrOriginUrl = originalUrl.split('/');
    for (var i = 0; i < arrOriginUrl.length; i++) {
        if (i == 1) {
            $('#navigate-text').append(
                `<a class="colora" href="/` + arrOriginUrl[1] + `"><span>` + capitalizeFirstLetter(arrOriginUrl[1]) + `</span><a>
    <span class="setarrownavigate">
        <img src="/themes/img/dashboard/iconarrowbreadcrumb.png">
    </span>
    `)
        }
        if (i == 2) {
            $('#navigate-text').append(
                `<a class="colora" href="/` + arrOriginUrl[1] + '/' + arrOriginUrl[2] + `"><span>` + capitalizeFirstLetter(arrOriginUrl[2]) + `</span><a>
    `)
        }
    }

});