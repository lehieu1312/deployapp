$(document).ready(() => {
    var btnmenu = document.getElementsByClassName('selected-date');
    var menu = document.getElementsByClassName('dropdown-traffic');
    for (let i = 0; i < btnmenu.length; i++) {
        btnmenu[i].addEventListener("click", (event) => {
            if (menu[i].style.display == "none") {
                menu[i].style.display = "block";
            } else {
                menu[i].style.display = "none";
            }
            console.log(menu[i].style.display);
            event.stopPropagation();
        })
    }
    $("#deploy-detail-content").click(() => {
        $(".dropdown-traffic").hide();
    });
    ajax_daily_traffic(7, 0);
    ajax_sale_traffic(7, 0)

    clickmenu(0, ajax_daily_traffic)
    clickmenu(1, ajax_sale_traffic)
})

function clickmenu(a, b, c) {
    let menupageuser = document.getElementsByClassName("dropdown-traffic")[a];
    let selected = document.getElementsByClassName("selected-date")[a];
    let selected1 = document.getElementsByClassName("selected-date1")[a];
    let showdate = document.getElementsByClassName("show-date")[a];

    let tagapageuser = menupageuser.getElementsByTagName("a");
    let now = new Date();
    let numDay = now.getDate()
    // for (let i = 0; i < tagapageuser.length; i++) {
    tagapageuser[0].addEventListener('click', () => {
        let datenow = new Date(now);
        datenow.setDate(numDay);
        datenow = datenow.toString().split(" ");
        showdate.innerHTML = datenow[1] + " " + datenow[2] + "," + datenow[3];
        selected.innerHTML = "ToDay";
        selected1.innerHTML = "ToDay";
        b(7, 0);
    })
    tagapageuser[1].addEventListener('click', () => {
        let datenow = new Date(now);
        datenow.setDate(numDay - 1);
        datenow = datenow.toString().split(" ");
        showdate.innerHTML = datenow[1] + " " + datenow[2] + "," + datenow[3];
        selected.innerHTML = "Yesterday";
        selected1.innerHTML = "Yesterday";
        b(7, 0);
    })
    tagapageuser[2].addEventListener('click', () => {
        let datenow = new Date(now);
        datenow.setDate(numDay - 1);
        datenow = datenow.toString().split(" ");
        let datenow1 = new Date(now);
        datenow1.setDate(numDay - 7);
        datenow1 = datenow1.toString().split(" ");
        showdate.innerHTML = datenow[1] + " " + datenow[2] + "," + datenow[3] + " - " + datenow1[1] + " " + datenow1[2] + "," + datenow1[3];;
        selected.innerHTML = "Last 7 days";
        selected1.innerHTML = "Last 7 days";
        b(7, 0);
    })
    tagapageuser[3].addEventListener('click', () => {
        let datenow = new Date(now);
        datenow.setDate(numDay - 1);
        datenow = datenow.toString().split(" ");
        let datenow1 = new Date(now);
        datenow1.setDate(numDay - 30);
        datenow1 = datenow1.toString().split(" ");
        showdate.innerHTML = datenow[1] + " " + datenow[2] + "," + datenow[3] + " - " + datenow1[1] + " " + datenow1[2] + "," + datenow1[3];;
        selected.innerHTML = "Last 30 days";
        selected1.innerHTML = "Last 30 days";
        b(30, 0);
    })
    tagapageuser[4].addEventListener('click', () => {
        let datenow = new Date(now);
        datenow.setDate(numDay - 1);
        datenow = datenow.toString().split(" ");
        let datenow1 = new Date(now);
        datenow1.setDate(numDay - 90);
        datenow1 = datenow1.toString().split(" ");
        showdate.innerHTML = datenow[1] + " " + datenow[2] + "," + datenow[3] + " - " + datenow1[1] + " " + datenow1[2] + "," + datenow1[3];
        selected.innerHTML = "Last 90 days";
        selected1.innerHTML = "Last 90 days";
        b(90, 0);
    })
    $("#selectime" + a).click((event) => {
        event.stopPropagation();
    })
    if (a == 4) {
        $("#selectime" + a).daterangepicker({
                "dateLimit": {
                    "days": 7
                },
                maxDate: new Date(),
                drops: "up",
                opens: "left"
            },
            (start, end) => {
                $(".myDropdown-traffic").hide();
                let number = ((end._d - start._d) / 86400000).toFixed(0);
                let startx = start._d;
                startx = startx.toString().split(" ");
                let endx = end._d;
                endx = endx.toString().split(" ");
                showdate.innerHTML = startx[1] + " " + startx[2] + "," + startx[3] + " - " + endx[1] + " " + endx[2] + "," + endx[3];;
                selected.innerHTML = "Custom";
                selected1.innerHTML = "Custom";
                b(number, end)
            })
    } else {
        $("#selectime" + a).daterangepicker({
                maxDate: new Date(),
                drops: "up",
                opens: "left"
            },
            (start, end) => {
                $(".dropdown-traffic").hide();
                let number = ((end._d - start._d) / 86400000).toFixed(0);
                let startx = start._d;
                startx = startx.toString().split(" ");
                let endx = end._d;
                endx = endx.toString().split(" ");
                showdate.innerHTML = startx[1] + " " + startx[2] + "," + startx[3] + " - " + endx[1] + " " + endx[2] + "," + endx[3];;
                selected.innerHTML = "Custom";
                selected1.innerHTML = "Custom";
                // console.log(number, end)
                b(number, end)
            })
    }

}