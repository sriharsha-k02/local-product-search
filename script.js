const API_BASE = "https://backend-production-2d1e2.up.railway.app";

const zipInput = document.getElementById("zip");
const cityInput = document.getElementById("city");
const stateInput = document.getElementById("state");
const genderSelect = document.getElementById("gender");
const genderOtherContainer = document.getElementById("gender-other-container"); // ensure this ID exists

function normalizeZip(value) {
  const v = value.trim().toUpperCase().replace(/\s+/g, "");
  return v.length === 6 ? v.slice(0, 3) + " " + v.slice(3) : v;
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
  clearTimeout(zipLookupTimer);
  zipLookupTimer = setTimeout(async () => {
    const normalized = normalizeZip(zipInput.value);
    zipInput.value = normalized;

    const looksCA = /^[A-Z]\d[A-Z]\s\d[A-Z]\d$/.test(normalized);
    const looksUS = /^\d{5}(-\d{4})?$/.test(normalized);
    if (!looksCA && !looksUS) return;

    cityInput.value = "";
    stateInput.value = "";
    cityInput.placeholder = "Looking up...";
    stateInput.placeholder = "Looking up...";

    try {
      const { city, region } = await fetchCityRegion(normalized);
      console.log("ZIP lookup:", normalized, city, region);
      cityInput.value = city || "";
      stateInput.value = region || "";
    } catch (e) {
      cityInput.value = "";
      stateInput.value = "";
      cityInput.placeholder = "Not found";
      stateInput.placeholder = "Not found";
      console.warn(e.message);
    } finally {
      setTimeout(() => {
        cityInput.placeholder = "";
        stateInput.placeholder = "";
      }, 1500);
    }
  }, 450);
});

// Gender "Other" toggle (ensure IDs match your HTML)
if (genderSelect && genderOtherContainer) {
  genderSelect.addEventListener("change", function () {
    genderOtherContainer.style.display = this.value === "Other" ? "block" : "none";
  });
}
