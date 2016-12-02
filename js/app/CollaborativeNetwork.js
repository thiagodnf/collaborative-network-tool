function draw(graph){

    $("#svg-canvas").empty();

    var svg = d3.select("#svg-canvas")
         .attr("width", "100%")
         .attr("height", "100%")
         .call(d3.behavior.zoom().on("zoom", function () {
               svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
         }))
         .append("g");

    var width = $(window).width();
    var height = $(window).height();

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var simulation = d3.forceSimulation()
         .force("link", d3.forceLink().id(function(d) { return d.id; }))
         .force("charge", d3.forceManyBody())
         .force("center", d3.forceCenter(width / 2, (height / 2)));

    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("r", function(d){
            var value = d.size? d.size: 1;

            if(value >= 1 && value <= 5) return 5;
            if(value >= 6 && value <= 10) return 7;
            if(value >= 11 && value <= 15) return 9;
            if(value >= 16 && value <= 20) return 11;
            if(value >= 21 && value <= 25) return 13;
            if(value >= 26 && value <= 30) return 15;
            if(value >= 31 && value <= 35) return 17;
            if(value >= 36 && value <= 40) return 19;
            if(value >= 41 && value <= 45) return 21;
            if(value >= 46 && value <= 50) return 23;
            if(value >= 51 && value <= 55) return 25;
            if(value >= 56 && value <= 60) return 27;
            if(value >= 61 && value <= 65) return 29;
            if(value >= 66 && value <= 70) return 31;

            return 33;
        })
        .attr("fill", function(d) { return color(d.group); })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    node.append("title")
        .text(function(d) { return d.id + " " + d.size; });

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    function ticked() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    }

    function dragstarted(d) {
        if (!d3.event.active)
            simulation.alphaTarget(0.3).restart();

        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active)
            simulation.alphaTarget(0);

        d.fx = null;
        d.fy = null;
    }

    $(".links line").attr("stroke", "#999");
    $(".links line").attr("stroke-opacity", "0.6");

    $(".nodes circle").attr("stroke", "#fff");
    $(".nodes circle").attr("stroke-opacity", "1.5px");
}

function plotCollaborationNetwork(nodes){

    if(nodes){
        draw(nodes);
    }else{
        d3.json("miserables.json", function(error, graph) {
            if (error)
                throw error;

            draw(graph);
        });
    }
}
