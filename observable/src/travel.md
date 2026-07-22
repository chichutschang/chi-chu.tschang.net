---
title: chi-chu.tschang.net
toc: false
header: false
sidebar: false
footer: false
pager: false
---

<!-- pulls data from foursquare.json.js -->
```js
const checkins = await FileAttachment("data/foursquare.json").json();
```
<!-- ```js
display(checkins.length)
``` -->
 ```js
import * as topojson from "npm:topojson-client";
```
<!-- pulls data for all countries  -->
```js
const world = await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(r => r.json())
```
<!-- ```js
display(world)
``` -->
```js
const countries = topojson.feature(world, world.objects.countries)
```
<!-- ```js
display(countries)
```-->
<!-- manually adds United States and Hong Kong to list of countries  -->
```js
const nameAliases = ({ "United States": "United States of America",
                "Hong Kong": "Hong Kong Special Administrative Region" })
```
<!-- ```js
display(nameAliases)
``` -->
<!-- pulls unique checked in countries from foursquare.json.js -->
```js
const CheckInCountryNames = [...new Set(checkins.map(d => d.venue?.location?.country).filter(Boolean).map(name => nameAliases[name] || name))]
```
<!-- ```js
display(CheckInCountryNames)
```   -->
```js
const CheckInCountries = countries.features.filter(f => CheckInCountryNames.includes(f.properties.name))
```
<!-- ```js
display(CheckInCountries.length)
```  -->
<!-- pulls unique checked in cities from foursquare.json.js -->
```js
const CheckInCities = [...new Set(checkins.map(d => d.venue.location.city))]
```
<!-- ```js
display(CheckInCities.length)
```  -->
<!-- pulls unique checked in venues from foursquare.json.js -->
```js
const uniqueVenues = [...new Map(checkins.map(d => [d.venue.id, { name: d.venue?.name, lat: d.venue?.location?.lat, lng: d.venue?.location?.lng, city: d.venue?.location?.city, country: d.venue?.location?.country}])).values()]
```
<!-- ```js
display(uniqueVenues)
``` -->
<!-- pulls earliest checked in venues from foursquare.json.js -->
```js
const firstCheckin = checkins.reduce((earliest, d) =>
  d.createdAt < earliest.createdAt ? d : earliest
);
```
<!-- ```js
display({
  date: new Date(firstCheckin.createdAt * 1000).toLocaleDateString(),
  venue: firstCheckin.venue?.name,
  city: firstCheckin.venue?.location?.city,
  country: firstCheckin.venue?.location?.country
})
``` -->
<!-- pulls unique checked in airports from foursquare.json.js -->
```js
const airportCheckins = checkins.filter(d =>
  d.venue?.categories?.some(c => c.name?.includes("Airport"))
)
```
```js
const uniqueAirports = [...new Map(
  airportCheckins.map(d => [d.venue.id, d.venue.name])
).values()]
```
<!-- ```js
    display(uniqueAirports)
``` -->
<!-- pulls unique checked in boats from foursquare.json.js -->
```js
const BoatCheckins = checkins.filter(d =>
  d.venue?.categories?.some(c => c.name?.includes("Boat"))
)
```
```js
const uniqueBoat= [...new Map(
  BoatCheckins.map(d => [d.venue.id, d.venue.name])
).values()]
```
<!-- ```js
    display(uniqueBoat)
``` -->
<!-- pulls unique checked in restaurants from foursquare.json.js -->
```js
const RestaurantCheckins = checkins.filter(d =>
  d.venue?.categories?.some(c => c.name?.includes("Restaurant"))
)
```
```js
const uniqueRestaurantsCheckins= [...new Map(
  RestaurantCheckins.map(d => [d.venue.id, d.venue.name])
).values()]
```
<!-- ```js
    display(uniqueRestaurantsCheckins)
```  -->
<!-- pulls unique checked in Chinese restaurants from foursquare.json.js -->
```js
const ChineseRestaurantCheckins = checkins.filter(d =>
  d.venue?.categories?.some(c => c.name?.includes("Chinese Restaurant"))
)
```
```js
const uniqueChineseRestaurantsCheckins= [...new Map(
  ChineseRestaurantCheckins.map(d => [d.venue.id, d.venue.name])
).values()]
```
<!-- ```js
    display(uniqueChineseRestaurantsCheckins)
``` -->
<!-- pulls unique checked in boba tea shops from foursquare.json.js -->
```js
const BobaTeaCheckins = checkins.filter(d =>
  d.venue?.categories?.some(c => c.name?.includes("Bubble Tea Shop"))
)
```
```js
const uniqueBobaTeaCheckins= [...new Map(
  BobaTeaCheckins.map(d => [d.venue.id, d.venue.name])
).values()]
```
<!-- ```js
    display(uniqueBobaTeaCheckins)
``` -->
<meta http-equiv="content-type" content="text/html; charset=utf-8">
<meta name="author" content="Chi-Chu Tschang">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<meta name="description" content="chi-chu.tschang.net is the personal website of Chi-Chu Tschang">
<link rel="icon" href="./images/favicon.ico" type="image/x-icon">
<title>chi-chu.tschang.net</title>

<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>

