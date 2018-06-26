$(document).ready(() => {
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    $.post(
        "/admin/getbreadcrumb", {},
        function(data) {
            // console.log(data.breadcrumbs);
            var breadCrumbs = data.breadcrumbs;
            for (var i = 0; i < breadCrumbs.length; i++) {
                if (breadCrumbs.length == 1) {
                    $('#navigate-text').append(
                        `<span class='text-none'>` + capitalizeFirstLetter(breadCrumbs[0].name) + `</span>
                   `)
                } else {
                    if (i == breadCrumbs.length - 1) {
                        $('#navigate-text').append(
                            `<span class='text-none'>` + capitalizeFirstLetter(breadCrumbs[breadCrumbs.length - 1].name) + `</span>
                         `)
                    } else {
                        $('#navigate-text').append(
                            `<a class="colora" href="/` + breadCrumbs[i].url + `"><span>` + capitalizeFirstLetter(breadCrumbs[i].name) + `</span><a>
                                 <span class="setarrownavigate">
                                   <img src="/themes/img/dashboard/iconarrowbreadcrumb.png">
                                 </span>
                       `)
                    }

                }

            }
        }
    )

    // var originalUrl = window.location.pathname;
    // console.log('-----Breadcrumb-----');
    // console.log(document.title);
    // var nameTitle = document.title.split('-')[0].trim();
    // console.log(nameTitle);
    // var arrOriginUrl = originalUrl.split('/');
    // for (var i = 0; i < arrOriginUrl.length; i++) {

    //     if (i == 1) {
    //         $('#navigate-text').append(
    //             `<a class="colora" href="/` + arrOriginUrl[1] + `"><span>` + capitalizeFirstLetter(arrOriginUrl[1]) + `</span><a>
    // <span class="setarrownavigate">
    //     <img src="/themes/img/dashboard/iconarrowbreadcrumb.png">
    // </span>
    // `)
    //     } else {
    //         $('#navigate-text').append(
    //             `<a class="colora" href="/` + arrOriginUrl[1] + '/' + arrOriginUrl[2] + `"><span>` + capitalizeFirstLetter(arrOriginUrl[2]) + `</span><a>
    //     `)
    //     }

    // }

});