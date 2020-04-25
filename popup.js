/**
 * Declare initial variables
 */
let price = '';

/*
 * calculateBTC
 * ------------
 * Takes input given from user, and calculates how much USD they will have according to the amount
 * of BTC in input.
 */
const calculateBtc = () => {
  const val = document.getElementById('btc-input').value;
  const valFloat = parseFloat(val);
  if (!valFloat) return 'Please input a valid number';
  const priceFloat = parseFloat(price);
  const resVal = valFloat * priceFloat;
  return '$' + resVal.toLocaleString();
};

const calculateConversion = () => {
  const amt = calculateBtc();
  const textNode = document.getElementById('calculated-btc-num');
  textNode.textContent = amt;
};

/**
 * fetchPrice
 * --------------
 * Fetches price data by emitting message to background.js. Takes the result from emitted message
 * and displays the price in extension.
 */

const fetchPrice = (node) => {
  chrome.runtime.sendMessage({
    action: 'fetch'
  }, function(res) {
    price = res;
    node.textContent = res;
  })
};

/**
 * listenForPrice
 * --------------
 * Adds a listener for price messages sent from background.js, and updates price in extension
 */
const listenForPrice = (node) => {
  chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    if (msg.action === 'send') {
      price = msg.msg;
      node.textContent = msg.msg;
    }
  });
};


/**
 * initPrices
 * ----------
 * Emit message to background.js to fetch current price data.
 * First: Immediately fetches price data, so that the price data is immediately requested.
 * Second: Adds a listener for messages emitted from background.js with updated price data.
 */
const initPrices = () => {
  const priceNode = document.getElementById('price-num');
  fetchPrice(priceNode);
  listenForPrice(priceNode);
};

/**
 * Invoke all necessary functions once DOM is loaded
 */
window.addEventListener('DOMContentLoaded', function () {
  // Fetch current BTC price data from Coinbase
  initPrices();
  // Add listener to calculate-btn for clicks. Invoke calculateBTC if clicked
  document.getElementById('calculate-btn').addEventListener('click', calculateConversion);
  document.getElementById('btc-input').onkeypress = function(e) {
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    // If user presses Enter/Return, calculate BTC/USD conversion
    if (keyCode == '13') calculateConversion();
  }
});
