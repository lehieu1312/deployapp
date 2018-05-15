// console.log(hostSeverSocket);
$(document).ready(() => {
    var socket = io(hostSeverSocket);
    var iduser = $('#iduserfornoti').val();
    console.log(iduser);

    socket.on("notification-" + iduser, (data) => {
        // var numbernoti = $('#number-of-notification').html();
        // console.log('numbernoti _ io: ' + data.id);
        var numbOld = $('#number-of-notification').html();
        console.log(numbOld);
        $('#number-of-notification').html(parseInt(numbOld) + 1);
        $('#number-notifications').html(parseInt(numbOld) + 1);

        $('#body-content-for-user').prepend(`
        <a href="/dashboard/membership/detailnoti/` + data.id + `">
        <div class="box-content-noti" id="box-content-noti-` + data.id + `">
        <div class="box-icon-notification">
            <img src="/themes/img/admin/symbolnotifi.png" alt="symbol notification">
        </div>
        <div class="content-notification-user">
            <div class="title-content-noti" id="title-notification-for-user">
                <span>` + data.title + `</span>
                <a href="javascript:void(0)" onclick="deletenotiuser('` + data.id + `')" class="btn-close-noti">
                <img src="/themes/img/admin/closemodal.png" alt="Close model">
             </a>
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