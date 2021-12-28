function loadStreamGraph(streamgraph_rs, path_value, toggle, ex) {
    console.log(streamgraph_rs);

    let margin = { top: 20, right: 30, bottom: 20, left: 30 };
    let width =
        document.querySelector("#streamgraph").clientWidth - margin.left;
    let height =
        document.querySelector("#streamgraph").clientHeight -
        margin.top -
        margin.bottom;

    var svg = d3.select("#streamgraph");
    svg.selectAll("*").remove();
    svg = d3
        .select("#streamgraph")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // Parse the Data
    // d3.csv("/static/data/streamgraph_example_data.csv").then(function(data) {
    //console.log(data.streamgraph);
    // List of groups = header of the csv files
    var data = streamgraph_rs.streamgraph;
    var keys = [
        "Doubt",
        "Loaded_Language",
        "Labeling",
        "Appeal_to_fear-prejudice",
        "Name_Calling",
        "Minimisation",
        "Causal_Oversimplification",
        "Black-and-White_Fallacy",
        "Exaggeration",
        "Flag-Waving",
        "Thought-terminating_Cliches",
        "Slogans",
    ];
    keys.sort();
    // color palette
    var color = d3
        .scaleOrdinal()
        .domain(keys)
        .range([
            "#a6cee3",
            "#1f78b4",
            "#b2df8a",
            "#33a02c",
            "#fb9a99",
            "#e31a1c",
            "#fdbf6f",
            "#ff7f00",
            "#cab2d6",
            "#6a3d9a",
            "#ffff99",
            "#b15928",
        ]);

    var metrics = streamgraph_rs.metrics;
    var startdate = metrics.start_date.split("-");
    var enddate = metrics.end_date.split("-");
    fromdate.valueAsDate = new Date(
        startdate[2],
        parseInt(startdate[1]) - 1,
        startdate[0]
    );
    todate.valueAsDate = new Date(
        enddate[2],
        parseInt(enddate[1]) - 1,
        enddate[0]
    );
    //console.log(keys);
    //console.log([new Date(startdate[2],parseInt(startdate[1])-1,startdate[0]), new Date(enddate[2],parseInt(enddate[1])-1,enddate[0])]);
    // Add X axis
    var x = d3
        .scaleLinear()
        .domain(
            d3.extent(data, function (d) {
                return d.day;
            })
        )
        .range([0, width]);
    var xScale = d3
        .scaleTime()
        .domain([
            new Date(startdate[2], parseInt(startdate[1]) - 1, startdate[0]),
            new Date(enddate[2], parseInt(enddate[1]) - 1, enddate[0]),
        ])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale).ticks(10));

    // Add Y axis
    var y = d3
        .scaleLinear()
        .domain([-metrics.max_prop, metrics.max_prop])
        .range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));
    //stack the data?
    var stackedData = d3.stack().offset(d3.stackOffsetSilhouette).keys(keys)(
        data
    );
    //console.log(stackedData);
    // Show the areas
    svg.selectAll("mylayers")
        .data(stackedData)
        .enter()
        .append("path")
        .style("fill", function (d) {
            return color(d.key);
        })
        .attr(
            "d",
            d3
                .area()
                .x(function (d, i) {
                    return x(d.data.day);
                })
                .y0(function (d) {
                    return y(d[0]);
                })
                .y1(function (d) {
                    return y(d[1]);
                })
        )
        .on("mouseover", function (d, i) {
            //console.log(color(d.key));
            if (d3.select(this).style("opacity") == 1) {
                let index = Math.floor(x.invert(d3.mouse(this)[0]));
                let prop = d.key;
                tooltipdiv
                    .style("opacity", 1)
                    .html(
                        "Propaganda : <b>" +
                            prop +
                            "</b><br/> Usage : " +
                            d[index].data[prop]
                    )
                    .style("left", d3.event.pageX + 20 + "px")
                    .style("top", d3.event.pageY - 20 + "px");
            }
        })
        .on("mousemove", function (d, i) {
            //console.log('mousemove on ' + d.key);
            if (d3.select(this).style("opacity") == 1) {
                let index = Math.floor(x.invert(d3.mouse(this)[0]));
                let prop = d.key;
                tooltipdiv
                    .style("opacity", 1)
                    .html(
                        "Propaganda : <b>" +
                            prop +
                            "</b><br/> Usage : " +
                            d[index].data[prop]
                    )
                    .style("left", d3.event.pageX + 20 + "px")
                    .style("top", d3.event.pageY - 20 + "px");
            }
        })
        .on("mouseout", function (d, i) {
            //console.log('mouseout on ' + d.key);
            if (d3.select(this).style("opacity") == 1) {
                tooltipdiv.style("opacity", 0);
            }
        });
    // }).catch(function(err) {
    //     console.log(err);
    // });
    if (path_value != "") {
        let ex_sum = eval(ex.join("+"));
        if (ex_sum != 0) {
            for (let i = 0; i < ex.length; i++) {
                if (ex[i] == 1) {
                    svg.selectAll("path")
                        .filter(function (d) {
                            return (
                                d3
                                    .select(this)
                                    .style("fill")
                                    .toString()
                                    .replace(/\s/g, "") ==
                                `rgb(${color(keys[i])
                                    .match(/\w\w/g)
                                    .map((x) => +`0x${x}`)})`
                            );
                        })
                        .style("opacity", 1);
                } else {
                    svg.selectAll("path")
                        .filter(function (d) {
                            //console.log((d3.select(this).style("fill")).toString().replace(/\s/g, ''),`rgb(${color(keys[i]).match(/\w\w/g).map(x=>+` 0x${x}`)})`);
                            return (
                                d3
                                    .select(this)
                                    .style("fill")
                                    .toString()
                                    .replace(/\s/g, "") ==
                                `rgb(${color(keys[i])
                                    .match(/\w\w/g)
                                    .map((x) => +`0x${x}`)})`
                            );
                        })
                        .style("opacity", 0);
                }
            }
        }
        let sum = eval(toggle.join("+"));
        if (sum != 0) {
            for (let i = 0; i < toggle.length; i++) {
                if (toggle[i] == 1) {
                    svg.selectAll("path")
                        .filter(function (d) {
                            return (
                                d3
                                    .select(this)
                                    .style("fill")
                                    .toString()
                                    .replace(/\s/g, "") ==
                                `rgb(${color(keys[i])
                                    .match(/\w\w/g)
                                    .map((x) => +`0x${x}`)})`
                            );
                        })
                        .transition()
                        .duration(1000)
                        .style("opacity", 1);
                } else {
                    svg.selectAll("path")
                        .filter(function (d) {
                            //console.log((d3.select(this).style("fill")).toString().replace(/\s/g, ''),`rgb(${color(keys[i]).match(/\w\w/g).map(x=>+` 0x${x}`)})`);
                            return (
                                d3
                                    .select(this)
                                    .style("fill")
                                    .toString()
                                    .replace(/\s/g, "") ==
                                `rgb(${color(keys[i])
                                    .match(/\w\w/g)
                                    .map((x) => +`0x${x}`)})`
                            );
                        })
                        .transition()
                        .duration(1000)
                        .style("opacity", 0);
                }
            }
        } else {
            svg.selectAll("path")
                .transition()
                .duration(1000)
                .style("opacity", 1);
        }
        if (sum == toggle.length) {
            for (let i = 0; i < toggle.length; i++) {
                toggle[i] = 0;
            }
        }
    }
}
