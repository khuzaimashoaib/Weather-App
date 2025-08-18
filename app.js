const cityInput = document.querySelector(".city_input");
const searchBtn = document.querySelector(".search_btn");

const notFoundSec = document.querySelector(".not_found");
const searchCitySec = document.querySelector(".search_city");
const weatherInfoSec = document.querySelector(".weather_info");

const apiKey = "4b723a065309f2d01e04da2b1f3ea444";

const countryText = document.querySelector(".country_text");
const tempText = document.querySelector(".temp_text");
const conditionText = document.querySelector(".condition_text");
const humidityText = document.querySelector(".humidity_value_text");
const windspeedText = document.querySelector(".wind_value_text");
const weatherSummaryImg = document.querySelector(".weather_summary_img");
const currentDateText = document.querySelector(".current_date_text");
const forecastItemsContainer = document.querySelector(
  ".forecast_item_container"
);

searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim() != "") {
    getWeatherUpdate(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

cityInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter" && cityInput.value.trim() != "") {
    getWeatherUpdate(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

async function getWeatherData(endPoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;

  const response = await fetch(apiUrl);
  const data = response.json();
  return data;
}

function getWeatherIcon(id) {
  if (id <= 232) return "thunderstorm";
  if (id <= 321) return "drizzle";
  if (id <= 531) return "rain";
  if (id <= 622) return "snow";
  if (id <= 781) return "atmosphere";
  if (id <= 800) return "clear";
  else return "clouds";
}

function getCurrentDate() {
  const date = new Date();

  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };
  return date.toLocaleDateString("en-GB", options);
}
async function getWeatherUpdate(city) {
  const weatherData = await getWeatherData("weather", city);

  if (weatherData.cod != 200) {
    showDisplaySection(notFoundSec);
    return;
  }

  const {
    name: country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = weatherData;

  countryText.textContent = country;
  tempText.textContent = Math.round(temp) + " °C";
  conditionText.textContent = main;
  humidityText.textContent = humidity + " %";
  windspeedText.textContent = speed + " M/s";
  currentDateText.textContent = getCurrentDate();

  weatherSummaryImg.src = `./assets/weather/${getWeatherIcon(id)}.svg`;
  await getForecastInfo(city);
  showDisplaySection(weatherInfoSec);
}

async function getForecastInfo(city) {
  const forecastData = await getWeatherData("forecast", city);

  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];

  forecastItemsContainer.innerHTML = "";
  forecastData.list.forEach((forecastList) => {
    if (
      forecastList.dt_txt.includes(timeTaken) &&
      !forecastList.dt_txt.includes(todayDate)
    ) {
      updateForecastInfo(forecastList);
    }
  });
}

function updateForecastInfo(weatherData) {
  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = weatherData;

  const getDate = new Date(date);

  const dateOpt = {
    day: "2-digit",
    month: "short",
  };

  const dateRes = getDate.toLocaleDateString("en-US", dateOpt);

  const forecastItem = `
   <div class="forecast_items">
        <h5 class="forecast_item_date regular_text">${dateRes}</h5>
        <img
          src="./assets/weather/${getWeatherIcon(id)}.svg"
          class="forecast_item_img"
        />
        <h5 class="forecast_item_temp">${Math.round(temp)} °C</h5>
    </div>`;

  forecastItemsContainer.insertAdjacentHTML("beforeend", forecastItem);
}

function showDisplaySection(section) {
  [weatherInfoSec, searchCitySec, notFoundSec].forEach((section) => {
    section.style.display = "none";
  });

  section.style.display = "flex";
}
