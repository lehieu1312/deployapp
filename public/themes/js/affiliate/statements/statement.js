function download_csv() {

    let status = ["Pedding", "Complate", "Cancel"]

    var data_csv = [
        ["#", "Date", "Content", "Amount", "Status", "Balance", "note"]
    ];
    $.post("/getdata/withdrawal", {},
        function (data_withdrawal) {
            for (let i = 0; i < data_withdrawal.length; i++) {
                data_csv.push([i + 1, data_withdrawal[i].dateCreate, data_withdrawal[i].content, data_withdrawal[i].amount, status[data_withdrawal[i].statusWithdraw - 1], data_withdrawal[i].blance, data_withdrawal[i].note])
            }
            var csv = '';
            data_csv.forEach(function (row) {
                csv += row.join(',');
                csv += "\n";
            });

            // console.log(csv);
            var hiddenElement = document.createElement('a');
            hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
            hiddenElement.target = '_blank';
            hiddenElement.download = 'withdrawal.csv';
            hiddenElement.click();
        }
    )
}

$(document).ready(() => {
    var btndelete = document.getElementsByClassName("deleteuser");
    var deleteuser = document.getElementsByClassName("delete-user");
    var elementdelete = document.getElementsByClassName("element-delete");
    var id_history = document.getElementsByClassName("id-history");

    for (let i = 0; i < $('.deleteuser').length; i++) {
        btndelete[i].addEventListener('click', (event) => {
            if (deleteuser[i].style.display === "none") {
                deleteuser[i].style.display = "block";
            } else {
                deleteuser[i].style.display = "none";
            }
            event.stopPropagation();
        })
        elementdelete[i].addEventListener('click', () => {
            window.location.href = "/affiliate/statement/detail?idhistory=" + id_history[i].value
        })
    }
    $(body).click(() => {
        $('.delete-user').hide();
    })

})