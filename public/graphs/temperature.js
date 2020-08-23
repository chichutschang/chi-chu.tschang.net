//set up d3.js
var d3 = d3 || require('d3'); 
var element = typeof module !== 'undefined' && module.exports ? 'body' : '#temperature';

//draw temperature chart
var svg2 = d3.select("div#temperature").append("svg")
    .attr("viewBox", `0 0 1150 200`)  
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//retrieve temperature data in json format from ./projects/plants/temperature
var temperatureurl="./plants/temperature"

d3.json(temperatureurl).then(function(data){
  
    //format temperature data
    data.forEach(function(d){
      d.time = d3.isoParse(d.time);
      d.value = +d.value;
    })

    //set the ranges of the data
    x.domain(d3.extent(data, function(d) { return d.time;}));
    y.domain([d3.min(data, function(d) {return d.value;}), d3.max(data, function(d) { return d.value;})]);
  
    //define the line
    var temperatureline = d3.line()
      .x(function(d) { return x(d.time); })
      .y(function(d) { return y(d.value); });

    //add path of line 
    svg2.append("path")
      .data([data])
      .attr("class", "temperatureline")
      .attr("d", temperatureline)
      
    //add x-axis
    svg2.append("g")
      .attr("class","x-axis")
      .attr("transform", "translate(0," + height +")")
      .call(d3.axisBottom(x).ticks(width / 200).tickFormat(d3.timeFormat("%m/%d/%Y")).tickSizeOuter(0));
    
    //add y-axis
    svg2.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y))
});





if (typeof module !== 'undefined' && module.exports) {
    module.exports = svg;
  }