$(document).ready(function () {


    $(".delete-menumore").each(function (i) {
        $(this).find("a")
            .mouseenter(() => {
                $(this).find(".imgicondelete").attr("src", "/themes/img/dashboard/icondeleteactive.png");
            })
            .mouseleave(() => {
                $(this).find(".imgicondelete").attr("src", "/themes/img/dashboard/icondelete.png");
            });
    });

    if (window.location.pathname.toLowerCase() == "/dashboard/appversion") {
        $('#appversion').css('color', '#00afee');
    }

    $(".far-notification").click((event) => {
        $('.item-notification').toggle();
        event.stopPropagation();
    })

    $(".far-affiliate").click((event) => {
        $(".arrow-top-afiliate").toggle();
        $(".arrow-affiliate").toggle();
        $('.item-affiliate').toggle();
        event.stopPropagation();
    })

    $('.showmenuaccount').click((event) => {
        $('#menuaccount').toggle();
        event.stopPropagation();
    })
    $(body).click(() => {
        $('#menuaccount').hide();
    })
    // btn-menu active
    $('#nomenu').click(() => {
        $('.setlimenu').removeClass('divhover');
        $('.setlimenu').addClass("hoverspan");
        $('.top-opacity').addClass("toptop-opacity-menusmall");
        $('.orderit').addClass('orderit-menusmall');
        $('#nomenu').hide();
        $('#okmenu').show();
        $('#menu-detail').animate({
            'width': '70px'
        });
        $('.navbar1').animate({
            'left': '70px'
        });
        $('.set-a-logo').attr({
            'src': '/themes/img/dashboard/iconhome.png'
        });
        $('.set-a-logo').css('margin-left', '2px');
        $('.imgiconmenu').css('padding', '0 23px 0 23px');
        $('.xcontent ').css('margin-left', '70px');
        $('.spantextmenu').css('display', 'none');
        $('.setarrowmenu').css('display', 'none');

    })
    $('#okmenu').click(() => {
        $('.setlimenu').addClass('divhover');
        $('.setlimenu').removeClass("hoverspan");
        $('.top-opacity').removeClass("toptop-opacity-menusmall");
        $('.orderit').removeClass('orderit-menusmall');
        $('#nomenu').show();
        $('#okmenu').hide();
        $('.navbar1').css({
            'left': '270px'
        });
        $('#menu-detail').animate({
            'width': '270px'
        });
        $('.set-a-logo').attr({
            'src': '/themes/img/logo-appbuilder.svg'
        });
        $('.set-a-logo').css('margin-left', '');
        $('.imgiconmenu').css('padding', '0 50px 0 35px');
        $('.xcontent ').css('margin-left', '270px');
        $('.spantextmenu').css('display', 'inline')
        $('.setarrowmenu').css('display', 'inline');
    })
    $('#app-used-menuleft').click(() => {
        $('#arowwx').toggle();
        $('.arrow-top').toggle();
        $('.submenuleft-edit').toggle();
    })


    // set local
    var hoverarrow = document.getElementsByClassName('set-span-arrow-right');
    var hovertext = document.getElementsByClassName('subspantextmenu1');
    var pathArray = window.location.pathname.split('/');

    if (pathArray[1] == "dashboard" && pathArray[2] == null) {
        $("#myapp").css("background", "#00afee");
        $("#myapp").find(".imgfirst").hide();
        $("#myapp").find(".imglast").show();
        document.getElementById("myapp").style.color = "#00afee";
        document.getElementById("myapp").getElementsByClassName("spantextmenu")[0].style.color = "#fff";
    }
    if (pathArray[1] == "checkout" && pathArray[2] == null) {

    }
    var item_affiliate = document.getElementsByClassName("item-affiliate");

    if (pathArray[1] == "affiliate") {
        $(".item-affiliate").show();
        if (pathArray[2] == "report") {
            // hoversubmenu[0].style.display = "none"
            item_affiliate[0].style.color = "#00afee";
            item_affiliate[0].getElementsByClassName("spantextmenu")[0].style.color = "#00afee";
        }
        if (pathArray[2] == "statements") {
            // hoversubmenu[0].style.display = "none"
            item_affiliate[1].style.color = "#00afee";
            item_affiliate[1].getElementsByClassName("spantextmenu")[0].style.color = "#00afee";
        }
        if (pathArray[2] == "withdrawal") {
            // hoversubmenu[0].style.display = "none"
            item_affiliate[2].style.color = "#00afee";
            item_affiliate[2].getElementsByClassName("spantextmenu")[0].style.color = "#00afee";
        }
        if (pathArray[2] == "payment-method") {
            // hoversubmenu[0].style.display = "none"
            item_affiliate[3].style.color = "#00afee";
            item_affiliate[3].getElementsByClassName("spantextmenu")[0].style.color = "#00afee";
        }
    }

    if (pathArray[2] == "appversion") {
        // hoversubmenu[0].style.display = "none"
        hoverarrow[0].style.color = "#00afee";
        hovertext[0].style.color = "#00afee";
        $('#app-used-menuleft').css("background", "#00afee");
        $('#app-used-menuleft').css('color', '#fff');

    }
    if (pathArray[2] == "editprofile") {
        // hoversubmenu[0].style.display = "none"


    }

    if (pathArray[2] == "history") {
        hoverarrow[1].style.color = "#00afee";
        hovertext[1].style.color = "#00afee";
        $('#app-used-menuleft').css("background", "#00afee");
        $('#app-used-menuleft').css('color', '#fff');


    }
    if (pathArray[2] == "myteam") {
        hoverarrow[2].style.color = "#00afee";
        hovertext[2].style.color = "#00afee";
        $('#app-used-menuleft').css("background", "#00afee");
        $('#app-used-menuleft').css('color', '#fff');


    }
    if (pathArray[2] == "appsettings") {
        hoverarrow[3].style.color = "#00afee";
        hovertext[3].style.color = "#00afee";
        $('#app-used-menuleft').css("background", "#00afee");
        $('#app-used-menuleft').css('color', '#fff');


    }
    if (pathArray[2] == "myorder") {
        hoverarrow[4].style.color = "#00afee";
        hovertext[4].style.color = "#00afee";
        $('#app-used-menuleft').css("background", "#00afee");
        $('#app-used-menuleft').css('color', '#fff');
        if (pathArray[2] != "detail") {

        } else {
            var parseQueryString = function (queryString) {
                var params = {},
                    queries, temp, i, l;
                // Split into key/value pairs
                queries = queryString.split("&");
                // Convert the array of strings into an object
                for (i = 0, l = queries.length; i < l; i++) {
                    temp = queries[i].split('=');
                    params[temp[0]] = temp[1];
                }
                return params;
            };
            var querycodeorder = parseQueryString(window.location.search.substring(1))

        }

    }

    if (pathArray[2] == "traffic") {
        hoverarrow[5].style.color = "#00afee";
        hovertext[5].style.color = "#00afee";
        $('#app-used-menuleft').css("background", "#00afee");
        $('#app-used-menuleft').css('color', '#fff');

    }
    if (pathArray[2] == "notification") {
        hoverarrow[6].style.color = "#00afee";
        hovertext[6].style.color = "#00afee";
        $('#app-used-menuleft').css("background", "#00afee");
        $('#app-used-menuleft').css('color', '#fff');

    }
    if (pathArray[1] == "affiliate") {
        $("#app-used-affilite").find(".imgfirst").hide();
        $("#app-used-affilite").find(".imglast").show();
        $('#app-used-affilite').css("background", "#00afee");
        $('#app-used-affilite').css('color', '#fff');

    }
    if (pathArray[1] == "membership") {
        $("#membership").find(".imgfirst").hide();
        $("#membership").find(".imglast").show();
        $('#membership').css("background", "#00afee");
        $('#membership').css('color', '#fff');

    }
});

