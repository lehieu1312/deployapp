// console.log(hostSeverSocket);
$(document).ready(() => {
    var socket = io(hostSeverSocket);
    var iduser = $('#iduserfornoti').val();
    console.log(iduser);

    socket.on("notification-" + iduser, (data) => {
        // var numbernoti = $('#number-of-notification').html();
        // console.log(numbernoti);
        $('#box-content-notifi-for-user').append(`
        <a href="/dashboard/membership/detailnoti/` + data.id + `">
        <div class="box-content-noti">
        <div class="box-icon-notification">
            <img src="/themes/img/admin/symbolnotifi.png" alt="symbol notification">
        </div>
        <div class="content-notification-user">
            <div class="title-content-noti" id="title-notification-for-user">
                <span>` + data.title + `</span>
            </div>
            <div class="body-content-noti" id="content-message-noti-for-user">
         <span>  ` + (data.content.length < 75 ? data.content : data.content.slice(0, 74) + '...') + `</span>       
            </div>
            <div class="head-content-noti" id="date-footer-noti-for-user">
                <span>${moment(data.date).format('DD/MM/YYYY HH:mm:ss')} </span>
            </div>
        </div>
    </div> 
    </a>`);
    })
})