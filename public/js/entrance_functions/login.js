const enterContainer = $('.enter-container');

// This template is for the login modal popup, the functions below replace the REPLACE
// with the account type (user or store) and the login/logout/register
const template = `<div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
  <div class="modal-container">
    <div class="modal-header-content w-full">
      <h2 id="modalTitle" class="modal-title">
        REPLACE Login
      </h2>
      <button type="button" class="modal-close-button" aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" class="close-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="flex flex-col justify-center items-center mt-4">
      <div class="error-container">
        <p></p>
      </div>

      <form action="/api/REPLACE/login" method="POST" id="REPLACE-login-form" class="form-container">
        <div class="form-group">
          <label for="email" class="form-label form-label-dark">Email</label>
          <input type="email" id="email" name="email" required class="form-input form-input-dark">
        </div>

        <div class="form-group">
          <label for="password" class="form-label form-label-dark">Password</label>
          <input type="password" id="password" name="password" required class="form-input form-input-dark">
        </div>

        <button type="submit" id="REPLACE-login-button" class="form-button form-button-dark">Login</button>
      </form>

      <p class="account-link-container">
        Don't have an account? 
        
        <a id="register-shortcut" class="register-link" href="#">
            Register Now
        </a>
      </p>
    </div>
  </div>
</div>`;

// This function applies the click functions to the user login button
export function userLoginButtonClick(e) {
  //user login button's click event
  e.preventDefault();
  processLoginOperation("user");
};

// This function applies the click functions to the store login button
export function storeLoginButtonClick(e) {
  //user login button's click event
  e.preventDefault();
  processLoginOperation("store");
};

//To prevent duplicate operations, this is a unified function that changes
// whatever needed based on the account type passed (user or store)
function processLoginOperation(acc_type) {
  //Removes the enterContainer div to make the transition smoother
  enterContainer.css({ "display": "none" });

  //Replaces the html of the enterContainer div with the login template
  enterContainer.html(template.replaceAll('REPLACE', acc_type));

  //Fades in the element
  enterContainer.fadeIn(1000);

  //Grabs the login form from the DOM to apply submiting event
  const loginForm = $(`#${acc_type}-login-form`);

  //Adding a submit event listener to the login form
  loginForm.on('submit', function (e) {
    e.preventDefault();

    // Grabs the email and password input fields from the DOM
    const email = $('#email').val();
    const password = $('#password').val();

    // Validate input
    if (!email || !password) {
      alert('Please fill in all fields.');
      return;
    }

    // Sends the login request to the server with the login credentials
    $.ajax({
      url: window.location.origin + `/api/${acc_type}/login`,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        email: email,
        password: password
      }),
      success: function (data) {
        // If the login is successful, we apply the button clicks from another js file (click_functions/click_functions.js)
        // which is responsible for buttons like adding products, seeing orders, and so on based on the type of the account
        const import_src = (acc_type == "user") ? "../click_functions/click_functions.js" : "../click_functions/store_click_functions.js";
        import(import_src).then(module => {
          module.applyButtonClicks(data);
        });

      },
      error: function (err) {
        // If the login fails, we show an error message
        // and focus on the email input field for the user to try again
        console.error('Error in login:', err);
        alert('Login failed. Please check your credentials and try again.');
        $("#email").focus();
      }
    })
  })

  //Adding a click event listener for closing the enterContainer div
  $(".modal-close-button").off("click").on("click", function () {
    closeMenu()
  })

  //to make the register shortcut work, we use the same function from the register.js file
  import("./register.js").then(module => {
    const registerShortcut = $("#register-shortcut");
    
    //Based on the account type, we change the register button's action
    // to either user or store
    if (acc_type == "user") {
      registerShortcut.on('click', module.userRegisterButtonClick);
    } else {
      registerShortcut.on('click', module.storeRegisterButtonClick);
    }
  });

}

//Checks if a user account exists.
export function userLoginCheck(e) {
  $.get('/api/user/check', function (data) {
    if (data != "No Account") {
      $.get('/api/user/dashboard', function (data) {

        import("../click_functions/click_functions.js").then(module => {
          module.applyButtonClicks(data);
        }).catch(error => {
          console.log("No account, error: " + error);
        });

      })
    }
  })
}

function closeMenu() {
  enterContainer.fadeOut(300);
}