import d3 from "d3";
require("./style/style.less");

// d3.select("body").append("div")
//   .on("click", () => console.log("it works with es6!"))
//   .text("it works!");


var margin = {top: 60, right: 20, bottom: 30, left: 50},
    width = 500 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var x = d3.time.scale()
    .domain([0, 1])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([0, 1])
    .range([400, 0]);

var area = d3.svg.area()
    .x(function(d) { return x(d.x); })
    .y0(height)
    .y1(function(d) { return y(d.y); })
    .interpolate('basis');

var mini_line = d3.svg.line()
    .x(function(d, i) { return i * 5; })
    .y(function(d) { return d * 5; })
    .interpolate('basis');

var line = d3.svg.line()
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); })
    .interpolate('basis');

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var jitter = 1;

function data() {
    return d3.range(0, 40).map(function(y) {
        // pseudorandom noise
        var pseudo = Math.random() * 1.2;
        var pseudo_b = Math.random();
        return d3.range(0, 40).map(function(x) {
            if (Math.random() > 0.7) pseudo_b = Math.random();
            return {
                x: x / 40,
                y0: y / 40,
                y: (y / 40) + (((x < 10 || x > 30) ? 0.2 : 1) *
                    Math.sin(x / (Math.PI * 4)) * (jitter * Math.random() / 5) *
                        pseudo * pseudo_b)
            };
        });
    }).reverse();
}

function draw() {
    var wave = svg.selectAll('g.wave').data(data()),
        wave_enter = wave.enter()
            .append('g')
            .attr('class', 'wave');

    wave_enter.append('path')
        .attr('class', 'area');

    wave_enter.append('path')
        .attr('class', 'line');

    wave.select('path.area').transition().duration(400).attr('d', area);
    wave.select('path.line').transition().duration(400).attr('d', line);

    d3.timer(draw, 2000);
}

draw();

function sinw(cycle) {
    return function(x) { return Math.sin(x / cycle); }
}

var waves = [
    d3.range(0, 20).map(sinw(3)),
    d3.range(0, 20).map(sinw(2)),
    d3.range(0, 20).map(sinw(1))
];

var selects = svg.selectAll('g.select')
    .data(waves)
    .enter()
    .append('g').attr('class', 'select')
    .attr('transform', function(d, i) {
        return 'translate(' + [i * 162, 450] + ')';
    })
    .on('click', function(d, i) { jitter = (i + 1) / 2; });

selects.append('rect').attr({ width: 150, height: 50 });

selects.append('path')
    .attr('class', 'mini-line').attr('d', mini_line);
