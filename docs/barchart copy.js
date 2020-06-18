async function run() {

    data = await CountryAll('China')

    margin = ({ top: 10, right: 40, bottom: 40, left: 30 })

    const width = 400
    const height = 400

    color = d3.scaleOrdinal(
        data.map(d => d.name),
        ['#FEE89F', '#D7A19B', '#BED6AD', 'grey'])


    legend = ({
        g,
        x = 0,
        y = 0,
        iconWidth = 12,
        iconHeight = 12,
        intervalX = 70,
        intervalY = 0,
        fontSize = 10,
        format = x => x
    }) => {
        item = g.selectAll('g')
            .data(color.domain())
            .join('g')

        item.append('rect')
            .attr("fill", d => color(d))
            .attr("x", (d, i) => x + i * intervalX)
            .attr("y", (d, i) => y + i * intervalY)
            .attr("width", iconWidth)
            .attr("height", iconHeight)

        item.append("text")
            .attr("class", "title")
            .attr("x", (d, i) => x + i * intervalX + iconWidth + 3)
            .attr("y", (d, i) => y + i * intervalY)
            .attr("dy", "1em")
            .attr("font-size", `${fontSize}`)
            .text(d => format(d))
    }

    xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickValues(d3.ticks(...d3.extent(x.domain()), 15))
            .tickFormat(i => data[i].date).tickSizeOuter(0))
        .call(g => g.selectAll("text")
            .attr("transform", `translate(-20,12),rotate(-30)`))

    yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisRight(y).tickSize(width - margin.left - margin.right).ticks(5, data.format))
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
        .domain(d3.range(data.length))
        .range([margin.left, width - margin.right])
        .padding(0.1)

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.total) * 1.2]).nice()
        .range([height - margin.bottom, margin.top])


    // Draw chart
    var svg = d3.select('#barchart')
        .append("svg")
        .attr('width', width)
        .attr('height', height)

    // Draw total cases
    // var serie = svg.append("g")
    //     .selectAll("g")
    //     .data(([]).push(data))
    //     .join("g");

    // serie.append("path")
    //     .attr("fill", "none")
    //     .attr("stroke", "red")
    //     .attr("stroke-width", 1.5)
    //     .attr("d", d3.line()
    //         .x((d, i) => x(i))
    //         .y(d => y(d.total)))


    for (countryData in data) {

    }

    svg.append("g")
        .attr("stroke", "violet")
        .selectAll("polyline")
        .data(data.slice(0, -1))
        .join("polyline")
        .attr("points", (d, i) => `${x(i)},${y(d.total)} ${x(i + 1)},${y(data[i + 1].total)}`)


    // // Draw deaths
    // svg.append("g")
    //     .attr("fill", color('deaths'))
    //     .selectAll("rect")
    //     .data(data)
    //     .join("rect")
    //     .attr("x", (d, i) => x(i))
    //     .attr("y", d => y(d.death))
    //     .attr("height", d => y(0) - y(d.death))
    //     .attr("width", x.bandwidth());

    // // Draw recovered
    // svg.append("g")
    //     .attr("fill", color('recovered'))
    //     .selectAll("rect")
    //     .data(data)
    //     .join("rect")
    //     .attr("x", (d, i) => x(i))
    //     .attr("y", d => y(d.death + d.recovered))
    //     .attr("height", d => y(0) - y(d.recovered))
    //     .attr("width", x.bandwidth());

    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

    svg.append("g")
        .call(g => legend({
            g: g,
            x: 50,
            y: 50,
            intervalX: 70,
            format: str => str.toUpperCase()
        }))

    // Create title
    svg.append("text")
        .attr("class", "title")
        .attr("x", 50)
        .attr("y", 10)
        .attr("dy", "1em")
        .attr("font-size", "30")
        .text('China, Mainland')

}

run()