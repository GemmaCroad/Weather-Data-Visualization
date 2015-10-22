var d3render = function(city, country) {

  // 
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
      returnValue = ( radius - innerRadius ) * ( d.data.temp.min / 100.0 ) + 75;
      // console.log("returnValue: " + returnValue + ", d.data.temp.min: " + d.data.temp.min);
      return returnValue;
    })
    // .innerRadius(radius - innerRadius) * (d.data.temp.min / 100.0) +
    .outerRadius(function (d) {
      returnValue = ( radius - innerRadius ) * ( d.data.temp.max / 100.0 ) + innerRadius + 75;
                      // 500  - 250          * 19.23 / 100               + 200
                      // 250                * 0.1923                    + 200
      // console.log("returnValue: " + returnValue + ", d.data.temp.max: " + d.data.temp.max);
      return returnValue;
    });
]
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

    // console.log(data.length);
    // console.log(data);
    // debugger;

    data = data.list;
    // debugger;

    var min = data[0].temp.min;
    var max = data[0].temp.max;

    for ( var i = 1; i < data.length; i++ ) {

      // Works out the min (if the current days minimum is less than the variable min)
      var minimumTemp = data[i].temp.min;
      if ( minimumTemp < min ) {
        min = minimumTemp;
      }

      // Works out the max (if the current days maximum is greater than the variable max)
      var maximumTemp = data[i].temp.max;
      if ( maximumTemp > max ) {
        max = maximumTemp;
      }
    };

    console.log( "Minimum: ", min, " Maximum: ", max );
    // console.log(data);

    var maxTemperature = max;
    var minTemperature = min;

    // the total number of hex code colors available
    var maxColors = 16777216;

    // maxTemp - minTemperature
    var numberOfColors = maxTemperature - minTemperature;

    // works out the "size" of each hex color for the temp range from the data set
    var sizeOfEachColor = maxColors / numberOfColors;

    console.log(sizeOfEachColor);

    for (var i=0; i < numberOfColors; i++) {
      var color = "#" + (Math.round(i * sizeOfEachColor)).toString( 16 )
      console.log(color);
    }

    data.forEach(function(d) {
      // works out the size of each segment based on the number of items in data returned from the search
      d.width  =  360 / data.length;
    });

    var path = svg.selectAll(".solidArc")
        .data(pie(data))
        .enter().append("path")
        // .attr("fill", "url(#gradient)")

        .attr("fill", function(d) { 

          // need to rotate the gradient so that it starts from the center?

          // var rotateValue = "rotate(" + Math.round(d.startAngle * 60) + ")";
          // var rotateValue = function(d) { return "rotate("} + Math.round((d.startAngle + (d.endAngle - d.startAngle)/2) * 57.3) + "50,50"; 

          var gradient = svg.append("svg:defs")
            .append("svg:linearGradient")
              .attr("id", "gradient")
              .attr("x1", "0%")
              .attr("y1", "0%")
              .attr("x2", "100%")
              .attr("y2", "100%")
              .attr("spreadMethod", "pad")
              // .attr("gradientTransform", function(d) { return "rotate(" + Math.round((d.startAngle + (d.endAngle - d.startAngle)/2) * 57.3) + "50,50)"; })
              // .attr("gradientTransform", rotateValue)
          gradient.append("svg:stop")
              .attr("offset", "0%")
              .attr("stop-color", "#00000f")
              .attr("stop-opacity", 1);
          gradient.append("svg:stop")
              .attr("offset", "100%")
              .attr("stop-color", "#cc0000")
              .attr("stop-opacity", 1);

          // console.log(d);      
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
      .attr("text-anchor", "middle");

      // .text(Math.round(d));
  });

};

$( document ).ready(function() {

  $( "#search" ).click(function() {

    var city = $('#city').val();
    var country = $('#country').val();
    d3render(city, country);
  });
});



  