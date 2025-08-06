---
title: AAPL
toc: false
header: false
sidebar: false
footer: false
pager: false
---

```js
const stock = await FileAttachment("./data/AAPLprice.json").json();
console.log(stock);
const forwardPE = await FileAttachment("./data/AAPLPE.json").json();
const forwardPS = await FileAttachment("./data/AAPLPS.json").json();
```
```js
//Convert row of arrays to array of objects for AAPL share price 
const [header, ...dataRows] = stock; //header = ["Date", "Close"]
const price = dataRows.map(row => ({
    [header[0]]: new Date(row[0]), //"Data" -> Date object
    [header[1]]:+row[1] //"Close" -> number
})) 
//display(price)
```
```js
//convert row of arrays to array of objects for AAPL forward PE
const [header, ...dataRows] = forwardPE;
const AAPLforwardPE = dataRows.flatMap(row => [
    {
        [header[0]]: new Date(row[0]),
        [header[1]]: +row[1],
        [header[2]]: +row[2],
        [header[3]]: +row[3],
        [header[4]]: +row[4],
        [header[5]]: +row[5],
        [header[6]]: +row[6]
    }
]);
```
```js
//convert row of arrays to array of objects for AAPL forward PS
const [header, ...dataRows] = forwardPS;
const AAPLforwardPS = dataRows.flatMap(row => [
    {
        [header[0]]: new Date(row[0]),
        [header[1]]: +row[1],
        [header[2]]: +row[2],
        [header[3]]: +row[3],
        [header[4]]: +row[4],
        [header[5]]: +row[5],
        [header[6]]: +row[6]
    }
]);
//display(AAPLforwardPS);
```
```js
const defaultStartEnd = [price[8584].Date, price.at(-1).Date]; //start graph on December 20, 2014
const startEnd = Mutable(defaultStartEnd);
const setStartEnd = (se) => startEnd.value = (se ?? defaultStartEnd);
//display(startEnd)
const getStartEnd = () => startEnd.value;
//display(getStartEnd)
const currentSelection = startEnd.value;
const filteredPrice = price.filter((d) => currentSelection[0] <= d.Date && d.Date < currentSelection[1]);
``` 
```js
function trend(v) {
    return v >= 0.00 ? html `<span class="green">↗︎</span>`
    : v < 0.00 ? html `<span class="red">↘︎</span>`
    : "→";
}
```
```js
function formatPercent(value, format){
    return value == null
    ? "N/A"
    : (value / 100).toLocaleString("en-US", {minimumFractionDigits: 2, style: "percent", ...format});
}
```

