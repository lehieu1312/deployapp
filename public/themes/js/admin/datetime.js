$(document).ready(() => {
    var toLocalTime = function(time) {
        var d = new Date(time);
        console.log(d);
        var offset = (new Date().getTimezoneOffset() / 60) * -1;
        console.log(offset);
        var n = new Date(d.getTime() + offset);
        console.log(n);
        return n;
    };
})