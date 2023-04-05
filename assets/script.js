const API_KEY = "af8ca56afa425104e46913689c7da68c"; 
const inputEl = document.querySelector(".input");
const buttonEl = document.querySelector("#submit");
const clearEl = document.getElementById('clear');
const currentDiv = document.querySelector(".current");
const headingDiv = document.querySelector("#heading");
const citiesDiv = document.getElementById("cities");
const $hidden = document.querySelector(".is-hidden");
let citiesSearched = []; // This is an array that is empty here, but is being populated throughout the functions that will be used to set and pull data to and from local storage.
getStorage(); // This allows the user to have their data pulled upon loading the website. 

// // This function is using the openweatherAPI to fetch the data and coordinates that are being searched by the user. 
// In line 25 the function hideElements is being called to hide the start screen when a city has been searched. 
function getCityCoordinates(cityName) {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=3&appid=${API_KEY}`;

    fetch(url)
    .then(function(response){
        return response.json();
    }).then(function(data){
        console.log(data);
        if(data.length === 0){
            alert('Please spell the city name accurately!!')
        }else{
            hideElement();
            let latitude = data[0].lat;
            let longitude = data[0].lon;
            $hidden.setAttribute('class','column');   
            getLiveWeather(latitude,longitude);
            getForecast(latitude,longitude);
        }
    })
    .catch(function (error) {
        alert('Unable to fetch city coordinates. Please spell it correctly!');
    });    
}    

//gets current weather if we give latitude and longitude of the city
function getLiveWeather(lat,lon) {
    let currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`;
    fetch(currentWeatherURL)
    .then(function(response){
        return response.json();    
    }).then(function(data){
        renderLiveWeather(data);
    })
}

// This function is having the API pull the lat and lon coordiantes to then pull the forecast weather for the 5 day forecast. 
function getForecast(lat,lon) {
    let forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`;
    fetch(forecastURL)
    .then(function(response){
        return response.json()
    }).then(function(data){
        renderForecastWeather(data);
    })
}

// This takes the information that the API is pulling and then putting it on the screen for the user to see. 
function renderLiveWeather(data) {
    let icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;   
    headingDiv.children[0].textContent = data.name + ' (' + new Date().toLocaleDateString() + ')';
    headingDiv.children[1].setAttribute('src', icon);
    currentDiv.children[1].textContent = "Temp: " + data.main.temp + "°F";
    currentDiv.children[2].textContent = "Wind: " + data.wind.speed + "MPH";
    currentDiv.children[3].textContent = "Humidity: " + data.main.humidity + "%"; 
    setStorage(data.name);     
}

//renders forecast weather on the screen 
function renderForecastWeather(data) {
    let index = 0;
    let time = "09:00:00";
    //for loop to get the index of weather data for 9am next day
    for(let i=0; i< 10; i++){
        if(time === data.list[i].dt_txt.slice(11)){
            index = i;
            break;
        }
    }

    // This is a for loop that is taking the data for the 5 day forecast. 
    for(let i=index,j=1; i< 40; i +=8,j++){
        let $div = document.getElementById(`day${j}`);
        let icon = `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon.slice(0,2)}d@2x.png`;
        $div.children[0].textContent = data.list[i].dt_txt.slice(0,10);
        $div.children[1].setAttribute('src',icon)
        $div.children[2].textContent = "Temp: " + data.list[i].main.temp + "°F";
        $div.children[3].textContent = "Wind: " + data.list[i].wind.speed + "MPH";
        $div.children[4].textContent = "Humidity: " + data.list[i].main.humidity + "%";
    }
    
}   

// The function below has a goal of putting the cities that the user has searched in their local storage so it can be pulled in the future when the user loads the site.
// What it is saying below is that if the city that was searched is already in the local storage, return the function. 
// If the city that is searched is not already in the local storage, then push that city to the local storange in a JSON String format.
// Then create a button that contains the city name in it, that way that information can be used in the getCityCoordinates function. 
// It then appends all new cities to the bottom of the list. 
function setStorage(city){
    if(citiesSearched.includes(city)){
        return;
    }else {
        citiesSearched.push(city);
        localStorage.setItem("citiesSearched", JSON.stringify(citiesSearched));
        let $button = document.createElement("button");
            $button.textContent = city;
            $button.setAttribute('class', 'button is-fullwidth is-info city')
            citiesDiv.appendChild($button);
    }
}

// The function below is taking the data that is in the user's local storage and then using that data to populate the buttons with the city name in it.
// This allows the user to be able to use the getCityCoordinates function based on their prior searches, even after the page was just loaded. 
function getStorage(){
    let dummy = JSON.parse(localStorage.getItem("citiesSearched"));
    if(dummy){
        citiesSearched  = dummy;
        citiesSearched.forEach(element => {
            let $button = document.createElement("button");
            $button.textContent = element;
            $button.setAttribute('class', 'button is-fullwidth is-info city')
            citiesDiv.appendChild($button);
        });
    }else{
        citiesSearched = [];
    }
    
}

// The function below is the action of clearing the user's local storage. This gets called with an event listening in line 141 with the "Clear History Button"
function clearHistory() {
    localStorage.clear();
    citiesDiv.textContent = '';
} 

// The function below creates an event listening for the "Submit" button that is below the search bar.
// This will complete the getCityCoordinates function using the text that the user has inputed into the search bar. 
buttonEl.addEventListener("click", function(){
    let cityName = inputEl.value;
    getCityCoordinates(cityName);
});

// The function below is adding an event listening to the clearEl button which is the "Clear History" button.
// This will then delete and remove all information that is in the user's local storage. 
clearEl.addEventListener('click', clearHistory);

// The function below is adding an event listener to the created citiesDiv elements that completes the getCityCoordinates function
// using the text that is in the citiesDiv, which is the city that was recently searched, so it will successfully pull the data on the selected city.
citiesDiv.addEventListener("click", function(event){
    let e = event.target;
    if(e.matches(".city")) {
        getCityCoordinates(e.textContent);
    }
});

function hideElement() {
    var startScreen = document.getElementById("startScreen");
    startScreen.classList.add("is-hidden");
  }