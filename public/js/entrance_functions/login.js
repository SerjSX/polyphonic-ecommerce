const enterContainer = $('.enter-container');

const template = `
<div class="fixed inset-0 z-50 grid place-content-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
  <div class="max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
    <div class="flex items-start justify-between w-full">
      <h2 id="modalTitle" class="text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
        REPLACE Login
      </h2>
      <button type="button" class="close-button -me-4 -mt-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 focus:outline-none dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300" aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="flex flex-col justify-center items-center mt-4">
      <div class="error-message hidden mb-4 p-3 bg-red-100 text-red-700 rounded dark:bg-red-900/30 dark:text-red-400">
        <p></p>
      </div>

      <form action="/api/REPLACE/login" method="POST" id="REPLACE-login-form" class="space-y-4">
        <div class="space-y-2">
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input type="email" id="email" name="email" required class="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
        </div>

        <div class="space-y-2">
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input type="password" id="password" name="password" required class="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
        </div>

        <button type="submit" id="REPLACE-login-button" class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-800">Login</button>
      </form>

      <p class="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account? 
        
        <a id="register-shortcut"
        class="inline-block rounded-sm bg-indigo-400 px-2 py-1 text-sm font-medium text-white transition hover:scale-110 hover:shadow-xl focus:ring-3 focus:outline-hidden"
        href="#"
            >
            Register Now
        </a>
      </p>
    </div>
  </div>
</div>`;

export function userLoginButtonClick(e) {
  //user login button's click event
  e.preventDefault();
  processLoginOperation("user");
};

export function storeLoginButtonClick(e) {
  //user login button's click event
  e.preventDefault();
  processLoginOperation("store");

};

//To prevent duplicate operations, this is a unified function that changes
// whatever needed based on the account type passed (user or store)
function processLoginOperation(acc_type) {
  enterContainer.css({ "display": "none" });

  enterContainer.html(template.replaceAll('REPLACE', acc_type));

  enterContainer.fadeIn(1000);

  const loginForm = $(`#${acc_type}-login-form`);

  loginForm.on('submit', function (e) {
    e.preventDefault();

    const email = $('#email').val();
    const password = $('#password').val();

    // Validate input
    if (!email || !password) {
      alert('Please fill in all fields.');
      return;
    }

    $.ajax({
      url: window.location.origin + `/api/${acc_type}/login`,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        email: email,
        password: password
      }),
      success: function (data) {
        const import_src = (acc_type == "user") ? "./click_functions.js" : "./store_click_functions.js";
        import(import_src).then(module => {
          module.applyButtonClicks(data);
        });

      },
      error: function (err) {
        console.error('Error in login:', err);
        alert('Login failed. Please check your credentials and try again.');
        $("#email").focus();
      }
    })
  })

  $(".close-button").off("click").on("click", function () {
    closeMenu()
  })

  //to make the register shortcut work, we use the same function from the register.js file
  import("./register.js").then(module => {
    const registerShortcut = $("#register-shortcut");
    
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

        import("./click_functions.js").then(module => {
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