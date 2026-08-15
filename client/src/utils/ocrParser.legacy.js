// Billvora OCR Parser v5 (Amazon + Zomato + Generic Stable)

function formatDate(dateStr) {
  const match = dateStr.match(/(\d{2})[\/.-](\d{2})[\/.-](\d{2,4})/);
  if (!match) return "";

  let [, dd, mm, yy] = match;
  if (yy.length === 2) yy = `20${yy}`;

  return `${yy}-${mm}-${dd}`;
}

function inferCategory(product = "", store = "") {
  const t = `${product} ${store}`.toLowerCase();

  if (/(waffle|pancake|burger|pizza|food|zomato|swiggy|cafe|coffee)/.test(t))
    return "Food";

  if (/(shirt|dress|jeans|shoe|silk|fashion|clothing)/.test(t))
    return "Fashion";

  if (/(iphone|phone|laptop|macbook|tv|electronics|amazon)/.test(t))
    return "Electronics";

  return "Others";
}

// -----------------------------
// ZOMATO PARSER
// -----------------------------
function parseZomato(lines, fullText) {
  let productName = "";

  const itemIndex = lines.findIndex((l) => /^item$/i.test(l));

  if (itemIndex !== -1) {
    const products = [];

    for (let i = itemIndex + 1; i < lines.length; i++) {
      const line = lines[i];

      if (
        /sub|total qty|discount|container|sgst|cgst|round|grand total|paid via|scan|fssai|thanks/i.test(
          line
        )
      ) {
        break;
      }

      if (/qty|price|amount/i.test(line)) continue;
      if (/^\d+(\.\d+)?(\s+\d+(\.\d+)?)+$/.test(line)) continue;

      if (/[A-Za-z]/.test(line)) products.push(line);
    }

    productName = products.join(" ").replace(/\s+/g, " ").trim();
  }

  let amount = "";

  const grandIndex = lines.findIndex((l) => /grand\s*total/i.test(l));

  if (grandIndex !== -1) {
    const values = [];

    for (let i = grandIndex; i < Math.min(grandIndex + 5, lines.length); i++) {
      const nums = [...lines[i].matchAll(/(\d+\.\d{2})/g)];

      nums.forEach((n) => values.push(parseFloat(n[1])));
    }

    if (values.length) amount = Math.max(...values).toFixed(2);
  }

  let purchaseDate = "";

  for (const line of lines) {
    const m = line.match(/\d{2}[\/.-]\d{2}[\/.-]\d{2,4}/);

    if (m) {
      purchaseDate = formatDate(m[0]);
      break;
    }
  }

  return {
    storeName: "Zomato",
    productName,
    purchaseDate,
    amount,
    paymentMethod: /upi|paid via online|online/i.test(fullText) ? "UPI" : "",
  };
}

// -----------------------------
// AMAZON PARSER
// -----------------------------
function parseAmazon(lines, fullText) {
  let productName = "";

  const descIndex = lines.findIndex((l) => /description/i.test(l));

  if (descIndex !== -1) {
    for (let i = descIndex + 1; i < Math.min(descIndex + 12, lines.length); i++) {
      const line = lines[i];

      if (
        /shipping charges|tax|cgst|sgst|amount in words|authorized|subtotal|total/i.test(
          line
        )
      ) {
        break;
      }

      if (/unit|price|qty|amount/i.test(line)) continue;
      if (/^\d+(\.\d+)?$/.test(line)) continue;

      if (/[A-Za-z]/.test(line)) {
        productName = line.trim();
        break;
      }
    }
  }

  let purchaseDate = "";

  const orderDateLine = lines.find((l) => /order date/i.test(l));

  if (orderDateLine) {
    const m = orderDateLine.match(/\d{2}[\/.-]\d{2}[\/.-]\d{2,4}/);

    if (m) purchaseDate = formatDate(m[0]);
  }

  // ---------- AMAZON AMOUNT FIX ----------
  let amount = "";

  const amountWordsIndex = lines.findIndex((l) => /amount in words/i.test(l));

  if (amountWordsIndex !== -1) {
    for (
      let i = Math.max(0, amountWordsIndex - 8);
      i < amountWordsIndex;
      i++
    ) {
      const line = lines[i];

      // OCR pattern: 21.195.00
      const weird = line.match(/(\d{1,2})\.(\d{3})\.(\d{2})/);

      if (weird) {
        amount = `${weird[2]}.${weird[3]}`;
        break;
      }

      // Pattern: 1,195.00
      const comma = line.match(/(\d{1,3}(?:,\d{3})+\.\d{2})/);

      if (comma) {
        amount = comma[1].replace(/,/g, "");
        break;
      }

      // Take largest value >= 500
      const nums = [...line.matchAll(/(\d+\.\d{2})/g)].map((m) =>
        parseFloat(m[1])
      );

      if (nums.length) {
        const max = Math.max(...nums);

        if (max >= 500) {
          amount = max.toFixed(2);
          break;
        }
      }
    }
  }

  // Final fallback
  if (!amount) {
    const values = [...fullText.matchAll(/(\d+\.\d{2})/g)]
      .map((m) => parseFloat(m[1]))
      .filter((v) => v >= 500);

    if (values.length) {
      amount = Math.max(...values).toFixed(2);
    }
  }

  return {
    storeName: "Amazon",
    productName,
    purchaseDate,
    amount,
    paymentMethod: "",
  };
}

// -----------------------------
// GENERIC PARSER
// -----------------------------
function parseGeneric(lines, fullText) {
  let storeName = "";

  for (const line of lines.slice(0, 5)) {
    if (/^[A-Za-z][A-Za-z0-9 .&-]{2,}$/.test(line)) {
      storeName = line;
      break;
    }
  }

  let purchaseDate = "";

  for (const line of lines) {
    const m = line.match(/\d{2}[\/.-]\d{2}[\/.-]\d{2,4}/);

    if (m) {
      purchaseDate = formatDate(m[0]);
      break;
    }
  }

  const values = [...fullText.matchAll(/(\d+\.\d{2})/g)]
    .map((m) => parseFloat(m[1]))
    .filter((v) => v >= 100);

  const amount = values.length ? Math.max(...values).toFixed(2) : "";

  return {
    storeName,
    productName: "",
    purchaseDate,
    amount,
    paymentMethod: /upi|online/i.test(fullText) ? "UPI" : "",
  };
}

// -----------------------------
// MAIN PARSER
// -----------------------------
export function parseReceiptText(text) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const fullText = lines.join(" ");

  let result;

  if (/zomato/i.test(fullText)) {
    result = parseZomato(lines, fullText);
  } else if (/amazon/i.test(fullText)) {
    result = parseAmazon(lines, fullText);
  } else {
    result = parseGeneric(lines, fullText);
  }

  return {
    ...result,
    category: inferCategory(result.productName, result.storeName),
    currency: "INR",
    confidence: 0.97,
    rawText: text,
  };
}