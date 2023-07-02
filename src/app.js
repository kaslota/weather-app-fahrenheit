//
function showDayMood() {
  let mood = document.querySelector("#body-mood");
  mood.classList.add("day-body");
  mood.classList.remove("night-body");
}
let dayBtn = document.querySelector("#day-btn");
dayBtn.addEventListener("click", showDayMood);

function showNightMood() {
    let mood = document.querySelector("#body-mood");
  mood.classList.add("night-body");
  mood.classList.remove("day-body");
}
let nightBtn = document.querySelector("#night-btn");
nightBtn.addEventListener("click", showNightMood);
// Show current time and day
let date = new Date();
let hours = date.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
let minutes = date.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[date.getDay()];
let time = document.querySelector("#current-time");
time.innerHTML = `${day} ${hours}:${minutes}`;

// Show forecast html and data
function transformOnDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecastDaily = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecast = `<div class="row">`;
  forecastDaily.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecast =
        forecast +
        `<div class="col">
            <div class="forecast-weather">
              <div class="forecast-day"><strong>${transformOnDay(
                forecastDay.dt
              )}</strong></div>
              <img class="forecast-icon" src="https://openweathermap.org/img/wn/${
                forecastDay.weather[0].icon
              }@2x.png" alt="icon">
              <div class="forecast-max-min-tem">
                 ${Math.round(forecastDay.temp.min)} / ${Math.round(
          forecastDay.temp.max
        )}
              </div>
            </div>
        </div> `;
    }
  });
  forecast = forecast + `</div>`;
  forecastElement.innerHTML = forecast;
}

function getForecast(coordinates) {
  let apiKey = "0f8bc384a7c31b717a18cfe38a95ae06";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayForecast);
}

// Show current input data and auto city(temperature, description, humidity, wind)
function classDescription() {
  let descriptionElement = document.querySelector("#description");
  if (descriptionElement.innerHTML === "clear sky") {
    descriptionElement.classList.add("clear-sky");
    descriptionElement.classList.remove("haze", "fog", "mist");
  } else if (descriptionElement.innerHTML === "haze") {
    descriptionElement.classList.add("haze");
    descriptionElement.classList.remove("clear-sky", "fog", "mist");
  } else if (descriptionElement.innerHTML === "mist") {
    descriptionElement.classList.add("mist");
    descriptionElement.classList.remove("clear-sky", "fog", "haze");
  } else if (descriptionElement.innerHTML === "fog") {
    descriptionElement.classList.add("fog");
    descriptionElement.classList.remove("clear-sky", "haze", "mist");
  } else {
    descriptionElement.classList.add("description-all");
    descriptionElement.classList.remove("clear-sky", "haze", "fog", "mist");
  }
}

function showCityData(response) {
  document.querySelector("#city-name").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.main.temp
  );
  let minTemp = Math.floor(response.data.main.temp_min);
  let maxTemp = Math.ceil(response.data.main.temp_max);
  document.querySelector(
    "#current-max-min-tem"
  ).innerHTML = `${minTemp} / ${maxTemp}`;

  celsiusTemperature = response.data.main.temp;
  celsiusMaxTem = response.data.main.temp_max;
  celsiusMinTem = response.data.main.temp_min;

  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
  classDescription();

  let inputIcon = response.data.weather[0].icon;
  let icon = document.querySelector("#icon");
  icon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${inputIcon}@2x.png`
  );
  icon.setAttribute("alt", `${response.data.weather[0].description}`);

  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );

  getForecast(response.data.coord);
}
function searchCity(city) {
  let keyApi = `0f8bc384a7c31b717a18cfe38a95ae06`;
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${keyApi}&units=imperial`;
  axios.get(url).then(showCityData);
}
function submitCity(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}
searchCity("Kyiv");

let form = document.querySelector("#search-form");
form.addEventListener("submit", submitCity);

// // Location Current weather by coordinates(latitude and longitude)

function currentLocation(position) {
  let keyApi = `0f8bc384a7c31b717a18cfe38a95ae06`;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${keyApi}&units=imperial`;
  axios.get(url).then(showCityData);
}

function askCurrentPosition() {
  navigator.geolocation.getCurrentPosition(currentLocation);
}

let currentBtn = document.querySelector("#current-btn");
currentBtn.addEventListener("click", askCurrentPosition);
