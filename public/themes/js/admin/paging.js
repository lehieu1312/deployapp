$(document).ready(function() {

    var pageSize;
    var currentPage;
    var totalPages, totalRecord;
    var isCheckSearch = false;

    function setDefault() {
        pageSize = $('#span-show-number').html();
        currentPage = 1;
    }

    function showRecord(fPageSize, fCurrentPage, fTotalRecord, fTotalPage) {
        var trnum = 0;
        $('.currentpagetext').html(fCurrentPage);
        if ($('.trrecord').length > 0) {
            // console.log('vao length > 0');
            $('.trrecord').each(function() {
                trnum++;
                // console.log('trnum: ' + trnum);
                if (fCurrentPage == 1) {
                    if (trnum <= fPageSize) {
                        // console.log('hahaha');
                        $('.totalshowcurrent').html('1-' + trnum);
                        $(this).show();
                        // console.log($(this));
                        $(this).find('.numberorder').html(trnum);
                    } else {
                        // console.log('hide');
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

    function mathFuncDefault(mPageSize, mCurrentPage) {
        // console.log('math');
        // console.log(mPageSize);
        // console.log(mCurrentPage);
        var tmlpage = $('.trrecord').length % mPageSize;
        // console.log(tmlpage);
        if (tmlpage == 0) {
            totalPages = $('.trrecord').length / mPageSize;
        } else {
            // console.log($('.trrecord').length);
            // console.log(mPageSize);
            // console.log($('.trrecord').length / mPageSize);
            if (($('.trrecord').length / mPageSize) == 0) {
                // console.log('vao =0');
                totalPages = $('.trrecord').length / mPageSize;
            } else {
                // console.log('vao !=0');
                totalPages = $('.trrecord').length / mPageSize + 1;
            }

        }
        totalPages = Math.floor(totalPages);
        totalRecord = $('.trrecord').length;
        $('.totalitems').html(totalRecord + ' item(s)');
        $('.totalpagetext').html("of " + totalPages);
        // console.log(mPageSize);
        // console.log(mCurrentPage);
        // console.log(totalRecord);
        // console.log(totalPages);
        showRecord(mPageSize, mCurrentPage, totalRecord, totalPages);
    }

    setDefault();
    mathFuncDefault($('#span-show-number').html(), 1);



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
            mathRecordWithDate();
            searchFunc();
            currentPage = 1;
            mathFuncDefault($('#span-show-number').html(), currentPage);
        } else {
            mathRecordWithDate();
            searchFunc();
            currentPage = 1;
            mathFuncDefault($('#span-show-number').html(), currentPage);
        }
    });

    function mathRecordWithDate() {
        var fTypeDate = $('#type-fill-date').val();

        //All Date
        if (fTypeDate == 4) {
            $('#table-appversion tbody tr').each(function() {
                $(this).show();
                $(this).addClass("trrecord");
            })
        }

        //Hours ago
        if (fTypeDate == 1) {
            $('#table-appversion tbody tr').each(function() {
                var sDate = $(this).find('.admin-datecreate').val();
                var newDate = new Date(sDate);
                var nowDate = new Date();
                var mathDate = (nowDate - newDate);
                if (mathDate <= (1000 * 60 * 60)) {
                    $(this).show();
                    $(this).addClass("trrecord");
                } else {
                    $(this).hide();
                    $(this).removeClass("trrecord");
                }
            })
        }

        //Yesterday
        if (fTypeDate == 2) {
            var dateNow = new Date();
            var mathDateLastYesterday = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate());
            var mathDateFirstYesterDay = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate() - 1);

            $('#table-appversion tbody tr').each(function() {
                var sDate = $(this).find('.admin-datecreate').val();
                var recordDate = new Date(sDate);
                // console.log('recordDate');
                // console.log(recordDate);
                if (recordDate > mathDateFirstYesterDay && recordDate < mathDateLastYesterday) {
                    $(this).show();
                    $(this).addClass("trrecord");
                } else {
                    $(this).hide();
                    $(this).removeClass("trrecord");
                }
            })
        }

        //Last Week
        if (fTypeDate == 3) {
            var dateNow = new Date();
            var mathDateLastWeek = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate());
            var mathDateFirstWeek = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate() - 7);

            $('#table-appversion tbody tr').each(function() {
                var sDate = $(this).find('.admin-datecreate').val();
                var recordDate = new Date(sDate);
                // console.log('recordDate');
                // console.log(recordDate);
                if (recordDate > mathDateFirstWeek && recordDate < mathDateLastWeek) {
                    $(this).show();
                    $(this).addClass("trrecord");
                } else {
                    $(this).hide();
                    $(this).removeClass("trrecord");
                }
            })
        }

        //Custom date
        if (fTypeDate == 5) {
            var dateNow = new Date();
            var mathDateStart = $('#filter-date-custom-start').val();
            var mathDateEnd = $('#filter-date-custom-end').val();
            $('#table-appversion tbody tr').each(function() {
                var sDate = $(this).find('.admin-datecreate').val();
                var recordDate = moment(sDate).format();
                if (recordDate >= mathDateStart && recordDate <= mathDateEnd) {
                    $(this).show();
                    $(this).addClass("trrecord");
                } else {
                    $(this).hide();
                    $(this).removeClass("trrecord");
                }
            })
        }


    }

    function searchFunc() {
        var textSearch = $('#inputsearch-customer').val();
        console.log(textSearch);
        var input, filter, table, tr, td, i, j;
        filter = textSearch.toUpperCase();
        table = document.getElementById("table-appversion");
        tr = table.getElementsByTagName("tr");

        $('#table-appversion .trrecord').each(function() {
                var span = $(this).find('span');
                for (j = 0; j < span.length; j++) {
                    if (span[j]) {
                        if (span[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
                            $(this).show();
                            $(this).addClass("trrecord");
                            break;
                        } else {
                            $(this).hide();
                            $(this).removeClass("trrecord");
                        }
                    }
                }

            })
            // for (i = 1; i < tr.length; i++) {
            //     span = tr[i].getElementsByTagName("span");
            //     for (j = 0; j < span.length; j++) {
            //         if (span[j]) {
            //             if (span[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
            //                 tr[i].style.display = "";
            //                 tr[i].classList.add("trrecord");
            //                 break;
            //             } else {
            //                 tr[i].style.display = "none";
            //                 tr[i].classList.remove("trrecord");
            //             }
            //         }
            //     }
            // }
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

    // filter-date-all
    $('#filter-date-all').click(() => {
        $('#span-selcect-date').text('All Dates');
        $('#type-fill-date').val('4');
        mathRecordWithDate();
        searchFunc();
        currentPage = 1;
        mathFuncDefault($('#span-show-number').html(), currentPage);
    });
    // filter-date-hoursago
    $('#filter-date-hoursago').click(() => {
        $('#span-selcect-date').text('Hours Ago');
        $('#type-fill-date').val('1');
        mathRecordWithDate();
        searchFunc();
        currentPage = 1;
        mathFuncDefault($('#span-show-number').html(), currentPage);
    });
    // filter-date-yesterday
    $('#filter-date-yesterday').click(() => {
        $('#span-selcect-date').text('Yesterday');
        $('#type-fill-date').val('2');
        mathRecordWithDate();
        searchFunc();
        currentPage = 1;
        mathFuncDefault($('#span-show-number').html(), currentPage);
    });
    // filter-date-lastweek
    $('#filter-date-lastweek').click(() => {
        $('#span-selcect-date').text('Last Week');
        $('#type-fill-date').val('3');
        mathRecordWithDate();
        searchFunc();
        currentPage = 1;
        mathFuncDefault($('#span-show-number').html(), currentPage);
    });
    // filter-date-custom
    $('#filter-date-custom').click((event) => {
        $('#span-selcect-date').text('Custom');
        $('#type-fill-date').val('5');
        event.stopPropagation();
    });

    $("#filter-date-custom").daterangepicker({
        drops: "up",
        opens: "left"
    }, function(start, end) {
        $('#filter-date-custom-start').val(moment(start._d).format());
        $('#filter-date-custom-end').val(moment(end._d).format());

        mathRecordWithDate();
        searchFunc();
        currentPage = 1;
        mathFuncDefault($('#span-show-number').html(), currentPage);

    });
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