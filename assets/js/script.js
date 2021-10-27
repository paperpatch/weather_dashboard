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
var ultraviolet = document.querySelector("#ultraviolet");


function clock() {
  let today = new Date();
  let formatToday = moment(today).format('MMMM Do YYYY');
  let formatTime = moment(today).format('h:mm a')
  $("#currentDay").html(formatToday);
  $("currentTime").html(formatTime);
  setInterval(clock, 60 * 1000);
}
clock();


/* City Search Section */

var formSubmitHandler = function(event) {
  event.preventDefault();

  // get value form input element
  var cityName = cityInputEl.value.trim();

  if (cityName) {
    // 




    // clear old content
    $("#current-location").empty();
    $("#current-time").empty();
    $("#current-temp").empty();
    $("#current-maxminTemp").empty();
    $("#current-status").empty();
    $("#temp-feels").empty();
    $("#tempMax").empty();
    $("#tempMin").empty();
    $("#ultraviolet").empty();
    $("#wind-speed").empty();
    $("#wind-direction").empty();
    $("#humidity").empty();

    getWeatherData(cityName);
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
    alert("Unable to connect to OpenWeather Current Weather For One Location API");
  });
};

var displayWeather = function(data) {
  // Today Section //
  // Current Location
  console.log(data)
  let currentLocation = data.name;
  let countryLocation = data.sys.country;
  locationEl.append(currentLocation + ", " + countryLocation);

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

  // Based on Open Weather Map weather conditions codes
  // https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2

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

  // Card Sections //
  // Temperature Card
  let tempFeels = convertTempFahrenheit(parseInt(data.main.feels_like));
  tempCardFeels.append(tempFeels);
  tempCardMax.append(currentMaxTemp);
  tempCardMin.append(currentMinTemp);

  // Wind Card
  let windSpeed = convertMPStoMPH(parseInt(data.wind.speed));
  let windDirection = convertDegDirection(parseInt(data.wind.deg));
  $("#wind-speed").append(windSpeed + " mph");
  $("#wind-direction").append(windDirection);

  // Humidity Card
  let humidity =  data.main.humidity;
  $("#humidity").append(humidity + " %");

  // UV Card & 5-Day Forecast
  // Need lon and lat from city from different API
  let cityLon = data.coord.lon;
  let cityLat = data.coord.lat;
  getUV(cityLat, cityLon);

}

// Get Other API function
var getUV = function(lat, lon) {
  var otherApiKey = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat +"&lon=" + lon +"&exclude={part}&appid=" + apiKey;

  fetch(otherApiKey)
  .then(function(response) {
    if (response.ok) {
      response.json()
      .then(function(data) {
        displayClimate(data);
      })
    } else {
      alert("Error: " + response.statusText);
    }
  })
  .catch(function() {
    alert("Unable to connect to OpenWeather One Call API")
  })
}

// UV and 5-Day Forecast Section

var displayClimate = function(data) {
  console.log(data);
  // UV Section
  let currentUV = data.current.uvi;
  if (currentUV >= 11) {
    $("#ultraviolet").addClass("uv-danger")
    ultraviolet.append(currentUV);
  } else if (currentUV >= 8 && currentUV < 11) {
    $("#ultraviolet").addClass("uv-veryhigh")
    ultraviolet.append(currentUV);
  } else if (currentUV >= 6 && currentUV < 8) {
    $("#ultraviolet").addClass("uv-high")
    ultraviolet.append(currentUV);
  } else if (currentUV >= 3 && currentUV < 6) {
    $("#ultraviolet").addClass("uv-moderate")
    ultraviolet.append(currentUV);
  } else if (currentUV >=0 && currentUV < 3) {
    $("#ultraviolet").addClass("uv-low")
    ultraviolet.append(currentUV);
  } else {
    ultraviolet.append(currentUV);
  }

  // 5-day forecast
  // clear previous data
  $("#forecast").empty();

  // loop over available days in data
  for (var i = 1; i < data.daily.length-1; i++) {
    // convert unix time to usable data.
    let timeUnix = moment.unix(data.daily[i].dt);
    let timeSplit = String(timeUnix._d);
    let timeSlice = timeSplit.split(/\s+/).slice(0,3).join(" ");

    // add new div (column)
    // for each day, add a column, card and card-body
    var newDiv = document.createElement("div")
    newDiv.className = "dailyForecast";
    $(".dailyForecast").addClass("col-1");
    $("#forecast").append(newDiv);

    // new card and header (header is time)
    let forecastCard = $(".dailyForecast").addClass("card mb-3").attr("style", "max-width: 16em");
    let cardHeaderEl = $("<h5>").addClass("card-title").text(timeSlice);
    let cardBodyEl = $("<div>").addClass("card-body");
    forecastCard.append(cardBodyEl);

    // new picture icon, temperature, wind and humidity under card body
    let forecastIconEl = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png").addClass("card-title");
    let tempF = (Math.round((data.daily[i].temp.day -273.15) * 1.80 + 32));
    let forecastTempEl = $("<div>").addClass("card-title").text("Temp: " + tempF + " \u00B0" + "F");
    let forecastWindEl = $("<div>").addClass("card-title").text("Wind: " + data.daily[i].wind_speed + " mps");
    let forecastHumEl = $("<div>").addClass("card-title").text("Humidity: " + data.daily[i].humidity + " %");

    cardBodyEl.append(cardHeaderEl, forecastIconEl, forecastTempEl, forecastWindEl, forecastHumEl);
  }
}


// Various Convert Function Section

var convertTempFahrenheit = function(kelvin) {
  let fahrenheit = (kelvin - 273.15) * (9/5) + 32;
  return (Math.round(fahrenheit));
}

var convertMPStoMPH = function(mps) {
  return mph = (mps * 2.236936).toFixed(2);
}

var convertDegDirection = function(deg) {
  if (deg >= 349 && deg <= 360) {
    return "N";
  } else if (deg >= 0 && deg <= 11) {
    return "N";
  } else if (deg >= 012 && deg <= 33) {
    return "NNE";
  } else if (deg >= 034 && deg <= 56) {
    return "NE";
  } else if (deg >= 57 && deg <= 78) {
    return "ENE";
  } else if (deg >= 79 && deg <= 101) {
    return "E";
  } else if (deg >= 102 && deg <= 123) {
    return "ESE"
  } else if (deg >= 124 && deg <= 146) {
    return "SE"
  } else if (deg >= 147 && deg <= 168) {
    return "SSE"
  } else if (deg >= 169 && deg <= 191) {
    return "S"
  } else if (deg >= 214 && deg <= 236) {
    return "SW"
  } else if (deg >= 237 && deg <= 258) {
    return "WSW"
  } else if (deg >= 259 && deg <= 281) {
    return "W"
  } else if (deg >= 282 && deg <= 303) {
    return "WNW"
  } else if (deg >= 304 && deg <= 326) {
    return "NW"
  } else if (deg >= 327 && deg <= 348) {
    return "NNW"
  } else {
    return "Calm Winds"
  }
}

// add event listeners to form and button container
cityFormEl.addEventListener("submit", formSubmitHandler);

