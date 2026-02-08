# Single Payment Platform (SPP)

Single Payment Platform is a lightweight Chrome extension that helps you keep track of shopping carts across multiple websites and see your total planned spending in one place.

Instead of juggling bookmarks, notes, or open tabs, SPP lets you save cart links, manually record prices, and view an aggregated total whenever you want.

👉 **Chrome Web Store:**  
https://chromewebstore.google.com/detail/single-payment-platform/dpdnlhncbpfdmhnipbcpnmbkejkoliei

---

## What it does

- Save shopping cart URLs from any website
- Manually enter or update a price for each cart
- See a running total across all saved carts
- Open any saved cart instantly in a new tab
- Remove individual carts or clear all carts at once

All data is stored locally in your browser using `chrome.storage`. The extension does **not** process payments, collect personal data, or transmit information off-device.

---

## Why this exists

When shopping across multiple sites, it’s easy to lose track of:
- how many carts you’ve started
- how much you’re planning to spend
- where each cart lives

Single Payment Platform is intentionally simple and human-in-the-loop. Prices are entered manually so nothing is guessed, scraped, or misreported.

---

## How to use

1. Saving a cart: When on the "cart" page of an online shop, simply press the extension in the top right and click "Save this cart." This will save the current URL and then allow you to enter in the total price. As you add more carts and prices, the extension will keep track of the total price.

2. Pay all: Once you have added all the things you've wanted, you can press "Pay all," which will automatically open up every cart you've saved. This allows you to easily pay for each cart at the end once you know the full price of your entire shopping experience.

3. Removing carts: To remove a single cart, simply press the red "x" to the right of it. Or, if you want to remove all carts at once (for example, when you're done shopping), simply press "Clear all carts" at the bottom. Note that there is currently no "undo" if you remove carts, so be careful!

---

## Privacy & permissions

- No accounts
- No analytics
- No ads
- No remote code execution
- No data sharing

---

## Local development and testing

To run the extension locally and test changes:

1. Clone this repository:

2. Open Chrome and navigate to chrome://extensions/

3. Enable Developer mode using the toggle in the top-right corner.

4. Click Load Unpacked.

5. Select the top-level folder: single_payment_platform_extension

6. The extension will now be installed locally. Any changes you make to the code can be tested by clicking Reload on the extension in chrome://extensions without having to load it again (i.e., you only have to do "Load Unpacked" once and then all new updates in your code will be reflected in Chrome).
