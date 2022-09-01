// set the dimensions and margins of the graph
var margin_sun1 = { top: 100, right: 150, bottom: 50, left: 60 },
    width_sun1 = 1300 - margin_sun1.left - margin_sun1.right,
    height_sun1 = 600 - margin_sun1.top - margin_sun1.bottom;

// append the svg object to the body of the page
var svg_sun1 = d3.select("#viz_1")
    .append("svg")
    .attr("width", width_sun1 + margin_sun1.left + margin_sun1.right)
    .attr("height", height_sun1 + margin_sun1.top + margin_sun1.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin_sun1.left + "," + margin_sun1.top + ")");

function plot1() {

    // Add Chart Title
    svg_sun1.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width_sun1 / 2)
        .attr("y", -50)
        .style("font-size", "24px")
        .style("font", "Lato")
        .text("Decoupling Economic Growth and Energy Use");

    // Prepare X-axis date format range 
    var x = d3.scaleTime()
        .domain(d3.extent(filtered, function (d) { return d.Year; }))
        .range([0, width_sun1]); // unit: pixels

    // Add X-axis 
    svg_sun1.append("g")
        .attr("transform", "translate(0," + height_sun1 + ")")
        .call(d3.axisBottom(x))

    // Add X axis label:
    svg_sun1.append("text")
        .attr("text-anchor", "end")
        .attr("x", width_sun1)  
        .attr("y", height_sun1 + 50)
        .text("Year →");

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(filtered, function (d) { return d.Energy_Per_GDP })]) // unit: 
        .range([height_sun1, 0])  // unit: pixels
    svg_sun1.append("g")
        .call(d3.axisLeft(y))

    // Add Y axis label:
    svg_sun1.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin_sun1.left + 15)
        .attr("x", -margin_sun1.top + 100)
        .text("Energy Consumption Per Unit GDP →")

    // Add legend labels
    svg_sun1.selectAll("mylabels")
        .data(sumstat)//res)
        .enter()
        .append("text")
        .datum(function (d) {
            return {
                label: d.key,
                height: d.values[d.values.length - 1], // keep only the last value of each time series
            };
        })
        .attr("transform", function (d) { return "translate(" + x(d.height.Year) + "," + y(d.height.Energy_Per_GDP) + ")"; }) // Put the text at the position of the last point
        .attr("x", 10)
        .style("fill", function (d) { return color(d.label) }) //return d
        .text(function (d) { return d.label }) //return d

    // Draw the lines
    svg_sun1.selectAll(".line")
        .data(sumstat)
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("stroke", function (d) { return color(d.key) })
        .attr("stroke-width", 2)
        .attr("d", function (d) {
            return d3.line()
                .x(function (d) { return x(d.Year); })
                .y(function (d) { return y(d.Energy_Per_GDP); })
                (d.values)
        })

    // Define the div for the tooltip
    var divtip1 = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Add the points
    svg_sun1
        // enter in a group
        .selectAll("myDots")
        .data(sumstat)
        .enter()
        .append('g')
        .style("fill", "white")
        // enter in the 'values' part of this group
        .selectAll("myPoints")
        .data(function (d) { return d.values })
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.Year) })
        .attr("cy", function (d) { return y(d.Energy_Per_GDP) })
        .attr("r", 3)
        .attr("stroke", function (d) { return color(d.Country) })
        .on("mouseover", function (d) {
            divtip1.transition()
                .duration(200)
                .style("opacity", .9);
            divtip1.html("Energy Per GDP: " + d.Energy_Per_GDP)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 50) + "px");
        })
        .on("mouseout", function (d) {
            divtip1.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // gridlines in x axis function
    function make_x_gridlines() {
        return d3.axisBottom(x)
            .ticks(10)
    }

    // gridlines in y axis function
    function make_y_gridlines() {
        return d3.axisLeft(y)
            .ticks(6)
    }

    // add the X gridlines
    svg_sun1.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height_sun1 + ")")
        .call(make_x_gridlines()
            .tickSize(-height_sun1)
            .tickFormat("")
        )

    // add the Y gridlines
    svg_sun1.append("g")
        .attr("class", "grid") 
        .call(make_y_gridlines()
            .tickSize(-width_sun1)
            .tickFormat("")
        )


}


