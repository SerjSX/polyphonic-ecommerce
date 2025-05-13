
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
    $("main").fadeIn(500);

    loginButtonApply();
    registerButtonApply();

    $(".products-button").on('click', function(e) {
        $.get("/products", (data) => {
            import("./click_functions/micro.js").then(module => {
                module.updateHTML(data);
                loginButtonApply();
                registerButtonApply();
            });
        })
    })

});

function loginButtonApply() {
    const enterContainer = $('.enter-container');
    const loginButton = $('#log-in');

    loginButton.on('click', function (e) {
        e.preventDefault();

        import("../templates/account_choice.js").then(module => {
            enterContainer.html(module.accountChoiceTemplate.replaceAll('REPLACE_TWO', 'Login').replaceAll('REPLACE', 'login'));

            $(".modal-close-button").off("click").on("click", function () {
                $(".enter-container").fadeOut(300);
            })

            $(".enter-container").fadeIn(300);

            let userLoginButton = $('#user-login');
            let storeLoginButton = $('#store-login');
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