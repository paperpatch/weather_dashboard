var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#cities");
var apiKey = "c155a3cc1e033984455148d28a12c930"
var locationEl = document.querySelector("#current-location");
var timeEl = document.querySelector("#current-time");
var tempEl = document.querySelector("#current-temp");

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
  console.log(data)
  let currentLocation = data.name;
  locationEl.append(currentLocation);

  // Current Time
  let currentTime = moment().format('LT');
  timeEl.append("As of " + currentTime);

  // Current Temp
  let currentTemp = convertTempFahrenheit(parseInt(data.main.temp));
  console.log(currentTemp);
  tempEl.append(currentTemp + " °F");

}

var convertTempFahrenheit = function(kelvin) {
  let fahrenheit = (kelvin - 273.15) * (9/5) + 32;
  return (Math.round(fahrenheit * 100) / 100);
}

// add event listeners to form and button container
cityFormEl.addEventListener("submit", formSubmitHandler);

