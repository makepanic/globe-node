var _ = require('lodash-node'),
    d3 = require('d3');

var defaults = {
        period: '1_week',
        legendPos: [],
        dimension: {
            w: 400,
            h: 300
        }
    };

/**
 * Generates a svg graph for given data.
 * @param {{period: String, legendPos: Array, dimension: {w: Number, h: Number}}} opts Render options.
 * @returns {String} Graph SVG stringified.
 */
exports.svg = function(opts) {
    // require on each request because otherwise it just adds new DOM to the existing d3 dom
    var data = opts.data,
        period = opts.period ? opts.period : defaults.period,
        graphs = _.isArray(opts.graphs) ? opts.graphs : [],
        padding = {
            left: 45,
            top: 40,
            bottom: 10,
            right: 10
        },
        dimension = opts.dimension ? opts.dimension : defaults.dimension,
        dataset = [],
        yTickFormat = opts.tickFormat ? opts.tickFormat : 's',
        histories = [],
        legendPos = _.merge({}, defaults.legendPos, opts.legendPos),
        labels = _.isArray(opts.labels) ? opts.labels : [];

    d3.select('body svg').remove();

    // get values for each graph type an put them in the histories array
    graphs.forEach(function(graph){
        if(data.hasOwnProperty(graph)){
            histories.push(data[graph]);
        }
    });

    // loop through each item in the history array and push it to the d3 dataset
    histories.forEach(function(history){
        if(history && history[period] && history[period].values){
            dataset.push(history[period].values);
        }
    });

    var xExtents = d3.extent(d3.merge(dataset), function(d) {
        return d[0];
    });
    var yExtents = d3.extent(d3.merge(dataset), function(d) {
        return d[1];
    });

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
        .attr('width', dimension.w + padding.left + padding.right)
        .attr('height', dimension.h + padding.top + padding.bottom + 10)
        .attr('version', 1.1)
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .append('g')
        .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')');

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
        .style('stroke-opacity', 0.5);
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
        .style('stroke-opacity', 0.5);
    yAxisContainer.selectAll('text')
        .style('font-family', 'Helvetica')
        .style('font-size', '11px');

    var lineContainers = svg.selectAll('g.line')
        .data(dataset)
        .enter().append('svg:g')
        .attr('class', 'line')
        .style('fill', 'white')
        .style('stroke-width', 2)
        .style('stroke', function(d){
            return color(dataset.indexOf(d));
        });

    /* Add path between all line values. */
    var line = d3.svg.line()
        .defined(function(d) { return d[1] !== null; })
        .x(function (d) { return xScale(d[0]); })
        .y(function (d) { return yScale(d[1]); });

    lineContainers.append('svg:path')
        .attr('d', line)
        .style('fill', 'none');

    // create legend
    var legend = svg.append('g')
        .attr('class', 'legend')
        .attr('x', dimension.w - 65)
        .attr('y', 25);

    // legend offset
    var legendOffset = {
        x: 0,
        y: -10
    };

    legend
        .selectAll('g')
        .data(dataset)
        .enter()
        .append('g')
        .attr('transform', 'translate(' + legendOffset.x + ',' + legendOffset.y + ')')
        .each(function(d, i) {

            var g = d3.select(this);
            g.append('svg:text')
                .attr('x', legendPos[i].x - padding.left)
                .attr('y', legendPos[i].y - padding.top)
                .attr('height', 30)
                .attr('width', 100)
                .style('fill', color(i))
                .style('font-family', '"Open Sans","lucida grande","Segoe UI",arial,verdana, "lucida sans unicode",tahoma,sans-serif')
                .style('font-size', '10px')
                .text(labels[i]);
        });

    return d3.select('body').node().innerHTML;
};