function trimSpace(str) {
    return str.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, "").replace(/\s+/g, " ");
}

function searchapp_admin() {
    var input, filter, span, i, div;
    input = document.getElementById("inputsearhappadmin");
    filter = input.value.toUpperCase();
    // console.log(filter);
    span = document.getElementsByClassName("name-app-advertise");
    div = document.getElementsByClassName("group-advertise");
    var dem = 0;
    for (i = 0; i < span.length; i++) {
        if (span[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            dem++;
            div[i].style.display = "";

        } else {
            div[i].style.display = "none";
        }
    }
}

function searchmyapp() {
    var input, filter, span, i, div;
    input = document.getElementById("inputsearchapp");
    filter = input.value.toUpperCase();
    // console.log(filter);
    span = document.getElementsByClassName("nameapp");
    div = document.getElementsByClassName("div-list-myapp");
    var dem = 0;
    for (i = 0; i < span.length; i++) {
        if (span[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            dem++;
            div[i].style.display = "";

        } else {
            div[i].style.display = "none";
        }
    }
    if (dem < 6) {
        $('.iconloadmore').hide();
    }

    if (trimSpace(input.value) == "") {
        if (div.length > 6) {
            $('.iconloadmore').show();
            for (let i = 6; i < div.length; i++) {
                // console.log(i);
                div[i].style.display = "none";
            }
        }
    }


}