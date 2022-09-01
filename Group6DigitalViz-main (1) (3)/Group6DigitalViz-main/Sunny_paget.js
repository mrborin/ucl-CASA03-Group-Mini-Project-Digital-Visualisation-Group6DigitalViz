// set the dimensions and margins of the graph
var margin_sun3 = { top: 50, right: 150, bottom: 100, left: 130 },
    width_sun3 = 900 - margin_sun3.left - margin_sun3.right,
    height_sun3 = 300 - margin_sun3.top - margin_sun3.bottom;

// append the svg object to the body of the page
var svgt = d3.select("#viz_t")
    .append("svg")
    .attr("width", width_sun3 + margin_sun3.left + margin_sun3.right)
    .attr("height", height_sun3 + margin_sun3.top + margin_sun3.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin_sun3.left + "," + margin_sun3.top + ")");

// Slider
var formatDateIntoYear = d3.timeFormat("%Y");
var formatDate = d3.timeFormat("%b %Y");
var startDate = new Date("1965-01-01 00:00:00");
var endDate = new Date("2018-01-01 00:00:00");

var marginz = { top: 0, right: 30, bottom: 0, left: 60 },
    widthz = 800 - marginz.left - marginz.right,
    heightz = 100 - marginz.top - marginz.bottom;

var svgz = d3.select("#slider")
    .append("svg")
    .attr("width", widthz + marginz.left + marginz.right)
    .attr("height", heightz);

var x = d3.scaleTime()
    .domain([startDate, endDate])
    .range([0, widthz])
    .clamp(true);

var slider = svgz.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + marginz.left + "," + heightz / 2 + ")")

slider.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
    .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
    .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", function () { slider.interrupt(); })
        .on("start drag", function () { hue(x.invert(d3.event.x)); }));

slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
    .selectAll("text")
    .data(x.ticks(10))
    .enter()
    .append("text")
    .attr("x", x)
    .attr("y", 10)
    .attr("text-anchor", "middle")
    .text(function (d) { return formatDateIntoYear(d); });

var label = slider.append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .text(formatDateIntoYear(startDate))
    .attr("transform", "translate(0," + (-25) + ")")

var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 12)

function hue(h) {
    svgt.selectAll("rect").remove();
    handle.attr("cx", x(h));
    label
        .attr("x", x(h))
        .text(formatDateIntoYear(h));
    //svgz.style("background-color", d3.hsl(h / 1000000000, 0.8, 0.8));
    var thyme = formatDateIntoYear(h).toString()

    d3.csv(source,
        function (data) {
            return {
                Country: data.country,
                Year: d3.timeParse("%Y")(data.year),
                Energy_Per_GDP: data.energy_per_gdp,
                Renewables_Per_Fossils: data.renewables_consumption / data.fossil_fuel_consumption,
            }
        },

        function (data) {
            // Filter data
            var ear = data.filter(function (e) {
                return (e.Country == "United Kingdom" || e.Country == "China" || e.Country == "India" || e.Country == "United States" || e.Country == "Germany") &
                    (e.Year >= new Date(thyme)) & (e.Year <= new Date(thyme))
                //Mon Feb 13 1989 07:01:33 GMT+0000 (Greenwich Mean Time)
                //years[50].toString() + "-01-01 00:00:00"
                //"2017-01-01 00:00:00"
            })
            // Add X axis Renewables
            var xmax = d3.max(filtered, function (d) { return d.Renewables_Per_Fossils })
            var x1 = d3.scaleLinear()
                .domain([0.001, xmax])
                //.domain([-10, 20])
                .range([width_sun3 / 2, width_sun3]) // unit: pixels
            svgt.append("g")
                .attr("transform", "translate(0," + height_sun3 + ")")
                .call(d3.axisBottom(x1))
            
            // Add X axis Energy per GDP
            var xmin = d3.max(filtered, function (d) { return d.Energy_Per_GDP })
            var x2 = d3.scaleLinear()
                .domain([0, xmin])
                //.domain([-10, 20])
                .range([width_sun3 / 2, 0]) // unit: pixels
            svgt.append("g")
                .attr("transform", "translate(0," + height_sun3 + ")")
                .call(d3.axisBottom(x2))

            // Add X axis label:
            svgt.append("text")
                .attr("text-anchor", "end")
                .attr("x", width_sun3)
                .attr("y", height_sun3 + margin_sun3.top)
                .text("← Energy Per GDP ---------------------------------------- Renewables Per Fossil Fuels →");

            // Add Y axis
            var y = d3.scaleBand()
                .domain(ear.map(function (d) { return d.Country; })) // unit: 
                .range([0, height_sun3])  // unit: pixels
                .padding(0.1)
            svgt.append("g")
                //.attr("transform", "translate(" + width3/2 + ", 0 )")
                .call(d3.axisLeft(y))

            // Add Y axis label:
            svgt.append("text")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("y", -margin_sun3.left + 20)
                .attr("x", -margin_sun3.top)
                .text("Countries")

            //Bars 
            svgt.selectAll("myRect1")
                .data(ear)
                .enter()
                .append("rect")
                .attr("x", x1(0))
                .attr("y", function (d) { return y(d.Country); })
                .attr("width", function (d) { return x1(d.Renewables_Per_Fossils) / 2; })
                .attr("height", y.bandwidth())
                .attr("fill", function (d) { return color(d.Country) })


            svgt.selectAll("myRect2")
                .data(ear)
                .enter()
                .append("rect")
                .attr("x", function (d) { return x2(d.Energy_Per_GDP); })
                .attr("y", function (d) { return y(d.Country); })
                .attr("width", function (d) { return x2(xmin - d.Energy_Per_GDP); })
                .attr("height", y.bandwidth())
                .attr("fill", function (d) { return color2(d.Country) })
        });
}


