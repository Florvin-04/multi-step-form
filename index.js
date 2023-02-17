// Constants and variables
const form = document.getElementById("form");
const usernameInput = document.querySelector("input[type=text]");
const emailInput = document.querySelector("input[type=email]");
const phoneInput = document.querySelector("input[type=number]");
const plans = document.querySelectorAll(".plan input[type=radio]");
const addons = Array.from(document.querySelectorAll(".add-on input[type=checkbox]"));
const planPrices = document.querySelectorAll(".plan-price");
const monthlySub = document.getElementById("monthly-sub");
const yearlySub = document.getElementById("yearly-sub");
const freeMonths = document.querySelectorAll(".free-months");
const switcher = document.querySelector(".switcher");
const stepNumbers = document.querySelectorAll("div.step-number");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("back");
const changeBtn = document.getElementById("change");
const steps = document.querySelectorAll(".step");
let billingType = "Monthly";

const localStorage = {
  billing_type: "",
  plan: {
    name: "",
    price: 0,
  },
  addonsList: [],
};

/* ------- The Logic ------- */
// -- Calling the functions
form.addEventListener("submit", (e) => {
  e.preventDefault();
});

updateAddons();
handleTheLastStep();

function updateAddons() {
  addons.forEach((addon) => {
    addon.addEventListener("change", () => {
      getAddons(addons);
      handleTheLastStep();
    });
  });
}
function getAddons(addonsList) {
  const finalAddonsList = [];
  addonsList.forEach((addon) => {
    if (addon.checked) {
      finalAddonsList.push({
        name: addon.dataset.name,
        price: addon.dataset.value,
      });
    }
  });
  localStorage.addonsList = finalAddonsList;
  console.log(localStorage);
}

function printAddonsList() {
  if (localStorage.addonsList) {
    addonsList = localStorage.addonsList;
    planSubscription = localStorage.billing_type;
    addonsListWrapper = document.querySelector(".final-wrapper .addons-list");
    addonsListWrapper.textContent = ``;
    for (i = 0; i < addonsList.length; i++) {
      finalItem = document.createElement("div");
      finalItem.className = "final-item flex";
      addonName = document.createElement("h4");
      addonName.className = "item-name";
      addonName.textContent = addonsList[i].name;
      addonPrice = document.createElement("p");
      addonPrice.className = "item-price";
      planSubscription == "Monthly" ? (addonPrice.textContent = `+$${addonsList[i].price}/mo`) : (addonPrice.textContent = `+$${addonsList[i].price * 10}/yr`);

      finalItem.append(addonName);
      finalItem.append(addonPrice);
      addonsListWrapper.append(finalItem);
    }
  }
}

function handleTheLastStep() {
  printAddonsList();
}

function showMessageOfThanks() {
  // Remove the buttons holder
  nextBtn.parentElement.style.display = "none";
  // If the device is not a mobile the following styles will be applied to the final step
  if (window.innerWidth > 768) {
    steps[steps.length - 1].style.top = "50%";
    steps[steps.length - 1].style.translate = "0 -50%";
  }
}

function emptyFields() {
  emailInput.value = "sample@email.com";
  usernameInput.value = "sampleName";
  phoneInput.value = "78258";
}
