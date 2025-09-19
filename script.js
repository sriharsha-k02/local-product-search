document.getElementById("gender").addEventListener("change", function () {
  const otherLabel = document.getElementById("gender-other-label");
  if (this.value === "Other") {
    otherLabel.style.display = "block";
  } else {
    otherLabel.style.display = "none";
  }
});

// Optional: Auto-fill city/state from zip (mocked for now)
document.getElementById("zip").addEventListener("blur", function () {
  const zip = this.value.trim();
  if (zip === "L1H1A9") {
    document.getElementById("city").value = "Oshawa";
    document.getElementById("state").value = "Ontario";
  }
});
