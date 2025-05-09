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
    if (confirm("Are you sure you want to logout?")) {
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