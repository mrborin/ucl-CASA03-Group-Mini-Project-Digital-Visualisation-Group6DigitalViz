// set the dimensions and margins of the graph
var margin = {top: 130, right: 30, bottom: 90, left: 50},
    width = 1500 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

// append the svg_uk_import object to the body of the page
var svg_uk_import = d3.select("#uk_import_dependency")
.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
.append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

var tooltip_uk = d3.select("body").append("div").attr("class", "toolTip_uk");   

    
// Parse the Data
d3.csv("energy-import-data.csv", function(data) {

    // X axis
    var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(data.map(function(d) { return d.Year; }))
        .padding(0.2);
    svg_uk_import.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
              .tickValues(x.domain().filter(function(d, i) {return !(i % 5);})))
        .style("font-size","12px");


    // Add Y axis
    var y = d3.scaleLinear()
        .domain([-30, 60])
        .range([ height, 0]);
    svg_uk_import.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y)
              .tickSize(-width))
        .style("font-size","12px");
    
    // Bars
    svg_uk_import.selectAll("mybar")
        .data(data)
        .enter().append("rect")
            .attr("x", function(d) { return x(d.Year); })
            .attr("width", x.bandwidth())
            // no bar at the beginning thus:
            .attr("y", function(d) { return y(0); })
            .on("mousemove", function(d){
                tooltip_uk
                    .style("left", d3.event.pageX - 22 + "px")
                    .style("top", d3.event.pageY - 60 + "px")
                    .style("display", "inline-block")
                    .html("Year: " +(d.Year) + "<br>" + "Imports: " + (d.UK) + "%");
            })
          .on("mouseout", function(d){ tooltip_uk.style("display", "none");});
        
    // Animation
    svg_uk_import.selectAll("rect")
        .transition()
        .duration(1500)
        .attr("class", function(d) { return d.UK
                                    < 0 ? "bar--negative" : "bar--positive"; })
        .attr("height", function(d) { return Math.abs(y(d.UK) - y(0)); }) // always equal to 0
        .attr("y", function(d) { return y(Math.max(0, d.UK)); })
        .delay(function(d,i){console.log(i) ; return(i*20)})

    
    
    // y=0 baseline
    var baseline = [0];

    var target = svg_uk_import.selectAll(".targetgoal")
    .data(baseline)
    .enter()
    .append("g")
    .attr("transform", function(d){
        return "translate(0, " + y(d) +")"
        })

    target.append("line")
    .attr("class", "targetgoal")
    .attr("x1", 0)
    .attr("x2", width)
    .style("stroke", "Gray")
    .style("stroke-width",2);
    
    // Annotations
    const annotations = [
        {
      note: {
        label: "North Sea oil and gas production begins.",
        title: "1975",
        wrap: 150
      },
      connector: {
        end: "dot",
        type: "curve",
        endScale: 3,
        //can also add a curve type, e.g. curve: d3.curveStep
        points: [[10, -8],[90, -16]]
      },
      x: 103,
      y: 81,
      dy: -15,
      dx: 120
    }, {
     note: {
        label: "UK becomes net exporter due to growth in capacity of North Sea oil and gas developments.",
        title: "1981",
        wrap: 180
      },
      connector: {
        end: "dot",
        type: "curve",
        endScale: 3,
        //can also add a curve type, e.g. curve: d3.curveStep
        points: [[-35, 35],[-60, 50]]
      },
      x: 203,
      y: 320,
      dy: 55,
      dx: -75   
    }, {
     note: {
        label: "UK becomes a net importer after 1988 Piper Alpha disaster, impacts last for a few years.",
        title: "1988-92",
        wrap: 240
      },
      connector: {
        end: "arrow",
        type: "curve",
        endScale: 1,
        //can also add a curve type, e.g. curve: d3.curveStep
        points: [[-10, -35],[-15, -45]]
      },
      x: 382,
      y: 285,
      dy: -55,
      dx: -30      
    }, {
     note: {
        label: "Reliance on imports grows due to depleting oil and gas fields and the phasing out of coal plants.",
        title: "2004-13",
        wrap: 240
      },
      connector: {
        end: "arrow",
        type: "curve",
        //can also add a curve type, e.g. curve: d3.curveStep
        points: [[-100, 120]]
      },
      x: 710,
      y: 80,
      dy: -5,
      dx: -120    
    }, {
     note: {
        label: "Growing capacity of wind production and reduction of energy consumption triggers reducing import dependency.",
        title: "2013",
        wrap: 240
      },
      connector: {
        end: "dot",
        type: "curve",
          endScale: 3,
        //can also add a curve type, e.g. curve: d3.curveStep
        points: [[-15, 10]]
      },
      x: 800,
      y: 320,
      dy: 20,
      dx: -40    
    }].map(function(d){ d.color = "grey"; return d})
    
    // d3 annotations actions
    const makeAnnotations = d3.annotation()
        .type(d3.annotationLabel)
        .annotations(annotations)
    
    // call the annotations function
    //d3.select("svg_uk_import")
      svg_uk_import.append("g")
      .attr("class", "annotation-group")
      .call(makeAnnotations);
    
    // Plot title
    svg_uk_import.append("text")
    .attr("x", 0)
    .attr("y", margin.top - 180)
    .attr("text-anchor", "left")
    .attr("class", "val-plot-title")
    .text("UK energy import dependency: the percentage of UK energy supply made up of net imports, 1970 to 2020");
    
    // Handmade legend
    svg_uk_import.append("circle").attr("cx",7).attr("cy", margin.top - 156).attr("r", 6).style("fill", "SteelBlue")
    svg_uk_import.append("circle").attr("cx",125).attr("cy", margin.top - 156).attr("r", 6).style("fill", "DarkCyan")
    svg_uk_import.append("text").attr("x", 22).attr("y", margin.top - 155).text("Net importer").style("font-size", "15px").attr("alignment-baseline","middle")
    svg_uk_import.append("text").attr("x", 140).attr("y", margin.top - 155).text("Net exporter").style("font-size", "15px").attr("alignment-baseline","middle")
    
    // Source text
    svg_uk_import.append("text")
    .attr("x", 0)
    .attr("y", height + margin.bottom/2)
    .attr("text-anchor", "left")
    .attr("class", "val-plot-legend")
    .text("Source: Digest of UK Energy Statistics (DUKES) 2021, Department for Business, Energy and Industrial Strategy (BEIS)");
    
           })