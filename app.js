var authKey = "75c9c3885f537245e3ffc95d9728c4b1";

function buildWeatherURL(location, apiKey) {
  return (
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    location +
    "&units=imperial&appid=" +
    apiKey
  );
}

function buildForecastURL(location, apiKey) {
  return (
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    location +
    "&units=imperial&appid=" +
    apiKey
  );
}

function buildUVURL(apiKey, coordLat, coordLon) {
  return (
    "https://api.openweathermap.org/data/2.5/uvi?" +
    "&lat=" +
    coordLat +
    "&lon=" +
    coordLon +
    "&appid=" +
    apiKey
  );
}

function callAPI(URL) {
  return $.ajax({
    url: URL,
    method: "GET",
  });
}

var fiveDayData, weatherData, uvData;

$("#search-btn").on("click", function (event) {
  event.preventDefault();
  var location = $("#search-input").val();
  $("#search-input").val("");

  // Calling series of 3 api in promise chain
  callAPI(buildForecastURL(location, authKey)).then(function (resp) {
    console.log("five day output", resp);
    fiveDayData = resp;
    callAPI(buildWeatherURL(location, authKey)).then(function (resp) {
      console.log("weather output", resp);
      weatherData = resp;
      var coordLon = resp.coord.lon;
      var coordLat = resp.coord.lat;
      callAPI(buildUVURL(authKey, coordLat, coordLon)).then(function (resp) {
        console.log("uv output", resp);
        uvData = resp;
        bindDataToDocument();
      });
    });
  });
});

function bindDataToDocument() {
  for (let i = 0; i < fiveDayData.list.length; i++) {
    if (fiveDayData.list[i].dt_txt.indexOf("12:00:00") !== -1) {
      // DOM Forecast
      var forecastIcon = fiveDayData.list[i].weather[0].icon;
      var forecastIconUrl =
        "http://openweathermap.org/img/w/" + forecastIcon + ".png";
      var forecastDate = fiveDayData.list[i].dt_txt;
      var forecastTemp = fiveDayData.list[i].main.temp;
      var forecastHum = fiveDayData.list[i].main.humidity;

      $("#forecast").append(
        `
       <div class="card" id="forecast-card">
       <div class="card-header">
       ${forecastDate}
       </div
          <div class="card-body">
             <h5 class="card-title">Temp: ${forecastTemp}</h5>
             <img id="forecast-icon" src="${forecastIconUrl}" alt=""> 
             <p class="card-text">Humidity: ${forecastHum}</p> 
          </div>
        </div>
       <br>
        `
      );
    }
  }

  // DOM Current Weather
  var iconCode = weatherData.weather[0].icon;
  var iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

  $("#location").append(
    weatherData.name + " " + new Date().toLocaleDateString()
  );
  $("#wicon").attr("src", iconUrl);
  $("#temp").append("temperature: " + weatherData.main.temp);
  $("#humidity").append("humidity: " + weatherData.main.humidity);
  $("#windspeed").append("wind speed: " + weatherData.wind.speed);
  $("#uv-index").append("uv index: " + uvData.value);
}