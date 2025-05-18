
//Checks if there is a cookie for user credintials, if yes it redirects to dashboard immediately.
$.get('/check', function (data) {
    if (data == "User Account") {
        $.get('/api/user/dashboard', function (data) {
            import("./click_functions/click_functions.js").then(module => {
                module.applyButtonClicks(data);
            }).catch(error => {
                console.log("Error: " + error);
            });
        });
    }

    if (data == "Store Account") {
        $.get('/api/store/product/limited/0', function (data) {
            import("./click_functions/store_click_functions.js").then(module => {
                module.applyButtonClicks(data);
            }).catch(error => {
                console.log("Error: " + error);
            });
        })
    } else {
        console.log("No account from before. User can login.")
    }
})

$(document).ready(function () {
    //Fades in the main content of the page
    $("main").fadeIn(500);

    //Applies the click functions to the login and register buttons
    loginButtonApply();
    registerButtonApply();

    //Applies the click functions to the products button so it would load the limited products page
    $(".products-button-click").on('click', function(e) {
        $.get("/products", (data) => {
            import("./click_functions/micro.js").then(module => {
                // Uses updateHTML function to update the content of the page, this is stored in
                // click_functions/micro.js
                module.updateHTML(data);

                // Applies the click functions to the login and register buttons again as on the products
                // page there is a section to login and/or register as well
                loginButtonApply();
                registerButtonApply();
            });
        })
    })

});

//This function applies the click functions to the login buttons
function loginButtonApply() {
    //Gets the .enter-container div from the DOM since it's where the login/register elements are placed in
    const enterContainer = $('.enter-container');
    const loginButton = $('#log-in'); // Selects the login button from the DOM

    //Adds a click event listener to the login button
    loginButton.on('click', function (e) {
        //Prevents the default action of the button
        e.preventDefault();

        //Imports the account_choice.js template and replaces the REPLACE and REPLACE_TWO variables
        // This allows the user to choose between user and store login
        import("../templates/account_choice.js").then(module => {
            enterContainer.html(module.accountChoiceTemplate.replaceAll('REPLACE_TWO', 'Login').replaceAll('REPLACE', 'login'));

            //Adds a click event listener to the close button of the modal
            $(".modal-close-button").off("click").on("click", function () {
                $(".enter-container").fadeOut(300);
            })

            //Fades in the modal by default to show the account_choice html template after it was loaded
            $(".enter-container").fadeIn(300);

            //Adds click event listeners to the user and store login buttons
            let userLoginButton = $('#user-login');
            let storeLoginButton = $('#store-login');

            //Imports the login.js file and applies the click functions to the user and store login buttons
            // Based on the type chosen.
            import("./entrance_functions/login.js").then(module => {
                userLoginButton.on('click', module.userLoginButtonClick);
                storeLoginButton.on('click', module.storeLoginButtonClick);
            });
        })


    });
}

function registerButtonApply() {
    const enterContainer = $('.enter-container');
    const registerButton = $('#register');

    registerButton.on('click', function (e) {
        e.preventDefault();

        import("../templates/account_choice.js").then(module => {
            enterContainer.html(module.accountChoiceTemplate.replaceAll('REPLACE_TWO', 'Register').replaceAll('REPLACE', 'register'));

            $(".modal-close-button").off("click").on("click", function () {
                $(".enter-container").fadeOut(300);
            })

            $(".enter-container").fadeIn(300);

            let userRegisterButton = $('#user-register');
            let storeRegisterButton = $('#store-register');
            import("./entrance_functions/register.js").then(module => {
                userRegisterButton.on('click', module.userRegisterButtonClick);
                storeRegisterButton.on('click', module.storeRegisterButtonClick);
            });
        })
    });
}