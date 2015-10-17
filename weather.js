$( document ).ready(function() {

	$('input').on('focus', function(){
		var full = $('#content').has('p').length ? true : false;
		if(full === false){
		  $('#content').empty();
		}
	});

  	var getWeather = function(){
	    var cityName = $('#cityName').val();
	    var countryName = $('#countryName').val();

    	if(cityName === '' || countryName === ''){

      		$('#content').html('Please enter city and country.');

    	} else {

      		$('#content').html('Your weather is on its way');

			$.ajax({

				type: 'GET',
				// url: 'http://api.openweathermap.org/data/2.5/forecast/city?id=524901&APPID={f3a5dd18c8a77128d0151472b2283866}',

      			// url: 'http://api.openweathermap.org/data/2.5/weather?q=' + cityName + ',' + countryName + '&lang=zh_tw',

      			url: 'http://api.openweathermap.org/data/2.5/forecast/daily?q=' + cityName + ',' + countryName + '&units=metric&cnt=16&APPID=f3a5dd18c8a77128d0151472b2283866',

      			dataType: 'jsonp',

      			success: function(data){

              // console.log(data);
              // console.log(data.list[8]);

              // $('#content').html("hello")
              // $('#content').html(data.city.coord.lat);

              console.log(this)

              // jQuery.each(data.list, function() {


              //   console.log(this.temp.day)


              // });

      			// 	if(data.message == 'Error: Not found city'){
    					// $('#content').html('Not found city');
	        // 		} else {
	        // 			$('#content').html(data.list[16]);
	        // 		}

      			}

      			// sucess: function(data){
      			// 	if(status.code == '200 OK'){
      			// 		$('#content').html(data.weather[0].main);
      			// 	} else {
      			// 		$('#content').html('Not found city');
      			// 	}
      			// }

      		});
    	}
    	return this;
    	console.log(this);

  	};

	$('#search').click(getWeather);
	$('input').on('keyup', function(e){
    	if(e.keyCode == 13){
      		getWeather();
    	}
  	});

});