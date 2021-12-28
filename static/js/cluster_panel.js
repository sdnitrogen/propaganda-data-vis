function loadCluster(cluster_rs, streamgraph_rs) {
    console.log(cluster_rs);

    let margin = { top: 20, right: 50, bottom: 20, left: 50 };
    let width = document.querySelector("#cluster").clientWidth - margin.left;
    let height =
        document.querySelector("#cluster").clientHeight -
        margin.top -
        margin.bottom;

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
    var toggle = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
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

    // var data = d3.json("/static/data/cluster_data_format.json")
    // console.log(data);
    // var data = ({
    //   children: Array.from(
    //     d3.group(
    //       Array.from({length: n}, (_, i) => ({
    //         group: Math.random() * m | 0,
    //         value: -Math.log(Math.random())
    //       })),
    //       d => d.group
    //     ),
    //     ([, children]) => ({children})
    //   )
    // })
    //console.log(data);
    var data = cluster_rs;
    let topleft = 10;
    let lefttop = 10;

    //replay;
    let pack = () =>
        d3.pack().size([width, height]).padding(1)(
            d3.hierarchy(data).sum((d) => d.propaganda_score)
        );

    const nodes = pack().leaves();

    const simulation = d3
        .forceSimulation(nodes)
        .force("x", d3.forceX((2 * width) / 3).strength(0.01))
        .force("y", d3.forceY(height / 2).strength(0.01))
        .force("cluster", forceCluster())
        .force("collide", forceCollide());

    const svg = d3.select("#cluster");
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    keys.forEach((element) => {
        svg.append("rect")
            .attr("x", topleft)
            .attr("y", lefttop)
            .attr("width", 15)
            .attr("height", 15)
            .style("fill", color(element))
            .on("click", function (d, i) {
                let ex = toggle.slice(0);
                toggle[keys.indexOf(element)] =
                    toggle[keys.indexOf(element)] == 0 ? 1 : 0;
                loadStreamGraph(streamgraph_rs, element, toggle, ex);
                let sum = eval(toggle.join("+"));
                if (sum != 0) {
                    for (let i = 0; i < toggle.length; i++) {
                        if (toggle[i] == 1) {
                            svg.data(nodes)
                                .selectAll("circle")
                                .filter(function (d) {
                                    return d.data.propaganda_name == keys[i];
                                })
                                .transition()
                                .duration(1000)
                                .style("opacity", 1);
                            svg.selectAll("text")
                                .filter(function (d) {
                                    return d3.select(this).text() == keys[i];
                                })
                                .style("fill-opacity", 1);
                        } else {
                            svg.data(nodes)
                                .selectAll("circle")
                                .filter(function (d) {
                                    return d.data.propaganda_name == keys[i];
                                })
                                .transition()
                                .duration(1000)
                                .style("opacity", 0);
                            svg.selectAll("text")
                                .filter(function (d) {
                                    return d3.select(this).text() == keys[i];
                                })
                                .style("fill-opacity", 0.5);
                        }
                    }
                } else {
                    svg.selectAll("circle")
                        .transition()
                        .duration(1000)
                        .style("opacity", 1);
                    svg.selectAll("text").style("fill-opacity", 1);
                }
                if (sum == toggle.length) {
                    for (let i = 0; i < toggle.length; i++) {
                        toggle[i] = 0;
                    }
                }
            })
            .on("mouseover", function (d, i) {
                d3.select(this).style("cursor", "pointer");
            })
            .on("mousemove", function (d, i) {
                d3.select(this).style("cursor", "pointer");
            })
            .on("mouseout", function (d, i) {
                d3.select(this).style("cursor", "default");
            });
        svg.append("text")
            .attr("x", topleft + 20)
            .attr("y", lefttop + 12)
            .text(element)
            .style("font-size", "12px")
            .attr("alignment-baseline", "middle")
            .style("fill", "white")
            .on("click", function (d, i) {
                let ex = toggle.slice(0);
                toggle[keys.indexOf(element)] =
                    toggle[keys.indexOf(element)] == 0 ? 1 : 0;
                loadStreamGraph(streamgraph_rs, element, toggle, ex);
                let sum = eval(toggle.join("+"));
                if (sum != 0) {
                    for (let i = 0; i < toggle.length; i++) {
                        if (toggle[i] == 1) {
                            svg.data(nodes)
                                .selectAll("circle")
                                .filter(function (d) {
                                    return d.data.propaganda_name == keys[i];
                                })
                                .transition()
                                .duration(1000)
                                .style("opacity", 1);
                            svg.selectAll("text")
                                .filter(function (d) {
                                    return d3.select(this).text() == keys[i];
                                })
                                .style("fill-opacity", 1);
                        } else {
                            svg.data(nodes)
                                .selectAll("circle")
                                .filter(function (d) {
                                    return d.data.propaganda_name == keys[i];
                                })
                                .transition()
                                .duration(1000)
                                .style("opacity", 0);
                            svg.selectAll("text")
                                .filter(function (d) {
                                    return d3.select(this).text() == keys[i];
                                })
                                .style("fill-opacity", 0.5);
                        }
                    }
                } else {
                    svg.selectAll("circle")
                        .transition()
                        .duration(1000)
                        .style("opacity", 1);
                    svg.selectAll("text").style("fill-opacity", 1);
                }
                if (sum == toggle.length) {
                    for (let i = 0; i < toggle.length; i++) {
                        toggle[i] = 0;
                    }
                }
            })
            .on("mouseover", function (d, i) {
                d3.select(this).style("cursor", "pointer");
            })
            .on("mousemove", function (d, i) {
                d3.select(this).style("cursor", "pointer");
            })
            .on("mouseout", function (d, i) {
                d3.select(this).style("cursor", "default");
            });
        lefttop = lefttop + 20;
    });

    const node = svg
        .append("g")
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("fill", (d) => color(d.data.propaganda_name))
        .call(drag(simulation))
        .on("mouseover", function (d, i) {
            //console.log(d);
            if (d3.select(this).style("opacity") == 1) {
                d3.select(this)
                    .attr("stroke-width", 2)
                    .style("stroke", "#000000")
                    .style("cursor", "pointer");

                tooltipdiv
                    .style("opacity", 1)
                    .html(
                        "<b><u>" +
                            d.data.title +
                            "</b></u><br/>" +
                            d.data.publication +
                            "<br/>" +
                            d.data.date +
                            "<br/>...click to see full article<br/>"
                    )
                    .style("left", d3.event.pageX + 20 + "px")
                    .style("top", d3.event.pageY - 20 + "px");
                createPieChart(d.data);
            }
        })
        .on("mousemove", function (d, i) {
            //console.log('mousemove on ' + d.data.group);
            if (d3.select(this).style("opacity") == 1) {
                d3.select(this)
                    .attr("stroke-width", 2)
                    .style("stroke", "#000000")
                    .style("cursor", "pointer");

                tooltipdiv
                    .style("opacity", 1)
                    .html(
                        "<b><u>" +
                            d.data.title +
                            "</b></u><br/>" +
                            d.data.publication +
                            "<br/>" +
                            d.data.date +
                            "<br/>...click to see full article<br/>"
                    )
                    .style("left", d3.event.pageX + 20 + "px")
                    .style("top", d3.event.pageY - 20 + "px");
                createPieChart(d.data);
            }
        })
        .on("mouseout", function (d, i) {
            //console.log('mouseout on ' + d.data.group);
            if (d3.select(this).style("opacity") == 1) {
                d3.select(this)
                    .attr("stroke-width", 0)
                    .style("stroke", "#000000")
                    .style("cursor", "default");

                tooltipdiv.style("opacity", 0);
            }
        })
        .on("click", function (d, i) {
            //console.log('mousemove on ' + d.data.group);
            // tooltipdiv.style("opacity", 1)
            //         .html("<b>" + d.data.title + "</b><br/>Propaganda_cluster: " + d.data.cluster)
            //         .style("left", (d3.event.pageX+20) + "px")
            //         .style("top", (d3.event.pageY-20) + "px");
            while (article.firstChild) {
                article.removeChild(article.firstChild);
            }
            while (wordcloud.firstChild) {
                wordcloud.removeChild(wordcloud.firstChild);
            }
            placeholder_article.style.opacity = 0;
            placeholder_wordcloud.style.opacity = 0;
            loader_article.style.opacity = 1;
            loader_wordcloud.style.opacity = 1;
            if (d3.select(this).style("opacity") == 1) {
                getArticle(
                    "GET",
                    "http://127.0.0.1:5000/article/" + String(d.data.id)
                )
                    .then(function (datums) {
                        loader_article.style.opacity = 0;
                        loader_wordcloud.style.opacity = 0;
                        loadArticlePanel(datums.article_rs);
                        loadWordcloudPanel(datums.wordcloud_rs);
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            }
        });

    node.transition()
        .delay((d, i) => Math.random() * 500)
        .duration(750)
        .attrTween("r", (d) => {
            const i = d3.interpolate(0, d.r);
            return (t) => (d.r = i(t));
        });

    simulation.on("tick", () => {
        node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    });

    //invalidation.then(() => simulation.stop());

    return svg.node();

    function forceCluster() {
        const strength = 0.2;
        let nodes;

        function force(alpha) {
            const centroids = d3.rollup(nodes, centroid, (d) => d.data.cluster);
            const l = alpha * strength;
            for (const d of nodes) {
                const { x: cx, y: cy } = centroids.get(d.data.cluster);
                d.vx -= (d.x - cx) * l;
                d.vy -= (d.y - cy) * l;
            }
        }

        force.initialize = (_) => (nodes = _);

        return force;
    }

    function forceCollide() {
        const alpha = 0.2; // fixed for greater rigidity!
        const padding1 = 2; // separation between same-color nodes
        const padding2 = 20; // separation between different-color nodes
        let nodes;
        let maxRadius;

        function force() {
            const quadtree = d3.quadtree(
                nodes,
                (d) => d.x,
                (d) => d.y
            );
            for (const d of nodes) {
                const r = d.r + maxRadius;
                const nx1 = d.x - r,
                    ny1 = d.y - r;
                const nx2 = d.x + r,
                    ny2 = d.y + r;
                quadtree.visit((q, x1, y1, x2, y2) => {
                    if (!q.length)
                        do {
                            if (q.data !== d) {
                                const r =
                                    d.r +
                                    q.data.r +
                                    (d.data.cluster === q.data.data.cluster
                                        ? padding1
                                        : padding2);
                                let x = d.x - q.data.x,
                                    y = d.y - q.data.y,
                                    l = Math.hypot(x, y);
                                if (l < r) {
                                    l = ((l - r) / l) * alpha;
                                    (d.x -= x *= l), (d.y -= y *= l);
                                    (q.data.x += x), (q.data.y += y);
                                }
                            }
                        } while ((q = q.next));
                    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
                });
            }
        }

        force.initialize = (_) =>
            (maxRadius =
                d3.max((nodes = _), (d) => d.r) + Math.max(padding1, padding2));

        return force;
    }

    function centroid(nodes) {
        let x = 0;
        let y = 0;
        let z = 0;
        for (const d of nodes) {
            let k = d.r ** 2;
            x += d.x * k;
            y += d.y * k;
            z += k;
        }
        return { x: x / z, y: y / z };
    }

    function drag(simulation) {
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    function createPieChart(data) {
        let width = 100;
        let height = 100;
        let margin = 10;
        let radius = Math.min(width, height) / 2 - margin;
        var jsonData = {};
        data.all_propaganda_names.forEach((element) => {
            jsonData[element] = data[element];
        });
        var pieSvg = tooltipdiv
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr(
                "transform",
                "translate(" + width / 2 + "," + height / 2 + ")"
            );
        var pie = d3.pie().value(function (d) {
            return d.value;
        });
        var data_ready = pie(d3.entries(jsonData));
        pieSvg
            .selectAll("whatever")
            .data(data_ready)
            .enter()
            .append("path")
            .attr("d", d3.arc().innerRadius(0).outerRadius(radius))
            .attr("fill", function (d) {
                return color(d.data.key);
            })
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 0.7);
    }
}
