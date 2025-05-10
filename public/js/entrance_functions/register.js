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
      register_html = `<div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
  <div class="modal-container">
    <div class="modal-header-content w-full">
      <h2 id="modalTitle" class="modal-title">
        User Registration
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

      <form id="user-register-form" class="form-container w-full">
        <div class="grid grid-cols-2 gap-4">
          <div class="form-group">
            <label for="name" class="form-label form-label-dark">User Name</label>
            <input type="text" id="name" name="name" required class="form-input form-input-dark">
          </div>
          
          <div class="form-group">
            <label for="email" class="form-label form-label-dark">Email</label>
            <input type="email" id="email" name="email" required class="form-input form-input-dark">
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label form-label-dark">Password</label>
            <input type="password" id="password" name="password" required class="form-input form-input-dark">
          </div>
          
          <div class="form-group">
            <label for="age" class="form-label form-label-dark">Age</label>
            <input type="number" id="age" name="age" required class="form-input form-input-dark">
          </div>
          
          <div class="form-group">
            <label for="address" class="form-label form-label-dark">Address</label>
            <input type="text" id="address" name="address" required class="form-input form-input-dark">
          </div>
          
          <div class="form-group">
            <label for="phone_number" class="form-label form-label-dark">Phone Number</label>
            <input type="text" id="phone_number" name="phone_number" required class="form-input form-input-dark">
          </div>
        </div>

        <div class="mt-6 flex justify-center">
          <button type="submit" id="user-register-button" class="form-button form-button-dark">Register</button>
        </div>
      </form>
    </div>
  </div>
</div> `;
    } else {
      register_html = `<div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
  <div class="modal-container">
    <div class="modal-header-content w-full">
      <h2 id="modalTitle" class="modal-title">
        Store Registration
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

      <form id="store-register-form" class="form-container w-full">
        <div class="grid grid-cols-2 gap-4">
          <div class="form-group">
            <label for="name" class="form-label form-label-dark">Store Name</label>
            <input type="text" id="name" name="name" required class="form-input form-input-dark">
          </div>

          <div class="form-group">
            <label for="founded_date" class="form-label form-label-dark">Founded Date</label>
            <input type="date" id="founded_date" name="founded_date" required class="form-input form-input-dark">
          </div>

          <div class="form-group">
            <label for="phone_number" class="form-label form-label-dark">Phone Number</label>
            <input type="text" id="phone_number" name="phone_number" required class="form-input form-input-dark">
          </div>

          <div class="form-group">
            <label for="location" class="form-label form-label-dark">Location</label>
            <input type="text" id="location" name="location" class="form-input form-input-dark">
          </div>

          <div class="form-group">
            <label for="email" class="form-label form-label-dark">Email</label>
            <input type="email" id="email" name="email" required class="form-input form-input-dark">
          </div>

          <div class="form-group">
            <label for="password" class="form-label form-label-dark">Password</label>
            <input type="password" id="password" name="password" required class="form-input form-input-dark">
          </div>
        </div>

        <div class="mt-6 flex justify-center">
          <button type="submit" id="store-register-button" class="form-button form-button-dark">Register</button>
        </div>
      </form>
    </div>
  </div>
</div>`;
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

    $(".modal-close-button").off("click").on("click", function () {
        closeMenu();
    })
}