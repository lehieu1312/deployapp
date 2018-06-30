$(document).ready(() => {
    var arrcountry = [];
    $("#country1").find("li").each(function (i) {
        arrcountry.push($(this).text()[0].toUpperCase())
    })
    $(document).keypress(function (e) {
        if(document.getElementById("country1")){
            if (document.getElementById("country1").style.display != "none") {
                var control = arrcountry.indexOf(e.originalEvent.key.toUpperCase());
                document.getElementById("country1").scrollTop = control * 34;
            }
        }
    });

})