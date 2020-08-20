//set up d3.js
var d3 = d3 || require('d3'); 
var element = typeof module !== 'undefined' && module.exports ? 'body' : '#AAPLforwardPS';

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
var y3 = d3.scaleLinear().range([height, 0])

//draw the chart
var svg3 = d3.select(element)
              .attr("viewBox", `0 0 1150 200`)
            .append('svg')
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//draw clip so when focus chart is zoomed in, the data lines don't extend past the border
var clip = svg3.append("defs").append("clipPath")
        .attr("id", "clip")
      .append("rect")
        .attr("class", "zoom")
        .attr("width", (width - margin.right))
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0)

//append the clip
var focuschartlines = svg3.append("g")
         .attr("class", "focus")
         .attr("tranform", "translate(" + margin.left + "," + margin.top + ")")
         .attr("clip-path","url(#clip");                 

//retrieve data from Google Spreadsheets
//var url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTKS3FYmpBnEZde6YXzmlrpWr3hZlGqykA7FrZE2Hbdo7wn2uJnW-HRBvE7Kzqrn5cNrVLBdP6i5omY/pub?gid=627892166&single=true&output=tsv"
var url ="https://cors-anywhere.herokuapp.com/https://docs.google.com/spreadsheets/d/e/2PACX-1vTKS3FYmpBnEZde6YXzmlrpWr3hZlGqykA7FrZE2Hbdo7wn2uJnW-HRBvE7Kzqrn5cNrVLBdP6i5omY/pub?gid=627892166&single=true&output=tsv"

//map data into an array
d3.tsv(url).then(function(data){
    //console.log(data)
    data.forEach(function(d) {
        d.time = d3.isoParse(d.Date),
        //console.log(d.time),
        d.ForwardPS = +d.ForwardPS,
        //console.log(d.ForwardPE),
        d.Mean = +d.Mean,
        //console.log(d.Mean),
        d.PlusTwoSTD = +d.PlusTwoSTD,
        //console.log(d.PlusTwoSTD),
        d.PlusOneSTD = +d.PlusOneSTD,
        //console.log(d.PlusOneSTD),
        d.MinusOneSTD = +d.MinusOneSTD,
        //console.log(d.MinusOneSTD),
        d.MinusTwoSTD = +d.MinusTwoSTD
        //console.log(d.MinusTwoSTD)
    })
    
//-------------------------SCALES-------------------------//
//scale the range of the data
x.domain(d3.extent(data, function(d) { return d.time }));
x2.domain(x.domain())
y3.domain([0, d3.max(data, function(d) { return d.ForwardPS })]);
//console.log(y3.domain())  
//-------------------------AXES-------------------------//
const xAxis = d3.axisBottom().scale(x);
const x2Axis = d3.axisBottom().scale(x2);
const yAxis = d3.axisRight().scale(y3).ticks(5);
  
//-------------------------GRAPH-------------------------//
//create focus object for graph
const focus = svg3.selectAll("lines")
        .data([data])
        .enter()
        .append("g");

      //add Forward P/E line
      focus.append("path")
          .attr("class", "line-0")
          .attr("d", d3.line()
            .x(function(d) {return x(d.time) })
            .y(function(d) {return y3(d.ForwardPS); })
          );

      //add Forward P/E Mean line
      focus.append("path")
          .attr("class", "line-1")
          .attr("d", d3.line()
            .x(function(d) {return x(d.time) })
            .y(function(d) {return y3(d.Mean); })
          );

      //add Forward P/E +2 STD line
      focus.append("path")
          .attr("class", "line-2")
          .attr("d", d3.line()
            .x(function(d) {return x(d.time) })
            .y(function(d) {return y3(d.PlusTwoSTD); })
          );

      //add Forward P/E +1 STD line
      focus.append("path")
          .attr("class", "line-3")
          .attr("d", d3.line()
            .x(function(d) {return x(d.time) })
            .y(function(d) {return y3(d.PlusOneSTD); })
          );

      //add Forward P/E -1 STD line
      focus.append("path")
      .attr("class", "line-3")
      .attr("d", d3.line()
        .x(function(d) {return x(d.time) })
        .y(function(d) {return y3(d.MinusOneSTD); })
      );

      //append circle to line path
      focus.selectAll("circle")
        .attr("class", "circle")
        .attr("cx", function(d) {return x(d.time); })
        .attr("cy", function(d) {return y3(d.ForwardPS); });

      //add Forward P/E -2 STD line
      focus.append("path")
      .attr("class", "line-5")
      .attr("d", d3.line()
        .x(function(d) {return x(d.time) })
        .y(function(d) {return y3(d.MinusTwoSTD); })
      );

      //add x-axis
      focus.append("g")
        .attr("transform", "translate(0," + height +")")
        .attr("class","x-axis")
        .call(xAxis);

      //add y-axis
      focus.append("g")
        .attr("transform", "translate( "+ (width - margin.right) +" , 0)")
        .attr("class","y-axis");

//create context area for slider bar
const context = svg3.selectAll("context")
        .data([data])
        .enter()
        .append("g");

//-------------------------TOOLTIP-------------------------//
  //set up tooltip
  const tooltip = d3.select("body").append("g")
    .attr("class","tooltip")
    .style("opacity", 1)

  //set up zoom
  const zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0],[width, height]])
    .extent([[0 , 0], [width, height]])
    .on("zoom", zoomed);

  //overlay zoom area rectangle on top of the focus chart  
  const rectangle = svg3.append("rect")
                      .attr("width", (width - margin.right))
                      .attr("height", height)
                      .attr("class", "zoom")
                      .on("mousemove", mousemove);
  
  //draw vertical line to follow mouse
  const mouseline = focus.append("path")
                          .attr("class","mouse-line")
                          .attr("stroke", "#000000")
                          .attr("stroke-width", 1)
                          .attr("opacity", "0");

