let citySearch ;
let history = [];
let apiHistory = [];
let currentSearch;

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
    let key = "95ff62280315d2853674fe9ff4f63c2d";
    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/weather?q="+citySearch+"&appid="+key+"",
        method: "GET"
    })
    .then(function(result) {
        apiHistory.push(result);
        localStorage.setItem('apiHistory', JSON.stringify(apiHistory));
        
        $("#currentCity").text(result.name);
        $("#currentIcon").attr({"src" : "http://openweathermap.org/img/wn/"+result.weather[0].icon+"@2x.png", "alt" : "Weather Icon"});
        $("#currentTemp").text(""+Math.round(((result.main.temp-273.15)*1.8)+32)+" ˙F");
        $("#currentHumidity").text(""+result.main.humidity+" %");
        $("#currentWind").text(""+result.wind.speed+" MPH");

        let latitude = result.coord.lat;
        let longitude = result.coord.lon;
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/uvi?appid="+key+"&lat="+latitude+"&lon="+longitude+"",
            method: "GET"
        })
        .then(function(result) {
            $("#currentUV").text(result.value);
        });
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