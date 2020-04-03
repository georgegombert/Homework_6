let citySearch ;
let history = [];
let apiHistory = [];

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

function getWeatherInfo(){
    let key = "95ff62280315d2853674fe9ff4f63c2d";
    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/weather?q="+citySearch+"&appid="+key+"",
        method: "GET"
    })
    .then(function(result) {
        // console.log(result);
        apiHistory.push(result);
        // console.log(apiHistory);
        localStorage.setItem('apiHistory', JSON.stringify(apiHistory));
    })
    .catch(function(error){
        console.log(error);
    });
}

function getLocalData(){
    let test = JSON.parse(localStorage.getItem('apiHistory'));
    console.log(test);
}


$("#searchButton").click(function(){
    search();
    getWeatherInfo();
    appendHistory();
    getLocalData();
});

$("#citySearch").keydown(function(event){
    if(event.which == 13){
        search();
        getWeatherInfo();
        appendHistory();
        getLocalData();
    }
})