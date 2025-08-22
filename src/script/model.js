// `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
import { getJSON } from "./helpers";
import { API_KEY } from "./config";
import { CITY } from "./config";
import { BASE_URL } from "./config";
import { UNIT } from "./config";

export const state = {
  weather: [],
  page: 1,
  resultsPerPage: 6,
};

const createWeatherObject = function (data) {
  return {
    city: data.name,
    id: data.id,
    temp: data.main.temp,
    feelsLike: data.main.feels_like,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    description: data.weather[0].description,
  };
};

export const getResultsPage = function (page = state.page) {
  state.page = page;

  const start = (page - 1) * state.resultsPerPage;
  const end = page * state.resultsPerPage;

  return state.weather.slice(start, end);
};

export const loadWeatherByCity = async function (city) {
  try {
    const data = await getJSON(
      `${BASE_URL}?q=${city}&appid=${API_KEY}&units=${UNIT}`
    );
    const card = createWeatherObject(data);

    return card;
  } catch (err) {
    throw err;
  }
};

export const getCoords = function () {
  try {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude: lat, longitude: lon } = pos.coords;
          resolve({ lat, lon });
        },
        (err) => {
          reject("GPS access denied:", err.message);
        }
      );
    });
  } catch (err) {
    throw err;
  }
};

export const loadWeatherByCoords = async function () {
  try {
    // 1️⃣ Get coordinates
    const { lat, lon } = await getCoords();

    const data = await getJSON(
      `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${UNIT}`
    );
    const cityName = data.name;

    return await loadWeatherByCity(cityName);
  } catch (err) {
    throw err;
  }
};

export const addCard = function (card) {
  const index = state.weather.findIndex((c) => c.id === card.id);

  if (index !== -1) {
    state.weather[index] = card;
  } else {
    state.weather.push(card);
  }

  persistCards();
  state.page = Math.ceil(state.weather.length / state.resultsPerPage); // jump to last page

  return getResultsPage(state.page);
};

export const deleteCard = function (id) {
  state.weather = state.weather.filter((weatherObj) => weatherObj.id !== id);
  persistCards();

  const numPage = Math.ceil(state.weather.length / state.resultsPerPage);

  state.page = Math.min(state.page, numPage || 1);

  if (state.weather.length === 0) return []; // ✅ Always return an array

  return getResultsPage(state.page);
};

export const loadAllCards = function () {
  const storage = localStorage.getItem("weather-cards");

  if (!storage) return (state.weather = []);
  return (state.weather = JSON.parse(storage));
};

const persistCards = function () {
  localStorage.setItem("weather-cards", JSON.stringify(state.weather));
};

export const refreshStoredCards = async function () {
  try {
    const promises = state.weather.map((obj) =>
      getJSON(`${BASE_URL}?q=${obj.city}&appid=${API_KEY}&units=${UNIT}`)
    );

    const results = await Promise.all(promises);

    state.weather = results.map((data) => createWeatherObject(data));
    persistCards();
  } catch (err) {
    throw err;
  }
};
