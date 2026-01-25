console.log("SPP content script loaded on", window.location.hostname);

/**
 * --- SHOPIFY ADAPTER (unchanged) ---
 */
function getShopifyCart() {
  return fetch("/cart.js", { credentials: "same-origin" })
    .then((res) => {
      if (!res.ok) throw new Error("Not Shopify");
      return res.json();
    })
    .then((cart) => ({
      merchant: window.location.hostname,
      subtotal: (cart.total_price / 100).toFixed(2),
      currency: cart.currency || "USD",
      confidence: "high",
      checkoutUrl: `${window.location.origin}/checkout`
    }));
}

/**
 * --- DOM SUBTOTAL INFERENCE ---
 */
function inferSubtotalFromDOM() {
  const KEYWORDS = ["subtotal", "total", "order total"];
  const PRICE_REGEX = /\$?\d{1,3}(,\d{3})*(\.\d{2})?/g;

  let bestCandidate = null;
  let bestScore = -Infinity;

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  while (walker.nextNode()) {
    const text = walker.currentNode.textContent.toLowerCase();

    let keywordScore = 0;
    KEYWORDS.forEach((k) => {
      if (text.includes(k)) keywordScore += k === "subtotal" ? 2 : 1;
    });

    if (keywordScore === 0) continue;

    const matches = walker.currentNode.textContent.match(PRICE_REGEX);
    if (!matches) continue;

    matches.forEach((raw) => {
      const value = parseFloat(raw.replace(/[^0-9.]/g, ""));
      if (isNaN(value)) return;

      let score = keywordScore;

      // Penalize common false positives
      if (text.includes("shipping")) score -= 1;
      if (text.includes("tax")) score -= 1;

      // Prefer larger values
      score += Math.log(value + 1);

      if (score > bestScore) {
        bestScore = score;
        bestCandidate = value;
      }
    });
  }

  if (!bestCandidate || bestScore < 3) {
    return null;
  }

  return {
    subtotal: bestCandidate.toFixed(2),
    currency: "USD",
    confidence: bestScore >= 5 ? "high" : "medium"
  };
}

/**
 * --- MESSAGE HANDLER ---
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_CART") {
    // 1) Try Shopify first
    getShopifyCart()
      .then(sendResponse)
      .catch(() => {
        // 2) Fallback to DOM inference
        const inferred = inferSubtotalFromDOM();
        if (inferred) {
          sendResponse({
            merchant: window.location.hostname,
            subtotal: inferred.subtotal,
            currency: inferred.currency,
            confidence: inferred.confidence,
            checkoutUrl: window.location.href
          });
        } else {
          sendResponse({ error: "Price unknown" });
        }
      });

    return true; // async
  }
  
});