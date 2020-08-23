//set up d3.js
var d3 = d3 || require('d3'); 
var element = typeof module !== 'undefined' && module.exports ? 'body' : '#humidity';

//set margins and size of graph
var margin = {top: 10, right: 20, bottom: 20, left: 30},
  height = 200 - margin.top - margin.bottom,
  width = 1150 - margin.left - margin.right

//set x-axis range
var x = d3.scaleTime().range([0, width - margin.right])

//set y-axis range
var y = d3.scaleLinear().range([height, 0]);

//draw humidity chart
var svg3 = d3.select("div#humidity").append("svg")
     .attr("viewBox", `0 0 1150 200`)
   .append("g")
     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//retrieve temperature data in json format from ./projects/plants/temperature
var humidityurl="./plants/humidity"

d3.json(humidityurl).then(function(data){
  
    //format temperature data
    data.forEach(function(d){
       d.time = d3.isoParse(d.time);
       d.value = +d.value;
    })

    //set the ranges of the data
    x.domain(d3.extent(data, function(d) { return d.time;}));
    y.domain([0, d3.max(data, function(d) { return d.value;})]);
  
    //define the line
    var humidityline = d3.line()
       .x(function(d) { return x(d.time); })
       .y(function(d) { return y(d.value); });

    //add path of line 
    svg3.append("path")
       .data([data])
       .attr("class", "humidityline")
       .attr("d", humidityline)
      
    //add x-axis
    svg3.append("g")
       .attr("class","x-axis")
       .attr("transform", "translate(0," + height +")")
       .call(d3.axisBottom(x).ticks(width / 100).tickFormat(d3.timeFormat("%m/%d/%Y")).tickSizeOuter(0));
    
    //add y-axis
    svg3.append("g")
       .attr("class", "y-axis")
       .call(d3.axisLeft(y))
        
});







if (typeof module !== 'undefined' && module.exports) {
    module.exports = svg;
  }