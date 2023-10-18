// Initialize user data array
const userData = JSON.parse(localStorage.getItem("userData")) || [];

// Email and password regex patterns
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

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
document.getElementById("signup-button").addEventListener("click", function () {
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
    tasks: [],
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
document.getElementById("login-button").addEventListener("click", function () {
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
    // Successful login, show the To-Do App for the user
    showTodoApp(user);
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

// Show To-Do App for the user
function showTodoApp(user) {
  document.getElementById("container").style.display = "none";
  document.getElementById("todo-app").style.display = "block";
  loadTodoList(user);

  // Add a click event to the logout button
  document
    .getElementById("logout-button")
    .addEventListener("click", function () {
      // Clear the login form fields
      document.getElementById("login-email").value = "";
      document.getElementById("login-password").value = "";

      // Redirect to the sign-in page
      showSignInPage();
    });
}

// Add a Task
document.getElementById("add-button").addEventListener("click", function () {
  const task = document.getElementById("todo-input").value;
  if (task.trim() !== "") {
    const user = getCurrentUser();
    if (user) {
      user.tasks.push(task);
      saveUserData();
      loadTodoList(user);
    }
    document.getElementById("todo-input").value = "";
  }
});

// Load tasks from the user's localStorage
function loadTodoList(user) {
  if (user) {
    const tasks = user.tasks || [];
    const todoList = document.getElementById("todo-list");
    todoList.innerHTML = "";
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between";
      li.innerHTML = `${task}
            <button type="button" class="btn  btn_rm btn-sm" data-index="${index}"><i class="fa-solid fa-xmark"></i></button>`;
      todoList.appendChild(li);
    });

    // Attach event listeners to remove buttons
    const removeButtons = todoList.querySelectorAll("button.btn_rm");
    removeButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const index = this.getAttribute("data-index");
        if (index !== null) {
          user.tasks.splice(index, 1);
          saveUserData();
          loadTodoList(user);
        }
      });
    });
  }
}

// Save user data to localStorage
function saveUserData() {
  localStorage.setItem("userData", JSON.stringify(userData));
}

// Get the currently logged-in user
function getCurrentUser() {
  const email = document.getElementById("login-email").value;
  const user = userData.find((u) => u.email === email);
  return user;
}
