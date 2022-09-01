energy_cost_data = [
    { 'year': '2009', 'Value': '72.8', 'category': 'Energy cost, UK' },
    { 'year': '2010', 'Value': '74.7', 'category': 'Energy cost, UK' },
    { 'year': '2011', 'Value': '141.8', 'category': 'Energy cost, UK' },
    { 'year': '2012', 'Value': '138.7', 'category': 'Energy cost, UK' },
    { 'year': '2013', 'Value': '91.9', 'category': 'Energy cost, UK' },
    { 'year': '2014', 'Value': '29.2', 'category': 'Energy cost, UK' },
    { 'year': '2015', 'Value': '26.7', 'category': 'Energy cost, UK' },
    { 'year': '2016', 'Value': '25.8', 'category': 'Energy cost, UK' },
    { 'year': '2017', 'Value': '24.9', 'category': 'Energy cost, UK' },
    { 'year': '2018', 'Value': '23.9', 'category': 'Energy cost, UK' },
    { 'year': '2019', 'Value': '23.1', 'category': 'Energy cost, UK' },

    { 'year': '2009', 'Value': '16.8', 'category': 'Energy cost, US' },
    { 'year': '2010', 'Value': '16.9', 'category': 'Energy cost, US' },
    { 'year': '2011', 'Value': '16.8', 'category': 'Energy cost, US' },
    { 'year': '2012', 'Value': '16.1', 'category': 'Energy cost, US' },
    { 'year': '2013', 'Value': '15.6', 'category': 'Energy cost, US' },
    { 'year': '2014', 'Value': '14.6', 'category': 'Energy cost, US' },
    { 'year': '2015', 'Value': '14.1', 'category': 'Energy cost, US' },
    { 'year': '2016', 'Value': '14', 'category': 'Energy cost, US' },
    { 'year': '2017', 'Value': '13.6', 'category': 'Energy cost, US' },
    { 'year': '2018', 'Value': '13.1', 'category': 'Energy cost, US' },
    { 'year': '2019', 'Value': '12.4', 'category': 'Energy cost, US' },

    { 'year': '2009', 'Value': '24.8', 'category': 'Energy cost, India' },
    { 'year': '2010', 'Value': '20.9', 'category': 'Energy cost, India' },
    { 'year': '2011', 'Value': '14', 'category': 'Energy cost, India' },
    { 'year': '2012', 'Value': '14.2', 'category': 'Energy cost, India' },
    { 'year': '2013', 'Value': '19.2', 'category': 'Energy cost, India' },
    { 'year': '2014', 'Value': '14.1', 'category': 'Energy cost, India' },
    { 'year': '2015', 'Value': '13.7', 'category': 'Energy cost, India' },
    { 'year': '2016', 'Value': '13.1', 'category': 'Energy cost, India' },
    { 'year': '2017', 'Value': '11.6', 'category': 'Energy cost, India' },
    { 'year': '2018', 'Value': '10.4', 'category': 'Energy cost, India' },
    { 'year': '2019', 'Value': '8.6', 'category': 'Energy cost, India' },

    { 'year': '2009', 'Value': '835.7', 'category': 'Energy cost, China' },
    { 'year': '2010', 'Value': '755.2', 'category': 'Energy cost, China' },
    { 'year': '2011', 'Value': '640.9', 'category': 'Energy cost, China' },
    { 'year': '2012', 'Value': '547', 'category': 'Energy cost, China' },
    { 'year': '2013', 'Value': '499.2', 'category': 'Energy cost, China' },
    { 'year': '2014', 'Value': '459.2', 'category': 'Energy cost, China' },
    { 'year': '2015', 'Value': '413.1', 'category': 'Energy cost, China' },
    { 'year': '2016', 'Value': '390.2', 'category': 'Energy cost, China' },
    { 'year': '2017', 'Value': '355.8', 'category': 'Energy cost, China' },

    { 'year': '2009', 'Value': '50.6', 'category': 'Energy cost, Germany' },
    { 'year': '2010', 'Value': '51.9', 'category': 'Energy cost, Germany' },
    { 'year': '2011', 'Value': '49.9', 'category': 'Energy cost, Germany' },
    { 'year': '2012', 'Value': '48.3', 'category': 'Energy cost, Germany' },
    { 'year': '2013', 'Value': '46.2', 'category': 'Energy cost, Germany' },
    { 'year': '2014', 'Value': '44.4', 'category': 'Energy cost, Germany' },
    { 'year': '2015', 'Value': '42', 'category': 'Energy cost, Germany' },
    { 'year': '2016', 'Value': '40.8', 'category': 'Energy cost, Germany' },
    { 'year': '2017', 'Value': '40.2', 'category': 'Energy cost, Germany' },
    { 'year': '2018', 'Value': '35.8', 'category': 'Energy cost, Germany' },
    { 'year': '2019', 'Value': '37', 'category': 'Energy cost, Germany' },
]

function createBarChart(data, container_name) {
    var svg = dimple.newSvg(container_name, 1350, 600);

    // Constructs chart from SVG object and list of data
    var myChart = new dimple.chart(svg, data)

    // Adds X axis
    var x = myChart.addCategoryAxis("x", ["year", "category"]);
    x.title = "Year"

    // Adds Y axis
    var y = myChart.addMeasureAxis("y", "Value");

    // Speicfied chart type
    var series = myChart.addSeries(["year", "category"], dimple.plot.bar);

    myChart.defaultColors = [
        new dimple.color("#D98880")  // Red
    ]


    // Adds value labels to each of the bars in a bar chart
    series.afterDraw = function (shape, list) {
        var s = d3.select(shape),
            // Dictionary of float values representing heights, used for scaling text positions with
            // repsect to x, y values and graphic width and height
            bar = {
                // numeric represtnation of x position
                x: parseFloat(s.attr("x")),

                // numeric representation of y position
                y: parseFloat(s.attr("y")),

                // numeric represntation of graphic width
                width: parseFloat(s.attr("width")),

                // numeric reprsentation of graphic height
                height: parseFloat(s.attr("height"))
            };
        svg.append("text")
            // The sum of the x length and the bar length divided by 2 places the text squarely in the middle of a bar horizontally
            .attr("x", bar.x + bar.width / 2)

            // The sum of the y heighy and the bar height divided by 2 places the text squarely in the middle of a bar vertically
            .attr("y", bar.y + bar.height / 2)

            // Change colour of inner text to improve visibility
            .attr('fill', d3.color('#34495E'))

            // This centres the text
            .style("text-anchor", "middle")

            // This sets text size
            .style("font-size", "10px")

            // This removes tailing integer values
            .text(d3.format(",.1f")(list.yValue));
    };

    myChart.defaultColors = [
        new dimple.color("Orchid"),
        new dimple.color("SteelBlue"),
        new dimple.color("Coral"),
        new dimple.color("Orange"),
        new dimple.color("DarkCyan"),
    ]

    // Add legend
    myChart.addLegend(1275, 20, 90, 300, "left")

    // Draw chart
    myChart.draw();
}