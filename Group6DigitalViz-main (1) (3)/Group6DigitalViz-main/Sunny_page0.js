var filtered;
var filtered2;
var sumstat;
var res;
var color;
var source = 'https://nyc3.digitaloceanspaces.com/owid-public/data/energy/owid-energy-data.csv'

// load csv, filter, and nest
d3.csv(source,
    function (data) {
        return {
            Country: data.country,
            Year: d3.timeParse("%Y")(data.year),

            Energy_Per_GDP: data.energy_per_gdp,
            //GDP: data.gdp,
            //Renewables_Consumption: data.renewables_consumption,
            //Fossil_Fuel_Consumption: data.fossil_fuel_consumption,
            Renewables_Per_Fossils: data.renewables_consumption / data.fossil_fuel_consumption,
            //Primary_Energy_Consumption: data.primary_energy_consumption,
            Greenhouse_Gas_Emissions: data.greenhouse_gas_emissions
        }
    },

    function (data) {
        // Filter data
        filtered = data.filter(function (e) {
            return (e.Country == "United Kingdom" || e.Country == "China" || e.Country == "India" || e.Country == "United States" || e.Country == "Germany") &
                (e.Year >= new Date("1965-01-01 00:00:00")) & (e.Year <= new Date("2018-01-01 00:00:00"))
        })

        filtered2 = data.filter(function (e) {
            return (e.Country == "United Kingdom" || e.Country == "China" || e.Country == "India" || e.Country == "United States" || e.Country == "Germany") &
                (e.Year >= new Date("2000-01-01 00:00:00")) & (e.Year <= new Date("2018-01-01 00:00:00"))
        })

        // Group data by country
        sumstat = d3.nest()
            .key(function (e) { return e.Country; })
            .entries(filtered)

        // Group data by country
        sumstat2 = d3.nest()
            .key(function (e) { return e.Country; })
            .entries(filtered2)

        // Set Color Palette
        res = sumstat.map(function (d) { return d.key }) // list of group names
        color = d3.scaleOrdinal()
            .domain(res)
            .range(['Orchid', 'Coral', 'Darkgoldenrod', 'SteelBlue', 'DarkCyan'])
        color2 = d3.scaleOrdinal()
            .domain(res)
            .range(['DarkOrchid', '#a25032', '#644906', '#2c5272', '#004b4b'])

        plot1();
        plot2();
        plot3();
    });







