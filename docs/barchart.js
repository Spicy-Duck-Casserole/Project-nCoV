async function barchart({
    containerQuery,
    dataSource,
    country,
    title = "",
    colorMap,
    width = 800,
    height = 400,
    margin = ({ top: 10, right: 40, bottom: 40, left: 30 })
}) {

    const data = await dataSource(country)

    const color = colorMap

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


    x = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([margin.left, width - margin.right])
        .padding(0.1)

    y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.confirmed) * 1.2]).nice()
        .range([height - margin.bottom, margin.top])


    // Draw chart
    var svg = d3.select(containerQuery)
        .append("svg")
        .attr('width', width)
        .attr('height', height)

    // Draw confirmed cases
    svg.append("g")
        .attr("fill", color('active'))
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", (d, i) => x(i))
        .attr("y", d => y(d.confirmed))
        .attr("height", d => y(0) - y(d.confirmed))
        .attr("width", x.bandwidth());

    // Draw deaths
    svg.append("g")
        .attr("fill", color('deaths'))
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", (d, i) => x(i))
        .attr("y", d => y(d.death))
        .attr("height", d => y(0) - y(d.death))
        .attr("width", x.bandwidth());

    // Draw recovered
    svg.append("g")
        .attr("fill", color('recovered'))
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", (d, i) => x(i))
        .attr("y", d => y(d.death + d.recover))
        .attr("height", d => y(0) - y(d.recover))
        .attr("width", x.bandwidth());

    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

    svg.append("g")
        .call(g => legend({
            color: color,
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
        .text(title)

}
