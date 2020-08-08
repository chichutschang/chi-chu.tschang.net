<script src="https://apis.google.com/js/api.js" type="text/javascript"></script>

var d3 = d3 || require('d3'); 

var element = typeof module !== 'undefined' && module.exports ? 'body' : '#aapl';

var url ="https://docs.google.com/spreadsheets/d/e/2PACX-1vTKS3FYmpBnEZde6YXzmlrpWr3hZlGqykA7FrZE2Hbdo7wn2uJnW-HRBvE7Kzqrn5cNrVLBdP6i5omY/pub?gid=492548184&single=true&output=csv"

d3.csv(url).then(function(data){
    console.log(data)
})


if (typeof module !== 'undefined' && module.exports) {
    module.exports = svg;
  }