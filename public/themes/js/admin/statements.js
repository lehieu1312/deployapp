$(document).ready(() => {
    $(window).on("load", function() {
        $(".adminfilldate").each(function() {
            var strDate = $(this).find('input').val();
            $(this).find('span').text(moment(strDate).format('DD/MM/YYYY HH:mm:ss'));
        })
    })

    $('#filter-date-customize-statement').click((event) => {
        event.stopPropagation();
    })

    $("#filter-date-customize-statement").daterangepicker({
        drops: "up",
        opens: "left"
    }, function(start, end) {
        // console.log(Base64.encode('aa'));
        var startDate = new Date(start._d).toISOString();
        var endDate = new Date(end._d).toISOString();
        startDate = Base64.encode(startDate);
        endDate = Base64.encode(endDate);
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