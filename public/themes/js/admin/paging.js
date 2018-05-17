$(document).ready(function() {

    var pageSize;
    var currentPage;
    var totalPages, totalRecord;
    var isCheckSearch = false;

    function setDefault() {
        pageSize = $('#span-show-number').html();
        currentPage = 1;
    }
    setDefault();
    mathFuncDefault($('#span-show-number').html(), 1);

    function mathFuncDefault(mPageSize, mCurrentPage) {
        var tmlpage = $('.trrecord').length % mPageSize;
        if (tmlpage == 0) {
            totalPages = $('.trrecord').length / mPageSize;
        } else {
            if (($('.trrecord').length / mPageSize) == 0) {
                totalPages = $('.trrecord').length / mPageSize;
            } else {
                totalPages = $('.trrecord').length / mPageSize + 1;
            }

        }
        totalPages = Math.floor(totalPages);
        totalRecord = $('.trrecord').length;
        $('.totalitems').html(totalRecord + ' item(s)');
        $('.totalpagetext').html("of " + totalPages);
        showRecord(mPageSize, mCurrentPage, totalRecord, totalPages);
    }

    function showRecord(fPageSize, fCurrentPage, fTotalRecord, fTotalPage) {
        var trnum = 0;
        $('.currentpagetext').html(fCurrentPage);
        if ($('.trrecord').length > 0) {
            $('.trrecord').each(function() {
                trnum++;
                if (fCurrentPage == 1) {
                    if (trnum <= fPageSize) {
                        $('.totalshowcurrent').html('1-' + trnum);
                        $(this).show();
                        $(this).find('.numberorder').html(trnum);
                    } else {
                        $(this).hide();
                    }
                } else {
                    var countPrevious = ((fCurrentPage - 1) * fPageSize);
                    var countNext = (((fCurrentPage + 1) * fPageSize) - fPageSize);
                    if (fCurrentPage == fTotalPage) {
                        $('.totalshowcurrent').html((countPrevious + 1) + '-' + (fTotalRecord));
                    } else
                        $('.totalshowcurrent').html((countPrevious + 1) + '-' + (countNext));
                    if ((countPrevious < trnum) && (trnum <= countNext)) {
                        $(this).find('.numberorder').html(trnum);
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                }
            });
        } else {
            $('.totalshowcurrent').html(trnum);
            $(this).find('.numberorder').html(trnum);
        }
    }
    $('.btnfirstpage').click(() => {
        currentPage = 1;
        showRecord(pageSize, currentPage, totalRecord, totalPages);
    });
    $('.btnlastpage').click(() => {
        currentPage = totalPages;
        showRecord(pageSize, currentPage, totalRecord, totalPages);
    });

    $('.btnprevpage').click(() => {
        if (currentPage > 1)
            currentPage = currentPage - 1;
        showRecord(pageSize, currentPage, totalRecord, totalPages);
    });
    $('.btnnextpage').click(() => {
        if (currentPage < totalPages)
            currentPage = currentPage + 1;
        showRecord(pageSize, currentPage, totalRecord, totalPages);
    });

    $('#inputsearch-customer').on('keyup', () => {
        var textSearch = $('#inputsearch-customer').val();
        if (textSearch != "") {
            searchFunc(textSearch);
            currentPage = 1;
            mathFuncDefault($('#span-show-number').html(), currentPage);
        } else {
            currentPage = 1;
            mathFuncDefault($('#span-show-number').html(), currentPage);
        }
    });

    function searchFunc(fTextSearch) {

        var input, filter, table, tr, td, i, j;
        filter = fTextSearch.toUpperCase();
        table = document.getElementById("table-appversion");
        tr = table.getElementsByTagName("tr");

        for (i = 1; i < tr.length; i++) {
            span = tr[i].getElementsByTagName("span");
            for (j = 0; j < span.length; j++) {
                if (span[j]) {
                    if (span[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
                        tr[i].style.display = "";
                        tr[i].classList.add("trrecord");
                        break;
                    } else {
                        tr[i].style.display = "none";
                        tr[i].classList.remove("trrecord");
                    }
                }
            }
        }
    }

    ///////////////FILER PERPAGE//////////
    $('#show9perpage').click(() => {
        $('#span-show-number').html(9);
        pageSize = $('#span-show-number').html();
        currentPage = 1;
        mathFuncDefault(pageSize, currentPage);
    });
    $('#show18perpage').click(() => {
        $('#span-show-number').html(18);
        pageSize = $('#span-show-number').html();
        currentPage = 1;
        mathFuncDefault(pageSize, currentPage);

    });
    $('#show27perpage').click(() => {
        $('#span-show-number').html(27);
        pageSize = $('#span-show-number').html();
        currentPage = 1;
        mathFuncDefault(pageSize, currentPage);
    });
    $('#show36perpage').click(() => {
        $('#span-show-number').html(36);
        pageSize = $('#span-show-number').html();
        currentPage = 1;
        mathFuncDefault(pageSize, currentPage);
    });

    //////////// FILTER DATE///////////////
    $('#filter-date-hoursago').click(() => {
        $('.trrecord').each(function() {

            var sDate = $(this).find('.daterecord').val();
            console.log(sDate);
            var newDate = new Date(sDate);
            // console.log(newDate);
            var nowDate = new Date();
            // console.log(nowDate);
            var mathDate = (nowDate - newDate);
            if (mathDate <= (1000 * 60 * 60)) {
                console.log('lon hon');
            }
            // else {
            // }
            // console.log('-------------------------');


        })

    })



    // function mathRecordSearch(mPageSize, mCurrentPage) {
    //     var tmlpage = $('.trrecord').length % mPageSize;
    //     if (tmlpage == 0) {
    //         totalPages = $('.trrecord').length / mPageSize;
    //     } else {
    //         totalPages = $('.trrecord').length / mPageSize + 1;
    //     }
    //     // totalPages = $('.recordsearch').length / pageSize;
    //     // totalPages = totalPages.toFixed();
    //     totalPages = Math.floor(totalPages);
    //     totalRecord = $('.trrecord').length;
    //     // console.log(totalRecord);
    //     // console.log(pageSize);
    //     // console.log(totalPages);
    //     $('.totalitems').html(totalRecord + ' item(s)');
    //     $('.totalpagetext').html("of " + totalPages);
    //     showRecordSearch(mPageSize, mCurrentPage, totalRecord, totalPages);
    // }

    // function showRecordSearch(fPageSize, fCurrentPage, fTotalRecord, fTotalPage) {
    //     var trnum = 0;
    //     $('.currentpagetext').html(fCurrentPage);
    //     $('#table-appversion .trrecord').each(function() { // each TR in  table and not the header
    //         // console.log($(this));
    //         trnum++; // Start Counter 
    //         // console.log(trnum);
    //         if (fCurrentPage == 1) {
    //             if (trnum <= fPageSize) {
    //                 $('.totalshowcurrent').html('1-' + trnum);
    //                 // console.log($(this + ' td'));
    //                 $(this).find('.numberorder').html(trnum);
    //                 // var td = $(this).getElementsByTagName("td")[0];
    //                 // console.log(firstTd);
    //                 $(this).show();
    //             } else {
    //                 $(this).hide();
    //             }
    //         } else {
    //             var countPrevious = ((fCurrentPage - 1) * fPageSize);
    //             var countNext = (((fCurrentPage + 1) * fPageSize) - fPageSize);
    //             if (fCurrentPage == fTotalPage) {
    //                 $('.totalshowcurrent').html((countPrevious + 1) + '-' + (fTotalRecord));
    //             } else
    //                 $('.totalshowcurrent').html((countPrevious + 1) + '-' + (countNext));
    //             // console.log(countPrevious);
    //             // console.log(countNext);
    //             if ((countPrevious < trnum) && (trnum <= countNext)) { // if tr number gt maxRows
    //                 // console.log($(this));
    //                 $(this).find('.numberorder').html(trnum);
    //                 $(this).show(); // fade it out 
    //             } else {
    //                 $(this).hide();
    //             }
    //         }
    //     });
    // }


})