//map x- and y-coordinates of mouse
function mousemove(){
  //console.log(data)
  const x0 = formatDate(x.invert(d3.mouse(this)[0]));
  //console.log(x0);
  const i = bisect(data, x0) 
  //console.log(i)
  const d0 = data[i -1]
  //console.log(d0) 
  const d1 = data[i]
  //console.log(d1)
  const d = x0 - d0.time > d1.time - x0 ? d1 : d0;
  //console.log(d)
  
  tooltip.attr("transform", `translate(${x(d3.isoParse(d.time))},${y3(d.ForwardPS)})`)
         .text(`AAPL forward P/S on ${formatTime(x.invert(d3.mouse(this)[0]))}: ${d.ForwardPS}x`) 
         .style("left", (d3.event.pageX - 150) + "px")
         .style("top", (d3.event.pageY - 50) +"px");
  //console.log(formatTime(x.invert(d3.mouse(this)[0])))
  //console.log(x(d3.isoParse(d.time)))
  //console.log(d.ForwardPS)
  //console.log(y2(d.ForwardPS))

  mouseline.attr("d", `M ${x(d3.isoParse(d.time))} ${y3(d.ForwardPS)} V ${y3(d.PlusTwoSTD)}`).attr("opacity", "1");
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
    focus.select(".line-0").attr("d", d3.line().x(function(d) {return x(d.time) }).y(function(d) {return y3(d.ForwardPS); }))
    focus.select(".x-axis").call(xAxis)
    focus.select(".y-axis").call(yAxis);
  }

  //zoom function rescale x-axis
  function zoomed(){
    var t = d3.event.transform;
    x.domain(t.rescaleX(x2).domain());
    //focus.select(".area").attr("d", function(d) {return area(d.values); });
    focus.select(".line").attr("d", function(d) {return line(d.values); });
    focus.select(".x-axis").call(xAxis)
  }
    

})

if (typeof module !== 'undefined' && module.exports) {
    module.exports = svg;
  }