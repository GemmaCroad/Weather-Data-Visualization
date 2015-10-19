var d3render = function(city, country) {


  var width = 500,
      height = 500,
      radius = Math.min(width, height) / 2,
      innerRadius = 0.4 * radius;

  var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d.width; });

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([0, 0])
    .html(function(d) {
      return d.data.label + ": <span style='color:orangered'>Min: " + d.data.temp.min + ", Max: " + d.data.temp.max + "</span>";
    });

  var arc = d3.svg.arc()
    .innerRadius(function (d) {
      returnValue = (radius - innerRadius) * (d.data.temp.min / 100.0);
      // console.log("returnValue: " + returnValue + ", d.data.temp.min: " + d.data.temp.min);
      return returnValue;
    })
    // .innerRadius(radius - innerRadius) * (d.data.temp.min / 100.0) +
    .outerRadius(function (d) {
      returnValue = (radius - innerRadius) * (d.data.temp.max / 100.0) + innerRadius;
//                     500  - 200          * 19.23 / 100               + 200
//                      300                * 0.1923                    + 200
      // console.log("returnValue: " + returnValue + ", d.data.temp.max: " + d.data.temp.max);
      return returnValue;
    });


  // var outlineArc = d3.svg.arc()
  //         .innerRadius(innerRadius)
  //         .outerRadius(radius);



  d3.select("svg").remove();
  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height)
      // .attr("id", "d3canvas")
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  svg.call(tip);

  var appID = 'f3a5dd18c8a77128d0151472b2283866';
  var daysOfData = 16;
  var weatherURL = 'http://api.openweathermap.org/data/2.5/forecast/daily?q=' + city + ',' + country + '&units=metric&cnt=' + daysOfData + '&APPID=' + appID;

  // d3.csv('aster_data.csv', function(error, data) {

  d3.json(weatherURL, function(error, data) {

    console.log(data);
//
    // console.log(data.length);

    // console.log(data);
    // debugger;

    data = data.list;

    console.log(data);


    data.forEach(function(d) {
      d.width  =  360 / data.length;
    });

    // console.log(data);


    // for (var i = 0; i < data.score; i++) { console.log(data[i].id) }

    var path = svg.selectAll(".solidArc")
        .data(pie(data))
        .enter().append("path")
        // TODO: Work out how to get some colour back in
        .attr("fill", function(d) { return d.data.color; })
        .attr("class", "solidArc")
        .attr("stroke", "gray")
        .attr("d", arc)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    var outerPath = svg.selectAll(".outlineArc")
        .data(pie(data))
        .enter().append("path")
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("class", "outlineArc")
        .attr("d", outlineArc);


    // calculate the weighted mean score
    // var score =
    //   data.reduce(function(a, b) {
    //     //console.log('a:' + a + ', b.score: ' + b.score + ', b.weight: ' + b.weight);
    //     return a + (b.score * b.weight);
    //   }, 0) /
    //   data.reduce(function(a, b) {
    //     return a + b.weight;
    //   }, 0);

    // svg.append("svg:text")
    //   .attr("class", "aster-score")
    //   .attr("dy", ".35em")
    //   .attr("text-anchor", "middle") // text-align: right
    //   .text(Math.round(score));

  });

};

$( document ).ready(function() {
  $( "#search" ).click(function() {
    var city = $('#city').val();
    var country = $('#country').val();
    d3render(city, country);
  });
});
