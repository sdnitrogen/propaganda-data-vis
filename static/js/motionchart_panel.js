//Left : +ve , Right: -ve
function loadMotionChartPanel(motionchart_rs) {
    console.log(motionchart_rs);
    var time;
    var data = motionchart_rs.motionchart;
    var end_index = motionchart_rs.metrics.end_index;
    var months_array = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    var years_array = ["2015", "2016", "2017", "2018"];
    // var data = [
    //     {
    //         name: "Article1",
    //         propaganda: "loadedlanguage",
    //         years: [
    //             [2000, 2000],
    //             [2001, 2001],
    //             [2002, 2002],
    //             [2003, 2003],
    //             [2004, 2004],
    //             [2005, 2005],
    //             [2006, 2006],
    //             [2007, 2007],
    //             [2008, 2008],
    //             [2009, 2009],
    //             [2010, 2010],
    //         ],
    //         bias: [
    //             [2000, 0.6],
    //             [2001, -0.2],
    //             [2002, 0.3],
    //             [2003, -0.1],
    //             [2004, 0.4],
    //             [2005, 0.4],
    //             [2006, 0.9],
    //             [2007, -0.7],
    //             [2008, 0.4],
    //             [2009, 0.4],
    //             [2010, -0.7],
    //         ],
    //     },
    //     {
    //         name: "Article2",
    //         propaganda: "namecalling",
    //         years: [
    //             [2000, 2000],
    //             [2001, 2001],
    //             [2002, 2002],
    //             [2003, 2003],
    //             [2004, 2004],
    //             [2005, 2005],
    //             [2006, 2006],
    //             [2007, 2007],
    //             [2008, 2008],
    //             [2009, 2009],
    //             [2010, 2010],
    //         ],
    //         bias: [
    //             [2000, 0.1],
    //             [2001, 0.2],
    //             [2002, 0.3],
    //             [2003, 0.1],
    //             [2004, -0.4],
    //             [2005, -0.4],
    //             [2006, 0.9],
    //             [2007, -0.2],
    //             [2008, 0.2],
    //             [2009, 0.2],
    //             [2010, -0.2],
    //         ],
    //     },
    //     {
    //         name: "Article3",
    //         propaganda: "namecalling",
    //         years: [
    //             [2000, 2000],
    //             [2001, 2001],
    //             [2002, 2002],
    //             [2003, 2003],
    //             [2004, 2004],
    //             [2005, 2005],
    //             [2006, 2006],
    //             [2007, 2007],
    //             [2008, 2008],
    //             [2009, 2009],
    //             [2010, 2010],
    //         ],
    //         bias: [
    //             [2000, 0.1],
    //             [2001, 0.1],
    //             [2002, 0.7],
    //             [2003, -0.3],
    //             [2004, 0.5],
    //             [2005, -0.1],
    //             [2006, 0.2],
    //             [2007, -0.3],
    //             [2008, 0.1],
    //             [2009, 0.2],
    //             [2010, -0.3],
    //         ],
    //     },
    // ];

    // d3.json("/biasdata/biasyears.json", function(data) {
    //   data1=data;
    //   console.log(data1);
    // });

    function x(d) {
        return d.years;
    }

    function y(d) {
        return d.bias;
    }

    function key(d) {
        return d.publication;
    }

    // Chart dimensions.
    var margin = { top: 12.5, right: 15, bottom: 15, left: 35 },
        width =
            document.querySelector("#motionchart").clientWidth -
            margin.left -
            margin.right,
        height =
            document.querySelector("#motionchart").clientHeight -
            margin.top -
            margin.bottom;

    // Various scales. These domains make assumptions of data, naturally.
    var xScale = d3.scaleLinear().domain([0, end_index]).range([0, width]),
        yScale = d3.scaleLinear().domain([-1, 1]).range([height, 0]),
        // radiusScale = d3.scale.linear().domain([10000, 100000]).range([0, 50]),
        colorScale = d3.scaleOrdinal(d3.schemePaired);

    // The x & y axes.
    formatter = d3.format(".0%");
    var xAxis = d3.axisBottom(xScale),
        yAxis = d3.axisLeft(yScale);

    // Create the SVG container and set the origin.
    var svg = d3.select("#motionchart");
    svg.selectAll("*").remove();
    svg = d3
        .select("#motionchart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // // Add the x-axis.
    // svg.append("g")
    //   .attr("class", "x axis")
    //   .attr("transform", "translate(0," + height + ")")
    //   .call(xAxis);

    // Add the middle-axis.
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height / 2 + ")")
        .call(xAxis.ticks(0));

    // Add the y-axis.
    svg.append("g").attr("class", "y axis").call(yAxis);

    // Add an x-axis label.
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 6)
        .text("TimeScale");

    // Add a Bias y-axis label.
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("x", 0)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Left Bias");

    // Add a Bias y-axis label.
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("x", -height + 45)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Right Bias");

    // Add the year label; the value is set on transition.
    var label = svg
        .append("text")
        .attr("class", "year label")
        .attr("text-anchor", "end")
        .attr("y", height - 24)
        .attr("x", width)
        .text("");

    // Load the data.
    drawMotionChart(data);

    function drawMotionChart(data) {
        var bisect = d3.bisector(function (d) {
            return d[0];
        });

        // Add a dot per article. Initialize the data at 1990, and set the colors.
        var tooltip = d3
            .select("body")
            .append("div")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .text("a simple tooltip");

        var dots = svg.append("g").attr("class", "dots");

        var dot = dots
            .selectAll(".dot")
            .data(interpolateData(end_index + 5))
            .enter()
            .append("circle")
            .attr("class", "dot")
            .style("fill", function (d) {
                return colorScale(Math.random() % 12);
            })
            .on("mouseover", function (d) {
                tooltip.html(
                    "<b>" + d.publication + "</b><br/>Bias: " + d.bias
                );
                tooltip.attr("class", "d3-tip");
                return tooltip.style("visibility", "visible");
            })
            .on("mousemove", function (d) {
                tooltip.html(
                    "<b>" + d.publication + "</b><br/>Bias: " + d.bias
                );
                return tooltip
                    .style("top", d3.event.pageY - 60 + "px")
                    .style("left", d3.event.pageX - 60 + "px");
            })
            .on("mouseout", function (d) {
                return tooltip.style("visibility", "hidden");
            })
            // .on("click", function (d) {
            //     console.log(time);
            //     console.log(d);
            // })
            .call(position);

        // Add a title.
        dot.append("text").text(function (d) {
            return d.publication;
        });

        // Add an overlay for the year label.
        //var box = label.node().getBBox();

        // var overlay = svg
        //     .append("rect")
        //     .attr("class", "overlay")
        //     .attr("x", box.x)
        //     .attr("y", box.y)
        //     .attr("width", box.width)
        //     .attr("height", box.height)
        // svg.on("mouseover", function () {
        //     svg.transition().duration(0);
        // }).on("mouseout", function () {
        //     svg.transition().duration(3000);
        // });

        // Start a transition that interpolates the data based on year.
        svg.transition()
            .duration(30000)
            .ease(d3.easeLinear)
            .tween("year", tweenYear)
            .on("end", repeat);

        // Positions the dots based on data.
        function position(dot) {
            dot.attr("cx", function (d) {
                //console.log(d);
                return xScale(x(d));
            })
                .attr("cy", function (d) {
                    return yScale(y(d));
                })
                .attr("r", function (d) {
                    return 5;
                });
            // .style("opacity", function (d) {
            //     if (d.years > time) {
            //         return 0;
            //     }
            //     return 1;
            // });
        }

        function repeat() {
            svg.transition()
                .duration(30000)
                .ease(d3.easeLinear)
                .tween("year", tweenYear)
                .on("end", repeat);
        }

        // After the transition finishes, you can mouseover to change the year.
        // function enableInteraction() {
        //     var yearScale = d3
        //         .scaleLinear()
        //         .domain([0, end_index])
        //         .range([box.x + 10, box.x + box.width - 10])
        //         .clamp(true);

        //     // Cancel the current transition, if any.
        //     svg.transition().duration(0);

        //     svg
        //         .on("mouseover", mouseover)
        //         .on("mouseout", mouseout)
        //         .on("mousemove", mousemove)
        //         .on("touchmove", mousemove);

        //     function mouseover() {
        //         label.classed("active", true);
        //     }

        //     function mouseout() {
        //         label.classed("active", false);
        //     }

        //     function mousemove() {
        //         displayYear(yearScale.invert(d3.mouse(this)[0]));
        //     }
        // }

        // Tweens the entire chart by first tweening the year, and then the data.
        // For the interpolated data, the dots and label are redrawn.
        function tweenYear() {
            var year = d3.interpolateNumber(0, end_index);
            return function (t) {
                displayYear(year(t));
            };
        }

        // Updates the display to show the specified year.
        function displayYear(year) {
            dot.data(interpolateData(year), key).call(position);
            time = Math.round(year);
            let m = time % 12;
            let y = Math.floor(time / 12);
            label.text(months_array[m] + "-" + years_array[y]);
        }

        // Interpolates the dataset for the given (fractional) year.
        function interpolateData(year) {
            return data.map(function (d) {
                return {
                    publication: d.publication,
                    years: interpolateValues(d.months, year),
                    bias: interpolateValues(d.bias, year),
                };
            });
        }

        // Finds (and possibly interpolates) the value for the specified year.
        function interpolateValues(values, year) {
            var i = bisect.left(values, year, 0, values.length - 1),
                a = values[i];
            if (i > 0) {
                var b = values[i - 1],
                    t = (year - a[0]) / (b[0] - a[0]);
                return a[1] * (1 - t) + b[1] * t;
            }
            return a[1];
        }
    }
}
