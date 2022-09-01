// set the dimensions and margins of the graph
var margin = {top: 130, right: 30, bottom: 90, left: 50},
width = 1500 - margin.left - margin.right,
height = 700 - margin.top - margin.bottom;

// append the svg_int_import object to the body of the page
var svg_int_import = d3.select("#int_import_dependency")
.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
.append("g")
    .attr("transform",
  "translate(" + margin.left + "," + margin.top + ")");

var tooltip_int = d3.select("body").append("div").attr("class", "toolTip_int");   


// Parse the Data
d3.csv("int-energy-import-data.csv", function(data) {

// X axis
var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(function(d) { return d.Year; }))
    .padding(0.2);
svg_int_import.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
          .tickValues(x.domain().filter(function(d, i) {return !(i % 2);})))
    .style("font-size","12px");


// Add Y axis
var y = d3.scaleLinear()
    .domain([-20, 70])
    .range([ height, 0]);
svg_int_import.append("g")
    .attr("class", "grid")
    .call(d3.axisLeft(y)
          .tickSize(-width))
    .style("font-size","12px");    

// y=0 baseline
var baseline = [0];

var target = svg_int_import.selectAll(".targetgoal")
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
    label: "Significantly high net exports maintained at consistent level suggesting high import reliance.",
    title: "Germany",
    wrap: 300
  },
  connector: {
    end: "arrow",
    type: "curve",
    //can also add a curve type, e.g. curve: d3.curveStep
    points: [[-30, 10]]
  },
  x: 270,
  y: 70,
  dy: 18,
  dx: -100
}, {
 note: {
    label: "Historically a high net exporter but experiences rapid growth of net imports.",
    title: "UK (2002-06)",
    wrap: 300
  },
  connector: {
    end: "arrow",
    type: "curve",
    //can also add a curve type, e.g. curve: d3.curveStep
    points: [[60, 15]]
  },
  x: 235,
  y: 385,
  dy: 25,
  dx: 150   
}, {
 note: {
    label: "Steady year on year growth of imports.",
    title: "India",
    wrap: 240
  },
  connector: {
    end: "arrow",
    type: "curve",
    //can also add a curve type, e.g. curve: d3.curveStep
    points: [[50, 0]]
  },
  x: 665,
  y: 188,
  dy: 30,
  dx: 130      
}, {
 note: {
    label: "Change in strategy through development of wind capacity results in reducing net imports.",
    title: "UK (2013-20)",
    wrap: 250
  },
  connector: {
    end: "arrow",
    type: "curve",
    //can also add a curve type, e.g. curve: d3.curveStep
    points: [[0, 0]]
  },
  x: 720,
  y: 155,
  dy: -10,
  dx: 80    
}, {
 note: {
    label: "Steady reduction of import reliance since 2005 suggeting a long-term political strategy or reduction in energy usage.",
    title: "USA",
    wrap: 250
  },
  connector: {
    end: "arrow",
    type: "curve",
    //can also add a curve type, e.g. curve: d3.curveStep
    points: [[-15, 10]]
  },
  x: 850,
  y: 378,
  dy: 1,
  dx: -60    
}].map(function(d){ d.color = "grey"; return d})

// d3 annotations actions
const makeAnnotations = d3.annotation()
    .type(d3.annotationLabel)
    .annotations(annotations)

// call the annotations function
// d3.select("svg_int_import")
  svg_int_import.append("g")
  .attr("class", "annotation-group")
  .call(makeAnnotations);

// Plot title
svg_int_import.append("text")
.attr("x", 0)
.attr("y", margin.top - 180)
.attr("text-anchor", "left")
.attr("class", "val-plot-title")
.text("Import dependency of case studies: the percentage of  energy supply made up of net imports, 1998 to 2020");

