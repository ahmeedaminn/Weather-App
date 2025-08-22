import View from "./view";

class SearchView extends View {
  _parentElement = document.querySelector(".search");
  _gpsBtn = document.querySelector(".gps-btn");

  getQuery() {
    const query = this._parentElement.querySelector(".search-field").value;
    this._clearIput();
    return query;
  }

  _clearIput() {
    this._parentElement.querySelector(".search-field").value = "";
  }

  addHandlerSearch(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();
      handler();
    });
  }

  addHandlerGps(handler) {
    this._gpsBtn.addEventListener("click", function (e) {
      handler();
    });
  }
}

export default new SearchView();