```js
function currentprice (price) {
    const range = d3.extent(price.slice(-251), (d) => d.Close); //sets range of 1 year (251 trading days)
    const latestPrice = price.slice(-1)[0]; // get the latest share price data point
    const oneMChange = (( price.slice(-1)[0].Close / price.slice(-26)[0].Close ) - 1 ) * 100 //calculates share price change over last 26 trading days
    const oneYrChange = (( price.slice(-1)[0].Close / price.slice(-251)[0].Close ) - 1 ) * 100 //calculates share price change over last 251 trading days
    const fiveYrChange = (( price.slice(-1)[0].Close / price.slice(-1255)[0].Close ) - 1 ) * 100 //calculates share price change over last 251 * 5 trading days
    const tenYrChange = (( price.slice(-1)[0].Close / price.slice(-2510)[0].Close ) - 1 ) * 100 //calculates share price change over last 251 * 10 trading days
    const all = (( price.slice(-1)[0].Close / price[0].Close ) - 1 ) * 100 //calculates share price change since IPO
    // Create color scale or get stroke color based on latest price
    // const color = d3.scaleOrdinal(d3.schemeBlues[9]); // or whatever color scheme you want
    // const stroke = color(`${latestPrice.Close}Y FRM`); // Now using latestPrice instead of undefined 'd'
    return html.fragment`
    <h1>share price: $${latestPrice.Close} </h1><h3>as of ${latestPrice.Date.toLocaleString("en-US", 
        {
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            timeZone: 'UTC'  
        })}
    </h3> 
        <table>
            <tr>
                <td>1-month change: </td>
                <td align="right">${formatPercent(oneMChange)}</td>
                <td>${trend(oneMChange)}</td>
            </tr>
            <tr>
                <td>1-year change: </td>
                <td align="right">${formatPercent(oneYrChange)}</td>
                <td>${trend(oneYrChange)}</td>
            </tr>
            <tr>
                <td>5-year change: </td>
                <td align="right">${formatPercent(fiveYrChange)}</td>
                <td>${trend(fiveYrChange)}</td>
            </tr>
            <tr>
                <td>10-year change: </td>
                <td align="right">${formatPercent(tenYrChange)}</td>
                <td>${trend(tenYrChange)}</td>
            </tr>
            <tr>
                <td>all-time change: </td>
                <td align="right">${formatPercent(all)}</td>
                <td>${trend(all)}</td>
            </tr>
            <tr>
                <td colspan="3">AAPL's share price trading range over the past year:</td>
            </tr>
        </table>
    
    ${resize((width) =>
    (Plot.plot({
                width,
                //height: 40,
                axis: null,
                x: {
                    domain: d3.extent(price.slice(-251), d => d.Close),
                    inset: 40
                    },
                marks: [
                    Plot.tickX(price.slice(-251),{
                        x: "Close",
                        //y: "Close",
                        stroke: "lightgray",
                        insetTop: 10,
                        insetBottom: 10,
                        tip: {anchor: "top"}
                    }), //adds tick mark of the latest closing price
                    Plot.tickX(price.slice(-1), {
                        x: "Close",
                        //y: "Close",
                        stroke: "darkgray",
                        strokeWidth: 3,
                    }),
                    Plot.text([`$${range[0]}`], {frameAnchor: "left"}),
                    Plot.text([`$${range[1]}`], {frameAnchor: "right"})
                ]
        }))
    )}
    `;
}
```
```js
function currentforwardPE (AAPLforwardPE) {
    const latestforwardPE = AAPLforwardPE.slice(-1)[0]; // get the latest forward PE price data point
    return html.fragment`
    <h1>forward P/E: ${latestforwardPE["Forward PE"]}x </h1><h3>as of ${latestforwardPE.Date.toLocaleString("en-US", 
        {
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            timeZone: 'UTC'  
        })}
    </h3> 
    <table>
            <tr>
                <td>+2 Standard Deviation: </td>
                <td align="right">${latestforwardPE["+2 Standard Deviation"]}x</td>
           </tr>
                       <tr>
                <td>+1 Standard Deviation: </td>
                <td align="right">${latestforwardPE["+1 Standard Deviation"]}x</td>
           </tr>
           <tr>
                <td>Mean: </td>
                <td align="right">${latestforwardPE["Mean"]}x</td>
           </tr>
                    <tr>
                <td>-1 Standard Deviation: </td>
                <td align="right">${latestforwardPE["-1 Standard Deviation"]}x</td>
           </tr>
                       <tr>
                <td>-2 Standard Deviation: </td>
                <td align="right">${latestforwardPE["-2 Standard Deviation"]}x</td>
           </tr>
    </table>
    `;
}

```
```js
function currentforwardPS (AAPLforwardPS) {
    const latestforwardPS = AAPLforwardPS.slice(-1)[0]; // get the latest forward PS price data point
    return html.fragment`
    <h1>forward P/S: ${latestforwardPS["Forward PS"]}x </h1><h3>as of ${latestforwardPS.Date.toLocaleString("en-US", 
        {
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            timeZone: 'UTC'   
        })}
    </h3> 
    <table>
            <tr>
                <td>+2 Standard Deviation: </td>
                <td align="right">${latestforwardPS["+2 Standard Deviation"]}x</td>
           </tr>
                       <tr>
                <td>+1 Standard Deviation: </td>
                <td align="right">${latestforwardPS["+1 Standard Deviation"]}x</td>
           </tr>
           <tr>
                <td>Mean: </td>
                <td align="right">${latestforwardPS["Mean"]}x</td>
           </tr>
                    <tr>
                <td>-1 Standard Deviation: </td>
                <td align="right">${latestforwardPS["-1 Standard Deviation"]}x</td>
           </tr>
                       <tr>
                <td>-2 Standard Deviation: </td>
                <td align="right">${latestforwardPS["-2 Standard Deviation"]}x</td>
           </tr>
    </table>
    `;
}
```
<meta http-equiv="content-type" content="text/html; charset=utf-8">
<meta name="author" content="Chi-Chu Tschang">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<meta name="description" content="chi-chu.tschang.net is the personal website of Chi-Chu Tschang">
<link rel="icon" href="./images/favicon.ico" type="image/x-icon">
<title>chi-chu.tschang.net</title>
<!doctype html>
  <html>
    <div class="container-fluid">
      <head>
        <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
<!-- <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script> -->
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
<!-- Google Analytics -->

