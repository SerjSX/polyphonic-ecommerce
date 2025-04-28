const enterContainer = $('#enter-container');

const template = `
        <div class="enter-header">
            <a href="/REPLACE/login"><button>Back</button></a>
            <h1>Register REPLACE</h1>
        </div>
        <form action="/api/REPLACE/register" method="POST">
            <table class="form-group">
                <tr>
                   <th><label for="name">Name</label></th>
                   <td><input type="text" id="name" name="name" required></td>
                </tr>
                
                <tr>
                   <th><label for="founded_date">Founded Date</label></th>
                   <td><input type="date" id="founded_date" name="founded_date" placeholder="YYYY-MM-DD" required></td>
                </tr>

                <tr>
                    <th><label for="phone_number">Phone Number</label></th>
                    <td><input type="text" id="phone_number" name="phone_number" required></td>
                </tr>

                <tr>
                    <th><label for="location">Location</label></th>
                    <td><input type="text" id="location" name="location"></td>
                </tr>

                <tr>
                    <th><label for="email">Email</label></th>
                    <td><input type="email" id="email" name="email" required></td>
                </tr>

                <tr>
                    <th><label for="password">Password</label></th>
                    <td><input type="password" id="password" name="password" required></td>
                </tr>
            </table>

            <button type="submit" class="door-button">Register</button>
        </form>
`;

// we export this function since it can be called again from the login page.
export function userRegisterButtonClick(e) {
    //user login button's click event
    e.preventDefault();
    enterContainer.css({"display": "none"});

    enterContainer.html(`
        <div class="enter-header">
            <button id="user-register-back">Back</button>
            <h1>User Registration</h1>
        </div>

        <form id="user-register-form">
            <table class="form-group">
                <tr>
                    <th><label for="name">User Name</label></th>
                    <td><input type="text" id="name" name="name" required></td>
                </tr>
                <tr>
                    <th><label for="email">Email</label></th>
                    <td><input type="email" id="email" name="email" required></td>
                </tr>
                <tr>
                    <th><label for="password">Password</label></th>
                    <td><input type="password" id="password" name="password" required></td>
                </tr>
                <tr>
                    <th><label for="age">Age</label></th>
                    <td><input type="number" id="age" name="age" required></td>
                </tr>
                <tr>
                    <th><label for="address">Address</label></th>
                    <td><input type="text" id="address" name="address" required></td>
                </tr>
                <tr>
                    <th><label for="phone_number">Phone Number</label></th>
                    <td><input type="text" id="phone_number" name="phone_number" required></td>
                </tr>
            </table>


            <button type="submit" id="user-register-button">Register</button>
        </form>
        `);
    
    enterContainer.fadeIn(1000);

    // implement user register back
    $('#user-register-form').on('submit', function (e) {
        e.preventDefault();

        const name = $("#name").val();
        const email = $("#email").val();
        const password = $("#password").val();
        const age = $("#age").val();
        const address = $("#address").val();
        const phone_number = $("#phone_number").val();

        $.ajax({
            url: window.location.origin + "/api/user/register",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
              name: name,
              email: email,
              password: password,
              age: age,
              address: address,
              phone_number: phone_number
            }),
            success: function(data) {
                if (data == "Success") {
                    $("main").fadeOut(1000);

                    $("#message-box").html(`
                        <p>Registration Successful. Please log in to your account.</p>`)
                    $("#message-box").addClass("success-message")
                    $("#message-box").fadeIn(1000);
    
                    $("#message-box").delay(5000).fadeOut(1000);
                } else {
                    alert(data);
                }

            },
            error: function (err) {
              console.error('Error in creating account:', err);
              alert('Failed to create account. Please try again later.');
            }
          });
    })



};

export function storeRegisterButtonClick(e) {
    //user login button's click event
    e.preventDefault();
    enterContainer.css({"display": "none"});

    enterContainer.html(`
        <div class="enter-header">
            <button id="store-register-back">Back</button>
            <h1>Store Registration</h1>
        </div>
        <form action="/api/store/register" method="POST">
            <table class="form-group">
                <tr>
                   <th><label for="name">Store Name</label></th>
                   <td><input type="text" id="name" name="name" required></td>
                </tr>
                
                <tr>
                   <th><label for="founded_date">Founded Date</label></th>
                   <td><input type="date" id="founded_date" name="founded_date" placeholder="YYYY-MM-DD" required></td>
                </tr>

                <tr>
                    <th><label for="phone_number">Phone Number</label></th>
                    <td><input type="text" id="phone_number" name="phone_number" required></td>
                </tr>

                <tr>
                    <th><label for="location">Location</label></th>
                    <td><input type="text" id="location" name="location"></td>
                </tr>

                <tr>
                    <th><label for="email">Email</label></th>
                    <td><input type="email" id="email" name="email" required></td>
                </tr>

                <tr>
                    <th><label for="password">Password</label></th>
                    <td><input type="password" id="password" name="password" required></td>
                </tr>
            </table>

            <button type="submit" class="door-button">Register</button>
        </form>
        `)
    
    enterContainer.fadeIn(1000);

    //implement store register back

};