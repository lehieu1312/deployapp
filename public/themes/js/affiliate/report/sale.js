function ajax_sale_traffic(date_start, date_end) {
    let url = "/affiliate/report/sale-traffic?datestart=" + date_start + "&dateend=" + date_end

    function set_money(a) {
        a = Number(a.toFixed(2));
        return "$" + a.toLocaleString('en');
    }

    function count_money(a) {

        dem = 0;
        for (let i = 0; i < a.length; i++) {
            dem = dem + a[i].money
        }
        // console.log(Number(dem.toFixed(2)));
        return Number(dem.toFixed(2));
    }
    $.post(url, {},
        function (data) {
            // console.log(data)
            $(".header-sale-traffic").html("");
            $(".header-sale-traffic").append(
                ` 
                    <div class="item-earning-by-time">
                    <div>Orders weekly</div>
                    <div class="light-large-gray">${data.statistics.weekly}</div>
                    </div>
                    <div class="item-earning-by-time">
                        <div>Orders monthly</div>
                        <div class="light-large-gray">${data.statistics.monthly}</div>
                    </div>
                    <div class="item-earning-by-time">
                        <div>Average revenue</div>
                        <div class="light-large-gray">${set_money(Number(data.statistics.year))}</div>
                    </div>
                `
            );


            data_sale = (() => {
                var a = [];
                for (let i = 0; i < data.sale.length; i++) {
                    a.push(count_money(data.sale[i]))
                }
                return a.reverse();
            })();
            // console.log(data_sale)

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

                var tooltipEl = document.getElementById('tooltip-sale-traffic');
                if (!tooltipEl) {
                    tooltipEl = document.createElement('div');
                    tooltipEl.id = 'tooltip-sale-traffic';
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
                        var span = '<span class="tooltip-sale-traffic-key"><img class="setimgtooltip" src="/themes/img/traffic/user.png"></span>';
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
            let uat = document.getElementById("chart-sale-traffic").getContext("2d");
            let useractive = new Chart(uat, {
                type: 'line',
                data: {
                    labels: label,
                    datasets: [{
                        label: 'Monthly',
                        data: data_sale,
                        borderColor: '#00afee',
                        backgroundColor: '#f2f9ff',
                        pointBackgroundColor: "#00afee",
                        pointStyle: 'circle',
                        borderWidth: 1,
                        fill: false,
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
                        custom: customTooltipsuser,
                    },
                    elements: {
                        line: {
                            tension: 0, // disables bezier curves
                        },
                        point: {
                            hoverRadius: 5,
                            radius: 3,
                            hitRadius: 5
                        }
                    },
                    scales: {
                        xAxes: [{
                            gridLines: {
                                drawOnChartArea: false,
                            },
                            ticks: {
                                beginAtZero: true,
                                fontFamily: ' OpenSans-Regular',
                                fontSize: 13,
                                min: 0,
                            },
                            gridLines: {
                                display: false
                            }
                        }],
                        yAxes: [{
                            ticks: {

                                beginAtZero: true,
                                fontFamily: ' OpenSans-Regular',
                                fontSize: 13,
                                // stepSize: 50

                            },
                            gridLines: {
                                // display: false
                            }
                        }]
                    },

                    label: {
                        font: {
                            family: "Georgia"
                        }
                    },

                }
            })

        }
    )
}