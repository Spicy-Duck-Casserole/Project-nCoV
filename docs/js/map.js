
async function map({
    containerQuery,
    dataSource,
    title = "",
    colorScheme,
    legendTick,
    width = 800,
    margin = ({ top: 60, right: 10, bottom: 10, left: 10 })
}) {

    const world = await d3.json("./data/countries-50m.json")

    const countries = topojson.feature(world, world.objects.countries)

    const outline = ({ type: "Sphere" })

    const projection = d3.geoEqualEarth()

    const height = (() => {
        const [[x0, y0], [x1, y1]] = d3.geoPath(projection.fitWidth(width - margin.left - margin.right, outline)).bounds(outline);
        const dy = Math.ceil(y1 - y0), l = Math.min(Math.ceil(x1 - x0), dy);
        projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
        return dy + margin.top + margin.bottom;
    })()

    var rename = new Map([
        ["North Macedonia", "Macedonia"],
        ["Korea, South", "South Korea"],
        ["US", "United States of America"],
        ["Democratic People's Republic of Korea", "North Korea"],
        ["Congo (Brazzaville)", "Congo"],
        ["Congo (Kinshasa)", "Dem. Rep. Congo"],
        ["Taiwan*", "Taiwan"],
        ["Central African Republic", "Central African Rep."],
        ["South Sudan", "S. Sudan"],
        ["Cote d'Ivoire", "Côte d'Ivoire"],
        ["Equatorial Guinea", "Eq. Guinea"],
        ["Western Sahara", "W. Sahara"],
        ["Sao Tome and Principe", "São Tomé and Principe"],
        ["Eswatini", "eSwatini"],
        ["Bosnia and Herzegovina", "Bosnia and Herz."],
        ["Greenland,Denmark", "Greenland"],
        ["Dominican Republic", "Dominican Rep."]
    ])

    const add = [
        ["Greenland", "Denmark"],
        ["Faeroe Is.", "Denmark"],
        ["Isle of Man", "United Kingdom"],
        ["Jersey", "United Kingdom"],
        ["Åland", "Finland"],
        ["N. Cyprus", "Cyprus"],
    ]

    var data = Object.assign(
        new Map((await dataSource()).map(d => [rename.get(d.name) || d.name, d.value])),
        { title: title })

    add.forEach(d => {
        data.set(d[0], data.get(rename.get(d[1]) || d[1]))
    });

    data = Object.assign(
        data,
        new Map(add.map(d => [d[0], data.get(d[1])]))
    )


    const path = d3.geoPath(projection)

    const color = d3.scaleSequentialLog()
        .domain([1, d3.max(Array.from(data.values()))])
        .interpolator(colorScheme)
        .unknown("#ccc")

    console.log(width);
    console.log(height);


    const svg = d3.select(containerQuery)
        .append("svg")
        .style("display", "block")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-margin.left, -margin.top, width, height]);

    const defs = svg.append("defs");

    defs.append("path")
        .attr("id", "outline")
        .attr("d", path(outline));

    defs.append("clipPath")
        .attr("id", "clip")
        .append("use")
        .attr("xlink:href", new URL("#outline", location));

    const g = svg.append("g")
        .attr("clip-path", `url(${new URL("#clip", location)})`);

    g.append("use")
        .attr("xlink:href", new URL("#outline", location))
        .attr("fill", "white");

    g.append("g")
        .selectAll("path")
        .data(countries.features)
        .join("path")
        .attr("fill", d => color(data.has(d.properties.name) ? data.get(d.properties.name) : 0))
        .attr("d", path)
        .append("title")
        .text(d => `${d.properties.name}
      ${data.has(d.properties.name) ? data.get(d.properties.name) : "N/A"}`);

    g.append("path")
        .datum(topojson.mesh(world, world.objects.countries, (a, b) => a !== b))
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-linejoin", "round")
        .attr("d", path);

    // svg.append("use")
    //     .attr("xlink:href", new URL("#outline", location))
    //     .attr("fill", "none")
    //     .attr("stroke", "grey");

    svg.append("g")
        .call(g => legend({
            color: d3.scaleOrdinal(
                legendTick.map(d => d.toLocaleString()),
                legendTick.map(d => color(d))
            ),
            g: g,
            x: 100,
            y: 200,
            intervalX: 0,
            intervalY: 20,
        }))

    // Create title
    svg.append("text")
        .attr("class", "title")
        .attr("x", 400)
        .attr("y", -45)
        .attr("dy", "1em")
        .attr("font-size", "40")
        .text(title)

}

