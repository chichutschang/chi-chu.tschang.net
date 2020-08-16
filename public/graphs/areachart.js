//set up d3.js
var d3 = d3 || require('d3'); 
var element = typeof module !== 'undefined' && module.exports ? 'body' : '#AAPLforwardPE';

//format dates and d3.bisector function
var formatTime = d3.timeFormat("%B %d, %Y");
var formatDate = d3.timeFormat("%Y-%m-%d");
var bisect = d3.bisector(function(d) {return d.Date}).left;

//set margins and size of graph
var margin = {top: 10, right: 20, bottom: 30, left: 0},
  height = 200 - margin.top - margin.bottom,
  width = 1150 - margin.left - margin.right

//set x-axis range
var x = d3.scaleTime().range([0, width - margin.right])
var x2 = d3.scaleTime().range([0, width - margin.right])

//set y-axis range
var y = d3.scaleLinear().range([height, 0])

//draw the chart
var svg2 = d3.select(element)
              .attr("viewBox", `0 0 1150 200`)
            .append('svg')
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//draw clip so when focus chart is zoomed in, the data lines don't extend past the border
var clip = svg2.append("defs").append("clipPath")
        .attr("id", "clip")
      .append("rect")
        .attr("class", "zoom")
        .attr("width", (width - margin.right))
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0)

//append the clip
var focuschartlines = svg2.append("g")
         .attr("class", "focus")
         .attr("tranform", "translate(" + margin.left + "," + margin.top + ")")
         .attr("clip-path","url(#clip");                 

//retrieve data from Google Spreadsheets
//var url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTKS3FYmpBnEZde6YXzmlrpWr3hZlGqykA7FrZE2Hbdo7wn2uJnW-HRBvE7Kzqrn5cNrVLBdP6i5omY/pub?gid=1256115182&single=true&output=tsv"
var url ="https://cors-anywhere.herokuapp.com/https://docs.google.com/spreadsheets/d/e/2PACX-1vTKS3FYmpBnEZde6YXzmlrpWr3hZlGqykA7FrZE2Hbdo7wn2uJnW-HRBvE7Kzqrn5cNrVLBdP6i5omY/pub?gid=1256115182&single=true&output=tsv"

