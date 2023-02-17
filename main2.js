// Constants and variables
const form = document.getElementById("form");
const usernameInput = document.querySelector("input[type=text]");
const emailInput = document.querySelector("input[type=email]");
const phoneInput = document.querySelector("input[type=number]");
const plans = document.querySelectorAll(".plan input[type=radio]");
const addons = Array.from(document.querySelectorAll(".add-on input[type=checkbox]"));
const freeMonths = document.querySelectorAll(".free-months");

// const switcher = document.querySelector(".switcher");
const switcher = document.querySelector("input.switcher");

const stepNumbers = document.querySelectorAll("div.step-number");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("back");
const changeBtn = document.getElementById("change");
const steps = document.querySelectorAll(".step");

const active = document.querySelector(`input[name="plan-price"]:checked`);
const localStorage = {
  billing_type: "Monthly",
  plan: {
    name: active.dataset.name,
    price: parseInt(active.value),
  },
  addonsList: [],
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
});

updateAddons();
showPreview();

function checker(step) {
  if (step.dataset.index == 1) {
    prevBtn.classList.remove("open");
  } else {
    prevBtn.classList.add("open");
  }
  if (step.dataset.index == 4) {
    nextBtn.textContent = "Confirm";
    nextBtn.classList.add("confirm");
  } else {
    nextBtn.textContent = "Next Step";
    nextBtn.classList.remove("confirm");
  }
}
function moveToStep(StepsArray, targetStep) {
  if (!targetStep) return;
  StepsArray.forEach((step) => {
    step.classList.remove("active");
  });
  targetStep.classList.add("active");
}

nextBtn.addEventListener("click", () => {
  const currentStep = document.querySelector(".step.active");
  const currentStepNumber = document.querySelector(".step-number.active");
  const targetStep = currentStep.nextElementSibling;
  if (!validateFields(currentStep)) {
    moveToStep(steps, targetStep);
    moveToStep(stepNumbers, stepNumbers[parseInt(currentStepNumber.dataset.index) + 1]);
    checker(targetStep);
    sendForm(currentStep);
  }
});

prevBtn.addEventListener("click", () => {
  const currentStep = document.querySelector(".step.active");
  const currentStepNumber = document.querySelector(".step-number.active");
  const targetStep = currentStep.previousElementSibling;
  moveToStep(steps, targetStep);
  moveToStep(stepNumbers, stepNumbers[currentStepNumber.dataset.index - 1]);
  checker(targetStep);
});

changeBtn.addEventListener("click", () => {
  const currentStepNumber = document.querySelector(".step-number.active");
  const currentStep = document.querySelector(".step.active");
  console.log();

  //   console.log(stepNumbers[currentStepNumber.dataset.index - 1]);
  moveToStep(steps, steps[currentStep.dataset.index - 3]);
  moveToStep(stepNumbers, stepNumbers[currentStepNumber.dataset.index - 2]);
});

plans.forEach((plan) => {
  plan.addEventListener("change", () => {
    const selected = document.querySelector(`input[name="plan-price"]:checked`);
    // console.log(selected);
    localStorage.plan.name = selected.dataset.name;
    localStorage.plan.price = Number(selected.dataset.value);
    showPreview();
    console.log(localStorage);
  });
});

switcher.addEventListener("click", () => {
  const free = document.querySelectorAll(".free-months");
  const dataBilling = switcher.getAttribute("data-billing");
  if (dataBilling == "Monthly") {
    localStorage.billing_type = "Yearly";
    switcher.dataset.billing = localStorage.billing_type;
    free[0].style.display = "block";
    free[1].style.display = "block";
    free[2].style.display = "block";
  } else if (dataBilling == "Yearly") {
    localStorage.billing_type = "Monthly";
    switcher.dataset.billing = localStorage.billing_type;
    free[0].style.display = "none";
    free[1].style.display = "none";
    free[2].style.display = "none";
  }
  switchPrice(localStorage.billing_type);
  // getTotal();
  showPreview();

  // console.log(localStorage);
});

