
const API_KEY = "af8ca56afa425104e46913689c7da68c"; 


function getCityCoordinates(cityName) {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=3&appid=${API_KEY}`;
fetch(url)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error)); 

};