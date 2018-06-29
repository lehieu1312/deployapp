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
    $('#filter-date-customize-statement').click((event) => {
        event.stopPropagation();

    })

    // // filter-date-custom
    // $('#filter-date-custom').click((event) => {
    //     $('#span-selcect-date').text('Custom');
    //     $('#type-fill-date').val('5');
    //     event.stopPropagation();
    // });

    $("#filter-date-customize-statement").daterangepicker({
        drops: "up",
        opens: "left"
    }, function(start, end) {
        // console.log(moment(start._d).format());
        // console.log(moment(end._d).format());
        console.log(new Date(start._d).toISOString());
        var startDate = new Date(start._d).toISOString();
        console.log(startDate);
        // console.log(moment(startDate).format());
        var endDate = new Date(end._d).toISOString();
        console.log(endDate);
        window.location.href = "/admin/statements?st=custom&f=" + startDate + "&t=" + endDate;


    });
    var url_string = window.location.href;
    var url = new URL(url_string);
    var c = url.searchParams.get("st");
    if (c == 'hoursago')
        $('#span-selcect-date').text('Hours Ago');
    if (c == 'lastweek')
        $('#span-selcect-date').text('Last Week');
    if (c == 'yesterday')
        $('#span-selcect-date').text('Yesterday');
    if (c == 'custom')
        $('#span-selcect-date').text('Custom...');
    console.log(c);
})