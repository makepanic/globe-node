var d3 = require('d3');

module.exports = function(req, res){
    // require on each request because otherwise it just adds new DOM to the existing d3 dom
    var data = [],
        now = Date.now(),
        margin = {
            left: 10,
            top: 10,
            bottom: 10,
            right: 10
        },
        dimension = {
            w: 400,
            h: 300
        };

    d3.select('body svg').remove();


    var yTickFormat = '04d';


    for (var i = 0; i < 3; i++){
        data.push([{
            time: now + i * 10,
            val: i * 10
        }]);
    }

    var xExtents = d3.extent(d3.merge(data), function(d) {
        return d.time; });
    var yExtents = d3.extent(d3.merge(data), function(d) {
        return d.val; });

    yExtents[0] = 0; // reset y min value

    var xScale = d3.time.scale()
        .domain(xExtents)
        .range([0, dimension.w]);
    var yScale = d3.scale.linear()
        .domain(yExtents)
        .range([dimension.h, 0]);

    var color = d3.scale.category10();

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(3)
        .tickFormat(d3.time.format('%Y/%m/%d'));

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .ticks(5)
        .tickSize(-dimension.w)
        .tickFormat(d3.format(yTickFormat));

    // create svg
    var svg = d3.select('body').append('svg')
//        .attr('width', dimension.w - margin.left)
//        .attr('height', dimension.h + margin.top + margin.bottom)
        .attr('version', 1.1)
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .append('g');
//        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // create x axis
    var xAxisContainer = svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0,' + dimension.h + ')')
        .call(xAxis);

    xAxisContainer.selectAll('line')
        .style('stroke', 'lightgrey');
    xAxisContainer.selectAll('path')
        .style('display', 'none');
    xAxisContainer.selectAll('minor')
        .style('stroke-opacity', .5);
    xAxisContainer.selectAll('text')
        .style('font-family', 'Helvetica')
        .style('font-size', '11px');

//    create y axis
    var yAxisContainer = svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0, 0)')
        .call(yAxis);

    yAxisContainer.selectAll('line')
        .style('stroke', 'lightgrey');
    yAxisContainer.selectAll('path')
        .style('display', 'none');
    yAxisContainer.selectAll('minor')
        .style('stroke-opacity', .5);
    yAxisContainer.selectAll('text')
        .style('font-family', 'Helvetica')
        .style('font-size', '11px');

    var lineContainers = svg.selectAll('g.line')
        .data(data)
        .enter().append('svg:g')
        .attr('class', 'line')
        .style('fill', 'white')
        .style('stroke-width', 2)
        .style('stroke', function(d){
            return color(data.indexOf(d));
        });

    /* Add path between all line values. */
    var line = d3.svg.line()
        .defined(function(d) { return d.val != null; })
        .x(function (d) { return xScale(d.time); })
        .y(function (d) { return yScale(d.val); });

    lineContainers.append('svg:path')
        .attr('d', line)
        .style('fill', 'none');


    var legendPos = [{x:80,y:35},{x:80,y:15},{x:270,y:15}, {x:270,y:35}];
    var labels = ['written bytes per second', 'read bytes per second'];

    // create legend
    var legend = svg.append('g')
        .attr('class', 'legend')
        .attr('x', dimension.w - 65)
        .attr('y', 25);
    legend.selectAll('g').data(data)
        .enter().append('g')
        .each(function(d, i) {
            var g = d3.select(this);
            console.log(i);
            g.append('svg:text')
                .attr('x', legendPos[i].x - margin.left)
                .attr('y', legendPos[i].y - margin.top)
                .attr('height', 30)
                .attr('width', 100)
                .style('fill', color(i))
                .style('font-family', 'Helvetica')
                .style('font-size', '12px')
                .text(labels[i]);
        });

    res.set('Content-Type', 'image/svg+xml');
    console.log(d3.select('body').node().innerHTML);
    res.send(d3.select('body').node().innerHTML);

};