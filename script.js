// script.js - DineEasy: handles form validation, dynamic fields, recommendations, and bill calculator

// deposits stores the reservation deposit amount for each restaurant
var deposits = {
  "Pho Bo Ga Mekong":           15,
  "Sam Sam Chicken":            10,
  "David Hot Pot":              20,
  "Haidilao Huoguo Emporium":   20,
  "Katsuhon":                   15,
  "Doo Boo":                    10
};

// restaurantData stores each restaurant's dietary tag, budget level, and supported purposes
// purpose is an array so a restaurant can match multiple dining contexts
var restaurantData = {
  "Pho Bo Ga Mekong":         { dietary: "none",  budget: "low",  purpose: ["family", "casual"] },
  "Sam Sam Chicken":          { dietary: "none",  budget: "low",  purpose: ["casual", "date"] },
  "David Hot Pot":            { dietary: "none",  budget: "mid",  purpose: ["family", "casual"] },
  "Haidilao Huoguo Emporium": { dietary: "none",  budget: "high", purpose: ["family", "business", "date"] },
  "Katsuhon":                 { dietary: "none",  budget: "mid",  purpose: ["date", "business"] },
  "Doo Boo":                  { dietary: "halal", budget: "low",  purpose: ["casual", "family"] }
};

// priceRanges stores the low and high estimated cost per person for the bill calculator
var priceRanges = {
  "Pho Bo Ga Mekong":           { low: 20, high: 30 },
  "Sam Sam Chicken":            { low: 15, high: 25 },
  "David Hot Pot":              { low: 25, high: 40 },
  "Haidilao Huoguo Emporium":   { low: 30, high: 50 },
  "Katsuhon":                   { low: 20, high: 35 },
  "Doo Boo":                    { low: 18, high: 28 }
};

// showError() finds the error span for a field by appending "-error" to the id and displays the message
function showError(id, msg) {
  var el = document.getElementById(id + "-error");
  if (el) { el.textContent = msg; el.style.display = "block"; }
}

// clearError() hides the error span for a field by appending "-error" to the id
function clearError(id) {
  var el = document.getElementById(id + "-error");
  if (el) { el.textContent = ""; el.style.display = "none"; }
}

// validateRegister() validates all registration fields and only submits the form if every check passes
function validateRegister(e) {
  e.preventDefault();
  var ok = true;

  // username must be at least 5 chars and contain only letters, numbers, or underscores
  var user = document.getElementById("username").value.trim();
  clearError("username");
  if (user.length < 5 || /[^a-zA-Z0-9_]/.test(user)) {
    showError("username", "Min 5 characters. Letters, numbers, underscores only.");
    ok = false;
  }

  // email must contain @ and a dot to be considered a valid format
  var email = document.getElementById("reg-email").value.trim();
  clearError("reg-email");
  if (email.indexOf("@") < 1 || email.indexOf(".") < 1) {
    showError("reg-email", "Enter a valid email address.");
    ok = false;
  }

  // phone must contain only digits and be between 8 and 15 characters long
  var phone = document.getElementById("reg-phone").value.trim();
  clearError("reg-phone");
  if (!/^\d{8,15}$/.test(phone)) {
    showError("reg-phone", "Phone must be 8 to 15 digits only.");
    ok = false;
  }

  // password must be at least 10 chars and include uppercase, lowercase, a number, and a special character
  var pass = document.getElementById("password").value;
  clearError("password");
  if (pass.length < 10 || !/[A-Z]/.test(pass) || !/[a-z]/.test(pass) || !/[0-9]/.test(pass) || !/[\W_]/.test(pass)) {
    showError("password", "Min 10 chars with uppercase, lowercase, number, and special character.");
    ok = false;
  }

  // confirm password must exactly match the password field
  var confirm = document.getElementById("confirm-password").value;
  clearError("confirm-password");
  if (confirm !== pass) {
    showError("confirm-password", "Passwords do not match.");
    ok = false;
  }

  // gender requires at least one radio button to be selected
  clearError("gender-anchor");
  if (!document.querySelector('input[name="gender"]:checked')) {
    showError("gender-anchor", "Please select a gender.");
    ok = false;
  }

  // country dropdown must not be left on the default empty option
  var country = document.getElementById("country").value;
  clearError("country");
  if (!country) {
    showError("country", "Please select your country.");
    ok = false;
  }

  if (ok) { document.getElementById("register-form").submit(); }
}

