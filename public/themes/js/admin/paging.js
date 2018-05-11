$(document).ready(function() {

    var pageSize;
    var currentPage;
    var totalPages, totalRecord;
    var isCheckSearch = false;

    function setDefault() {
        pageSize = $('#span-show-number').html();
        // console.log('perpage: ' + pageSize);
        currentPage = 1;
    }
    setDefault();
    mathFuncDefault($('#span-show-number').html(), 1);

    function mathFuncDefault(mPageSize, mCurrentPage) {
        var tmlpage = $('.record').length % mPageSize;
        // console.log(tmlpage);
        if (tmlpage == 0) {
            totalPages = $('.record').length / mPageSize;
        } else {
            totalPages = $('.record').length / mPageSize + 1;
        }
        // console.log(totalPages);
        totalPages = Math.floor(totalPages);
        totalRecord = $('.record').length;
        $('.totalitems').html(totalRecord + ' item(s)');
        $('.totalpagetext').html("of " + totalPages);
        showRecord(mPageSize, mCurrentPage, totalRecord, totalPages);
    }


    function showRecord(fPageSize, fCurrentPage, fTotalRecord, fTotalPage) {
        // console.log('111: ' + fTotalRecord);
        var trnum = 0;
        $('.currentpagetext').html(fCurrentPage);
        $('#table-appversion tr:gt(0)').each(function() { // each TR in  table and not the header
            // console.log($(this));
            trnum++; // Start Counter 
            // console.log(trnum);
            if (fCurrentPage == 1) {
                if (trnum <= fPageSize) {
                    $('.totalshowcurrent').html('1-' + trnum);
                    $(this).show();
                } else {
                    $(this).hide();
                }
            } else {
                var countPrevious = ((fCurrentPage - 1) * fPageSize);
                var countNext = (((fCurrentPage + 1) * fPageSize) - fPageSize);
                // console.log('countNext: ' + countNext);
                if (fCurrentPage == fTotalPage) {
                    $('.totalshowcurrent').html((countPrevious + 1) + '-' + (fTotalRecord));
                } else
                    $('.totalshowcurrent').html((countPrevious + 1) + '-' + (countNext));
                // console.log(countPrevious);
                // console.log(countNext);
                if ((countPrevious < trnum) && (trnum <= countNext)) { // if tr number gt maxRows
                    // console.log($(this));
                    $(this).show(); // fade it out 
                } else {
                    $(this).hide();
                }
            }
        });
    }
    $('.btnfirstpage').click(() => {
        currentPage = 1;
        if (isCheckSearch == true) {
            showRecordSearch(pageSize, currentPage, totalRecord, totalPages);
        } else
            showRecord(pageSize, currentPage, totalRecord, totalPages);
    });
    $('.btnlastpage').click(() => {
        // console.log(totalPages);
        currentPage = totalPages;
        if (isCheckSearch == true)
            showRecordSearch(pageSize, currentPage, totalRecord, totalPages);
        else
            showRecord(pageSize, currentPage, totalRecord, totalPages);
    });

    $('.btnprevpage').click(() => {
        // console.log(totalPages);
        if (currentPage > 1)
            currentPage = currentPage - 1;
        if (isCheckSearch == true)
            showRecordSearch(pageSize, currentPage, totalRecord, totalPages);
        else
            showRecord(pageSize, currentPage, totalRecord, totalPages);
    });
    $('.btnnextpage').click(() => {
        // console.log(totalPages);
        if (currentPage < totalPages)
            currentPage = currentPage + 1;
        // console.log(currentPage);
        // console.log(totalRecord);
        if (isCheckSearch == true)
            showRecordSearch(pageSize, currentPage, totalRecord, totalPages);
        else
            showRecord(pageSize, currentPage, totalRecord, totalPages);
    });

    $('#inputsearch-customer').on('keyup', () => {
        var textSearch = $('#inputsearch-customer').val();
        // console.log(textSearch);
        if (textSearch != "") {
            isCheckSearch = true;
            searchFunc(textSearch);
            currentPage = 1;
            mathRecordSearch($('#span-show-number').html(), currentPage);

            // showRecordSearch(pageSize, currentPage, totalRecord, totalPages);
        } else {
            isCheckSearch = false;
            currentPage = 1;
            mathFuncDefault($('#span-show-number').html(), currentPage);

            // showRecord(pageSize, currentPage, totalRecord, totalPages);
        }

        // mathFuncDefault();
        // showRecord(pageSize, 1);

    });

    function searchFunc(fTextSearch) {

        var input, filter, table, tr, td, i, j;
        // input = document.getElementById("inputsearch-customer");
        filter = fTextSearch.toUpperCase();
        table = document.getElementById("table-appversion");
        tr = table.getElementsByTagName("tr");
        // console.log(filter);

        for (i = 1; i < tr.length; i++) {
            span = tr[i].getElementsByTagName("span");
            for (j = 0; j < span.length; j++) {
                if (span[j]) {
                    // console.log(span[j].innerHTML.toUpperCase().indexOf(filter));
                    if (span[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
                        tr[i].style.display = "";
                        tr[i].classList.add("recordsearch");
                        // console.log(tr[i]);
                        break;
                    } else {
                        tr[i].style.display = "none";
                        tr[i].classList.remove("recordsearch");
                    }
                }
            }
        }

    }

    function mathRecordSearch(mPageSize, mCurrentPage) {
        var tmlpage = $('.recordsearch').length % mPageSize;
        if (tmlpage == 0) {
            totalPages = $('.recordsearch').length / mPageSize;
        } else {
            totalPages = $('.recordsearch').length / mPageSize + 1;
        }
        // totalPages = $('.recordsearch').length / pageSize;
        // totalPages = totalPages.toFixed();
        totalPages = Math.floor(totalPages);
        totalRecord = $('.recordsearch').length;
        // console.log(totalRecord);
        // console.log(pageSize);
        // console.log(totalPages);
        $('.totalitems').html(totalRecord + ' item(s)');
        $('.totalpagetext').html("of " + totalPages);
        showRecordSearch(mPageSize, mCurrentPage, totalRecord, totalPages);
    }

    function showRecordSearch(fPageSize, fCurrentPage, fTotalRecord, fTotalPage) {
        var trnum = 0;
        $('.currentpagetext').html(fCurrentPage);
        $('#table-appversion .recordsearch').each(function() { // each TR in  table and not the header
            // console.log($(this));
            trnum++; // Start Counter 
            // console.log(trnum);
            if (fCurrentPage == 1) {
                if (trnum <= fPageSize) {
                    $('.totalshowcurrent').html('1-' + trnum);
                    // console.log($(this + ' td'));
                    $(this).find('.numberorder').html(trnum);
                    // var td = $(this).getElementsByTagName("td")[0];
                    // console.log(firstTd);
                    $(this).show();
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
                // console.log(countPrevious);
                // console.log(countNext);
                if ((countPrevious < trnum) && (trnum <= countNext)) { // if tr number gt maxRows
                    // console.log($(this));
                    $(this).find('.numberorder').html(trnum);
                    $(this).show(); // fade it out 
                } else {
                    $(this).hide();
                }
            }
        });
    }
    $('#show9perpage').click(() => {
        $('#span-show-number').html(9);
        pageSize = $('#span-show-number').html();
        console.log(pageSize);
        currentPage = 1;
        if (isCheckSearch == true)
            mathRecordSearch(pageSize, currentPage);
        else
            mathFuncDefault(pageSize, currentPage);
    });
    $('#show18perpage').click(() => {
        $('#span-show-number').html(18);
        pageSize = $('#span-show-number').html();
        console.log(pageSize);
        currentPage = 1;
        if (isCheckSearch == true)
            mathRecordSearch(pageSize, currentPage);
        else
            mathFuncDefault(pageSize, currentPage);

    });
    $('#show27perpage').click(() => {
        $('#span-show-number').html(27);
        pageSize = $('#span-show-number').html();
        console.log(pageSize);
        currentPage = 1;
        if (isCheckSearch == true)
            mathRecordSearch(pageSize, currentPage);
        else
            mathFuncDefault(pageSize, currentPage);
    });
    $('#show36perpage').click(() => {
        $('#span-show-number').html(36);
        pageSize = $('#span-show-number').html();
        console.log(pageSize);
        currentPage = 1;
        if (isCheckSearch == true)
            mathRecordSearch(pageSize, currentPage);
        else
            mathFuncDefault(pageSize, currentPage);
    });

})