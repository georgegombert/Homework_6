let citySearch ;
let history = [];
let apiHistory = [];
let currentSearch;
let key = "95ff62280315d2853674fe9ff4f63c2d";

localStorage.removeItem('apiHistory');

function search(){
    event.preventDefault();
    citySearch = $("#citySearch").val().trim();
    console.log(citySearch);
    history.push(citySearch);
    $("#citySearch").val("");
}


function appendHistory(){
    $("#searchHistory").empty();
    for(city in history){
        let historyDivNode = $("<div>");
        historyDivNode.addClass("history-div");
        historyDivNode.text(history[city]);
        $("#searchHistory").prepend(historyDivNode);
    }
}

function getCurrentWeather(){
    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/weather?q="+citySearch+"&appid="+key+"",
        method: "GET"
    })
    .then(function(result) {
        $("#currentCity").text(""+result.name+" ("+moment().format("M/D/YY")+")");
        $("#currentIcon").attr({"src" : "http://openweathermap.org/img/wn/"+result.weather[0].icon+"@2x.png", "alt" : "Weather Icon"});
        $("#currentTemp").text(""+Math.round(((result.main.temp-273.15)*1.8)+32)+" ˙F");
        $("#currentHumidity").text(""+result.main.humidity+" %");
        $("#currentWind").text(""+result.wind.speed+" MPH");

        getCurrentUV(result.coord.lat, result.coord.lon);
        getFutureWeather(result.id);
    })
    .catch(function(error){
        console.log(error);
    });
}


function getCurrentUV(latitude, longitude){
    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/uvi?appid="+key+"&lat="+latitude+"&lon="+longitude+"",
        method: "GET"
    })
    .then(function(result) {
        let uvDiv = $("#currentUV");
        uvDiv.text(result.value);
        switch(true){
            case (result.value <= 5):
                uvDiv.css("background-color", "green");
            break;
            case (result.value > 5 && result.value <= 7):
                uvDiv.css("background-color", "#EED202");
            break;
            case (result.value > 7 && result.value <= 10):
                uvDiv.css("background-color", "red");
            break;
        }
    })
    .catch(function(error){
        console.log(error);
    });
}

function getFutureWeather(cityId){
    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/forecast?id="+cityId+"&appid="+key+"",
        method: "GET"
    })
    .then(function(result){
        let weatherDayIndex = [3,11,19,27,35]
        for(day in weatherDayIndex){
            let dateFormatted = moment(result.list[weatherDayIndex[day]].dt_txt).format("M/D/YY");
            $("#futureDate"+day+"").text(dateFormatted);
            $("#futureIcon"+day+"").attr({"src" : "http://openweathermap.org/img/wn/"+result.list[weatherDayIndex[day]].weather[0].icon+"@2x.png", "alt" : "Weather Icon", "class" : "future-icon"});
            $("#temp"+day+"").text(Math.round(((result.list[weatherDayIndex[day]].main.temp-273.15)*1.8)+32)+" ˙F");
            $("#humidity"+day+"").text(""+result.list[weatherDayIndex[day]].main.humidity+" %");
        }
        
        console.log(result);
    })
    .catch(function(error){
        console.log(error);
    });
}

$("#searchButton").click(function(){
    search();
    getCurrentWeather();
    appendHistory();
});

$("#citySearch").keydown(function(event){
    if(event.which == 13){
        search();
        getCurrentWeather();
        appendHistory();
    }
})