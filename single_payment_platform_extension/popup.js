const summaryEl = document.getElementById("summary");
const cartsEl = document.getElementById("carts");
const payAllBtn = document.getElementById("payAll");
const saveCartBtn = document.getElementById("saveCart");
const clearAllBtn = document.getElementById("clearAll");

function renderCarts(carts) {
    const merchants = Object.entries(carts);

  if (merchants.length === 0) {
    summaryEl.textContent = "No carts saved yet";
    cartsEl.innerHTML = "";
    payAllBtn.disabled = true;
    return;
  }

  let total = 0;
  let currency = "USD";

  cartsEl.innerHTML = "";

  merchants.forEach(([merchantKey, cart]) => {
    const container = document.createElement("div");
    container.style.marginBottom = "14px";

    // Merchant name
    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
    
    const title = document.createElement("div");
    title.textContent = cart.merchant;
    title.style.fontWeight = "bold";
    
    const removeBtn = document.createElement("span");
    removeBtn.textContent = "x";
    removeBtn.style.color = "red";
    removeBtn.style.cursor = "pointer";
    removeBtn.style.fontSize = "13px";
    removeBtn.style.fontWeight = "bold";
    removeBtn.style.lineHeight = "1";
    removeBtn.title = "Remove cart";
    
    removeBtn.addEventListener("click", () => {
        console.log("REMOVE CLICKED", cart.merchant);
      chrome.runtime.sendMessage(
        { type: "REMOVE_CART", merchant: merchantKey },
        () => {
          // Immediately re-fetch updated carts
          chrome.runtime.sendMessage(
            { type: "GET_ALL_CARTS" },
            renderCarts
          );
        }
      );
    });
    
    header.appendChild(title);
    header.appendChild(removeBtn);
    container.appendChild(header);

    // Price input row
    const priceRow = document.createElement("div");
    priceRow.style.display = "flex";
    priceRow.style.alignItems = "center";
    priceRow.style.gap = "4px";
    priceRow.style.margin = "4px 0";

    const dollar = document.createElement("span");
    dollar.textContent = "$";

    const input = document.createElement("input");
    input.type = "number";
    input.step = "0.01";
    input.placeholder = "--.--";
    input.style.width = "90px";

    if (cart.subtotal !== null && cart.subtotal !== undefined) {
      input.value = cart.subtotal;
      total += parseFloat(cart.subtotal);
    }

    input.addEventListener("change", () => {
      const value = input.value ? parseFloat(input.value).toFixed(2) : null;

      chrome.runtime.sendMessage(
        {
          type: "SAVE_CART",
          cart: {
            merchant: cart.merchant,
            subtotal: value,
            currency: "USD",
            checkoutUrl: cart.checkoutUrl,
            confidence: "manual"
          }
        },
        () => {
          chrome.runtime.sendMessage(
            { type: "GET_ALL_CARTS" },
            renderCarts
          );
        }
      );
    });

    priceRow.appendChild(dollar);
    priceRow.appendChild(input);

    // Checkout link
    const url = new URL(cart.checkoutUrl);
    const link = document.createElement("a");
    link.href = cart.checkoutUrl;
    link.textContent = `${url.hostname}${url.pathname}`;
    link.style.fontSize = "12px";
    link.style.color = "#1a73e8";
    link.style.textDecoration = "none";
    link.style.wordBreak = "break-all";

    link.addEventListener("click", (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: cart.checkoutUrl });
    });

    // container.appendChild(title);
    container.appendChild(priceRow);
    container.appendChild(link);

    cartsEl.appendChild(container);
  });

  summaryEl.textContent =
    `Merchants: ${merchants.length} | Total: $${total.toFixed(2)} ${currency}`;

  payAllBtn.disabled = merchants.length < 2;
}

// Initial load
chrome.runtime.sendMessage({ type: "GET_ALL_CARTS" }, renderCarts);

// Save current page as cart (unchanged)
saveCartBtn.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    const url = new URL(tab.url);

    chrome.runtime.sendMessage(
      {
        type: "SAVE_CART",
        cart: {
          merchant: url.hostname,
          subtotal: null,
          currency: null,
          checkoutUrl: tab.url,
          confidence: "unknown"
        }
      },
      () => {
        chrome.runtime.sendMessage(
          { type: "GET_ALL_CARTS" },
          renderCarts
        );
      }
    );
  });
});

// Pay all (unchanged)
payAllBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "PAY_ALL" });
});

clearAllBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage(
      { type: "CLEAR_ALL_CARTS" },
      () => {
        chrome.runtime.sendMessage(
          { type: "GET_ALL_CARTS" },
          renderCarts
        );
      }
    );
  });