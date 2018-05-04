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
                alert(deleteuser[i].style.display);
                if (deleteuser[i].style.display === "none") {
                    deleteuser[i].style.display = "block";
                } else {
                    deleteuser[i].style.display = "none";
                }
                settr = i;
                event.stopPropagation();
            })
            // elementdelete[i].addEventListener('click', () => {
            //     email = emaildelete[i].innerHTML;
            //     console.log(email);
            // })
    }
    $(body).click(() => {
        $('.delete-user').hide();
    })
});