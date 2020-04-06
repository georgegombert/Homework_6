let citySearch ;
let apiHistory = JSON.parse(localStorage.getItem("searchHistory"));
const key = "95ff62280315d2853674fe9ff4f63c2d";

appendHistory(); // initalizing search history on page open

// getting the search field value
function search(){
    event.preventDefault();
    citySearch = $("#citySearch").val().trim();
    $("#citySearch").val("");
}

// add searched item to the history object and set max history count to 8
function updateApiHistory(result){
    if(apiHistory.length < 8){
        apiHistory.push(result);
        localStorage.setItem("searchHistory", JSON.stringify(apiHistory));
    } 
    else{
        apiHistory = apiHistory.slice(1);
        apiHistory.push(result);
        localStorage.setItem("searchHistory", JSON.stringify(apiHistory));
    }
}

// print the search history object to the screen
function appendHistory(){
    if(!apiHistory){
        apiHistory = apiHistory = [];
        return;
    }
    $("#searchHistory").empty();
    for(city in apiHistory){
        let historyDivNode = $("<div>");
        historyDivNode.addClass("history-div");
        historyDivNode.text(apiHistory[city].name);
        $("#searchHistory").prepend(historyDivNode);
        // if(apiHistory[city].name == historyDivNode.text()){
        //     console.log("same");
        // } else{
        //     $("#searchHistory").prepend(historyDivNode);
        // }
    }
}

// main function that retrieves api information and prints weather to screen
function getWeather(){
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q="+citySearch+"&appid="+key+"",
        method: "GET"
    })
    .then(function(result) {
        //printing current weather
        $("#currentCity").text(""+result.name+" ("+moment().format("M/D/YY")+")");
        $("#currentIcon").attr({"src" : "https://openweathermap.org/img/wn/"+result.weather[0].icon+"@2x.png", "alt" : "Weather Icon"});
        $("#currentTemp").text(""+Math.round(((result.main.temp-273.15)*1.8)+32)+" ˙F");
        $("#currentHumidity").text(""+result.main.humidity+" %");
        $("#currentWind").text(""+result.wind.speed+" MPH");
        
        // functions for printing future weather and appending the history
        updateApiHistory(result);
        appendHistory();
        getUV(result.coord.lat, result.coord.lon); // uses latitude and longitude coordinates to get UV index
        getFutureWeather(result.id); //uses city id to get forcast
    })
    .catch(function(error){
        alert("Please enter valid city");
    });
}

function getUV(latitude, longitude){
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/uvi?appid="+key+"&lat="+latitude+"&lon="+longitude+"",
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
        url: "https://api.openweathermap.org/data/2.5/forecast?id="+cityId+"&appid="+key+"",
        method: "GET"
    })
    .then(function(result){
        let weatherDayIndex = [3,11,19,27,35]
        for(day in weatherDayIndex){
            let dateFormatted = moment(result.list[weatherDayIndex[day]].dt_txt).format("M/D/YY");
            $("#futureDate"+day+"").text(dateFormatted);
            $("#futureIcon"+day+"").attr({"src" : "https://openweathermap.org/img/wn/"+result.list[weatherDayIndex[day]].weather[0].icon+"@2x.png", "alt" : "Weather Icon", "class" : "future-icon"});
            $("#temp"+day+"").text(Math.round(((result.list[weatherDayIndex[day]].main.temp-273.15)*1.8)+32)+" ˙F");
            $("#humidity"+day+"").text(""+result.list[weatherDayIndex[day]].main.humidity+" %");
        }
    })
    .catch(function(error){
        console.log(error);
    });
}


// event listeners for search form and history buttons
$("#searchButton").click(function(){
    search();
    getWeather();
});

$("#citySearch").keydown(function(event){
    if(event.which == 13){
        search();
        getWeather();
    }
})

$("#searchHistory").click(function(event){
    let selection = event.target;
    if(selection.className == "history-div"){
        citySearch = selection.innerText;
        getWeather();
    }
})
// end event listeners 