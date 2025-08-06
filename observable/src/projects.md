---
title: projects
toc: false
header: false
sidebar: false
footer: false
pager: false
---
```js
const stock = await FileAttachment("./data/AAPLprice.json").json();
//display(stock)
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
// Graph stock price for projects page
function AAPLprice1 (price) {
    return(Plot.plot({
        width, //widen graph to fill card
        x: {label: "Date:"}, //labels x-axis with "Date"
        y: {grid: true, label: "Share Price:"}, //labels y-axis with "Share Price"
        marks: [   
            Plot.frame(),
            Plot.ruleY([0]),
            Plot.areaY(price, {
                x: "Date", 
                y: "Close",
                fillOpacity: 0.2,
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
                                day: "numeric"
                        })),
                            y: (d) => `$${d.toFixed(2)}`
                        }
                    }
                }),
        ]
    })); 
}
```
<meta http-equiv="content-type" content="text/html; charset=utf-8">
<meta name="author" content="Chi-Chu Tschang">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<meta name="description" content="chi-chu.tschang.net is the personal website of Chi-Chu Tschang">
<link rel="icon" href="/images/favicon.ico" type="image/x-icon">
<title>chi-chu.tschang.net</title>
<!doctype html>
  <html>
    <div class="container-fluid">
      <head>
        <link rel="stylesheet" type="text/css" href="/stylesheets/style.css" />
        <link rel="stylesheet" type="text/css" href="/stylesheets/iPython.css" />
        <link rel="stylesheet" type="text/css" href="/stylesheets/fontawesome/css/fontawesome.css" />
        <link rel="stylesheet" type="text/css" href="/stylesheets/fontawesome/css/regular.css" />
        <link rel="stylesheet" type="text/css" href="/stylesheets/fontawesome/css/solid.css" />
        <link rel="stylesheet" type="text/css" href="/stylesheets/fontawesome/css/brands.css" />
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous" />
        <ul class="nav">
          <div class="row" id="menu">
            <li class="nav-link"><a href="../">home</a></li>
            <li class="nav-link"><a href="../resume">resume</a></li>
            <li class="nav-link"><a href="../learning">learning</a></li>
            <li class="nav-link"><a href="../teaching/english9">teaching</a></li> 
            <li class="nav-link"><a href="../reading">reading</a></li>
            <li class="nav-link"><a href="https://www.bloomberg.com/authors/AE_Git5xwiE/chichu-tschang">writing</a></li>
            <li class="nav-link"><a href="/">projects</a></li>
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
                <div id="projects">
                  <div class="row no-gutters">
                      <div class="col-md-10 col-sm-6" style="padding-top: 10px"><a href="/AAPL"><font-color="black"><h6><b>Apple Inc share price</b></h6></font-color></a></div>
                      <div class="col-md-2 col-sm-6 text-right" style="padding-top: 10px"><font-color="gray">7/2023</font-color></div>
                    </div>
                      <a href="/AAPL"><div style="padding-top: 10px">${resize((width) => AAPLprice1(price, {width}))}</div></a>
                  <div class="row no-gutters">
                        <div class="col-md-10 col-sm-6" style="padding-top: 10px"><a href="/plants"><font-color="black"><h6><b>Internet of Things plant monitor</b></h6></font-color></a></div><div class="col-md-2 col-sm-6 text-right" style="padding-top: 10px"><font-color="gray">7/2020</font-color>
                        </div>
                    </div>
                        <div>
                          <a href="/plants"><img src="/images/moisture.png" width="100%" height="auto" align-content: left></a>
                        </div>
                    <div class="row no-gutters">
                    <div class="col-md-10 col-sm-6" style="padding-top: 10px"><a href="/shotchart"><font-color="black"><h6><b>LeBron James' career shot chart [2003-04 to 2016-17]</b></h6></font-color></a></div><div class="col-md-2 col-sm-6 text-right" style="padding-top: 10px"><font-color="gray">11/2016</font-color>
                    </div>
                        <div>
                          <a href="/shotchart"><img src="/images/LeBron James shot chart project.png" width="100%" height="auto" style="padding-left: 0px" align-content: left></a>
                        </div>
                    <div class="row no-gutters">
                        <div class="col-md-10 col-sm-6" style="padding-top: 10px"><a href="/censor-weibo"><font-color="black"><h6><b>Reverse Engineering Chinese censorship</b></h6></font-color></a></div><div class="col-md-2 col-sm-6 text-right" style="padding-top: 10px"><font-color="gray">5/2012</font-color>
                        </div>
                        <div>
                          <a href="/censor-weibo"><img src="/images/censored_weibo_timeline1.png" width="100%" height="auto" style="padding-left: 0px" align-content: left></a>
                        </div>    
                </div>
            </content>  
        </div>
    </body>  
    <div id="footer">
      <span><a href="chi-chu@tschang.net" target="_blank"><i class="fa-regular fa-envelope" aria-hidden="true"></i></a></span>
      <span style="margin-left: 10px;"><a href="https://pgp.mit.edu/pks/lookup?op=get&search=0x152A5675369F6C28" target="_blank"><i class="fa-solid fa-key" aria-hidden="true"></i></a></span>
      <span style="margin-left: 10px;"><a href="https://twitter.com/tschang" target="_blank"><i class="fa-brands fa-twitter" aria-hidden="true"></i></a></span>
      <span style="margin-left: 10px;"><a rel="me" href="https://mastodon.social/@tschang" target="_blank"><i class="fa-brands fa-mastodon" aria-hidden="true"></i></a></span>
      <span style="margin-left: 10px;"><a href="https://bsky.app/profile/chi-chu.tschang.net" target="_blank"><i class="fa-brands fa-bluesky" aria-hidden="true"></i></a></span>
      <span style="margin-left: 10px;"><a href="https://www.github.com/chichutschang/" target="_blank"><i class="fa-brands fa-github" aria-hidden="true"></i></a></span>
      <span style="margin-left: 10px;"><a href="https://www.goodreads.com/review/list/1589736/" target="_blank"><i class="fa-brands fa-goodreads-g" aria-hidden="true"></i></a></span>
    </div>
</html>