function switchPrice(dataBilling) {
  const yearlyPrice = [90, 120, 150, { "Online service": 10 }, { "Larger storage": 20 }, { "Customizable Profile": 20 }];
  const monthlyPrice = [9, 12, 15, { "Online service": 1 }, { "Larger storage": 2 }, { "Customizable Profile": 2 }];
  const prices = document.querySelectorAll(".plan-price");
  const valPrice = document.querySelectorAll(`input[name="plan-price"]`);
  const addOnsPrice = document.querySelectorAll(`input[name="add-ons"]`);
  const addOnsPriceHTML = document.querySelectorAll(`.add-on-price`);
  const currentVal = localStorage.plan.price;
  const curentAddOnsVal = localStorage.addonsList;

  if (dataBilling == "Yearly") {
    const newValIdx = monthlyPrice.indexOf(currentVal);
    const newVal = yearlyPrice[newValIdx];
    localStorage.plan.price = newVal;

    valPrice.forEach((price, idx) => {
      price.dataset.value = `${yearlyPrice[idx]}`;
    });

    prices.forEach((price, idx) => {
      price.textContent = `$${yearlyPrice[idx]}/yr`;
    });

    addOnsPriceHTML.forEach((item) => {
      const addOnList = yearlyPrice.find((element) => element.hasOwnProperty(item.dataset.name));
      item.textContent = `$${addOnList[item.dataset.name]}/yr`;
      // console.log(addOnList);
    });

    addOnsPrice.forEach((item, idx) => {
      const addOnList = yearlyPrice.find((element) => element.hasOwnProperty(item.dataset.name));
      item.dataset.value = `${addOnList[item.dataset.name]}`;
    });

    curentAddOnsVal.forEach((item, idx) => {
      const addOnList = yearlyPrice.find((element) => element.hasOwnProperty(item.name));
      item.price = `${addOnList[item.name]}`;
    });
  } else {
    const newValIdx = yearlyPrice.indexOf(currentVal);
    const newVal = monthlyPrice[newValIdx];
    localStorage.plan.price = newVal;

    valPrice.forEach((price, idx) => {
      price.dataset.value = `${monthlyPrice[idx]}`;
    });

    prices.forEach((price, idx) => {
      price.textContent = `$${monthlyPrice[idx]}/mo`;
    });

    addOnsPriceHTML.forEach((item) => {
      const addOnList = monthlyPrice.find((element) => element.hasOwnProperty(item.dataset.name));
      item.textContent = `$${addOnList[item.dataset.name]}/mo`;
      // console.log(addOnList);
    });

    addOnsPrice.forEach((item, idx) => {
      const addOnList = monthlyPrice.find((element) => element.hasOwnProperty(item.dataset.name));
      item.dataset.value = `${addOnList[item.dataset.name]}`;
    });

    curentAddOnsVal.forEach((item, idx) => {
      const addOnList = monthlyPrice.find((element) => element.hasOwnProperty(item.name));
      item.price = `${addOnList[item.name]}`;
    });
  }
  console.log(localStorage);
}

// addons.forEach((addon) => {
//   addon.addEventListener("change", () => {
//     let finalAddonsList = [];
//     addons.forEach((addon) => {
//       if (addon.checked) {
//         finalAddonsList.push({
//           name: addon.dataset.name,
//           price: parseInt(addon.dataset.value),
//         });
//       }
//       localStorage.addonsList = finalAddonsList;
//       console.log(localStorage)
//     });
//   });
// });

//refractor

function updateAddons() {
  addons.forEach((addon) => {
    addon.addEventListener("change", () => {
      getAddons(addons);
      showPreview();
    });
  });
}
function getAddons(addonsList) {
  let finalAddonsList = [];
  addonsList.forEach((addon) => {
    if (addon.checked) {
      finalAddonsList.push({
        name: addon.dataset.name,
        price: parseInt(addon.dataset.value),
      });
    }
  });
  localStorage.addonsList = finalAddonsList;
  console.log(localStorage);
}

function getTotal() {
  const billingPrice = localStorage.plan.price;
  const addsOnPrices = localStorage.addonsList;
  // console.log(addsOnPrices);
  let total = addsOnPrices.reduce((total, val) => {
    // console.log(total);
    return (total += parseInt(val.price));
  }, 0);
  total += billingPrice;

  return total;
}

