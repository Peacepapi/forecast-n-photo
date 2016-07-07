
var map = new google.maps.Map(document.createElement('div'));

$('.search').bind("submit", function(e) {

  e.preventDefault();
  e.stopPropagation();
  $('#images').empty();
  var user_input = $('#user_input').val();

  var request = {
    query: user_input
  };
  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
  function callback(results, status){
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      var lat = results[0].geometry.location.lat();
      var lng = results[0].geometry.location.lng();
      getWeather(lat,lng);
      getPhoto(lat,lng);
    }
  }
})
function getWeather(lat,lng){
  $.ajax({
    type: "GET",
    dataType: "jsonp",
    url: FORECAST_BASE_URL + lat + ',' + lng,
    success: function(response) {
      //  CURRENT WEATHER
      var timeZone = response.timezone.replace('_', ' ').split('/');
      $('#zone').append(timeZone[1] + " Region");
      $('#summary').append(response.currently.summary);
      $('.temp-icon').attr('src','img/' + response.currently.icon + '.svg');
      $('#temp').prepend(Math.round(response.currently.temperature));
      //$('temp-label');
      $('#precip').append(response.currently.precipProbability*100  + "%");
      $('#humidity').append(response.currently.humidity*100 + "%")
      $('#wind').append(response.currently.windSpeed + " MPH");
      //  HOURLY
      $.each(response.hourly.data, function(index, value) {
        $('.hourly').append(
          $('<div>').addClass('box').append(
            $('<div/>').addClass('hourly-summary summary').append(value.summary),
            $('<img/>').addClass('hourly-temp-icon icon').attr('src','img/' + value.icon + '.svg'),
            $('<div/>').addClass('hourly-temp temp').append(value.temperature),
            $('<div/>').addClass('hourly-precip precip').append( "Precipitation: " + value.precipProbability*100 + "%"),
            $('<div/>').addClass('hourly-humidity humidity').append( "Humidity: " + value.humidity*100 + "%"),
            $('<div/>').addClass('hourly-wind wind').append( "Wind: " + value.windSpeed + " MPH")
          )
        )
          if(index == 10) return false;
      });



      console.log(response);
    }
  })
}

function getPhoto(lat,lng){
  $.ajax({
    type: "GET",
    dataType: "jsonp",
    jsonp: "jsoncallback",
    url: FLICKR_BASE_URL +
      "&privacy_filter=1" +
      "&lat=" + lat + "&lon=" + lng +
      "&format=json",
    success: function (response) {
      var link = "";
      $.each(response.photos.photo, function(index,value){
        link = "http://farm" + value.farm +
               ".staticflickr.com/" + value.server +
               "/" + value.id + "_" + value.secret + "_m.jpg";
        $('<img/>').attr('src', link).appendTo('#images');
        if(index === 10) {return false;}
      })
    }
  })
}
