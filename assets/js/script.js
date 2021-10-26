var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#cities")
var apiKey = "c155a3cc1e033984455148d28a12c930"
var locationEl = document.querySelector("#current-location")
var timeEl = document.querySelector("#current-time")

/* City Search Section */

var formSubmitHandler = function(event) {
  event.preventDefault();

  // get value form input element
  var cityName = cityInputEl.value.trim();

  if (cityName) {
    getWeatherData(cityName);

    // clear old content
    locationEl.value = "";
    timeEl.value = "";
    // Temp.value/content = "";
    // Wind.value/content = "";
    // Humidity.value/content = "";
    // UVIndex.value/content = "";
  } else {
    alert("Please enter the name of a city")
  }
}

var getWeatherData = function(city) {
  // format openweather api url
  var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey

  fetch(apiUrl).then(function(response) {
    // request was successful
    if (response.ok) {
      response.json().then(function(data) {
        displayWeather(data);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  })
  .catch(function() {
    alert("Unable to connect to OpenWeather");
  });
};

var displayWeather = function(data) {
  // Today Section

  // Current Location
  // let locationEl = document.querySelector("#current-location")
  let currentLocation = data.name;

  locationEl.append(currentLocation);

  // Current Time
  // let timeEl = document.querySelector("#current-time")
  let currentTime = moment().format('LT');
  timeEl.append("As of " + currentTime);
}



// add event listeners to form and button container
cityFormEl.addEventListener("submit", formSubmitHandler);