// validateReservation() validates all reservation fields and only submits the form if every check passes
function validateReservation(e) {
  e.preventDefault();
  var ok = true;

  // full name must not be empty
  var name = document.getElementById("full-name").value.trim();
  clearError("full-name");
  if (!name) { showError("full-name", "Full name is required."); ok = false; }

  // email must contain @
  var email = document.getElementById("res-email").value.trim();
  clearError("res-email");
  if (email.indexOf("@") < 1) { showError("res-email", "Enter a valid email."); ok = false; }

  // phone is stripped of non-digits and must be at least 10 digits long
  var phone = document.getElementById("res-phone").value.replace(/\D/g, "");
  clearError("res-phone");
  if (phone.length < 10) { showError("res-phone", "Phone needs at least 10 digits."); ok = false; }

  // a restaurant must be selected from the dropdown
  var rest = document.getElementById("restaurant").value;
  clearError("restaurant");
  if (!rest) { showError("restaurant", "Please select a restaurant."); ok = false; }

  // date and time must be set to a future point in time
  var dt = document.getElementById("datetime").value;
  clearError("datetime");
  if (!dt || new Date(dt) <= new Date()) {
    showError("datetime", "Please choose a future date and time.");
    ok = false;
  }

  // number of people must be a positive integer
  var people = parseInt(document.getElementById("people").value);
  clearError("people");
  if (!people || people < 1) { showError("people", "Must be at least 1 person."); ok = false; }

  // payment method must be selected; if online is chosen, card number length is also checked
  var method = document.getElementById("pay-method").value;
  clearError("pay-method");
  if (!method) {
    showError("pay-method", "Please select a payment method.");
    ok = false;
  } else if (method === "online") {
    var card   = document.getElementById("card-number").value.trim();
    var needed = (document.getElementById("card-type").value === "amex") ? 15 : 16;
    clearError("card-number");
    if (!/^\d+$/.test(card) || card.length !== needed) {
      showError("card-number", "Card must be " + needed + " digits.");
      ok = false;
    }
  }

  // billing email must contain @
  var billing = document.getElementById("billing-email").value.trim();
  clearError("billing-email");
  if (billing.indexOf("@") < 1) { showError("billing-email", "Enter a valid billing email."); ok = false; }

  if (ok) { document.getElementById("reservation-form").submit(); }
}

// updateDeposit() reads the selected restaurant and updates the deposit box with the correct amount
function updateDeposit() {
  var name = document.getElementById("restaurant").value;
  var box  = document.getElementById("deposit-display");
  box.innerHTML = name
    ? "Deposit required: <strong>$" + deposits[name] + "</strong>"
    : "Select a restaurant to see the deposit amount.";
}

// togglePayment() shows the voucher textbox or credit card section depending on the chosen payment method
function togglePayment() {
  var method = document.getElementById("pay-method").value;
  document.getElementById("voucher-section").style.display = (method === "voucher") ? "block" : "none";
  document.getElementById("card-section").style.display   = (method === "online")  ? "block" : "none";
}

// fillBilling() copies the main email into the billing email field when the same-as checkbox is ticked
function fillBilling() {
  var same  = document.getElementById("same-email").checked;
  var field = document.getElementById("billing-email");
  field.value    = same ? document.getElementById("res-email").value : "";
  field.readOnly = same;
}

// prefillRestaurant() reads the ?restaurant= query parameter from the URL and pre-selects that restaurant
function prefillRestaurant() {
  var name = new URLSearchParams(window.location.search).get("restaurant");
  if (name) {
    document.getElementById("restaurant").value = name;
    updateDeposit();
  }
}

