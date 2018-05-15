$(document).ready(() => {

    $.post(
        "/affiliate/report/user-traffic", {},
        function (data) {
            var data_traffic = [];
            let user = 0;
            let session = 0;
            let bounceRate = 0;
            let timeSession = 0;

            for (let i = 0; i < data.length; i++) {
                user = user + data[i].user;
                session = session + data[i].session;
                bounceRate = bounceRate + data[i].bounceRate;
                timeSession = timeSession + data[i].timeSession
                data_traffic[i] = data[i].user;
            }
            // console.log(user, session, bounceRate, timeSession);
            // console.log(data_traffic);

            function set_money(a) {
                a = Number(a.toFixed(2));
                return "$" + a.toLocaleString('en');
            }

            var btnmenu = document.getElementsByClassName('showmenu');
            var menu = document.getElementsByClassName('myDropdown-traffic');

            for (let i = 0; i < btnmenu.length; i++) {
                btnmenu[i].addEventListener("click", (e) => {
                    if (menu[i].style.display == "none") {
                        menu[i].style.display = "block";
                    } else {
                        menu[i].style.display = "none";
                    }
                    e.stopPropagation();
                })
            }
            $("#deploy-detail-content").click(() => {
                $(".myDropdown-traffic").hide();
            });

            var numberdate = 7;
            var numberend = 0;

            function getWeekDates() {
                // if (numberdate == 7) {
                let now = new Date();
                if (!numberend) {
                    now = new Date();
                } else {
                    // console.log(numberend)
                    now = numberend._d;
                }

                let dayOfWeek = now.getDay(); //0-6
                let numDay = now.getDate();
                let setdate = [];
                let setarraydate = [];
                for (var i = numberdate; i >= 1; i--) {
                    setarraydate.push(i)
                }

                for (let i = 1; i <= numberdate; i++) {
                    setdate[i - 1] = new Date(now); //copy
                    setdate[i - 1].setDate(numDay - setarraydate[i - 1]);
                    setdate[i - 1].setHours(23, 59, 59, 999);
                    setdate[i - 1] = setdate[i - 1].toDateString().split(" ");
                    setdate[i - 1] = setdate[i - 1][2] + " " + setdate[i - 1][1];
                }
                return setdate;

            }
            var label = getWeekDates();
            var customTooltipsuser = function (tooltip, data) {

                var tooltipEl = document.getElementById('tooltip-daily-traffic');
                if (!tooltipEl) {
                    tooltipEl = document.createElement('div');
                    tooltipEl.id = 'tooltip-daily-traffic';
                    tooltipEl.innerHTML = "<table></table>";
                    this._chart.canvas.parentNode.appendChild(tooltipEl);
                }
                // Hide if no tooltip
                if (tooltip.opacity === 0) {
                    tooltipEl.style.opacity = 0;
                    return;
                }
                // Set caret Position
                tooltipEl.classList.remove('above', 'below', 'no-transform');
                if (tooltip.yAlign) {
                    tooltipEl.classList.add(tooltip.yAlign);
                } else {
                    tooltipEl.classList.add('no-transform');
                }

                function getBody(bodyItem) {
                    return bodyItem.lines;
                }
                // Set Text
                if (tooltip.body) {
                    var titleLines = tooltip.title || [];
                    var bodyLines = tooltip.body.map(getBody);
                    var innerHtml = '<thead>';
                    titleLines.forEach(function (title) {
                        innerHtml += '<tr><th>' + title + '</th></tr>';
                    });
                    innerHtml += '</thead><tbody>';
                    bodyLines.forEach(function (body, i) {
                        // console.log("body:" + body[i])
                        var editbody = body[0].split(":")[1];
                        var span = '<span class="tooltip-daily-traffic-key"><img class="setimgtooltip" src="/themes/img/traffic/user.png"></span>';
                        innerHtml += '<tr><td>' + span + editbody + '</td></tr>';
                    });
                    innerHtml += '</tbody>';
                    var tableRoot = tooltipEl.querySelector('table');
                    tableRoot.innerHTML = innerHtml;
                }
                var positionY = this._chart.canvas.offsetTop;
                var positionX = this._chart.canvas.offsetLeft;
                // Display, position, and set styles for font
                tooltipEl.style.opacity = 1;
                tooltipEl.style.left = positionX + tooltip.caretX + 'px';
                tooltipEl.style.top = positionY + tooltip.caretY + 'px';
                tooltipEl.style.fontFamily = tooltip._bodyFontFamily;
                tooltipEl.style.fontSize = tooltip.bodyFontSize + 'px';
                tooltipEl.style.fontStyle = tooltip._bodyFontStyle;
                tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
            };
            let uat = document.getElementById("chart-daily-traffic").getContext("2d");
            let useractive = new Chart(uat, {
                type: 'line',
                data: {
                    labels: label,
                    datasets: [{
                        label: 'Monthly',
                        data: data_traffic.reverse(),
                        borderColor: '#00afee',
                        backgroundColor: '#f2f9ff',
                        pointBackgroundColor: "#00afee",
                        pointStyle: 'rect',
                        borderWidth: 1,
                        fill: true,
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    responsive: true,
                    legend: {
                        display: false,
                    },
                    tooltips: {
                        enabled: false,
                        mode: 'index',
                        position: 'nearest',
                        custom: customTooltipsuser
                    },
                    elements: {
                        point: {
                            hoverRadius: 6,
                            radius: 0,
                            hitRadius: 5
                        }
                    },
                    scales: {
                        xAxes: [{

                            gridLines: {
                                drawOnChartArea: false,
                                // drawBorder: true,
                            },
                            ticks: {
                                min: '20',
                                fontFamily: 'OpenSans-Regular',
                                fontSize: 13
                            },
                            gridLines: {
                                display: false
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                fontFamily: 'OpenSans-Regular',
                                fontSize: 13
                            },
                            gridLines: {
                                // display: false
                            }
                        }],

                    }
                }
            })
        }
    )


})