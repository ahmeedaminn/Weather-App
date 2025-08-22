import View from "./view.js";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");
  curPage;

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const container = e.target.closest(".btn--inline");
      if (!container) return;

      const btn =
        e.target.closest("button[data-goto]") ||
        container.querySelector("button[data-goto]");
      if (!btn) return;

      const gotoPage = +btn.dataset.goto;

      handler(gotoPage);
    });
  }

  _generateMarkup() {
    this.curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.weather.length / this._data.resultsPerPage
    );

    // No pagination needed if no pages
    if (numPages === 0) return "";

    // first page
    if (this.curPage === 1 && numPages > 1) {
      return `${this._generateCurrentBtn()}${this._generateNextBtn()}`;
    }

    // last page
    if (this.curPage === numPages && numPages > 1) {
      return `${this._generateCurrentBtn()}${this._generatePreviousBtn()}`;
    }

    // any other page
    if (this.curPage < numPages) {
      return `${this._generatePreviousBtn()}${this._generateCurrentBtn()}${this._generateNextBtn()}`;
    }

    // first page and no other pages
    return `${this._generateCurrentBtn()}`;
  }

  _generatePreviousBtn() {
    return `
        <div class="prv btn--inline">
          <i class="fa-regular fa-arrow-left"></i>
          <button class="pag-btn previous" data-goto="${
            this.curPage - 1
          }">Page ${this.curPage - 1}</button>
        </div>
    `;
  }

  _generateCurrentBtn() {
    return `
        <div class="curr">
          <button class="pag-btn current" data-goto="${this.curPage}">${this.curPage}</button>
        </div>
    `;
  }

  _generateNextBtn() {
    return `
        <div class="nxt btn--inline">
          <button class="pag-btn next" data-goto="${this.curPage + 1}">Page ${
      this.curPage + 1
    }</button>
          <i class="fa-regular fa-arrow-right"></i>
        </div>
    `;
  }
}

export default new PaginationView();
