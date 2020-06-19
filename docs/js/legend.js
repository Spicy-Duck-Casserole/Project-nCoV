legend = ({
    color,
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