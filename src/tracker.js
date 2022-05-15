let userCoins;
let currency;
let settingsOpen = false;
let updateTimeout;

const track = async (coins) => {
  return await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${coins.join(
      ","
    )}`
  );
};

const drawCoin = (coin) => {
  return `<a id='${
    coin.name
  }' target="_blank" href="https://www.coingecko.com/en/coins/${
    coin.id
  }"><li class="coin-item"><div><p class="coin-rank">${
    coin.market_cap_rank
  }</p><img src='${coin.image}'/><p>${
    coin.name
  }</p><p class="coin-symbol">${coin.symbol.toUpperCase()}</p></div><div><p class='fade-in'>${
    coin.current_price
  } ${currency}</p><p class="fade-in coin-percent ${
    coin.price_change_percentage_24h > 0 ? "positive" : "negative"
  }">${coin.price_change_percentage_24h.toFixed(2)}%</p>
  </div></li></a>`;
};

const update = (clearTimeout = false) => {
  if (clearTimeout) {
    window.clearTimeout(updateTimeout);
  }
  track(userCoins).then((res) =>
    res.json().then((r) => {
      console.log(r);

      let coinList = "";

      r.forEach((coin) => {
        coinList += drawCoin(coin);
      });

      document.getElementById("coin-list").innerHTML = coinList;
    })
  );

  updateTimeout = setTimeout(update, 10000);
};

const setUserCurrency = (newCurrency) => {
  localStorage.setItem("currency", newCurrency);
  currency = newCurrency;
  update(true);
};

const setUserCoins = () => {
  localStorage.setItem(
    "userCoins",
    document.getElementById("user-coins-input").value.toLowerCase()
  );
  userCoins = document
    .getElementById("user-coins-input")
    .value.toLowerCase()
    .split(",");

  update(true);
};

const addUserCoin = () => {};

const removeUserCoin = () => {};

const toggleSettings = () => {
  settingsOpen = !settingsOpen;

  document.getElementById("settings-form").style.display = !settingsOpen
    ? "none"
    : "block";
  document.getElementById("coin-list-container").style.display = settingsOpen
    ? "none"
    : "block";
};

const initTracker = () => {
  userCoins = localStorage.getItem("userCoins").split(",");
  currency = localStorage.getItem("currency");

  document.getElementById("user-coins-input").value = userCoins;

  document.getElementById("settings-save").addEventListener("click", () => {
    setUserCoins();
    toggleSettings();
  });

  if (userCoins && userCoins.length > 0) {
    update();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  initTracker();

  document
    .getElementById("user-coins-input")
    .addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        setUserCoins();
        toggleSettings();
      }
    });

  document.getElementById("btn-settings").onclick = toggleSettings;
  document.getElementById("currency-selection").onchange = () => {
    setUserCurrency(document.getElementById("currency-selection").value);
  };
  document.getElementById("currency-selection").value = currency;
});
