export default class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;

    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderAll(data) {
    this._data = data;
    if (!data || (Array.isArray(data) && data.length === 0)) {
      this._parentElement.innerHTML = "";
      return;
    }

    this._parentElement.innerHTML = ""; // clear UI

    this._data.forEach((weather) => {
      this._data = weather;

      const markup = this._generateMarkup(weather);

      this._parentElement.insertAdjacentHTML("beforeend", markup);

      const card = this._parentElement.lastElementChild;

      this._changeBackgroundColor(weather, card);
    });
  }

  renderError() {
    const markup = `
      <div class="overlay">
        <div class="error-box">
          <button class="close-btn">×</button>
          <div>
            <i class="fa-solid fa-triangle-exclamation"></i>
            <p class="err-msg">${this._errorMessage}</p>
          </div>
        </div>
      </div>
      `;
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
    this._addHandlerHideOverlay();
  }

  _addHandlerHideOverlay() {
    const overlay = document.querySelector(".overlay");

    overlay.addEventListener("click", function (e) {
      if (
        e.target.classList.contains("overlay") ||
        e.target.classList.contains("close-btn")
      ) {
        overlay.classList.add("hidden");
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }
}
