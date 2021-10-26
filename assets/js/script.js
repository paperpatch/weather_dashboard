var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#cities");
var apiKey = "c155a3cc1e033984455148d28a12c930"
var locationEl = document.querySelector("#current-location");
var timeEl = document.querySelector("#current-time");
var tempEl = document.querySelector("#current-temp");
var tempMaxMinEl = document.querySelector("#current-maxminTemp");
var statusEl = document.querySelector("#current-status")
var weatherPicEl = document.querySelector("#current-picture");


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
  tempEl.append(currentTemp + " °F");

  // Current Outside Weather
  let currentWeather = data.weather[0].main
  statusEl.append(currentWeather);

  let currentWeatherID = parseInt(data.weather[0].id);

  if (currentWeatherID >= 200 && currentWeatherID <= 232 ) {
    // Thunderstorm
    weatherPicEl.classList.add("bi", "bi-cloud-lightning-rain");
  } else if (currentWeatherID >= 300 && currentWeatherID <= 321) {
    // Drizzle
    weatherPicEl.classList.add("bi", "bi-cloud-drizzle");
  } else if (currentWeatherID >= 500 && currentWeatherID <= 531) {
    // Rain
    weatherPicEl.classList.add("bi", "bi-cloud-rain-heavy");
  } else if (currentWeatherID >= 600 && currentWeatherID <= 622) {
    // Snow
    weatherPicEl.classList.add("bi", "bi-cloud-snow");
  } else if (currentWeatherID >= 701 && currentWeatherID <= 781) {
    // Other - Mist, Smoke, Haze, Dust, Fog, Ash, Squall, Tornado
    weatherPicEl.classList.add("bi", "bi-wind");
  } else if (currentWeatherID === 800) {
    // Clear
    weatherPicEl.classList.add("bi", "bi-sun");
  } else {
    // Cloudy
    weatherPicEl.classList.add("bi", "bi-cloudy");
  }

  // Current Max/Min Temp
  let currentMaxTemp = convertTempFahrenheit(parseInt(data.main.temp_max));
  let currentMinTemp = convertTempFahrenheit(parseInt(data.main.temp_min));
  tempMaxMinEl.append(currentMaxTemp + '° /' + currentMinTemp + '°');
}

var convertTempFahrenheit = function(kelvin) {
  let fahrenheit = (kelvin - 273.15) * (9/5) + 32;
  return (Math.round(fahrenheit));
}

// add event listeners to form and button container
cityFormEl.addEventListener("submit", formSubmitHandler);

