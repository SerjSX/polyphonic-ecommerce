export function userLogoutButtonClick(e) {
    e.preventDefault();
    
    $.ajax({
        url: window.location.origin + "/api/user/logout",
        type: 'POST',
        contentType: 'application/json',
        success: function (data) {
            import("./click_functions.js").then(module => {
                module.updateHTML(data);
            });
        },
        error: function (error) {
            console.error("Logout failed:", error);
        }
    })

    $("html").html()
}

export function storeLogoutButtonClick(e) {
    e.preventDefault();
    
    $.ajax({
        url: window.location.origin + "/api/store/logout",
        type: 'POST',
        contentType: 'application/json',
        success: function (data) {
            import("./click_functions.js").then(module => {
                module.updateHTML(data);
            });
        },
        error: function (error) {
            console.error("Logout failed:", error);
        }
    })

    $("html").html()
}