<script async src="https://www.googletagmanager.com/gtag/js?id=G-TFGKC2X8JB"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-TFGKC2X8JB');
</script>

<!-- End Google Analytics -->  

<link rel="stylesheet" type="text/css" href="/stylesheets/style.css" />
<link rel="stylesheet" type="text/css" href="/stylesheets/iPython.css" />
<link rel="stylesheet" type="text/css" href="/stylesheets/fontawesome/css/fontawesome.css" />
<link rel="stylesheet" type="text/css" href="/stylesheets/fontawesome/css/regular.css" />
<link rel="stylesheet" type="text/css" href="/stylesheets/fontawesome/css/solid.css" />
<link rel="stylesheet" type="text/css" href="/stylesheets/fontawesome/css/brands.css" />
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous" />
    <ul class="nav">
        <div class="row" id="menu">
            <li class="nav-link"><a href="../../">home</a></li>
            <li class="nav-link"><a href="../../resume">resume</a></li>
            <li class="nav-link"><a href="../../learning">learning</a></li>
            <li class="nav-link"><a href="../../teaching/english9">teaching</a></li> 
            <li class="nav-link"><a href="../../reading">reading</a></li>
            <li class="nav-link"><a href="https://www.bloomberg.com/authors/AE_Git5xwiE/chichu-tschang">writing</a></li>
            <li class="nav-link"><a href="../../projects">projects</a></li>
        </div>  
    </ul>
     <div id="header">
        <!-- add icon link -->
        <link rel="icon" href="/images/favicon.ico" type="image/x-icon">
        <a href="/"><div id="header_left"><img src="/images/chichutschanglogo.jpg" width="50" height="auto"></div></a>
        <a href="/"><div id="header_right"><img src="/images/chi-chu.tschang.png" width="175" height="auto"></div></a>
     </div>
      </head>
      <body>
        <div id="content">
            <content>
                <h1>Apple Inc. <font color="gray">[AAPL]</font></h1>
                <div class ="grid grid-cols-2 grid-rows-2" style="margin-top: 2rem; grid-template-rows: 215px 215px;">
                <div class="card grid-rowspan-2">${currentprice(price)}</div>
                <div class="card">${currentforwardPE(AAPLforwardPE)}</div>
                <div class="card">${currentforwardPS(AAPLforwardPS)}</div>
                <div class="card grid-colspan-2">
                ${resize((width) =>
                    Plot.plot({
                        width, 
                        x: {label: "Date:"}, 
                        y: {grid: true, label: "Share Price:"}, 
                        marks: [ 
                            Plot.frame(), 
                            Plot.ruleY([0]), 
                            Plot.areaY(price, {
                                x: "Date", 
                                y: "Close",
                                fillOpacity: 0.2
                            }),
                            Plot.lineY(price, {
                                x: "Date", 
                                y: "Close",
                                stroke: "gray",
                                tip: {
                                    format: {
                                        x: (d) => (d.toLocaleDateString("en-US", {
                                            month: "long",
                                            year: "numeric",
                                            day: "numeric",
                                            timeZone: 'UTC'  
                                        })),
                                        y: (d) => `$${d.toFixed(2)}`
                                    }
                                }
                            }),
                            Plot.tip(
                                [`Apple names Steve Jobs interim CEO`],{x: new Date("1997-09-16"), y:0.2, dy: -40, anchor: "bottom"},
                            ),
                                //https://www.apple.com/newsroom/2006/05/16Apple-Unveils-New-MacBook-Featuring-Intel-Core-Duo-Processors/
                            Plot.tip(
                                [`Apple starts selling MacBook`],{x: new Date("2006-05-16"), y:2.32, dy: -3, anchor: "bottom"}, 
                            ),
                                //https://www.apple.com/newsroom/2007/06/28iPhone-Premieres-This-Friday-Night-at-Apple-Retail-Stores/
                            Plot.tip(
                                [`Apple starts selling iPhone`],{x: new Date("2007-06-29"), y:4.36, dy: -26, anchor: "bottom"}, 
                            ),
                                //https://www.apple.com/newsroom/2010/01/27Apple-Launches-iPad/
                            Plot.tip(
                                [`Apple starts selling iPad`],{x: new Date("2010-04-03"), y:8.52, dy: -46, anchor: "bottom"},
                            ),
                                //https://www.apple.com/newsroom/2011/08/24Steve-Jobs-Resigns-as-CEO-of-Apple/
                            Plot.tip(
                                [`Tim Cook suceeds Steve Jobs as Apple's CEO`],{x: new Date("2011-08-24"), y:13.44, dy: -64, dx: 10, anchor: "bottom"},
                            ),
                                //https://www.apple.com/newsroom/2015/03/09Apple-Watch-Available-in-Nine-Countries-on-April-24/
                            Plot.tip(
                                [`Apple starts selling Apple Watch`],{x: new Date("2015-04-24"), y:32.57, dy: 10, anchor: "top"},
                            ),
                            Plot.tip(
                                [`Apple starts selling Apple TV+`],{x: new Date("2019-11-01"), y:63.96, dy: -3, anchor: "top"},
                            ),
                                (index, scales, channels, dimensions, context) => {
                                    const x1 = dimensions.marginLeft; 
                                    const y1 = 20; 
                                    const x2 = dimensions.width - dimensions.marginRight; 
                                    const y2 = dimensions.height - 28; 
                                    const brushed = (event) => {
                                        if(!event.sourceEvent) return; 
                                        let {selection} = event; 
                                        if(!selection) {
                                            const r = 10; 
                                            let [px] = d3.pointer(event, context.ownerSVGElement); 
                                            px = Math.max(x1 + r, Math.min(x2 - r, px)); 
                                            selection = [px - r, px + r]; 
                                            g.call(brush.move, selection) 
                                        }
                                    setStartEnd(selection.map(scales.x.invert));
                                };
                                const pointerdowned = (event) => {
                                    const pointerleave = new PointerEvent("pointerleave", {bubbles: true, pointerType: "mouse"});
                                    event.target.dispatchEvent(pointerleave);
                                };
                                const brush = d3.brushX().extent([[x1, y1], [x2, y2]]).on("brush end", brushed);
                                const g = d3.create("svg:g").call(brush);
                                g.call(brush.move, getStartEnd().map(scales.x));
                                g.on("pointerdown", pointerdowned);
                                return g.node();            
                            },
                        ]
                    })
                )}
            </div>
            <div class="card grid-colspan-2">
            <h3>AAPL share price between ${startEnd.map((d) => d.toLocaleDateString("en-US"), {timeZone: 'UTC'}).join("-")}</h3>
                ${resize((width) =>
                    Plot.plot({
                        width, 
                        x: {label: "Date:"}, 
                        y: {grid: true, label: "Share Price:"},
                        marks: [
                            Plot.frame(),
                            Plot.ruleY([0]),
                            Plot.areaY(price.filter((d) => startEnd[0] <= d.Date && d.Date < startEnd[1]), {
                                x: "Date", 
                                y: "Close",
                                fillOpacity: 0.2,
                            }),
                            Plot.lineY(price.filter((d) => startEnd[0] <= d.Date && d.Date < startEnd[1]), {
                                x: "Date", 
                                y: "Close",
                                stroke: "gray",
                                tip: {
                                    format: {
                                        x: (d) => (d.toLocaleDateString("en-US", {
                                            month: "long",
                                            year: "numeric",
                                            day: "numeric",
                                            timeZone: 'UTC'  
                                        })),
                                        y: (d) => `$${d.toFixed(2)}`
                                    }
                                }
                            }),
                        ]   
                    })
                )}
            </div>
            <div class="card grid-colspan-2">
            <h3>AAPL forward P/E price between ${startEnd.map((d) => d.toLocaleDateString("en-US"), {timeZone: 'UTC'}).join("-")}</h3>
                ${resize((width) =>
                    Plot.plot({
                        width, 
                        x: {label: "Date:"}, 
                        y: {label: "Forward P/E:"},
                        marks: [
                            Plot.frame(),
                            Plot.ruleY([0]),
                            Plot.lineY(AAPLforwardPE.filter((d) => startEnd[0] <= d.Date && d.Date < startEnd[1]), {
                                x: "Date", 
                                y: "Forward PE",
                                stroke: "gray",
                                tip: {
                                    format: {
                                        x: (d) => (d.toLocaleDateString("en-US", {
                                            month: "long",
                                            year: "numeric",
                                            day: "numeric",
                                            timeZone: 'UTC'  
                                        })),
                                        y: (d) => `${d.toFixed(1)}x`
                                    }
                                }
                            }),
                            Plot.lineY(AAPLforwardPE.filter((d) => startEnd[0] <= d.Date && d.Date < startEnd[1]), {
                                x: "Date", 
                                y: "+2 Standard Deviation", 
                                stroke: "darkred",
                                strokeOpacity: 0.5,
                            }),
                            Plot.text(AAPLforwardPE.filter((d) => startEnd[0] <= d.Date && d.Date < startEnd[1]), 
                            Plot.selectFirst({x: "Date", y: "+2 Standard Deviation", text: (d) => `+2 Standard Deviation: ${d["+2 Standard Deviation"]}x`, dx: 128, dy: 6, textAnchor: "end", fill: "darkred"})),
                            Plot.lineY(AAPLforwardPE.filter((d) => startEnd[0] <= d.Date && d.Date < startEnd[1]), {
                                x: "Date", 
                                y: "+1 Standard Deviation",
                                stroke: "orangered",
                                strokeOpacity: 0.5,
                            }),
                            Plot.text(AAPLforwardPE.filter((d) => startEnd[0] <= d.Date && d.Date < startEnd[1]), 
                            Plot.selectFirst({x: "Date", y: "+1 Standard Deviation", text: (d) => `+1 Standard Deviation: ${d["+1 Standard Deviation"]}x`, dx: 128, dy: 6, textAnchor: "end", fill: "orangered"})),
                            Plot.lineY(AAPLforwardPE.filter((d) => startEnd[0] <= d.Date && d.Date < startEnd[1]), {
                                x: "Date", 
                                y: "Mean",
                                stroke: "crimson",
                                strokeOpacity: 0.5,
                            }),
                            Plot.text(AAPLforwardPE.filter((d) => startEnd[0] <= d.Date && d.Date < startEnd[1]), 
                            Plot.selectFirst({x: "Date", y: "Mean", text: (d) => `Mean: ${d.Mean}x`, dx: 55, dy: -6, textAnchor: "end", fill: "crimson"})),
                            Plot.lineY(AAPLforwardPE.filter((d) => startEnd[0] <= d.Date && d.Date < startEnd[1]), {
                                x: "Date", 
                                y: "-1 Standard Deviation",
                                stroke: "orangered",
                                strokeOpacity: 0.5,
                            }),
                            Plot.text(AAPLforwardPE.filter((d) => startEnd[0] <= d.Date && d.Date < startEnd[1]), 
                            Plot.selectFirst({x: "Date", y: "-1 Standard Deviation", text: (d) => `-1 Standard Deviation: ${d["-1 Standard Deviation"]}x`, dx: 121, dy: 6, textAnchor: "end", fill: "orangered"})),
                            Plot.lineY(AAPLforwardPE.filter((d) => startEnd[0] <= d.Date && d.Date < startEnd[1]), {
                                x: "Date", 
                                y: "-2 Standard Deviation",
                                stroke: "darkred",
                                strokeOpacity: 0.5,
                            }),
                            Plot.text(AAPLforwardPE.filter((d) => startEnd[0] <= d.Date && d.Date < startEnd[1]), 
                            Plot.selectFirst({x: "Date", y: "-2 Standard Deviation", text: (d) => `-2 Standard Deviation: ${d["-2 Standard Deviation"]}x`, dx: 125, dy: -6, textAnchor: "end", fill: "darkred"})),
                        ]   
                    })
                )}
            </div>
            <div class="card grid-colspan-2">
            <h3>AAPL forward P/S price between ${startEnd.map((d) => d.toLocaleDateString("en-US"), {timeZone: 'UTC'}).join("-")}</h3>
                ${resize((width) =>
                    Plot.plot({
                        width, 
                        x: {label: "Date:"}, 
                        y: {label: "Forward P/S:"},
                        marks: [
                            Plot.frame(),
                            Plot.ruleY([0]),
                            Plot.lineY(AAPLforwardPS.filter((d) => startEnd[0] <= d.Date && d.Date < startEnd[1]), {
                                x: "Date", 
                                y: "Forward PS",
                                stroke: "gray",
                                tip: {
                                    format: {
                                        x: (d) => (d.toLocaleDateString("en-US", {
                                            month: "long",
                                            year: "numeric",
                                            day: "numeric",
                                            timeZone: 'UTC'  
                                        })),
                                        y: (d) => `${d.toFixed(1)}x`
                                    }
                                }
                            }),
                            Plot.lineY(AAPLforwardPS.filter((d) => startEnd[0] <= d.Date && d.Date < startEnd[1]), {
                                x: "Date", 
                                y: "+2 Standard Deviation", 
                                stroke: "darkred",
                                strokeOpacity: 0.5,
                            }),
                            Plot.text(AAPLforwardPS.filter((d) => startEnd[0] <= d.Date && d.Date < startEnd[1]), 
                            Plot.selectFirst({x: "Date", y: "+2 Standard Deviation", text: (d) => `+2 Standard Deviation: ${d["+2 Standard Deviation"]}x`, dx: 128, dy: 6, textAnchor: "end", fill: "darkred"})),
                            Plot.lineY(AAPLforwardPS.filter((d) => startEnd[0] <= d.Date && d.Date < startEnd[1]), {
                                x: "Date", 
                                y: "+1 Standard Deviation",
                                stroke: "orangered",
                                strokeOpacity: 0.5,
                            }),
                            Plot.text(AAPLforwardPS.filter((d) => startEnd[0] <= d.Date && d.Date < startEnd[1]), 
                            Plot.selectFirst({x: "Date", y: "+1 Standard Deviation", text: (d) => `+1 Standard Deviation: ${d["+1 Standard Deviation"]}x`, dx: 128, dy: 6, textAnchor: "end", fill: "orangered"})),
                            Plot.lineY(AAPLforwardPS.filter((d) => startEnd[0] <= d.Date && d.Date < startEnd[1]), {
                                x: "Date", 
                                y: "Mean",
                                stroke: "crimson",
                                strokeOpacity: 0.5,
                            }),
                            Plot.text(AAPLforwardPS.filter((d) => startEnd[0] <= d.Date && d.Date < startEnd[1]), 
                            Plot.selectFirst({x: "Date", y: "Mean", text: (d) => `Mean: ${d.Mean}x`, dx: 55, dy: -6, textAnchor: "end", fill: "crimson"})),
                            Plot.lineY(AAPLforwardPS.filter((d) => startEnd[0] <= d.Date && d.Date < startEnd[1]), {
                                x: "Date", 
                                y: "-1 Standard Deviation",
                                stroke: "orangered",
                                strokeOpacity: 0.5,
                            }),
                            Plot.text(AAPLforwardPS.filter((d) => startEnd[0] <= d.Date && d.Date < startEnd[1]), 
                            Plot.selectFirst({x: "Date", y: "-1 Standard Deviation", text: (d) => `-1 Standard Deviation: ${d["-1 Standard Deviation"]}x`, dx: 121, dy: 6, textAnchor: "end", fill: "orangered"})),
                            Plot.lineY(AAPLforwardPS.filter((d) => startEnd[0] <= d.Date && d.Date < startEnd[1]), {
                                x: "Date", 
                                y: "-2 Standard Deviation",
                                stroke: "darkred",
                                strokeOpacity: 0.5,
                            }),
                            Plot.text(AAPLforwardPS.filter((d) => startEnd[0] <= d.Date && d.Date < startEnd[1]), 
                            Plot.selectFirst({x: "Date", y: "-2 Standard Deviation", text: (d) => `-2 Standard Deviation: ${d["-2 Standard Deviation"]}x`, dx: 125, dy: -6, textAnchor: "end", fill: "darkred"})),
                        ]   
                    })
                )}
                </div>
                <div id="footer">
                <div id="lastupdate">last updated: 7/2025</div>
                    <span><a href="chi-chu@tschang.net" target="_blank"><i class="fa-regular fa-envelope" aria-hidden="true"></i></a></span>
                    <span style="margin-left: 10px;"><a href="https://pgp.mit.edu/pks/lookup?op=get&search=0x152A5675369F6C28" target="_blank"><i class="fa-solid fa-key" aria-hidden="true"></i></a></span>
                    <span style="margin-left: 10px;"><a href="https://twitter.com/tschang" target="_blank"><i class="fa-brands fa-twitter" aria-hidden="true"></i></a></span>
                    <span style="margin-left: 10px;"><a rel="me" href="https://mastodon.social/@tschang" target="_blank"><i class="fa-brands fa-mastodon" aria-hidden="true"></i></a></span>
                    <span style="margin-left: 10px;"><a href="https://bsky.app/profile/chi-chu.tschang.net" target="_blank"><i class="fa-brands fa-bluesky" aria-hidden="true"></i></a></span>
                    <span style="margin-left: 10px;"><a href="https://www.github.com/chichutschang/" target="_blank"><i class="fa-brands fa-github" aria-hidden="true"></i></a></span>
                    <span style="margin-left: 10px;"><a href="https://www.goodreads.com/review/list/1589736/" target="_blank"><i class="fa-brands fa-goodreads-g" aria-hidden="true"></i></a></span>
                </div>
    </content>  
    </div>
    </body>  
    </div>
</html>