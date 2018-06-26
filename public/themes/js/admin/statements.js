$(document).ready(() => {
    $(window).on("load", function() {
            $(".adminfilldate").each(function() {
                var strDate = $(this).find('input').val();
                $(this).find('span').text(moment(strDate).format('DD/MM/YYYY HH:mm:ss'));
            })
        })
        // $('#filter-date-hoursago-statement').click(() => {
        //     // alert('1');
        //     $('#span-selcect-date').html('Hours Ago');

    // });

})