$(document).ready(function() {

    var pageSize = 9;
    var currentPage = 2;
    var totalPages, totalRecord;

    // reset current page counter on load
    // $("#hdnActivePage").val(1);
    // calculate number of pages
    totalPages = $('.record').length / pageSize;
    totalPages = totalPages.toFixed();
    var totalRecord = $('.record').length;
    // console.log(totalPages);
    // console.log(totalRecord);
    showRecord(pageSize, currentPage);
    $('.totalitems').html(totalRecord + ' item(s)');
    $('#totalpagetext').html("of " + totalPages);


    function showRecord(fPageSize, fCurrentPage) {
        var trnum = 0;
        $('#table-appversion tr:gt(0)').each(function() { // each TR in  table and not the header
            trnum++; // Start Counter 
            // console.log(trnum);
            if (fCurrentPage == 1) {
                console.log('vao truong hop 1');
                if (trnum <= fPageSize) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            } else {
                console.log('vao truong hop 2');
                // console.log('trnum: ' + trnum);
                // console.log((fCurrentPage - 1) * fPageSize);
                // console.log((fCurrentPage + 1) * fPageSize);
                if (((fCurrentPage - 1) * fPageSize) < trnum && trnum < (((fCurrentPage + 1) * fPageSize)) - fPageSize) { // if tr number gt maxRows
                    console.log('1: ' + trnum);
                    console.log($(this));
                    $(this).show(); // fade it out 
                }
                if (((fCurrentPage - 1) * fPageSize) < trnum && trnum > ((fCurrentPage + 1) * fPageSize)) {
                    console.log('2');
                    $(this).hide();
                } // else fade in Important in case if it ..
            }

        });
    }

    // $("a.next").on('click', function() {
    //     // show only the necessary rows based upon activePage and Pagesize
    //     $("table tr:nth-child(-n+" + (($("#hdnActivePage").val() * pageSize) + pageSize) + ")").show();
    //     $("table tr:nth-child(-n+" + $("#hdnActivePage").val() * pageSize + ")").hide();
    //     var currentPage = Number($("#hdnActivePage").val());
    //     // update activepage
    //     $("#hdnActivePage").val(Number($("#hdnActivePage").val()) + 1);
    //     // check if previous page button is necessary (not on first page)
    //     if ($("#hdnActivePage").val() != "1") {
    //         $("a.previous").show();
    //         $("span").show();
    //     }
    //     // check if next page button is necessary (not on last page)
    //     if ($("#hdnActivePage").val() == numberOfPages) {
    //         $("a.next").hide();
    //         $("span").hide();
    //     }
    // });
    // // action on 'previous' click
    // $("a.previous").on('click', function() {
    //     var currentPage = Number($("#hdnActivePage").val());
    //     $("#hdnActivePage").val(currentPage - 1);
    //     // first hide all rows
    //     $("table tr").hide();
    //     // and only turn on visibility on necessary rows
    //     $("table tr:nth-child(-n+" + ($("#hdnActivePage").val() * pageSize) + ")").show();
    //     $("table tr:nth-child(-n+" + (($("#hdnActivePage").val() * pageSize) - pageSize) + ")").hide();
    //     // check if previous button is necessary (not on first page)
    //     if ($("#hdnActivePage").val() == "1") {
    //         $("a.previous").hide();
    //         $("span").hide();
    //     }
    //     // check if next button is necessary (not on last page)
    //     if ($("#hdnActivePage").val() < numberOfPages) {
    //         $("a.next").show();
    //         $("span").show();
    //     }
    //     if ($("#hdnActivePage").val() == 1) {
    //         $("span").hide();
    //     }
    // });
})