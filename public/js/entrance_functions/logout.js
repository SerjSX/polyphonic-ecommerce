export function userLogoutButtonClick(e) {
    e.preventDefault();
    processLogout("user");
}

export function storeLogoutButtonClick(e) {
    e.preventDefault();
    processLogout("store");
}

//Unified function to process the logout operation whether from user or store account.
function processLogout(acc_type) {
    //Confirm message used to ask the user if they are sure they want to logout
    if (confirm("Are you sure you want to logout?")) {
        //Connects to backend based on the type of the account and logs out (hence deletes the cookie and
        //refreshes the page)
        $.ajax({
            url: window.location.origin + `/api/${acc_type}/logout`,
            type: 'POST',
            contentType: 'application/json',
            success: function (data) {
                location.reload();
            },
            error: function (error) {
                console.error("Logout failed:", error);
            }
        })
    
    }
}