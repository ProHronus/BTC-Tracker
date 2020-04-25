/**
 * Declare initial variables
 */
const xhr = new XMLHttpRequest();
let amt = 0;

/**
 * All data about BTC price comes from Coinbase API.
 */
const COINBASE_BTC_PRICE_URL = "https://api.coinbase.com/v2/prices/BTC-USD/spot"

/**
 * setBadge
 * --------
 * Sets badge with the current price of BTC.
 */
const setBadge = (amt) => {
  chrome.browserAction.setBadgeText({
    text: amt.split('.')[0]
  })
};

/**
 * sendPriceMsg
 * -------------
 * Sends a message from background.js to a listener in popup.js with the current BTC price.
 */
const sendPriceMsg = (amt) => {
  chrome.runtime.sendMessage({
    action: 'send',
    msg: amt
  });
};

/**
 * fetchPrice
 * ----------
 * Fetches current BTC price from Coinbase API.
 * Sets badge number to price of BTC.
 * Sends price data to popup.js to display in the extension popup.
 */
const fetchPrice = () => {
  xhr.open("GET", COINBASE_BTC_PRICE_URL, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      const resp = JSON.parse(xhr.responseText);
      const { data: { amount } } = resp;
      amt = amount;
      setBadge(amount);
      sendPriceMsg(amount);
    }
  }
  xhr.send();
};

/**
 * fetch listener
 * --------------
 * Adds listener for price fetch requests from popup.js.
 */
chrome.runtime.onMessage.addListener(function (msg, sender, response) {
  if (msg.action === 'fetch') {
    response(amt);
  }
});

/**
 * Init
 */
fetchPrice();

/**
 * Poll for prices every 5 seconds.
 */
setInterval(fetchPrice, 5000);
