async function run() {

    data = await Top10()
	var countryData = data[3]
    margin = ({ top: 10, right: 40, bottom: 40, left: 30 })

    const width = 1080
    const height = 600

    color = d3.scaleOrdinal(
        ["active"],
        ['#FEE89F','grey'])


    legend = ({
        g,
        x = 0,
        y = 0,
        iconWidth = 12,
        iconHeight = 12,
        intervalX = 0,
        intervalY = 70,
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
            .tickFormat(i => data[0].data[i].date).tickSizeOuter(0))
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
        .domain(d3.range(data[0].data.length))
        .range([margin.left, width - margin.right])
        .padding(0.1)

    var y = d3.scaleLinear()
        .domain([0, d3.max(countryData.data, d => d.active) * 1.2]).nice()
        .range([height - margin.bottom, margin.top])


    // Draw chart
    var svg = d3.select('#INDIAlinechart')
        .append("svg")
        .attr('width', width)
        .attr('height', height)
		
	
		
		svg.append("g")
        .attr("stroke", color('active'))
		.attr("stroke-width",4)
        .selectAll("polyline")
        .data(countryData.data.slice(0, -1))
        .join("polyline")
        .attr("points", (d, i) => `${x(i)},${y(d.active)} ${x(i + 1)},${y(countryData.data[i+1].active)}`)
	
	


    // Create title
    svg.append("text")
        .attr("class", "title")
        .attr("x", 50)
        .attr("y", 10)
        .attr("dy", "1em")
        .attr("font-size", "30")
        .text('INDIA Active Cases')
		
    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

    svg.append("g")
        .call(g => legend({
            g: g,
            x: 1000,
            y: 50,
            intervalX: 0,
			intervalY:25,
            format: str => str.toUpperCase()
        }))



}

run()