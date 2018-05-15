function ajax_daily_traffic(date_start, date_end) {
    let url = "/affiliate/report/user-traffic?datestart=" + date_start + "&dateend=" + date_end

    function set_time(a) {
        a = a / 1000;
        // if (Math.floor(a / 60) > 60) {
        //     if (Math.floor(a / 60 / 60) > 24) {
        //         return Math.floor(a / 60 / 60 / 24) + "d" + Math.floor((a / 60 / 60) % 24) + "h" + Math.floor((a / 60) % 60) + "m" + Math.floor(a % 60) + "s";
        //     } else {
        //         return Math.floor(a / 60 / 60) + "h" + Math.floor((a / 60) % 60) + "m" + Math.floor(a % 60) + "s";
        //     }
        // } else {
        return Math.floor(a / 60) + "m" + Math.floor(a % 60) + "s";
        // }
    }
    $.post(
        url, {},
        function (data) {
            console.log(data)
            $(".header-daily-traffic").html("");
            $(".header-daily-traffic").append(
                `  
                    <div class="item-earning-by-time">
                    <div>User</div>
                    <div class="light-large-gray">${data.userStatistics.user}</div>
                    </div>
                    <div class="item-earning-by-time">
                    <div>Session</div>
                    <div class="light-large-gray">${data.userStatistics.session}</div>
                    </div>
                    <div class="item-earning-by-time">
                    <div>Bounce Rate</div>
                    <div class="light-large-gray">${(data.userStatistics.bounceRate/data.userStatistics.session)*100 + "%"}</div>
                    </div>
                    <div class="item-earning-by-time">
                    <div>Session Duration</div>
                    <div class="light-large-gray">${set_time(data.userStatistics.timeSession)}</div>
                    </div>
                `
            )

            var data_traffic = [];
            let user = 0;
            let session = 0;
            let bounceRate = 0;
            let timeSession = 0;

            for (let i = 0; i < data.daily.length; i++) {
                data_traffic[i] = data.daily[i].user;
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

            function getWeekDates() {
                // if (date_start == 7) {
                let now = new Date();
                if (!date_end) {
                    now = new Date();
                } else {
                    // console.log(date_end)
                    now = date_end._d;
                }

                let dayOfWeek = now.getDay(); //0-6
                let numDay = now.getDate();
                let setdate = [];
                let setarraydate = [];
                for (var i = date_start; i >= 1; i--) {
                    setarraydate.push(i)
                }

                for (let i = 1; i <= date_start; i++) {
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
}