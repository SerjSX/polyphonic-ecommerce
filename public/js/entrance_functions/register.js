//this container is where login/register html is injected
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

//fadesout the enterContainer div, primarily for close buttons
function closeMenu() {
    enterContainer.fadeOut(300);
}

//This function is unified to handle both user and store registration
function processRegister(connect_type) {
    let register_html;

    //The HTML to inject into the enterContainer div is based on the type of account 
    // as the forms used are different
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

      <form id="user-register-form" class="form-container w-full" enctype="multipart/form-data">
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

      <form id="store-register-form" class="form-container w-full" enctype="multipart/form-data">
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

          <div class="form-group">
            <label for="file" class="form-label form-label-dark">
              <div class="flex items-center justify-center gap-4">
                  <span> Upload your store picture </span>

                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                          stroke-width="1.5" stroke="currentColor" class="size-6">
                          <path stroke-linecap="round" stroke-linejoin="round"
                          d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75" />
                  </svg>
              </div>

              <input type="file" id="file" name="file" required/>
            </label>

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
    
    
    //hiding enterContainer
    enterContainer.css({ "display": "none" });

    //Putting the data in 
    enterContainer.html(register_html);

    //Fading in the entercontainer element
    enterContainer.fadeIn(1000);

    // implement user register submit event on the form based on the type of account
    $(`#${connect_type}-register-form`).on('submit', function (e) {
        e.preventDefault();

        //getting the data for the form to pass to the backend api
        const formData = new FormData(this);

        //sending the data to the backend api
        //the api link is based on the type of account
        $.ajax({
            url: window.location.origin + `/api/${connect_type}/register`,
            type: 'POST',
            data: formData,
            processData:false,
            contentType: false,
            success: function (data) {
              //if the data is success, that means the account was created successfully
                //so we close the menu and show a success alert
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

    //Adding a click event listener for closing the enterContainer div
    $(".modal-close-button").off("click").on("click", function () {
        closeMenu();
    })
}