const API_BASE = "https://backend-production-2d1e2.up.railway.app"; 

const zipInput = document.getElementById("zip");
const cityInput = document.getElementById("city");
const stateInput = document.getElementById("state");

function normalizeZip(value) {
  const v = value.trim();
  // If looks Canadian (letters and digits), uppercase and ensure single space in middle if length==6
  if (/^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/.test(v)) {
    const compact = v.replace(/\s+/g, "").toUpperCase();
    return compact.slice(0, 3) + " " + compact.slice(3);
  }
  // If US ZIP+4, keep base 5 visible
  if (/^\d{5}(-\d{4})?$/.test(v)) return v;
  return v.toUpperCase();
}

async function fetchCityRegion(zip) {
  const res = await fetch(`${API_BASE}/geo/lookup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ zip })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Lookup failed");
  }
  return res.json();
}

let zipLookupTimer = null;

zipInput.addEventListener("input", () => {
  // Debounce to reduce calls while typing
  clearTimeout(zipLookupTimer);
  zipLookupTimer = setTimeout(async () => {
    const normalized = normalizeZip(zipInput.value);
    zipInput.value = normalized;

    // Basic guardrails: length hints (CA: 7 incl. space, US: 5 or 10 with dash)
    const looksCA = /^[A-Z]\d[A-Z]\s\d[A-Z]\d$/.test(normalized);
    const looksUS = /^\d{5}(-\d{4})?$/.test(normalized);
    if (!looksCA && !looksUS) return; // wait until it looks valid

    cityInput.value = "";
    stateInput.value = "";
    cityInput.placeholder = "Looking up...";
    stateInput.placeholder = "Looking up...";

    try {
      const { city, region } = await fetchCityRegion(normalized);
      cityInput.value = city || "";
      stateInput.value = region || "";
    } catch (e) {
      cityInput.value = "";
      stateInput.value = "";
      cityInput.placeholder = "Not found";
      stateInput.placeholder = "Not found";
      console.warn(e.message);
    } finally {
      // Clear placeholders after a short delay
      setTimeout(() => {
        cityInput.placeholder = "";
        stateInput.placeholder = "";
      }, 1500);
    }
  }, 450);
});


document.getElementById("gender").addEventListener("change", function () {
  const otherLabel = document.getElementById("gender-other-label");
  if (this.value === "Other") {
    otherLabel.style.display = "block";
  } else {
    otherLabel.style.display = "none";
  }
});

