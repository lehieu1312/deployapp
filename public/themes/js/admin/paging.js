$(document).ready(function() {

    var pageSize;
    var currentPage;
    var totalPages, totalRecord;

    function setDefault() {
        pageSize = 3;
        currentPage = 1;
    }
    setDefault();

    function mathFuncDefault() {
        totalPages = $('.record').length / pageSize;
        totalPages = totalPages.toFixed();
        var totalRecord = $('.record').length;
        $('.totalitems').html(totalRecord + ' item(s)');
        $('.totalpagetext').html("of " + totalPages);
        showRecord(pageSize, currentPage);
    }
    mathFuncDefault();

    function showRecord(fPageSize, fCurrentPage) {
        var trnum = 0;
        $('.currentpagetext').html(fCurrentPage);
        $('#table-appversion tr:gt(0)').each(function() { // each TR in  table and not the header
            trnum++; // Start Counter 
            // console.log(trnum);
            if (fCurrentPage == 1) {
                if (trnum <= fPageSize) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            } else {
                var countPrevious = ((fCurrentPage - 1) * fPageSize);
                var countNext = (((fCurrentPage + 1) * fPageSize) - fPageSize);
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
        showRecord(pageSize, currentPage);
    });
    $('.btnlastpage').click(() => {
        console.log(totalPages);
        currentPage = totalPages;
        showRecord(pageSize, currentPage);
    });

    $('.btnprevpage').click(() => {
        // console.log(totalPages);
        if (currentPage > 1)
            currentPage = currentPage - 1;
        showRecord(pageSize, currentPage);
    });
    $('.btnnextpage').click(() => {
        // console.log(totalPages);
        if (currentPage < totalPages)
            currentPage = currentPage + 1;
        showRecord(pageSize, currentPage);
    });

    $('#inputsearch-customer').on('keyup', () => {
        var textSearch = $('#inputsearch-customer').val();
        console.log(textSearch);
        if (textSearch != "") {
            searchFunc(textSearch);
        } else {
            mathFuncDefault();
            showRecord(pageSize, 1);
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
        console.log(filter);

        for (i = 1; i < tr.length; i++) {
            span = tr[i].getElementsByTagName("span");
            for (j = 0; j < span.length; j++) {
                if (span[j]) {
                    console.log(span[j].innerHTML.toUpperCase().indexOf(filter));
                    if (span[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
                        tr[i].style.display = "";
                        tr[i].classList.add("recordsearch");
                        // console.log(tr[i]);
                        break;
                    } else {
                        tr[i].style.display = "none";
                    }
                }
            }
        }
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