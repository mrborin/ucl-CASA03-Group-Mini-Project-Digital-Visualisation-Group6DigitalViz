var margin = {top: 130, right: 30, bottom: 90, left: 30},
      width = 1000 - margin.left - margin.right,
      height = 700 - margin.top - margin.bottom;
      
  // append the svg_sources object to the body of the page    
  var svg_sources = d3.select("#import-source")
  .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
  .append("g")
        .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

  var tooltip_sources = d3.select("body").append("div").attr("class", "toolTip_sources");       
      
  var stack = d3.stack();

  d3.csv("import-country-fuels-ratio.csv", function(error, data) {
    if (error) throw error;

    // X axis  
    var x = d3.scaleBand()
        .rangeRound([0, width*8/10])
        .align(0.7)
        .domain(data.map(function(d) { return d.Type; }))
        .paddingInner(0.74)
        .paddingOuter(0);
    svg_sources.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height*2/3 + ")")
        .style("font", "18px sans-serif")
        .call(d3.axisBottom(x).tickValues([]));  
    
    // Y axis  
    var y = d3.scaleLinear()
        .rangeRound([height*2/3, 0])
        .domain([0, 100]).nice();
    svg_sources.append("g")
        .attr("class", "axis axis--y")
        .attr("transform","translate(" + width*8.05/10 + ",0)")
        .call(d3.axisRight(y).tickSize(5))
        .attr("class", "grid");      
      
    var data_nest = d3.nest()
                      .key(function(d){
                          return d.Year
                      })
                      .entries(data);

    data = data_nest.filter(function(d){ return d.key == 2020})[0].values;
    
    var cat = ["Coal and other solid fuel","Crude Oil","Electricity","Natural Gas","Petroleum products","Abu Dhabi","Dubai","Iran","Kuwait","Oman","Saudi Arabia","Algeria","Angola","Latvia","Libya","Lithuania","Mexico","Netherlands","Nigeria","Norway","Russia","U.S.A.","Venezuela","Other Countries","Belgium","Australia","Egypt","Qatar","Trinidad & Tobago","Dominican Republic","Peru","Yemen","Equatorial Guinea","Cameroon","France"];

    // Z axis
    var z = d3.scaleOrdinal(["#e5c594","#b3b3b3","Tomato","#ffd92f","MediumSlateBlue","LightSteelBlue","Sienna","Thistle","SlateGrey","NavajoWhite","MediumSeaGreen","LightSalmon","Khaki","RosyBrown","DimGray","Gold","YellowGreen","Chocolate","ForestGreen","Crimson","MidnightBlue","DarkCyan","RoyalBlue","LightCoral","DarkSlateGray","SkyBlue","Olive","DarkRed","MediumOrchid","LavendarBlush","OldLace","HoneyDew","Beige","PaleGoldenRod","Teal"]);      
    z.domain(cat); 

      
    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
    var energyType = d3.select(this.parentNode).datum().key;
    var fuelvalue = d.data[energyType];
    tooltip_sources
        .html(energyType + "<br>" + "Value: " + fuelvalue +"%")
        .style("opacity", 1)
    }
    var mousemove = function(d) {
    tooltip_sources
      .style("left", (d3.mouse(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.mouse(this)[1])+90 + "px")
    }
    var mouseleave = function(d) {
    tooltip_sources
      .style("opacity", 0)
  }  
      
    svg_sources.selectAll(".serie")
      .data(stack.keys(cat)(data))
      .enter().append("g")
        .attr("class", "serie")
        .attr("fill", function(d) {return z(d.key); })
      .selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data.Type); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width", x.bandwidth())
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);


    d3.select("input")
      .on("input", changed)
      .on("change", changed);

    function changed() {
      var value = this.value;

      svg_sources.selectAll(".serie")
        .data(stack.keys(cat)(data_nest.filter(function(d){return +d.key == value})[0].values))
        .selectAll("rect")
        .data(function(d) { return d; })
        .transition()
        .duration(1000) 
        .delay(function(d,i){return i*100})     
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("x", function(d) { return x(d.data.Type); })
        .attr("y", function(d) { return y(d[1]); })
  }
      
    // Plot title
    svg_sources.append("text")
    .attr("x", width/1000)
    .attr("y", margin.top - 150)
    .attr("text-anchor", "left")
    .attr("class", "val-plot-title")
    .text("% of UK energy imports by energy type" );
      
    // Plot title
    svg_sources.append("text")
    .attr("x", 330+width/1000)
    .attr("y", margin.top - 150)
    .attr("text-anchor", "left")
    .attr("class", "val-plot-title")
    .text("% of Oil imports by country of source" ); 
      
    // Plot title
    svg_sources.append("text")
    .attr("x", 657+width/1000)
    .attr("y", margin.top - 150)
    .attr("text-anchor", "left")
    .attr("class", "val-plot-title")
    .text("% of Gas imports by country of source" );  

      
        // Handmade for energy types
        svg_sources.append("circle").attr("cx",135).attr("cy", margin.top - 120).attr("r", 6).style("fill", "MediumSlateBlue")
        svg_sources.append("circle").attr("cx",135).attr("cy", margin.top - 75).attr("r", 6).style("fill", "#ffd92f")
        svg_sources.append("circle").attr("cx",135).attr("cy", margin.top - 30).attr("r", 6).style("fill", "Tomato")
        svg_sources.append("circle").attr("cx",135).attr("cy", margin.top + 15).attr("r", 6).style("fill", "#b3b3b3")
        svg_sources.append("circle").attr("cx",135).attr("cy", margin.top + 60).attr("r", 6).style("fill", "#e5c594")
        svg_sources.append("text").attr("x", 153).attr("y", margin.top - 119).text("Petroleum Products").style("font-size", "15px").attr("alignment-baseline","middle")
        svg_sources.append("text").attr("x", 153).attr("y", margin.top - 74).text("Oil").style("font-size", "15px").attr("alignment-baseline","middle")
        svg_sources.append("text").attr("x", 153).attr("y", margin.top - 29).text("Electricity").style("font-size", "15px").attr("alignment-baseline","middle")
        svg_sources.append("text").attr("x", 153).attr("y", margin.top + 16).text("Gas").style("font-size", "15px").attr("alignment-baseline","middle")
        svg_sources.append("text").attr("x", 153).attr("y", margin.top + 61).text("Nuclear").style("font-size", "15px").attr("alignment-baseline","middle")

        // Handmade legend for countries
        svg_sources.append("circle").attr("cx",792).attr("cy", margin.top - 50).attr("r", 6).style("fill", "LightSalmon")
        svg_sources.append("circle").attr("cx",792).attr("cy", margin.top - 20).attr("r", 6).style("fill", "Chocolate")
        svg_sources.append("circle").attr("cx",792).attr("cy", margin.top + 10).attr("r", 6).style("fill", "ForestGreen")
        svg_sources.append("circle").attr("cx",792).attr("cy", margin.top + 40).attr("r", 6).style("fill", "Crimson")
        svg_sources.append("circle").attr("cx",792).attr("cy", margin.top + 70).attr("r", 6).style("fill", "DarkRed")
        svg_sources.append("circle").attr("cx",792).attr("cy", margin.top + 100).attr("r", 6).style("fill", "MidnightBlue")
        svg_sources.append("circle").attr("cx",792).attr("cy", margin.top + 130).attr("r", 6).style("fill", "DarkCyan")
        svg_sources.append("text").attr("x", 810).attr("y", margin.top - 49).text("Algeria").style("font-size", "15px").attr("alignment-baseline","middle")
        svg_sources.append("text").attr("x", 810).attr("y", margin.top - 19).text("Netherlands").style("font-size", "15px").attr("alignment-baseline","middle")
        svg_sources.append("text").attr("x", 810).attr("y", margin.top + 11).text("Nigeria").style("font-size", "15px").attr("alignment-baseline","middle")
        svg_sources.append("text").attr("x", 810).attr("y", margin.top + 41).text("Norway").style("font-size", "15px").attr("alignment-baseline","middle")
        svg_sources.append("text").attr("x", 810).attr("y", margin.top + 71).text("Qatar").style("font-size", "15px").attr("alignment-baseline","middle")
        svg_sources.append("text").attr("x", 810).attr("y", margin.top + 101).text("Russia").style("font-size", "15px").attr("alignment-baseline","middle")
        svg_sources.append("text").attr("x", 810).attr("y", margin.top + 131).text("U.S.A.").style("font-size", "15px").attr("alignment-baseline","middle")
        svg_sources.append("text").attr("x", 785).attr("y", margin.top + 161).text("Hover over chart").style("font-size", "15px").attr("alignment-baseline","middle").style("fill","#808080")
        svg_sources.append("text").attr("x", 785).attr("y", margin.top + 176).text("for more detail.").style("font-size", "15px").attr("alignment-baseline","middle").style("fill","#808080")

              // Annotations
        const annotations = [
            {
          note: {
            label: "Notice the scale of reliance on Norway for the UK's two largest imported energy types.",
            title: "Norway",
            wrap: 210
          },
          connector: {
            end: "arrow",
            type: "curve",
            //can also add a curve type, e.g. curve: d3.curveStep
            points: [[10, 0],[80, -10]]
          },
          x: 425,
          y: 150,
          dy: -21,
          dx: 120
        }, {
          note: {
            label: " ",
            title: " ",
            wrap: 20
          },
          connector: {
            end: "arrow",
            type: "curve",
            //can also add a curve type, e.g. curve: d3.curveStep
            points: [[-10, 0],[-80, -10]]
          },
          x: 657,
          y: 150,
          dy: -21,
          dx: -110
        }, {
          note: {
            label: "Use the time slider to see how the UK has diversified suppliers of key imports",
            title: "Diversification",
            wrap: 210
          },
          connector: {
            end: "dot",
            type: "curve",
            endScale:0,
            //can also add a curve type, e.g. curve: d3.curveStep
            points: [[0,0]]
          },
          x: 542,
          y: 270,
          dy: -1,
          dx: 0
        }, {
          note: {
            label: "Use the time slider to see how the UK has become less reliant on gas imports",
            title: "Diversification",
            wrap: 210
          },
          connector: {
            end: "arrow",
            type: "curve",
            //can also add a curve type, e.g. curve: d3.curveStep
            points: [[50,15],[80,30]]
          },
          x: 93,
          y: 190,
          dy: 54,
          dx: 116
        } ].map(function(d){ d.color = "grey"; return d})
        
        // d3 annotations actions
        const makeAnnotations = d3.annotation()
            .type(d3.annotationLabel)
            .annotations(annotations)
        
        // call the annotations function
        //d3.select("svg_sources")
          svg_sources.append("g")
          .attr("class", "annotation-group")
          .call(makeAnnotations);

  });