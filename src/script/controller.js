import * as model from "./model.js";
import searchView from "./views/searchView.js";
import cardView from "./views/cardView.js";
import paginationView from "./views/paginationView.js";

const controlLoadWeatherBycity = async function () {
  try {
    const city = searchView.getQuery();

    if (!city) return;

    const cardData = await model.loadWeatherByCity(city);
    model.addCard(cardData);

    const currentPageData = model.getResultsPage(model.state.page);
    cardView.renderAll(currentPageData);

    // Render pagination after adding a new card
    paginationView.render(model.state);
  } catch (err) {
    console.error(err);
    cardView.renderError(err.message);
  }
};

const controlLoadWeatherByCoords = async function () {
  try {
    const cardData = await model.loadWeatherByCoords();

    model.addCard(cardData);

    // Re-render current page from slice (same as city function)
    const currentPageData = model.getResultsPage(model.state.page);
    cardView.renderAll(currentPageData);

    // Render pagination after adding a new card
    paginationView.render(model.state);
  } catch (err) {
    console.error(err);
    cardView.renderError(err.message);
  }
};

const controlDeleteCard = function (id) {
  model.deleteCard(id);

  // if no cards left
  if (model.state.weather.length === 0) {
    cardView._clear(); // clear UI
    paginationView.render(model.state);
    return;
  }

  const currentPageData = model.getResultsPage(model.state.page);
  cardView.renderAll(currentPageData);
  paginationView.render(model.state);
};

const controlRefreshPage = async function () {
  try {
    await model.refreshStoredCards();

    const data = model.state.weather;

    if (!data || data.length === 0) return;

    // Render first page of results and update pagination
    const firstPage = model.getResultsPage();

    cardView.renderAll(firstPage);

    paginationView.render(model.state);
  } catch (err) {
    // cardView.renderError(err.message);
    console.error(err);
  }
};

const controlPagination = function (gotoPage) {
  // 1) Get new results for that page
  const data = model.getResultsPage(gotoPage);

  // 2) Render weather cards for that page
  cardView.renderAll(data);

  // 3) Render updated pagination buttons
  paginationView.render(model.state);
};

const init = async function () {
  // 1️⃣ Load cards from localStorage into state
  const data = model.loadAllCards();

  // 2️⃣ If there are stored cards, refresh them with current data AND render
  if (data && data.length > 0) {
    await controlRefreshPage(); // This will fetch fresh data AND render it
  }

  searchView.addHandlerSearch(controlLoadWeatherBycity);
  searchView.addHandlerGps(controlLoadWeatherByCoords);
  cardView.addHandlerDeleteCard(controlDeleteCard);
  cardView.addHandlerRefreshPage(controlRefreshPage);
  paginationView.addHandlerClick(controlPagination);
};

init();
