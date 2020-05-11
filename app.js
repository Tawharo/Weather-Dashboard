$(document).ready(function () {

    // I can't get the window.onload function to work with the loadCities function. I was able to get some help but I couldn't incorporate the local storage for all cities to pop up when refreshed. I was only able to get the first city loaded. I was trying get the CSS added into the loadCities
    // function, but that didn't get done either. Thanks in advance for helping.

    window.onload = function () {
        loadCities();
    };

    function loadCities() {

        var newCity = $(".newCity");
        var cityInput = $(".city-input").val();
        var li = $("<li>").addClass("city-click").attr("style", "list-style-type: none;").text(cityInput);
        newCity.append(li);
        var cityInput = localStorage.getItem('city-input');
        console.log(cityInput);
        newCity.text(cityInput);
    }

    var searchBtn = $("#searchBtn");


    searchBtn.on("click", function (event) {
        event.preventDefault();
        var cityInput = $(".city-input").val();
        var cityData = $(".city-data");

        cityData.text(cityInput);

        var currentQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&appid=2c91858cdc5732c71063ad682162dea9";

        $.ajax({
            url: currentQueryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            var cityData = $(".city-data");
            cityData.attr("style", "margin-left: 5px;");
            var currentDate = new Date();
            var convertDate = currentDate.toLocaleDateString();
            cityData.text(response.name + " " + "(" + convertDate + ")");
            var iconcode = response.weather[0].icon;
            var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
            var sideIcon = $(".sideIcon").attr("src", iconurl);
            sideIcon.append(iconurl);
            var farenheit1 = (response.main.temp - 273.15) * 1.80 + 32;
            farenheit1 = Math.floor(farenheit1);
            var temp = $(".temp").attr("style", "margin-left: 5px;").text("Temperature: " + farenheit1 + " F");
            cityData.append(humid, windSpeed);
            var humid = $(".humidity").attr("style", "margin-left: 5px;").text("Humidty: " + response.main.humidity + " %");
            var windSpeed = $(".wind-speed").attr("style", "margin-left: 5px;").text("Wind Speed: " + response.wind.speed + " MPH");
            var lon1 = response.coord.lon;
            var lat1 = response.coord.lat;
            uvIndexVal(lon1, lat1);

            var cityInput = localStorage.getItem('city-input'); 
            localStorage.setItem('city-input', cityInput)
            console.log(cityInput);

        });


        function uvIndexVal(lon, lat) {

            var uvQueryURL = "http://api.openweathermap.org/data/2.5/uvi?appid=2c91858cdc5732c71063ad682162dea9&lat=" + lat + "&lon=" + lon;
            $.ajax({
                url: uvQueryURL,
                method: "GET"
            }).then(function (response) {
                console.log(response);
                var uvIndex = $(".uv-index");
                var indexVal = $("<span>").addClass("index-color").text(response.value);
                uvIndex.text("UV Index: ");
                uvIndex.append(indexVal)


                if (response.value <= 2) {
                    indexVal.addClass("low").attr("style", "background: green");
                } else if (response.value > 5) {
                    indexVal.addClass("severe").attr("style", "background: red");
                } else {
                    indexVal.addClass("moderate").attr("style", "background: yellow");
                }

            });


        }

        var fiveDayQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityInput + "&appid=2c91858cdc5732c71063ad682162dea9";

        $.ajax({
            url: fiveDayQueryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            var forecast5 = $(".container-footer");
            var row = $("<div class=\"row\">");
            forecast5.empty();
            forecast5.append(row);



            for (var i = 0; i < response.list.length; i++) {

                if (response.list[i].dt_txt.indexOf("18:00:00") !== -1) {


                    var column = $("<div class=\"col-md-2.5\">");
                    var card = $("<div>").addClass("card");
                    var cardBody = $("<div>").addClass("card-body bg-primary bodyWidth").attr("style", "background: lightblue;")
                    var cardTitle = $("<h5>").addClass("card-title");
                    var farenheit = (response.list[i].main.temp - 273.15) * 1.80 + 32;
                    farenheit = Math.floor(farenheit);
                    var temp = $("<p>").addClass("temp").text("Temperature: " + farenheit + " F");
                    var humid = $("<p>").addClass("humid").text("Humidity: " + response.list[i].main.humidity + " %");
                    var iconcode = response.list[i].weather[0].icon;
                    var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
                    var weather = $("<img>").addClass("weather").attr("src", iconurl);
                    var dateTime = response.list[i].dt_txt;
                    var dateTimeList = dateTime.split(' ');
                    var date = dateTimeList[0];
                    var splitDate = date.split('-');
                    var formattedDate = splitDate[1] + "/" + splitDate[2] + "/" + splitDate[0];
                    cardTitle.text(formattedDate);
                    var pOne = $("<p>").addClass("card-text");
                    cardBody.append(cardTitle, pOne, weather, temp, humid);
                    card.append(cardBody);
                    column.append(card);
                    row.append(column);

                }

            }

        });

        var newCity = $(".newCity");
        var cityInput = $(".city-input").val();
        var li = $("<li>").addClass("city-click").attr("style", "list-style-type: none;").text(cityInput);
        newCity.append(li);

        li.on("click", function (event) {
            event.preventDefault();
            console.log("clicked");
            cityData.text(li);

            var currentQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&appid=2c91858cdc5732c71063ad682162dea9";

            $.ajax({
                url: currentQueryURL,
                method: "GET"
            }).then(function (response) {
                console.log(response);

                var cityData = $(".city-data");
                cityData.attr("style", "margin-left: 5px;");
                var currentDate = new Date();
                var convertDate = currentDate.toLocaleDateString();
                cityData.text(response.name + " " + "(" + convertDate + ")");
                var iconcode = response.weather[0].icon;
                var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
                var sideIcon = $(".sideIcon").attr("src", iconurl);
                sideIcon.append(iconurl);
                var farenheit1 = (response.main.temp - 273.15) * 1.80 + 32;
                farenheit1 = Math.floor(farenheit1);
                var temp = $(".temp").attr("style", "margin-left: 5px;").text("Temperature: " + farenheit1 + " F");
                cityData.append(humid, windSpeed);
                var humid = $(".humidity").attr("style", "margin-left: 5px;").text("Humidty: " + response.main.humidity + " %");
                var windSpeed = $(".wind-speed").attr("style", "margin-left: 5px;").text("Wind Speed: " + response.wind.speed + " MPH");
                var lon1 = response.coord.lon;
                var lat1 = response.coord.lat;
                uvIndexVal(lon1, lat1);


            });


            function uvIndexVal(lon, lat) {

                var uvQueryURL = "http://api.openweathermap.org/data/2.5/uvi?appid=2c91858cdc5732c71063ad682162dea9&lat=" + lat + "&lon=" + lon;
                $.ajax({
                    url: uvQueryURL,
                    method: "GET"
                }).then(function (response) {
                    console.log(response);
                    var uvIndex = $(".uv-index");
                    var indexVal = response.value;
                    uvIndex.text("UV Index: " + indexVal);


                    if (response.value <= 2) {
                        indexVal.addClass("low").attr("style", "background: green");
                    } else if (response.value > 5) {
                        indexVal.addClass("severe").attr("style", "background: red");
                    } else {
                        indexVal.addClass("moderate").attr("style", "background: yellow");
                    }

                });

            }
            $.ajax({
                url: fiveDayQueryURL,
                method: "GET"
            }).then(function (response) {
                console.log(response);
                var forecast5 = $(".container-footer");
                var row = $("<div class=\"row\">");
                forecast5.empty();
                forecast5.append(row);



                for (var i = 0; i < response.list.length; i++) {

                    if (response.list[i].dt_txt.indexOf("18:00:00") !== -1) {


                        var column = $("<div class=\"col-md-2.5\">");
                        var card = $("<div>").addClass("card");
                        var cardBody = $("<div>").addClass("card-body bg-primary bodyWidth").attr("style", "background: lightblue;")
                        var cardTitle = $("<h5>").addClass("card-title");
                        var farenheit = (response.list[i].main.temp - 273.15) * 1.80 + 32;
                        farenheit = Math.floor(farenheit);
                        var temp = $("<p>").addClass("temp").text("Temperature: " + farenheit + " F");
                        var humid = $("<p>").addClass("humid").text("Humidity: " + response.list[i].main.humidity + " %");
                        var iconcode = response.list[i].weather[0].icon;
                        var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
                        var weather = $("<img>").addClass("weather").attr("src", iconurl);
                        var dateTime = response.list[i].dt_txt;
                        var dateTimeList = dateTime.split(' ');
                        var date = dateTimeList[0];
                        var splitDate = date.split('-');
                        var formattedDate = splitDate[1] + "/" + splitDate[2] + "/" + splitDate[0];
                        cardTitle.text(formattedDate);
                        var pOne = $("<p>").addClass("card-text");
                        cardBody.append(cardTitle, pOne, weather, temp, humid);
                        card.append(cardBody);
                        column.append(card);
                        row.append(column);

                    }

                }

            });


        });

    });

});