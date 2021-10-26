var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#cities");
var apiKey = "c155a3cc1e033984455148d28a12c930"
var locationEl = document.querySelector("#current-location");
var timeEl = document.querySelector("#current-time");
var tempEl = document.querySelector("#current-temp");
var tempMaxMinEl = document.querySelector("#current-maxminTemp");
var statusEl = document.querySelector("#current-status")
var tempCardFeels = document.querySelector("#temp-feels");
var tempCardMax = document.querySelector("#tempMax");
var tempCardMin = document.querySelector("#tempMin");


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
    timeEl.value = "";
    tempEl.value = "";
    tempMaxMinEl.value = "";
    statusEl.value = "";
    weatherPicEl = "";
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

  // Big Weather Pictures ICON
  let currentWeatherID = parseInt(data.weather[0].id);
  console.log(currentWeatherID);

  if (currentWeatherID >= 200 && currentWeatherID <= 232 ) {
    // Thunderstorm
    $("#current-picture").addClass("bi bi-cloud-lightning-rain");
  } else if (currentWeatherID >= 300 && currentWeatherID <= 321) {
    // Drizzle
    $("#current-picture").addClass("bi bi-cloud-drizzle");
  } else if (currentWeatherID >= 500 && currentWeatherID <= 531) {
    // Rain
    $("#current-picture").addClass("bi bi-cloud-rain-heavy");
  } else if (currentWeatherID >= 600 && currentWeatherID <= 622) {
    // Snow
    $("#current-picture").addClass("bi bi-cloud-snow");
  } else if (currentWeatherID >= 701 && currentWeatherID <= 781) {
    // Other - Mist, Smoke, Haze, Dust, Fog, Ash, Squall, Tornado
    $("#current-picture").addClass("bi bi-wind");
  } else if (currentWeatherID === 800) {
    // Clear
    $("#current-picture").addClass("bi bi-sun");
  } else {
    // Cloudy
    $("#current-picture").addClass("bi bi-cloudy");
  }

  // Current Max/Min Temp
  let currentMaxTemp = convertTempFahrenheit(parseInt(data.main.temp_max));
  let currentMinTemp = convertTempFahrenheit(parseInt(data.main.temp_min));
  tempMaxMinEl.append(currentMaxTemp + '° /' + currentMinTemp + '°');


  // Temperature Card
  let tempFeels = convertTempFahrenheit(parseInt(data.main.feels_like));
  tempCardFeels.append(tempFeels);
  tempCardMax.append(currentMaxTemp);
  tempCardMin.append(currentMinTemp);
}

var convertTempFahrenheit = function(kelvin) {
  let fahrenheit = (kelvin - 273.15) * (9/5) + 32;
  return (Math.round(fahrenheit));
}

// add event listeners to form and button container
cityFormEl.addEventListener("submit", formSubmitHandler);

