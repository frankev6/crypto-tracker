const track = async (coins) => {
  return await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=cad&ids=${coins.join(
      ","
    )}`
  );
};

const drawCoin = (coin) => {
  return `<a target="_blank" href="https://www.coingecko.com/en/coins/${
    coin.id
  }"><li class="coin-item"><div><p class="coin-rank">${
    coin.market_cap_rank
  }</p><img src='${coin.image}'/><p>${
    coin.name
  }</p><p class="coin-symbol">${coin.symbol.toUpperCase()}</p></div><div><p class='fade-in'>${
    coin.current_price
  }</p><p class="fade-in coin-percent ${
    coin.price_change_percentage_24h > 0 ? "positive" : "negative"
  }">${coin.price_change_percentage_24h.toFixed(2)}%</p></div></li></a>`;
};

const update = () => {
  track(["algorand", "terra-luna", "ethereum", "bitcoin"]).then((res) =>
    res.json().then((r) => {
      console.log(r);

      let coinList = "";

      r.forEach((coin) => {
        coinList += drawCoin(coin);
      });

      document.getElementById("coin-list").innerHTML = coinList;
    })
  );

  setTimeout(update, 10000);
};

update();