function showPreview() {
  const parent = document.querySelector(".final-wrapper .flex");
  const billingPrice = parent.querySelector(".plan-price");
  const billingType = parent.querySelector(".plan-name");
  const totalPrice = document.querySelector(".total-price");
  const totalType = document.querySelector(".total-type");
  const change = localStorage.billing_type == "Monthly" ? "/mo" : "/yr";
  const changeType = localStorage.billing_type == "Monthly" ? "Total (per month)" : "Total (per year)";
  billingPrice.innerText = `$${localStorage.plan.price} ${change}`;
  billingType.innerText = `${localStorage.plan.name} (${localStorage.billing_type})`;
  totalPrice.innerText = `$${getTotal()} ${change}`;
  totalType.innerText = ` ${changeType}`;
  const addOnParentPreview = document.querySelector(".addons-list");
  addOnParentPreview.textContent = ``;
  const ul = document.createElement("ul");
  ul.className = "add-on-info";

  const addOnsList = localStorage.addonsList;
  //   console.log(addOnsList);
  if (addOnsList) {
    addOnsList.map((item) => {
      const li = document.createElement("li");
      const span1 = document.createElement("span");
      span1.className = "add-on-info_name";
      const span2 = document.createElement("span");
      span2.className = "add-on-info_price";
      ul.append(li);
      li.append(span1);
      li.append(span2);
      span1.innerText = item.name;
      span2.innerText = `+$${item.price} ${change}`;
      addOnParentPreview.append(ul);
    });
    getTotal();
  }
}

function setError(element, message) {
  const inputControl = element.parentElement;
  const error = inputControl.querySelector(".error");

  error.style.display = "block";
  error.textContent = message;
}

function setSuccess(element) {
  const inputControl = element.parentElement;
  const error = inputControl.querySelector(".error");

  error.style.display = "none";
  // error.textContent = message;
}

const isValidEmail = (email) => {
  const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  return re.test(String(email).toLowerCase());
};

let errors = 0;
function validateFields(currentStep) {
  errors = 0;
  // const currentStep = document.querySelector(".step.active");
  if (currentStep.dataset.index == 1) {
    errors += validateUsername();
    errors += validateEmail();
    errors += validatePhone();
  }
  console.log(errors);
  return errors;
}
function validateEmail() {
  if (emailInput.value.trim() === "") {
    setError(emailInput, "Email is required");
    errors = 1;
  } else if (!isValidEmail(emailInput.value)) {
    setError(emailInput, "Enter a valid Email");
    errors = 1;
  } else {
    setSuccess(emailInput);
    errors = 0;
  }
  return errors;
}

function validateUsername() {
  if (usernameInput.value.trim() === "") {
    setError(usernameInput, "Username is required");
    errors = 1;
  } else {
    setSuccess(usernameInput);
    errors = 0;
  }
  return errors;
}

function validatePhone() {
  if (phoneInput.value.trim() === "") {
    setError(phoneInput, "Phone Number is required");
    errors = 1;
  } else {
    setSuccess(phoneInput);
    errors = 0;
  }
  return errors;
}

// function sendForm(currentStep) {
//   if (currentStep.dataset.index == 4) {
//     let request = new XMLHttpRequest();
//     request.open("GET", "#");
//     request.setRequestHeader("Content-Type", "application/json");
//     // request.onreadystatechange = () => {
//     //   if (request.readyState == 4 && request.status == 200) {
//     //     console.log("ready to send");
//     //     // The logic of sending form data with ajax request
//     //   }
//     // };
//     request.addEventListener("load", () => {
//       if (request.readyState == 4 && request.status == 200) {
//         const res = JSON.parse(request.responseText);
//         console(res);
//         console.log("sent successfully");
//       } else {
//         throw new Error("Bad Request");
//       }
//     });
//     request.send(JSON.stringify(localStorage));
//   }
// }

function sendForm(currentStep) {
  if (currentStep.dataset.index == 4) {
    let request = new XMLHttpRequest();
    request.open("GET", "#");
    request.onreadystatechange = () => {
      if (request.readyState == 4 && request.status == 200) {
        console.log("ready to send");
        console.log(localStorage);

        // The logic of sending form data with ajax request
      }
    };
    request.addEventListener("load", () => {
      emptyFields();
      setTimeout(redirectToTheFirstStep, 1000);
      console.log("sent successfully");
    });
    request.send();
  }
}

function redirectToTheFirstStep() {
  nextBtn.parentElement.style.display = "flex";

  moveToStep(steps, steps[0]);
  checker(steps[0]);
  moveToStep(stepNumbers, stepNumbers[0]);
}
function emptyFields() {
  usernameInput.value = "";
  phoneInput.value = "";
  emailInput.value = "";
}
