async function linechart({
    containerQuery,
    dataSource,
    title = "",
    colorScheme,
    width = 800,
    height = 400,
    margin = ({ top: 10, right: 40, bottom: 40, left: 30 }),
    scaleType = 'linear'
}) {

    const data = await dataSource()

    const color = d3.scaleOrdinal(
        data.map(d => d.name),
        colorScheme)

    const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickValues(d3.ticks(...d3.extent(x.domain()), 15))
            .tickFormat(i => data[0].data[i].date).tickSizeOuter(0))
        .call(g => g.selectAll("text")
            .attr("transform", `translate(-20,12),rotate(-30)`))

    const yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisRight(y).tickSize(width - margin.left - margin.right).ticks(5, scaleType == 'log'? (x => x.toLocaleString()) : data.format))
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", 50)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(data.y))
        .call(g => g.selectAll(".tick:not(:first-of-type) line")
            .attr("stroke-opacity", 0.3))

    var x = d3.scaleBand()
        .domain(d3.range(data[0].data.length))
        .range([margin.left, width - margin.right])
        .padding(0.1)

    var y = scaleType == 'log' ?
        d3.scaleLog()
            .domain([100, d3.max(data, country => d3.max(country.data, d => d.value)) * 1.2]).nice()
            .rangeRound([height - margin.bottom, margin.top])
        : d3.scaleLinear()
            .domain([0, d3.max(data, country => d3.max(country.data, d => d.value)) * 1.2]).nice()
            .range([height - margin.bottom, margin.top])


    // Draw chart
    var svg = d3.select(containerQuery)
        .append("svg")
        .attr('width', width)
        .attr('height', height)

    for (countryIndex in data) {
        countryData = data[countryIndex]
        svg.append("g")
            .attr("stroke", color(countryData.name))
            .attr("stroke-width", 4)
            .selectAll("polyline")
            .data(countryData.data.slice(0, -1))
            .join("polyline")
            .attr("stroke-width", '2')
            .attr("stroke-linecap", "round")
            .attr("points", (d, i) => `${x(i)},${y(d.value)} ${x(i + 1)},${y(countryData.data[i + 1].value)}`)
    }



    // Create title
    svg.append("text")
        .attr("class", "title")
        .attr("x", 50)
        .attr("y", 10)
        .attr("dy", "1em")
        .attr("font-size", "30")
        .text(title)

    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

    svg.append("g")
        .call(g => legend({
            g: g,
            color: color,
            x: 80,
            y: 80,
            intervalX: 0,
            intervalY: 25,
            format: str => str.toUpperCase()
        }))
}
