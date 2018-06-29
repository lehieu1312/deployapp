$(document).ready(() => {
    $(window).on("load", function() {
        $(".adminfilldate").each(function() {
            var strDate = $(this).find('input').val();
            $(this).find('span').text(moment(strDate).format('DD/MM/YYYY HH:mm:ss'));
        })
    })

    function trimSpace(str) {
        return str.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, "").replace(/\s+/g, " ");
    }
    var setStatusWithdraw, idWith;
    var statuspayment = document.getElementsByClassName("statuspayment");
    var getstatuspayment = document.getElementsByClassName("getstatuspayment");
    var getcodeorder = document.getElementsByClassName("getcodeorder");
    var idWithdraw = document.getElementsByClassName("idwithdraw");
    var ul = document.getElementsByClassName("selectstatuspayment");
    var textstatus = document.getElementsByClassName("textstatus");
    var dropDownMenuStatus = document.getElementsByClassName("dropdown-menu-status");

    for (let i = 0; i < dropDownMenuStatus.length; i++) {
        dropDownMenuStatus[i].addEventListener("click", () => {
            idWith = trimSpace(idWithdraw[i].value)
                // console.log(idWith);
            var li = dropDownMenuStatus[i].getElementsByTagName("li");
            var a = dropDownMenuStatus[i].getElementsByTagName("a");
            for (let j = 0; j < li.length; j++) {
                li[j].addEventListener("click", () => {

                    setStatusWithdraw = Number(li[j].value)
                        // console.log(setStatusWithdraw);
                    $.ajax({
                        type: "POST",
                        url: "/admin/withdraw/changestatuswithdraw",
                        dataType: "json",
                        data: {
                            id: idWith,
                            status: setStatusWithdraw
                        },
                        success: (data) => {
                            if (data.status == "1") {
                                textstatus[i].innerHTML = a[j].innerHTML;
                                if (j == 0) {
                                    statuspayment[i].style.background = "#4169e1"
                                }
                                if (j == 1) {
                                    statuspayment[i].style.background = "#32cd32"
                                }
                                if (j == 2) {
                                    statuspayment[i].style.background = "#dc143c"
                                }
                                for (let a = 0; a < li.length; a++) {
                                    li[a].classList.remove('activestatus');
                                }
                                li[j].classList.add('activestatus');
                            } else if (data.status == 2) {
                                $('#errPopup').show();
                                $('.alert-upload').text(data.msg[0].msg);

                            } else {
                                $('#errPopup').show();
                                $('.alert-upload').text(data.msg);
                            }
                        }
                    }).always(function(data) {
                        $('#loading').hide();
                    });
                })
            }
        });
    }

    // for (let i = 0; i < ul.length; i++) {
    //     var li = ul[i].getElementsByTagName("li");
    //     var a = ul[i].getElementsByTagName("a");
    //     // var li = $(this).getElementsByTagName('li');

    //     for (let j = 0; j < li.length; j++) {

    //         li[j].addEventListener("click", () => {
    //             // activestatus
    //             console.log(li[j]);
    //             li[j].classList.remove('aa');
    //             setStatusWithdraw = Number(li[j].value)
    //             $.ajax({
    //                 type: "POST",
    //                 url: "/admin/withdraw/changestatuswithdraw",
    //                 dataType: "json",
    //                 data: {
    //                     id: idWith,
    //                     status: setStatusWithdraw
    //                 },
    //                 success: (data) => {
    //                     if (data.status == "1") {
    //                         textstatus[i].innerHTML = a[j].innerHTML;
    //                         if (j == 0) {
    //                             statuspayment[i].style.background = "#4169e1"
    //                         }
    //                         if (j == 1) {
    //                             statuspayment[i].style.background = "#32cd32"
    //                         }
    //                         if (j == 2) {
    //                             statuspayment[i].style.background = "#dc143c"
    //                         }

    //                     } else if (data.status == 2) {
    //                         $('#errPopup').show();
    //                         $('.alert-upload').text(data.msg[0].msg);

    //                     } else {
    //                         $('#errPopup').show();
    //                         $('.alert-upload').text(data.msg);
    //                     }
    //                 }
    //             }).always(function(data) {
    //                 $('#loading').hide();
    //             });
    //         });

    //     }
    // }

});