// Handmade legend
svg_int_import.append("circle").attr("cx",7).attr("cy", margin.top - 156).attr("r", 6).style("fill", "Coral")
svg_int_import.append("circle").attr("cx",105).attr("cy", margin.top - 156).attr("r", 6).style("fill", "DarkCyan")
svg_int_import.append("circle").attr("cx",175).attr("cy", margin.top - 156).attr("r", 6).style("fill", "Orchid")
svg_int_import.append("circle").attr("cx",255).attr("cy", margin.top - 156).attr("r", 6).style("fill", "Orange")
svg_int_import.append("circle").attr("cx",330).attr("cy", margin.top - 156).attr("r", 6).style("fill", "SteelBlue")
svg_int_import.append("text").attr("x", 22).attr("y", margin.top - 155).text("Germany").style("font-size", "15px").attr("alignment-baseline","middle")
svg_int_import.append("text").attr("x", 120).attr("y", margin.top - 155).text("USA").style("font-size", "15px").attr("alignment-baseline","middle")
svg_int_import.append("text").attr("x", 190).attr("y", margin.top - 155).text("China").style("font-size", "15px").attr("alignment-baseline","middle")
svg_int_import.append("text").attr("x", 270).attr("y", margin.top - 155).text("India").style("font-size", "15px").attr("alignment-baseline","middle")
svg_int_import.append("text").attr("x", 345).attr("y", margin.top - 155).text("UK").style("font-size", "15px").attr("alignment-baseline","middle")

// UK Source
svg_int_import.append("text")
.attr("x", 0)
.attr("y", height + margin.bottom/2)
.attr("text-anchor", "left")
.attr("class", "val-plot-legend")
.text("UK Source: Digest of UK Energy Statistics (DUKES) 2021, Department for Business, Energy and Industrial Strategy (BEIS)");

// USA Source
svg_int_import.append("text")
.attr("x", 0)
.attr("y", height + margin.bottom/2 + 20)
.attr("text-anchor", "left")
.attr("class", "val-plot-legend")
.text("USA Source: Table 1.1 Primary Energy Overview, Monthly Energy Review April 2022, U.S. Energy Information Administration");

// USA Source
svg_int_import.append("text")
.attr("x", 0)
.attr("y", height + margin.bottom/2 + 40)
.attr("text-anchor", "left")
.attr("class", "val-plot-legend")
.text("Germany, China, India Source: Energy imports, net (% of energy use), IEA Statistics. (2014 to current year data not available)");



// Plot Germany data
var ger_import = d3.line()
    .x(function (d) { return x(d.Year); })
    .y(function (d) { return y(d.Germany); });
svg_int_import.append("path")
    .attr("fill", "none")
    .attr("stroke", "coral")
    .attr("stroke-width", 1.5)
    .attr("d", ger_import(data));

// Plot USA data
var usa_import = d3.line()
    .x(function (d) { return x(d.Year); })
    .y(function (d) { return y(d.USA); });
svg_int_import.append("path")
    .attr("fill", "none")
    .attr("stroke", "DarkCyan")
    .attr("stroke-width", 1.5)
    .attr("d", usa_import(data));

// Plot China data        
var china_import = d3.line()
    .x(function (d) { return x(d.Year); })
    .y(function (d) { return y(d.China); });
svg_int_import.append("path")
    .attr("fill", "none")
    .attr("stroke", "Orchid")
    .attr("stroke-width", 1.5)
    .attr("d", china_import(data));          

// Plot India data
var india_import = d3.line()
    .x(function (d) { return x(d.Year); })
    .y(function (d) { return y(d.India); });
svg_int_import.append("path")
    .attr("fill", "none")
    .attr("stroke", "Orange")
    .attr("stroke-width", 1.5)
    .attr("d", india_import(data));          

// Plot UK data        
var uk_import = d3.line()
    .x(function (d) { return x(d.Year); })
    .y(function (d) { return y(d.UK); });
svg_int_import.append("path")
    .attr("fill", "none")
    .attr("stroke", "SteelBlue")
    .attr("stroke-width", 1.5)
    .attr("d", uk_import(data));

       })