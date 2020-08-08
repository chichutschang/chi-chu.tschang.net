var d3 = d3 || require('d3'); 

var element = typeof module !== 'undefined' && module.exports ? 'body' : '#aapl';

//set margins and size of graph
var margin = {top: 10, right: 20, bottom: 30, left: 0},
  height = 200 - margin.top - margin.bottom,
  width = 1150 - margin.left - margin.right

const timeConv = d3.timeParse("%d-%b-%Y");

//draw the chart
var svg = d3.select(element)
          .attr("viewBox", `0 0 1150 200`)
            .append('svg')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// var url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTKS3FYmpBnEZde6YXzmlrpWr3hZlGqykA7FrZE2Hbdo7wn2uJnW-HRBvE7Kzqrn5cNrVLBdP6i5omY/pub?gid=492548184&single=true&output=csv"
var url ="https://cors-anywhere.herokuapp.com/https://docs.google.com/spreadsheets/d/e/2PACX-1vTKS3FYmpBnEZde6YXzmlrpWr3hZlGqykA7FrZE2Hbdo7wn2uJnW-HRBvE7Kzqrn5cNrVLBdP6i5omY/pub?gid=492548184&single=true&output=csv"

d3.csv(url).then(function(data){
    const multiples = data.columns.slice(1).map(function(id){
        return {
            id: id,
            values: data.map(function(d){
                return {
                    time: d3.isoParse(d.Date), 
                    value: +d[id]
                };
            })
        };            
    });
//console.log(multiples)
//console.log("Column headers", data.columns);
//console.log("Column headers without date", data.columns.slice(1));
//console.log("Multiples", multiples);
//console.log("Price", multiples[0]);
//console.log("An array", multiples[0].values);
console.log("Date element", multiples[0].values[0].time);
//console.log("Array length", (multiples[0].values).length);

// data.forEach(function(d){
//   //iterate over each date (d[0])
//   d.time = d3.isoParse(d.Date);
//   //console.log(d.time);
//   //iterate over each closing stock price (d[4])
//   d.value = +(d.Close);
  //console.log(d.value);
//  })


//set x-axis range
const x = d3.scaleTime().range([0, width - margin.right]);

//set y-axis range
const y = d3.scaleLinear().range([height, 0]);

//set the ranges of the data
x.domain(d3.extent(multiples, function(d) { 
  return (d.time),
  console.log(d.time)
  }
  ))
y.domain([(0), d3.max(multiples, function(c){
  return d3.max(c.values, 
    function(d) { 
      return d.value;});   
  }) 
]);



const xaxis = d3.axisBottom().scale(x);
const yaxis = d3.axisRight().scale(y);

//add x-axis
svg.append("g")
   .attr("transform", "translate(0," + height +")")
   .call(xaxis);
    
//add y-axis
svg.append("g")
   .attr("transform", "translate( "+ (width - margin.right) +" , 0)")
   .call(yaxis);
  
//define the line
var line = d3.line()
  .x(function(d) { return x(d.date); })
  .y(function(d) { return y(d.value); });


  // const svg = d3.selectAll(element)
  // .append("svg")
  // .data(multiples)
  // .enter()
  // .append("g");


//add path of line 
// graph.append("path")
//     .attr("class", "moistureline")
//     .attr("d", function(d){ return line(d.values); });
      


})


if (typeof module !== 'undefined' && module.exports) {
    module.exports = svg;
  }