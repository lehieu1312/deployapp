$(document).ready(()=>{
    var pathArray = window.location.pathname.split('/');
    if (pathArray[2] == "customer") {
        $("#customer").find(".imgfirst").hide();
        $("#customer").find(".imglast").show();
        $('#customer').css("background", "#00afee");
        $('#customer').css('color', '#fff');
    }
    if (pathArray[2] == "withdraw") {
        $("#withdraw").find(".imgfirst").hide();
        $("#withdraw").find(".imglast").show();
        $('#withdraw').css("background", "#00afee");
        $('#withdraw').css('color', '#fff');
    }
    if (pathArray[2] == "membership") {
        $("#membership").find(".imgfirst").hide();
        $("#membership").find(".imglast").show();
        $('#membership').css("background", "#00afee");
        $('#membership').css('color', '#fff');
    }
    if (pathArray[2] == "statements") {
        $("#statements").find(".imgfirst").hide();
        $("#statements").find(".imglast").show();
        $('#statements').css("background", "#00afee");
        $('#statements').css('color', '#fff');
    }
    if (pathArray[2] == "apps") {
        $("#apps").find(".imgfirst").hide();
        $("#apps").find(".imglast").show();
        $('#apps').css("background", "#00afee");
        $('#apps').css('color', '#fff');
    }
})