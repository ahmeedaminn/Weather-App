import View from "./view";

class CardView extends View {
  _parentElement = document.querySelector(".cards");
  _errorMessage = "We couldn’t find that city. Please try again.";

  _formatDate = function () {
    const now = new Date();

    const options = { weekday: "short", month: "short", day: "numeric" };
    // weekday: "short" -> Mon, Tue, ...
    // month: "short" -> Jan, Feb, ...
    // day: "numeric" -> 1, 2, 3 ...

    return now.toLocaleDateString("en-US", options);
  };

  _generateMarkup(weather) {
    return `
          <div class="card" data-id="${weather.id}">
            <div class="card-summary">
              <div class="img-div">
                            <img
              class="card-icon"
              src="${weather.icon}"
            />
              </div>
              <div class="info-div">
            <h2 class="card-name">${weather.city}</h2>
            <h3 class="card-temp">${weather.temp}°C</h3>
              </div>
            </div>
            
            <div class="card-info">
              <span class="card-date">${this._formatDate()}</span>
              <div>
                <p class="card-state">${weather.description}</p>
                <ul class="card__meta">
                  <li>
                    <span class="label">Feels Like</span>
                    <span class="value">${weather.feelsLike}°C</span>
                  </li>
                  <li>
                    <span class="label">Humidity</span>
                    <span class="value">${weather.humidity}%</span>
                  </li>
                  <li>
                    <span class="label">Wind</span>
                    <span class="value">${weather.windSpeed}km/h</span>
                  </li>
                </ul>
              </div>
            </div>

            <i class="fa-solid fa-trash delete-btn" data-id="${weather.id}"></i>
      </div>
     
    `;
  }

  _changeBackgroundColor(weather, card) {
    if (!card || !weather?.temp) return;

    const temp = weather.temp;

    let gradient = "";

    if (temp >= 35) {
      // 🔥 Hot
      gradient =
        "linear-gradient(to top, var(--card-hot-1), var(--card-hot-2))";
    } else if (temp >= 25) {
      // 🌤 Warm
      gradient =
        "linear-gradient(to top, var(--card-warm-1), var(--card-warm-2))";
    } else if (temp >= 15) {
      // 🌱 Mild
      gradient =
        "linear-gradient(to top, var(--card-mild-1), var(--card-mild-2))";
    } else if (temp >= 5) {
      // ❄️ Cold
      gradient =
        "linear-gradient(to top, var(--card-cold-1), var(--card-cold-2))";
    } else {
      // 🧊 Freezing
      gradient =
        "linear-gradient(to top, var(--card-freeze-1), var(--card-freeze-2))";
    }

    card.style.background = gradient;
  }

  removeCard(id) {
    const cardToRemove = this._parentElement.querySelector(`[data-id="${id}"]`);
    if (cardToRemove) cardToRemove.remove();
  }

  addHandlerDeleteCard(handler) {
    this._parentElement.addEventListener(
      "click",
      function (e) {
        const deleteBtn = e.target.closest(".delete-btn");
        if (!deleteBtn) return;

        const cardId = deleteBtn.dataset.id;
        if (cardId) {
          this.removeCard(+cardId);
          handler(+cardId);
        }
      }.bind(this)
    );
  }

  addHandlerRefreshPage(handler) {
    window.addEventListener("load", handler);
  }
}

export default new CardView();
