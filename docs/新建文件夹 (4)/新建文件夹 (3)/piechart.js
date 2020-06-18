async function piechart({
    containerQuery,
    dataSource,
    title = "",
    titleColor,
    colorScheme,
}) {

    pie = d3.pie()
        .sort(null)
        .value(d => d.value)

    const width = 800
    const height = 400

    const margin = ({ top: 10, right: 10, bottom: 50, left: 10 })

    radius = Math.min(width - margin.left - margin.right, height - margin.top - margin.bottom) / 2

    tagMargin = 10

    tagInterval = 50

    textLength = 100

    arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)

    arcLabel = d3.arc()
        .innerRadius(radius * 0.95)
        .outerRadius(radius * 0.95);

    arcNumber = d3.arc()
        .innerRadius(radius * 0.618)
        .outerRadius(radius * 0.618)

    data = await dataSource()


    sortBox = function (arr) {
        this.data = arr.map((x, i) => ({ value: x, index: i }))
        sortBox.prototype.sort = function (cmp) {
            this.data.sort((a, b) => cmp(a.value, b.value))
            return this
        }
        sortBox.prototype.unsort = function () {
            this.data.sort((a, b) => a.index - b.index)
            return this
        }
        sortBox.prototype.set = function (arr) {
            this.data = arr.map((x, i) => ({ value: x, index: this.data[i].index }))
            return this
        }
        sortBox.prototype.get = function () {
            return this.data.map(x => x.value)
        }
    }

    // Adjust values distributed in a rage with a least interval
    adjustInterval = ({ domain, range, interval, step = 1 }) => {
        var temp = (new sortBox(domain)).sort((a, b) => a - b)

        var [...result] = temp.get()

        cnt = 0
        do {
            nice = true
            if (result[0] < range[0]) {
                nice = false
                result[0] += step * 4
            }
            if (result[result.length - 1] > range[1]) {
                nice = false
                result[result.length - 1] -= step * 4
            }
            for (var i = 1; i < result.length; i++) {
                if (result[i] - result[i - 1] < interval) {
                    nice = false
                    if (result[i - 1] - step < range[0])
                        result[i] += step * 2
                    else if (result[i] + step > range[1])
                        result[i - 1] -= step * 2
                    else {
                        result[i - 1] -= step
                        result[i] += step
                    }
                }
            }
            cnt++
        } while (cnt < 10000 && !nice);

        return temp.set(result).unsort().get()
    }

    color = d3.scaleOrdinal()
        .domain(data.map(d => d.name))
        .range(d3.quantize(colorScheme, data.length).reverse())


    slicesGreatestN = n => pie(data)
        .sort((a, b) => b.value - a.value)
        .map((d, i) => { d.rank = i; return d; })
        .sort((a, b) => a.index - b.index)
        .filter(d => d.rank < n);

    right = d => arcLabel.centroid(d)[0] >= 0;
    left = d => arcLabel.centroid(d)[0] < 0;

    slicesSideLimit = limit => slicesGreatestN(function () {
        for (var i = 0; i < slices.length; i++) {
            const center = slicesGreatestN(i)

            if (center.filter(right).length > limit ||
                center.filter(left).length > limit) {
                return i - 1
            }
        }
        return slices.length
    }())


    const slices = pie(data)

    const slicesLabel = slicesSideLimit(7)

    const svg = d3.select(containerQuery)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -radius - margin.top, width, height]);

    svg.append("g")
        .attr("stroke", "white")
        .selectAll("path")
        .data(slices)
        .join("path")
        .attr("fill", d => color(d.data.name))
        .attr("d", arc)
        .append("title")
        .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);

    svg.append("g")
        .attr("fill", "grey")
        .selectAll('circle')
        .data(slicesLabel)
        .join("circle")
        .attr("r", 3)
        .attr("transform", d => `translate(${arcLabel.centroid(d)})`)

    endPointRight = adjustInterval({
        domain: slicesLabel.filter(right).map(d => arcLabel.centroid(d)[1]),
        range: [-height / 2 + tagInterval, height / 2 - tagInterval],
        interval: tagInterval
    })
    endPointLeft = adjustInterval({
        domain: slicesLabel.filter(left).map(d => arcLabel.centroid(d)[1]),
        range: [-height / 2 + tagInterval / 2, height / 2 - tagInterval / 2],
        interval: tagInterval
    })

    svg.append("g")
        .attr("stroke", "grey")
        .selectAll("polyline")
        .data(slicesLabel.filter(right))
        .join('polyline')
        .attr('fill', 'none')
        .attr('points', (d, i) => {

            const x1 = arcLabel.centroid(d)[0]
            const y1 = arcLabel.centroid(d)[1]

            const x2 = radius + tagMargin
            const y2 = endPointRight[i]

            const x3 = x2 + textLength
            const y3 = y2

            return `${x1},${y1} ${x2},${y2} ${x3},${y3}`
        })



    svg.append("g")
        .attr("stroke", "grey")
        .selectAll("polyline")
        .data(slicesLabel.filter(left))
        .join('polyline')
        .attr('fill', 'none')
        .attr('points', (d, i) => {

            const x1 = arcLabel.centroid(d)[0]
            const y1 = arcLabel.centroid(d)[1]

            const x2 = -radius - tagMargin
            const y2 = endPointLeft[i]

            const x3 = x2 - textLength
            const y3 = y2

            return `${x1},${y1} ${x2},${y2} ${x3},${y3}`
        })

    svg.append("g")
        .attr("stroke", "grey")
        .selectAll("text")
        .data(slicesLabel.filter(right))
        .join('text')
        .attr('x', radius + tagMargin + textLength)
        .attr('y', (d, i) => endPointRight[i])
        .attr('dy', '-0.4em')
        .attr('text-anchor', "end")
        .text(d => d.data.name.toUpperCase())

    svg.append("g")
        .attr("stroke", "grey")
        .selectAll("text")
        .data(slicesLabel.filter(left))
        .join('text')
        .attr('x', -radius - tagMargin - textLength)
        .attr('y', (d, i) => endPointLeft[i])
        .attr('dy', '-0.4em')
        .attr('text-anchor', "start")
        .text(d => d.data.name.toUpperCase())


    svg.append("g")
        .attr("stroke", "lightgrey")
        .selectAll("text")
        .data(slicesLabel.filter(right))
        .join('text')
        .attr('x', radius + tagMargin + textLength)
        .attr('y', (d, i) => endPointRight[i])
        .attr('dy', '1.2em')
        .attr('text-anchor', "end")
        .text(d => d3.format('.1%')(d.data.value / d3.sum(data, d => d.value)))

    svg.append("g")
        .attr("stroke", "lightgrey")
        .selectAll("text")
        .data(slicesLabel.filter(left))
        .join('text')
        .attr('x', -radius - tagMargin - textLength)
        .attr('y', (d, i) => endPointLeft[i])
        .attr('dy', '1.2em')
        .attr('text-anchor', "start")
        .text(d => d3.format('.1%')(d.data.value / d3.sum(data, d => d.value)))

    svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("fill", "white")
        .attr("stroke", "white")
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(slicesGreatestN(5))
        .join("text")
        .attr("transform", d => `translate(${arcNumber.centroid(d)})`)
        .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
            .attr("x", 0)
            .attr("y", "0.7em")
            .attr("fill-opacity", 0.7)
            .text(d => d.data.value.toLocaleString()));

    svg.append('text')
        .attr("stroke", titleColor)
        .attr("fill", titleColor)
        .attr("font-size", 25)
        .attr("x", 0)
        .attr("y", `${radius + 15}`)
        .attr('dy', '1em')
        .attr('text-anchor', "middle")
        .text(title)

}
