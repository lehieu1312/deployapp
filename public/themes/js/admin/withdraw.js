$(document).ready(() => {


    function trimSpace(str) {
        return str.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, "").replace(/\s+/g, " ");
    }
    var setStatusWithdraw, idWith;
    var statuspayment = document.getElementsByClassName("statuspayment");
    var getstatuspayment = document.getElementsByClassName("getstatuspayment");
    var getcodeorder = document.getElementsByClassName("getcodeorder");
    var idWithdraw = document.getElementsByClassName("idwithdraw");
    var ul = document.getElementsByClassName("selectstatuspayment");
    var textstatus = document.getElementsByClassName("textstatus")

    for (let i = 0; i < statuspayment.length; i++) {
        statuspayment[i].addEventListener("click", () => {
            idWith = trimSpace(idWithdraw[i].value)

        });
    }

    for (let i = 0; i < ul.length; i++) {
        var li = ul[i].getElementsByTagName("li")
        var a = ul[i].getElementsByTagName("a")
        for (let j = 0; j < li.length; j++) {
            li[j].addEventListener("click", () => {
                if (j == 0) {
                    statuspayment[i].style.background = "#4169e1"
                }
                if (j == 1) {
                    statuspayment[i].style.background = "#32cd32"
                }
                if (j == 2) {
                    statuspayment[i].style.background = "#dc143c"
                }


                setStatusWithdraw = Number(li[j].value)
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
                            textstatus[i].innerHTML = a[j].innerHTML
                                // $('#successPopup').show();
                                // $('.contenemail').text('Update success.');
                                // $("#danger-alert").fadeTo(5000, 1000).slideUp(1000, function() {
                                //     $("#danger-alert").slideUp(1000);
                                //     $('#successPopup').hide();
                                // });
                        } else if (data.status == 2) {
                            $('#errPopup').show();
                            $('.alert-upload').text(data.msg[0].msg);
                            $("#danger-alert").fadeTo(5000, 1000).slideUp(1000, function() {
                                $("#danger-alert").slideUp(1000);
                                $('.errPopup').hide();
                            });
                        } else {
                            $('#errPopup').show();
                            $('.alert-upload').text(data.msg);
                            $("#danger-alert").fadeTo(5000, 1000).slideUp(1000, function() {
                                $("#danger-alert").slideUp(1000);
                                $('.errPopup').hide();
                            });
                        }
                        // else if (data.status == "2") {
                        //     $('#myModal').modal('hide');
                        //     $('#errPopup').show();
                        //     $('.alert-upload').text(data.message);
                        //     $("#errPopup").fadeTo(5000, 1000).slideUp(1000, function () {
                        //         $("#errPopup").slideUp(1000);
                        //         $('#errPopup').hide();
                        //     });
                        // }
                    }
                }).always(function(data) {
                    $('#loading').hide();
                });
                // console.log(i)

            });
        }
    }

});

function searchFunc() {

    var input, filter, table, tr, td, i, j;
    input = document.getElementById("inputsearch-customer");
    filter = input.value.toUpperCase();
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
                    break;
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
}