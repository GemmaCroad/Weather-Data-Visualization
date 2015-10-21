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
      return d.data.dt + ": <span style='color:#63afae'>Min: " + d.data.temp.min + ", Max: " + d.data.temp.max + "</span>";
    });

  var arc = d3.svg.arc()
    .innerRadius(function (d) {
      returnValue = (radius - innerRadius) * (d.data.temp.min / 100.0) + 75;
      // console.log("returnValue: " + returnValue + ", d.data.temp.min: " + d.data.temp.min);
      return returnValue;
    })
    // .innerRadius(radius - innerRadius) * (d.data.temp.min / 100.0) +
    .outerRadius(function (d) {
      returnValue = (radius - innerRadius) * (d.data.temp.max / 100.0) + innerRadius + 75;
//                     500  - 250          * 19.23 / 100               + 200
//                      250                * 0.1923                    + 200
      // console.log("returnValue: " + returnValue + ", d.data.temp.max: " + d.data.temp.max);
      return returnValue;
    });

  // var outlineArc = d3.svg.arc()
  //         .innerRadius(innerRadius)
  //         .outerRadius(radius);

  // removes previous data 
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


  d3.json(weatherURL, function(error, data) {

    // console.log(data);
//
    // console.log(data.length);

    // console.log(data);
    // debugger;

    data = data.list;

    // console.log(data);


    data.forEach(function(d) {
      d.width  =  360 / data.length;
    });

    // console.log(data);

    // for (var i = 0; i < data.score; i++) { console.log(data[i].id) }

    var path = svg.selectAll(".solidArc")
        .data(pie(data))
        .enter().append("path")
        // .attr("fill", "url(#gradient)")

        .attr("fill", function(d) { 

          // need to rotate the gradient so that it starts from the center?
          var rotateValue = "rotate(" + Math.round(d.startAngle * 60) + ")";

          var gradient = svg.append("svg:defs")
            .append("svg:linearGradient")
              .attr("id", "gradient")
              .attr("x1", "0%")
              .attr("y1", "0%")
              .attr("x2", "100%")
              .attr("y2", "100%")
              .attr("spreadMethod", "pad")
              // .attr("gradientTransform", rotateValue)
          gradient.append("svg:stop")
              .attr("offset", "0%")
              .attr("stop-color", "#00000f")
              .attr("stop-opacity", 1);
          gradient.append("svg:stop")
              .attr("offset", "100%")
              .attr("stop-color", "#cc0000")
              .attr("stop-opacity", 1);

          console.log(d);      

          // return gradient;
          return "url(#gradient)"
       
        })

        // .attr("fill", function(d) { console.log(d); return d.data.color; })
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

    svg.append("svg:text")
      .attr("class", "value")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle"); // text-align: right

      // .text(Math.round(d));

   // svg.append("linearGradient")
   //   .attr("id", "temperature-gradient")
   //   .attr("gradientUnits", "userSpaceOnUse")
   //   .attr("x1", "0%").attr("y1", "100%")
   //   .attr("x2", "0%").attr("y2", "100%")
   //   .selectAll("stop")
   //   .data([
   //     {offset: "0%", color: "#FF0000"},
   //     {offset: "100%", color: "#FF00FF"}
   //   ])
   //   .enter().append("stop")
   //   .attr("offset", function(d) { console.log(d.offset); return d.offset; })
   //   .attr("stop-color", function(d) { console.log(d.color);  return d.color; });


  });

};

$( document ).ready(function() {

  // needs to be max and min across ALL days
  var maxTemperature = 37;
  var minTemperature = 10;
  
  var maxColors = 16777216;

  // maxTemp - minTemperature
  var numberOfColors = 27;
  var sizeOfEachColor = maxColors / numberOfColors;

  console.log(sizeOfEachColor);

  for (var i=0; i < numberOfColors; i++) {

    var color = "#" + (Math.round(i * sizeOfEachColor)).toString( 16 )

    console.log(color);

  }

  $( "#search" ).click(function() {
    var city = $('#city').val();
    var country = $('#country').val();
    d3render(city, country);
  });
});



