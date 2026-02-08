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

## Privacy & permissions

- No accounts
- No analytics
- No ads
- No remote code execution
- No data sharing

Permissions are limited to:
- **Storage** – to save carts locally
- **Tabs** – to open saved cart URLs on demand

---

## Local development and testing

To run the extension locally and test changes:

1. Clone this repository:

2. Open Chrome and navigate to chrome://extensions/

3. Enable Developer mode using the toggle in the top-right corner.

4. Click Load Unpacked.

5. Select the top-level folder: single_payment_platform_extension

6. The extension will now be installed locally. Any changes you make to the code can be tested by clicking Reload on the extension in chrome://extensions without having to load it again (i.e., you only have to do "Load Unpacked" once and then all new updates in your code will be reflected in Chrome).