//map data into an array
d3.tsv(url).then(function(data){
    var multiples = data.columns.slice(1).map(function(id){
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
console.log("Multiples", multiples);
//console.log("Price", multiples[0]);
//console.log("An array", multiples[0].values);
//console.log("Date element", multiples[0].values[0].time);
//console.log("Array length", (multiples[0].values).length);

//-------------------------SCALES-------------------------//
//scale the range of the data
x.domain(d3.extent(data, function(d) { 
  return (d3.isoParse(d["Date"]))
  //console.log(d3.isoParse(d["Date"]))
  })
);
x2.domain(x.domain())
// y.domain([d3.min(multiples, function(c){ 
//     return d3.min(c.values,
//       function(d){ return d.value;});
//     }), d3.max(multiples, function(c){
//     return d3.max(c.values, 
//       function(d) { 
//         return d.value;});   
//     }) 
//   ]);
y.domain([0, 50])

//-------------------------AXES-------------------------//
const xAxis = d3.axisBottom().scale(x);
const x2Axis = d3.axisBottom().scale(x2);
const yAxis = d3.axisRight().scale(y);

//-------------------------GRAPH-------------------------//
//define the line
const line = d3.line()
        .x(function(d) { return x(d.time); })
        .y(function(d) { return y(d.value); });
  
//add id to each line class
let id = 0;
const ids = function() {
  return "line-"+id++;
}

//create focus object for graph
const focus = svg2.selectAll("lines")
        .data(multiples)
        .enter()
        .append("g");

      //add line
      focus.append("path")
          .attr("class", "line-0")
          .attr("d", function(d) {return line(d.values); });

      //append circle to line path
      focus.selectAll("circle")
        .attr("class", "circle")
        .attr("cx", function(d) {return x(d.time); })
        .attr("cy", function(d) {return y(d.value); });

      //add x-axis
      focus.append("g")
        .attr("transform", "translate(0," + height +")")
        .attr("class","x-axis")
        .call(xAxis);
 
      //add y-axis
      focus.append("g")
        .attr("transform", "translate( "+ (width - margin.right) +" , 0)")
        .attr("class","y-axis")
        .call(yAxis);

//create context area for slider bar
const context = svg2.selectAll("context")
        .data(multiples)
        .enter()
        .append("g");

//-------------------------TOOLTIP-------------------------//
  //set up tooltip
  // const tooltip = d3.select("body").append("g")
  //   .attr("class","tooltip")
  //   .style("opacity", 1)

  //set up zoom
  // const zoom = d3.zoom()
  //   .scaleExtent([1, Infinity])
  //   .translateExtent([[0, 0],[width, height]])
  //   .extent([[0 , 0], [width, height]])
  //   .on("zoom", zoomed);

  //overlay zoom area rectangle on top of the focus chart  
  // const rectangle = svg2.append("rect")
  //                     .attr("width", (width - margin.right))
  //                     .attr("height", height)
  //                     .attr("class", "zoom")
  //                     .on("mousemove", mousemove);
  
  //draw vertical line to follow mouse
  // const mouseline = focus.append("path")
  //                         .attr("class","mouse-line")
  //                         .attr("stroke", "#000000")
  //                         .attr("stroke-width", 1)
  //                         .attr("opacity", "0");
      
//map x- and y-coordinates of mouse
function mousemove(multiples){
  //console.log(data)
  const x0 = formatDate(x.invert(d3.mouse(this)[0]));
  //console.log(x0);
  const i = bisect(data, x0)
  //console.log(i)
  const d0 = data[i -1]
  //console.log(d0) 
  const d1 = data[i]
  //console.log(d1)
  const d = x0 - d0.Date > d1.Date - x0 ? d1 : d0;
  //console.log(d)
  
  tooltip.attr("transform", `translate(${x(d3.isoParse(d.Date))},${y(d.Close)})`)
         .text(`AAPL share price on ${formatTime(x.invert(d3.mouse(this)[0]))}: $${d.Close}`) 
         .style("left", (d3.event.pageX - 150) + "px")
         .style("top", (d3.event.pageY - 50) +"px");
  console.log(formatTime(x.invert(d3.mouse(this)[0])))
  //console.log(x(d3.isoParse(d.Date)))
  console.log(d.Close)
  //console.log(y(d.Close))

  mouseline.attr("d", `M ${x(d3.isoParse(d.Date))} ${height} V ${y(d.Close)}`).attr("opacity", "1");
  }

//-------------------------SLIDER-------------------------//
  //draw slider 
  const brush = d3.brushX()
    .extent([[0,0] , [(width - margin.right) , 20]])
    .on("brush end", brushed)

  //append slider to context
  context.append("g")
    .attr("class", "brush")
    .attr("transform", "translate(" + margin.left +"," + (height + margin.top - 10) + ")")
    .call(brush)
    .call(brush.move, [581, x.range()[1]]); //starts the slider bar on August 24, 2011, when Tim Cook became CEO of Apple
  
  //brush function to move slider
  function brushed() {
    var s = d3.event.selection || x2.range()
    x.domain(s.map(x2.invert, x2));
    //focus.select(".area").attr("d", function(d) {return area(d.values); });
    focus.select(".path-line-0").attr("d", function(d) {return line(d.values); });
    focus.select(".x-axis").call(xAxis)
    focus.select(".y-axis").call(yAxis);
  }
  //zoom function rescale x-axis
  function zoomed(){
    var t = d3.event.transform;
    x.domain(t.rescaleX(x2).domain());
    // focus.select(".area").attr("d", function(d) {return area(d.values); });
    focus.select(".line").attr("d", function(d) {return line(d.values); });
    focus.select(".x-axis").call(xAxis)
  }
    
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = svg;
  }