<!-- script to render fontawesome stylesheet -->  
<script>
  const fontawesomeSheets = [
    "/stylesheets/fontawesome/css/fontawesome.css",
    "/stylesheets/fontawesome/css/regular.css",
    "/stylesheets/fontawesome/css/solid.css",
    "/stylesheets/fontawesome/css/brands.css"
  ];
  fontawesomeSheets.forEach(href => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = href;
    document.head.appendChild(link);
  });
</script>
<!-- script to render Hardcover icon -->  
<script>
document.addEventListener("DOMContentLoaded", () => {
  const hardcoverIcon = document.getElementById("hardcover-icon");
  if (hardcoverIcon) hardcoverIcon.src = "/images/Hardcover-Symbol-Dark.png";
});
</script>

<!-- script to render stylesheets -->  
<!-- <link rel="stylesheet" type="text/css" href="/stylesheets/style.css" /> -->
<script>
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "/stylesheets/style.css";
    document.head.appendChild(link);
</script>
<!-- <link rel="stylesheet" type="text/css" href="/stylesheets/iPython.css" />  -->
<script>
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "/stylesheets/iPython.css";
    document.head.appendChild(link);
</script>
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous" />
<!-- header nav bar-->  
<ul class="nav">
    <div id="menu" class="row">
        <li class="nav-link"><a href="/" rel="external">home</a></li>
        <li class="nav-link"><a href="/resume" rel="external">resume</a></li>
        <li class="nav-link"><a href="/learning" rel="external">learning</a></li>
        <li class="nav-link"><a href="/teaching/english9" rel="external">teaching</a></li> 
        <li class="nav-link"><a href="/read" rel="external">reading</a></li>
        <li class="nav-link"><a href="https://www.bloomberg.com/authors/AE_Git5xwiE/chichu-tschang">writing</a></li>
        <li class="nav-link"><a href="/projects" rel="external">projects</a></li>
    </div>
    <div id="header">
    <!-- add icon link -->
        <link rel="icon" href="/images/favicon.ico" type="image/x-icon">
    </div>
    <div id="header_left">
        <a href="/"><img src="/images/chichutschanglogo.jpg" width="50" height="auto"></a>
    </div>
    <div id="header_right">
        <a href="/"><img src="/images/chi-chu.tschang.png" width="175" height="auto"></a>
    </div>
</ul>
<!-- <body> -->
<div class="content">
    <div id="projects">
        ${resize((width) =>
            Plot.plot({
                projection: "equal-earth",
                width,
                marks: [
                    Plot.geo(countries, { fill: "lightgray" }),
                    Plot.geo(CheckInCountries, { fill: "lightcoral" }),
                    Plot.dot(uniqueVenues, {x: "lng", y: "lat", r: 1, fill: "red"}),
                    Plot.graticule(),
                    Plot.sphere()
                ]
            })
        )}
    </div>
    <div class="card">
        Since ${new Date(firstCheckin.createdAt * 1000).getFullYear()}, Chi-Chu Tschang has visited ${CheckInCities.length} cities in ${CheckInCountries.length} countries. He has eaten in at least ${uniqueRestaurantsCheckins.length} restaurants, including at least ${uniqueChineseRestaurantsCheckins.length} Chinese restaurants, and consumed copious amounts of boba tea from at least ${uniqueBobaTeaCheckins.length} boba tea shops.
    </div>
</div>
<!-- <footer> -->
<div id="footer">
    <table>
        <tr>
            <td style="padding-left: 14px">
                <a href="mailto:chi-chu@tschang.net" target="_blank">
                    <i class="fa-regular fa-envelope" aria-hidden="true"></i>
                </a>
            </td>
            <td style="padding-left: 10px">
                <a href="https://pgp.mit.edu/pks/lookup?op=get&search=0x152A5675369F6C28" target="_blank">
                    <i class="fa-solid fa-key" aria-hidden="true"></i>
                </a>
            </td>
            <td style="padding-left: 10px">
                <a href="https://twitter.com/tschang" target="_blank">
                    <i class="fa-brands fa-twitter" aria-hidden="true"></i>
                </a>
                </td>
            <td style="padding-left: 10px">
                <a rel="me" href="https://mastodon.social/@tschang" target="_blank">
                    <i class="fa-brands fa-mastodon" aria-hidden="true"></i>
                </a>
            </td>
            <td style="padding-left: 10px">
                <a href="https://bsky.app/profile/chi-chu.tschang.net" target="_blank">
                    <i class="fa-brands fa-bluesky" aria-hidden="true"></i>
                </a>
            </td>
            <td style="padding-left: 10px">
                <a href="https://www.github.com/chichutschang/" target="_blank">
                    <i class="fa-brands fa-github" aria-hidden="true"></i>
                </a>
            </td>
            <td style="padding-left: 10px">
                <a href="https://www.goodreads.com/review/list/1589736/" target="_blank">
                    <i class="fa-brands fa-goodreads-g" aria-hidden="true"></i>
                </a>
            </td>
            <td style="padding-left: 10px">
                <a href="https://hardcover.app/@tschang" target="_blank">
                    <img id="hardcover-icon" src="images/Hardcover-Symbol-Dark.png" alt="Hardcover" style="height: 18px; margin-bottom: 4px; transform: rotate(-12deg);">
                </a>
            </td>
        </tr>
    </table>
</div> 
</div>
