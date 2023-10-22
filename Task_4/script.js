// Initialize user data array
const userData = JSON.parse(localStorage.getItem("userData")) || [];

// Email and password regex patterns
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

// Track if the user is logged in
let isLoggedIn = false;

// Function to display an alert with optional styling and a timeout
function showAlert(message, style = "danger", timeout = 3000) {
  const alertBox = document.createElement("div");
  alertBox.className = `alert alert-${style}`;
  alertBox.textContent = message;
  document.body.appendChild(alertBox);
  setTimeout(() => {
    alertBox.remove();
  }, timeout);
}

// Function to check if an input field is empty and display an alert
function checkEmptyInput(input, message) {
  if (!input.value) {
    input.style.borderColor = "red";
    showAlert(message, "danger");
    return true;
  }
  return false;
}

// Sign Up Button Clicked
document.getElementById("signup-button").addEventListener("click", function (e) {
  e.preventDefault();
  const nameInput = document.getElementById("signup-name");
  const emailInput = document.getElementById("signup-email");
  const passwordInput = document.getElementById("signup-password");

  // Reset input box borders to the default color
  nameInput.style.borderColor = "";
  emailInput.style.borderColor = "";
  passwordInput.style.borderColor = "";

  if (
    checkEmptyInput(
      nameInput,
      "Name field is empty. Please enter your name."
    ) ||
    checkEmptyInput(
      emailInput,
      "Email field is empty. Please enter your email."
    ) ||
    checkEmptyInput(
      passwordInput,
      "Password field is empty. Please enter your password."
    )
  ) {
    return;
  }

  const name = nameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;

  // Check if the email or name is already registered
  if (userData.find((user) => user.email === email)) {
    emailInput.style.borderColor = "red";
    showAlert("This email is already registered. Please use another email.");
    return;
  }

  if (userData.find((user) => user.name === name)) {
    nameInput.style.borderColor = "red";
    showAlert("This name is already registered. Please use another name.");
    return;
  }

  if (!emailRegex.test(email)) {
    emailInput.style.borderColor = "red";
    showAlert("Please enter a valid email address.");
    return;
  }

  if (!passwordRegex.test(password)) {
    passwordInput.style.borderColor = "red";
    showAlert(
      "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, and one digit."
    );
    return;
  }

  // Store user details in the userData array and in localStorage
  const user = {
    name,
    email,
    password,
  };
  userData.push(user);
  localStorage.setItem("userData", JSON.stringify(userData));

  // Show the sign-in page
  showSignIn();
});

// Function to handle form input validation and display alerts
function handleInputValidation(input, message) {
  input.style.borderColor = "red";
  showAlert(message, "danger", 3000);
}

// Sign In Button Clicked
document.getElementById("login-button").addEventListener("click", function (e) {
  e.preventDefault();
  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");

  // Reset input box borders to the default color
  emailInput.style.borderColor = "";
  passwordInput.style.borderColor = "";

  const email = emailInput.value;
  const password = passwordInput.value;

  // Check if email is empty
  if (!email) {
    handleInputValidation(
      emailInput,
      "Email field is empty. Please enter your email."
    );
    return;
  }

  // Check if password is empty
  if (!password) {
    handleInputValidation(
      passwordInput,
      "Password field is empty. Please enter your password."
    );
    return;
  }

  // Check if email is valid
  if (!emailRegex.test(email)) {
    handleInputValidation(emailInput, "Please enter a valid email address.");
    return;
  }

  // Check login credentials
  const user = userData.find(
    (u) => u.email === email && u.password === password
  );
  if (user) {
    // Successful login, hide the login container and show the "User and Comments Details" section
    document.getElementById("container").style.display = "none";
    document.querySelector('section[style="display: none;"]').style.display = "block"; // Show "User and Comments Details" section
    showAlert("Login Successfully...","success","1000");
    fetchUserDetails(); // Fetch and display user details
    // document.body.style.backgroundColor = "#343a40"; 
    document.body.style.backgroundImage = 'url("./Imgs/BG_23.jpg")'; 
    document.body.style.backgroundSize = "cover"; 
    document.body.style.backgroundRepeat = "no-repeat"; 
    document.body.style.backgroundAttachment = "fixed"; 
    document.body.style.height = "100vh";
      window.addEventListener("beforeunload", function (e) {
        if (isLoggedIn) {
          e.preventDefault();
          e.returnValue = "You want to logout the page?"; // Confirmation message
        }
      });
      document.getElementById("logout-button").addEventListener("click", function () {
        isLoggedIn = false;
         window.location.href = "login.html"; 
      });
  
      isLoggedIn = true; // Set the user as logged in
  } else {
    handleInputValidation(
      emailInput,
      "Login failed. Please check your credentials."
    );
  }
});

// Show Sign-In Page
document.getElementById("signIn").addEventListener("click", function () {
  showSignIn();
});

// Show Sign-Up Page
document.getElementById("signUp").addEventListener("click", function () {
  showSignUp();
});

// Show Sign-In Page
function showSignIn() {
  document.getElementById("signup-name").value = "";
  document.getElementById("signup-email").value = "";
  document.getElementById("signup-password").value = "";
  document.getElementById("container").classList.remove("right-panel-active");
}

// Show Sign-Up Page
function showSignUp() {
  document.getElementById("login-email").value = "";
  document.getElementById("login-password").value = "";
  document.getElementById("container").classList.add("right-panel-active");
}

// JavaScript code to fetch and display comments goes here
function fetchUserDetails() {
  fetch("https://jsonplaceholder.typicode.com/comments")
    .then((response) => response.json())
    .then((data) => {
      const userDetails = document.getElementById("userDetails");
      data.forEach((user) => {
        const card = document.createElement("div");
        card.classList.add("card","mb-3","bg-dark");
        card.innerHTML = `
          <div class="card-body">
          <h5 class="card-title"><i class="fa-regular fa-id-badge text-info"></i><span class="text-danger fs-4"> ${user.id}</span></h5>
            <h5 class="card-title"><i class="fa-regular fa-user text-success"></i><b class="text-success"> User Name:</b><span class="text-warning fs-4"> ${user.name}</span></h5>
            <h6 class="card-subtitle text-warning mb-2"><i class="fa-regular fa-envelope text-primary"></i><b class="fw-bold text-primary"> Email:</b> ${user.email}</h6>
            <p class="card-text"><i class="fa-regular fa-comment-dots text-danger"></i> <b class="text-danger fw-bold">Comment:</b><span class="fw-bold text-warning">${user.body}</span></p>
          </div>
        `;
        userDetails.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Error fetching user details:", error);
    });
}

fetchUserDetails();
