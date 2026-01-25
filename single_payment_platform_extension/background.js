console.log("Single Payment Platform background worker running");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("BG RECEIVED", message);

  switch (message.type) {
    case "SAVE_CART": {
      const incoming = message.cart;

      chrome.storage.local.get(["carts"], (result) => {
        const carts = result.carts || {};
        const existing = carts[incoming.merchant];

        const shouldUpdatePrice =
          incoming.subtotal &&
          (!existing || existing.confidence !== "high");

        carts[incoming.merchant] = {
          ...existing,
          ...incoming,
          ...(shouldUpdatePrice ? {} : {
            subtotal: existing?.subtotal,
            confidence: existing?.confidence
          }),
          lastUpdated: Date.now()
        };

        chrome.storage.local.set({ carts }, () => {
          sendResponse({ success: true });
        });
      });

      return true; // REQUIRED
    }

    case "GET_ALL_CARTS": {
      chrome.storage.local.get(["carts"], (result) => {
        sendResponse(result.carts || {});
      });
      return true;
    }

    case "PAY_ALL": {
      chrome.storage.local.get(["carts"], (result) => {
        const carts = Object.values(result.carts || {});
        carts.forEach((cart) => {
          chrome.tabs.create({ url: cart.checkoutUrl, active: false });
        });
        sendResponse({ success: true });
      });
      return true;
    }

    case "REMOVE_CART": {
      const merchant = message.merchant;

      chrome.storage.local.get(["carts"], (result) => {
        const carts = result.carts || {};
        console.log("BEFORE DELETE", Object.keys(carts));
        delete carts[merchant];
        console.log("AFTER DELETE", Object.keys(carts));

        chrome.storage.local.set({ carts }, () => {
          sendResponse({ success: true });
        });
      });

      return true; // THIS fixes your bug
    }
    case "CLEAR_ALL_CARTS": {
        chrome.storage.local.set({ carts: {} }, () => {
          sendResponse({ success: true });
        });
        return true;
      }

    default:
      return false;
  }
});