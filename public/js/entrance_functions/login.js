const enterContainer = $('.enter-container');

const template = `
<div class="enter-header">
    <button class="close-button">
        Close
    </button>
    <h1>REPLACE Login</h1>
</div>

<div class="error-message hidden">
    <p></p>
</div>

<form action="/api/REPLACE/login" method="POST" id="REPLACE-login-form">
    <table class="form-group">
        <tr>
           <th><label for="email">Email</label></th>
           <td><input type="email" id="email" name="email" required></td>
        </tr>

        <tr>
            <th><label for="password">Password</label></th>
            <td><input type="password" id="password" name="password" required></td>
         </tr>
    </table>
    
    <button type="submit" class="door-button" id="REPLACE-login-button">Login</button>
</form>

<p>Don't have an account? <button id="register-shortcut">Register</button></p>
`;

export function userLoginButtonClick(e) {
    //user login button's click event
    e.preventDefault();
    enterContainer.css({"display": "none"});

    enterContainer.html(template.replaceAll('REPLACE', 'user'));
    
    enterContainer.fadeIn(1000);

    const loginForm = $('#user-login-form');

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
            url: window.location.origin + "/api/user/login",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
              email: email,
              password: password
            }),
            success: function (data) {
                import("./click_functions.js").then(module => {
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

    $(".close-button").off("click").on("click", function() {
        closeMenu()
    })
    
    //to make the register shortcut work, we use the same function from the register.js file
    import("./register.js").then(module => {
        const registerShortcut = $("#register-shortcut");
        registerShortcut.on('click', module.userRegisterButtonClick);
    });

};

export function storeLoginButtonClick(e) {
    //user login button's click event
    e.preventDefault();
    enterContainer.css({"display": "none"});

    enterContainer.html(template.replaceAll('REPLACE', 'store'));
    
    enterContainer.fadeIn(1000);

    const loginForm = $('#store-login-form');

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
            url: window.location.origin + "/api/store/login",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
              email: email,
              password: password
            }),
            success: function (data) {
                import("./store_click_functions.js").then(module => {
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

    $(".close-button").off("click").on("click", function() {
        closeMenu()
    })

    //to make the register shortcut work, we use the same function from the register.js file
    import("./register.js").then(module => {
        const registerShortcut = $("#register-shortcut");
        registerShortcut.on('click', module.userRegisterButtonClick);
    });

};

//Checks if a user account exists.
export function userLoginCheck(e) {
    $.get('/api/user/check', function (data) {
        if (data != "No Account") {
            $.get('/api/user/dashboard', function(data) {
    
                import("./click_functions.js").then(module => {
                    module.applyButtonClicks(data);
                }).catch (error => {
                    console.log("No account, error: " + error);
                });
    
            })
        } 
    })
}

function closeMenu() {
    enterContainer.fadeOut(300);
}