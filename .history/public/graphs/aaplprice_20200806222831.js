var d3 = d3 || require('d3'); 

var element = typeof module !== 'undefined' && module.exports ? 'body' : '#aapl';

//set margins and size of graph
var margin = {top: 10, right: 20, bottom: 20, left: 0},
  height = 200 - margin.top - margin.bottom,
  width = 1150 - margin.left - margin.right

//set x-axis range
var x = d3.scaleTime().range([0, width - margin.right]);

//set y-axis range
var y = d3.scaleLinear().range([height, 0]);

var url ="https://cors-anywhere.herokuapp.com/https://docs.google.com/spreadsheets/d/e/2PACX-1vTKS3FYmpBnEZde6YXzmlrpWr3hZlGqykA7FrZE2Hbdo7wn2uJnW-HRBvE7Kzqrn5cNrVLBdP6i5omY/pub?gid=492548184&single=true&output=csv"

d3.csv(url).then(function(data){
    const multiples = data.columns.slice(1).map(function(id){
        return {
            id: id,
            values: data.map(function(d){
                return {date: d3.isoParse(d.Date, price: d[id])};
            })
        };            
    })
    console.log(multiples)

// data.forEach(function(d){
//   //iterate over each date (d[0])
//   d.time = d3.isoParse(d.Date);
//   //console.log(d.time);
//   //iterate over each closing stock price (d[4])
//   d.value = +(d.Close);
  //console.log(d.value);
//  })


//set the ranges of the data
x.domain(d3.extent(data, function(d) { return d.time;}));
y.domain([0, d3.max(data, function(d) { return d.value;})]);
  
//define the line
var line = d3.line()
  .x(function(d) { return x(d.time); })
  .y(function(d) { return y(d.value); });

//draw the chart
var svg = d3.select(element)
          .attr("viewBox", `0 0 1150 200`)
            .append('svg')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


//add path of line 
svg.append("path")
   .data([data])
   .attr("class", "moistureline")
   .attr("d", line)
      
//add x-axis
svg.append("g")
   .attr("transform", "translate(0," + height +")")
   .call(d3.axisBottom(x));
    
//add y-axis
svg.append("g")
  .attr("transform", "translate( "+ (width - margin.right) +" , 0)")
  .call(d3.axisRight(y));

})


if (typeof module !== 'undefined' && module.exports) {
    module.exports = svg;
  }