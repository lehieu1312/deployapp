$(document).ready(() => {
    function trimSpace(str) {
        return str.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, "").replace(/\s+/g, " ");
    }
    var btndelete = document.getElementsByClassName("deleteuser");
    var deleteuser = document.getElementsByClassName("delete-user");
    var elementdelete = document.getElementsByClassName("element-delete");
    var emaildelete = document.getElementsByClassName("text-email");

    for (let i = 0; i < $('.deleteuser').length; i++) {
        btndelete[i].addEventListener('click', (event) => {
            // alert(deleteuser[i].style.display);
            if (deleteuser[i].style.display === "none") {
                // alert('1');
                deleteuser[i].style.display = "block";
            } else {
                // alert('2');
                deleteuser[i].style.display = "none";
            }
            settr = i;
            event.stopPropagation();
        })
        elementdelete[i].addEventListener('click', () => {
            // $('#mymodal-deleteuser').modal('show');
            email = emaildelete[i].innerHTML;
            // console.log(email);
        })
    }
    $(body).click(() => {
        $('.delete-user').hide();
    });

    var emailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var erremail = "Your email is not valid";
    var errempty = "Can not empty";

    function checkformadduser() {
        if (trimSpace($(".textarea-adduser").val()) == "") {
            $(".textarea-adduser").addClass("textarea-err")
            $(".textarea-adduser").attr({
                "placeholder": errempty
            });
            return false;
        } else if (emailReg.test($(".textarea-adduser").val()) == false) {
            $(".textarea-adduser").val("")
            $(".textarea-adduser").addClass("textarea-err")
            $(".textarea-adduser").attr({
                "placeholder": erremail
            });
            return false;
        }
        return true;
    }

    $('#form-adduser').submit(() => {
        if (checkformadduser() == true) {
            $('#myModa-adduser').modal('hide');
            $('#loading').show();
            $.ajax({
                type: "POST",
                url: "/admin/addcustomer",
                dataType: "json",
                data: {
                    email: $("#input-add-customer").val()
                },
                success: (data) => {
                    if (data.status == 1) {
                        window.location.href = "/admin/customer";
                    } else if (data.status == 2) {
                        $('#errPopup').show();
                        $('.alert-upload').text(data.msg[0].msg);
                        $("#errPopup").fadeTo(5000, 1000).slideUp(1000, function() {
                            // $("#errPopup").slideUp(1000);
                            // $('#errPopup').hide();
                        });
                    } else {
                        $('#errPopup').show();
                        $('.alert-upload').text(data.msg);
                        // $("#errPopup").fadeTo(5000, 1000).slideUp(1000, function() {
                        //     $("#errPopup").slideUp(1000);
                        //     $('#errPopup').hide();
                        // });
                    }
                }
            }).always(function(data) {
                $('#loading').hide();
            });
        }
    })
    $(".button-close-notification").click(() => {
        $(".errPopup").fadeOut();
    })

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