// getRecommendations() filters restaurantData against the user's dietary, budget, and purpose selections
// a restaurant is included only if it passes all three checks; results are injected into the page as cards
function getRecommendations(e) {
  e.preventDefault();
  var dietary = document.getElementById("dietary").value;
  var budget  = document.getElementById("budget").value;
  var purpose = document.getElementById("purpose").value;
  var results = [];

  for (var name in restaurantData) {
    var r         = restaurantData[name];
    var dietaryOk = (dietary === "none" || r.dietary === dietary);
    var budgetOk  = (r.budget === budget);
    var purposeOk = (r.purpose.indexOf(purpose) !== -1);
    if (dietaryOk && budgetOk && purposeOk) { results.push(name); }
  }

  var container = document.getElementById("recommend-results");
  container.innerHTML = "";

  if (results.length === 0) {
    container.innerHTML = "<p>No restaurants match your preferences. Try adjusting your selections.</p>";
  } else {
    for (var i = 0; i < results.length; i++) {
      var div = document.createElement("div");
      div.className = "recommend-item";
      div.innerHTML = "<div><h4>" + results[i] + "</h4></div>"
        + "<button class='btn-select' onclick=\"goReserve('" + results[i] + "')\">Reserve This</button>";
      container.appendChild(div);
    }
  }

  document.getElementById("recommend-results-section").style.display = "block";
}

// goReserve() redirects to reservation.html with the selected restaurant name as a URL parameter
function goReserve(name) {
  window.location.href = "reservation.html?restaurant=" + encodeURIComponent(name);
}

// calculateBill() estimates the total cost by multiplying the restaurant's price range by the group size
// if the deposit checkbox is ticked, the deposit amount is subtracted from the estimated balance
function calculateBill() {
  var restName = document.getElementById("bill-restaurant").value;
  var people   = parseInt(document.getElementById("bill-people").value);
  var deposit  = document.getElementById("bill-deposit").checked;
  var result   = document.getElementById("bill-result");

  if (!restName || !people || people < 1) { result.classList.add("bill-hidden"); return; }

  var range   = priceRanges[restName];
  var dep     = deposits[restName];
  var estLow  = range.low  * people;
  var estHigh = range.high * people;
  var depPaid = deposit ? dep : 0;

  document.getElementById("bill-restaurant-name").textContent = restName;
  document.getElementById("bill-people-count").textContent    = people + (people === 1 ? " person" : " people");
  document.getElementById("bill-est-range").textContent       = "$" + estLow + " – $" + estHigh;
  document.getElementById("bill-deposit-paid").textContent    = deposit ? "$" + dep : "Not paid";
  document.getElementById("bill-balance").textContent         = "$" + (estLow - depPaid) + " – $" + (estHigh - depPaid);

  result.classList.remove("bill-hidden");
}

// window.onload attaches all event listeners after the page has fully loaded
// each attachment is guarded by an existence check so it only runs on the relevant page
window.onload = function() {
  if (document.getElementById("register-form"))    document.getElementById("register-form").onsubmit    = validateRegister;
  if (document.getElementById("reservation-form")) document.getElementById("reservation-form").onsubmit = validateReservation;
  if (document.getElementById("reservation-form")) prefillRestaurant();
  if (document.getElementById("restaurant"))       document.getElementById("restaurant").onchange       = updateDeposit;
  if (document.getElementById("pay-method"))       document.getElementById("pay-method").onchange       = togglePayment;
  if (document.getElementById("same-email"))       document.getElementById("same-email").onchange       = fillBilling;
  if (document.getElementById("recommend-form"))   document.getElementById("recommend-form").onsubmit   = getRecommendations;
  if (document.getElementById("bill-restaurant")) {
    document.getElementById("bill-restaurant").onchange = calculateBill;
    document.getElementById("bill-people").oninput      = calculateBill;
    document.getElementById("bill-deposit").onchange    = calculateBill;
  }
};
