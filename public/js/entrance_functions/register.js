const enterContainer = $('.enter-container');

// we export this function since it can be called again from the login page.
export function userRegisterButtonClick(e) {
    //user login button's click event
    e.preventDefault();
    processRegister("user");
};

export function storeRegisterButtonClick(e) {
    //store registration button's click event
    e.preventDefault();
    processRegister("store");
}

function closeMenu() {
    enterContainer.fadeOut(300);
}

function processRegister(connect_type) {
    let register_html;

    if (connect_type === "user") {
      register_html = `<div class="fixed inset-0 z-50 grid place-content-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
  <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
    <div class="flex items-start justify-between">
      <h2 id="modalTitle" class="text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
        User Registration
      </h2>
      <button type="button" class="close-button -me-4 -mt-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 focus:outline-none dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300" aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <div id="message-box" class="mt-4"></div>

    <form id="user-register-form" class="mt-6 space-y-6">
      <div class="space-y-4">
        <div class="grid grid-cols-3 items-center gap-4">
          <label for="name" class="text-sm font-medium text-gray-700 dark:text-gray-200">User Name</label>
          <input type="text" id="name" name="name" required class="col-span-2 rounded-lg border border-gray-300 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" />
        </div>
        
        <div class="grid grid-cols-3 items-center gap-4">
          <label for="email" class="text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
          <input type="email" id="email" name="email" required class="col-span-2 rounded-lg border border-gray-300 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" />
        </div>
        
        <div class="grid grid-cols-3 items-center gap-4">
          <label for="password" class="text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
          <input type="password" id="password" name="password" required class="col-span-2 rounded-lg border border-gray-300 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" />
        </div>
        
        <div class="grid grid-cols-3 items-center gap-4">
          <label for="age" class="text-sm font-medium text-gray-700 dark:text-gray-200">Age</label>
          <input type="number" id="age" name="age" required class="col-span-2 rounded-lg border border-gray-300 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" />
        </div>
        
        <div class="grid grid-cols-3 items-center gap-4">
          <label for="address" class="text-sm font-medium text-gray-700 dark:text-gray-200">Address</label>
          <input type="text" id="address" name="address" required class="col-span-2 rounded-lg border border-gray-300 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" />
        </div>
        
        <div class="grid grid-cols-3 items-center gap-4">
          <label for="phone_number" class="text-sm font-medium text-gray-700 dark:text-gray-200">Phone Number</label>
          <input type="text" id="phone_number" name="phone_number" required class="col-span-2 rounded-lg border border-gray-300 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" />
        </div>
      </div>

      <div class="flex justify-end">
        <button type="submit" id="user-register-button" class="rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Register
        </button>
      </div>
    </form>
  </div>
</div>
      `;
    } else {
      register_html = `<div class="fixed inset-0 z-50 grid place-content-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
  <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
    <div class="flex items-start justify-between">
      <h2 id="modalTitle" class="text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
        Store Registration
      </h2>
      <button type="button" class="close-button -me-4 -mt-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 focus:outline-none dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300" aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div id="message-box" class="mt-4"></div>

    <form id="store-register-form" class="mt-6 space-y-6">
      <div class="space-y-4">
        <div class="grid grid-cols-3 items-center gap-4">
          <label for="name" class="text-sm font-medium text-gray-700 dark:text-gray-200">Store Name</label>
          <input type="text" id="name" name="name" required class="col-span-2 rounded-lg border border-gray-300 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" />
        </div>

        <div class="grid grid-cols-3 items-center gap-4">
          <label for="founded_date" class="text-sm font-medium text-gray-700 dark:text-gray-200">Founded Date</label>
          <input type="date" id="founded_date" name="founded_date" required class="col-span-2 rounded-lg border border-gray-300 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" />
        </div>

        <div class="grid grid-cols-3 items-center gap-4">
          <label for="phone_number" class="text-sm font-medium text-gray-700 dark:text-gray-200">Phone Number</label>
          <input type="text" id="phone_number" name="phone_number" required class="col-span-2 rounded-lg border border-gray-300 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" />
        </div>

        <div class="grid grid-cols-3 items-center gap-4">
          <label for="location" class="text-sm font-medium text-gray-700 dark:text-gray-200">Location</label>
          <input type="text" id="location" name="location" class="col-span-2 rounded-lg border border-gray-300 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" />
        </div>

        <div class="grid grid-cols-3 items-center gap-4">
          <label for="email" class="text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
          <input type="email" id="email" name="email" required class="col-span-2 rounded-lg border border-gray-300 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" />
        </div>

        <div class="grid grid-cols-3 items-center gap-4">
          <label for="password" class="text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
          <input type="password" id="password" name="password" required class="col-span-2 rounded-lg border border-gray-300 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" />
        </div>
      </div>

      <div class="flex justify-end">
        <button type="submit" id="store-register-button" class="rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Register
        </button>
      </div>
    </form>
  </div>
</div>
  `;
    }
    
    

    // login button's click event
    enterContainer.css({ "display": "none" });

    enterContainer.html(register_html);

    enterContainer.fadeIn(1000);

    // implement user register back
    $(`#${connect_type}-register-form`).on('submit', function (e) {
        e.preventDefault();

        const name = $("#name").val();
        const email = $("#email").val();
        const password = $("#password").val();
        const phone_number = $("#phone_number").val();
        let data_to_pass;

        if (connect_type == "user") {
            const age = $("#age").val();
            const address = $("#address").val();

            data_to_pass = {
                name: name,
                email: email,
                password: password,
                age: age,
                address: address,
                phone_number: phone_number
            }
        } else {
            const founded_date = $("#founded_date").val();
            const location = $("#location").val();

            data_to_pass = {
                name: name,
                founded_date: founded_date,
                phone_number: phone_number,
                location: location,
                email: email,
                password: password
            }
        }

        $.ajax({
            url: window.location.origin + `/api/${connect_type}/register`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data_to_pass),
            success: function (data) {
                if (data == "Success") {
                    alert("Registration successful. You can now login to your account.")
                    closeMenu();
                } else {
                    alert(data);
                }

            },
            error: function (err) {
                console.error('Error in creating account:', err);
                alert(err.responseText);
            }
        });
    })

    $(".close-button").off("click").on("click", function () {
        closeMenu();
    })
}