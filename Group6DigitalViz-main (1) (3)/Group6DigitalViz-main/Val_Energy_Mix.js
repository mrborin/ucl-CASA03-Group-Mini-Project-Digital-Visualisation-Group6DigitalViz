var margin = {top: 130, right: 30, bottom: 90, left: 50},
    width = 1500 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

// append the svg_energy_mix object to the body of the page
var svg_energy_mix = d3.select("#energy_mix")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("uk-energy-breakdown.csv", function(data) {

  // List of groups = header of the csv files
  var keys = data.columns.slice(1)

  // Add X axis
  var x = d3.scaleLinear()
    .range([ 0, width ])
    .domain(d3.extent(data, function(d) { return d.Year; }));
  svg_energy_mix.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "grid")
    .call(d3.axisBottom(x).tickSize(-height*1).tickValues([1965, 1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020]).tickFormat(d3.format('d')))
    .style("font-size",14);
    
  // Customization
  svg_energy_mix.selectAll(".tick line").attr("class", "grid")

  // Add X axis label:
  svg_energy_mix.append("text")
      .attr("text-anchor", "end")
      .attr("class", "val-plot-legend")
      .attr("x", width)
      .attr("y", height + margin.bottom/2 )
      .text("Time (year)");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([-2300, 2300])
    .range([ height, 0 ]);

  // color palette
  var color = d3.scaleOrdinal()
    .domain(keys)
    .range(d3.schemeSet2);

  //stack the data?
  var stackedData = d3.stack()
    .offset(d3.stackOffsetSilhouette)
    .keys(keys)
    (data)

  // create a tooltip
  var Tooltip = svg_energy_mix
    .append("text")
    .attr("x", 0)
    .attr("y", -8)
    .style("opacity", 0)
    .style("font-size", "12px")

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    Tooltip.style("opacity", 1)
    d3.selectAll(".myArea").style("opacity", .6)
    d3.select(this)
      .style("opacity", 1)
  }
  var mousemove = function(d,i) {
    grp = keys[i]
    Tooltip.text(grp)
  }
  var mouseleave = function(d) {
    Tooltip.style("opacity", 0)
    d3.selectAll(".myArea").style("opacity", 1)
   }

  // Area generator
  var area = d3.area()
    .x(function(d) { return x(d.data.Year); })
    .y0(function(d) { return y(d[0]); })
    .y1(function(d) { return y(d[1]); })

  // Show the areas
  svg_energy_mix
    .selectAll("mylayers")
    .data(stackedData)
    .enter()
    .append("path")
      .attr("class", "myArea")
      .style("fill", function(d) { return color(d.key); })
      .attr("d", area)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)

    // Plot title
    svg_energy_mix.append("text")
    .attr("x", 0)
    .attr("y", margin.top - 180)
    .attr("text-anchor", "left")
    .attr("class", "val-plot-title")
    .text("Energy mix: annual consumption of energy types used by the UK, 1965-2020");
    
    // Handmade legend
        svg_energy_mix.append("circle").attr("cx",7).attr("cy", margin.top - 162).attr("r", 6).style("fill", "#66c2a6")
        svg_energy_mix.append("circle").attr("cx",127).attr("cy", margin.top - 162).attr("r", 6).style("fill", "#b3b3b3")
        svg_energy_mix.append("circle").attr("cx",182).attr("cy", margin.top - 162).attr("r", 6).style("fill", "#e5c594")
        svg_energy_mix.append("circle").attr("cx",252).attr("cy", margin.top - 162).attr("r", 6).style("fill", "#ffd92f")
        svg_energy_mix.append("circle").attr("cx",317).attr("cy", margin.top - 162).attr("r", 6).style("fill", "#a6d954")
        svg_energy_mix.append("circle").attr("cx",407).attr("cy", margin.top - 162).attr("r", 6).style("fill", "#e185bd")
        svg_energy_mix.append("circle").attr("cx",487).attr("cy", margin.top - 162).attr("r", 6).style("fill", "#8da0cc")
        svg_energy_mix.append("circle").attr("cx",562).attr("cy", margin.top - 162).attr("r", 6).style("fill", "#f3885e")
        svg_energy_mix.append("circle").attr("cx",637).attr("cy", margin.top - 162).attr("r", 6).style("fill", "#66c0a5")
        svg_energy_mix.append("text").attr("x", 22).attr("y", margin.top - 161).text("Geo Biomass").style("font-size", "15px").attr("alignment-baseline","middle")
        svg_energy_mix.append("text").attr("x", 142).attr("y", margin.top - 161).text("Oil").style("font-size", "15px").attr("alignment-baseline","middle")
        svg_energy_mix.append("text").attr("x", 197).attr("y", margin.top - 161).text("Coal").style("font-size", "15px").attr("alignment-baseline","middle")
        svg_energy_mix.append("text").attr("x", 267).attr("y", margin.top - 161).text("Gas").style("font-size", "15px").attr("alignment-baseline","middle")
        svg_energy_mix.append("text").attr("x", 332).attr("y", margin.top - 161).text("Nuclear").style("font-size", "15px").attr("alignment-baseline","middle")
        svg_energy_mix.append("text").attr("x", 422).attr("y", margin.top - 161).text("Hydro").style("font-size", "15px").attr("alignment-baseline","middle")
        svg_energy_mix.append("text").attr("x", 502).attr("y", margin.top - 161).text("Wind").style("font-size", "15px").attr("alignment-baseline","middle")
        svg_energy_mix.append("text").attr("x", 577).attr("y", margin.top - 161).text("Solar").style("font-size", "15px").attr("alignment-baseline","middle")
        svg_energy_mix.append("text").attr("x", 652).attr("y", margin.top - 161).text("Biofuels").style("font-size", "15px").attr("alignment-baseline","middle")

    
    // Source text
    svg_energy_mix.append("text")
    .attr("x", 0)
    .attr("y", height + margin.bottom/2)
    .attr("text-anchor", "left")
    .attr("class", "val-plot-legend")
    .text("Source: Statistical Review of World Energy, BP");

    
})