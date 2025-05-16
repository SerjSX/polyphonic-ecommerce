import {updateHTML, messagePopup} from "./micro.js";

//This function runs when the user clicks on an item card, for example a store name.
//I stored it in a separate file because when the user clicks on the back button I have to add the 
//same functionality to the item cards again, this way I can just call the same function to prevent repetition.
let goBackLink = ""; // Global variable to store the back link
let link = "";
export function clickItemCard(e) {
    e.preventDefault();
    link = $(e.currentTarget).attr("href");

    if (link == "") {
        link = $(e.currentTarget).attr("href");
        console.log(link);
    }

    $.get(link, function (data) {
        goBackLink = "/api/user/dashboard";
        updateHTML(data, true, "user");

        applyCategoryButtonClick(link);
        applyOverlayCloseButton();

        backButtonApply();

        buttonClicks();


    }).fail(function (err) {
        messagePopup("error", err.status, err.responseText || err.statusText);
    });
}

function clickShowOrderButton(e) {
    e.preventDefault();
    $.get("/api/user/orders", function (data) {

        updateHTML(data, true, "user");
        $(".overlay").fadeIn(200);

        applyOverlayCloseButton();

        $(".delete-button-form").off("click").on("click", function (e) {
            e.preventDefault();

            if (confirm("Are you sure you want to cancel this order?")) {
                const api_link = $(e.currentTarget).attr("action");

                $.ajax({
                    url: window.location.origin + api_link,
                    type: 'DELETE',
                    contentType: 'application/json',
                    success: function (data) {
                        //Informs the user on the message returned from the DELETE route, and then 
                        //refreshes the order menu
                        messagePopup("success",200, data);
                        $(".overlay").fadeOut(300);
                    },
                    error: function (err) {
                        messagePopup("error", err.status, err.responseText || err.statusText);
                    }
                });
            }

        });

    }).fail(function (err) {
        messagePopup("error", err.status, err.responseText || err.statusText);
    });
}

function clickShowCartButton(e) {
    e.preventDefault();
    $.get("/api/user/get-cart", function (data) {
        updateHTML(data, true, "user");
        $(".overlay").fadeIn(200);

        applyOverlayCloseButton();

        $(".delete-cart-button").off("click").on("click", function (e) {
            e.preventDefault();

            if (confirm("Are you sure you want to delete this item from your cart?")) {
                const api_link = $(".delete-cart-button").attr("action");
    
                $.ajax({
                    url: window.location.origin + api_link,
                    type: 'DELETE',
                    contentType: 'application/json',
                    success: function (data) {
                        //Informs the user on the message returned from the DELETE route, and then 
                        //refreshes the order menu
                        $(".overlay").fadeOut(300);
                        messagePopup("success",200, data);
                    },
                    error: function (err) {
                        messagePopup("error", err.status, err.responseText || err.statusText);
                    }
                })
            }
        })

        $("#confirm-button").off("click").on("click", function (e) {
            e.preventDefault();

            if (confirm('Are you sure you want to order these products? If yes, the supplier will contact you shortly afterwards.')) {
                $.ajax({
                    url: window.location.origin + "/api/user/confirm-cart/",
                    type: 'POST',
                    success: function (data) {
                        //Informs the user on the message returned from the DELETE route, and then 
                        //refreshes the order menu
                        $(".overlay").fadeOut(300);
                        messagePopup("success", 200, data);
                    },
                    error: function (err) {
                        messagePopup("error", err.status, err.responseText || err.statusText);
                    }
                })
            }

        })
    }).fail(function (err) {
        messagePopup("error", err.status, err.responseText || err.statusText);
    })
}

function clickAddToCartButton(e) {
    e.preventDefault();
    link = $(e.currentTarget).attr("action");

    $.ajax({
        url: window.location.origin + link,
        type: 'POST',
        contentType: 'application/json',
        success: function (data) {
            messagePopup("success", 200, "Successfully added item to your cart.");
        },
        error: function (err) {
            messagePopup("error", err.status, err.responseText || err.statusText);
        }
    }).fail(function (err) {
        messagePopup("error", err.status, err.responseText || err.statusText);
    })
}

function backButtonApply(link) {
    $("#back-button").off("click").on("click", function (e) {
        e.preventDefault();
        $.get(goBackLink, function (data) {
            applyButtonClicks(data);

            //if the gobacklink is currently at /api/category/get, that means the user was browsing the 
            //store's category so it sets the new goBackLink to the dashboard. That way, after the new page
            // is loaded and the user clicks on the gobacklink, it would redirect to the dashboard.
            if (goBackLink.includes("/api/category/get/") || goBackLink == "") {
                goBackLink = "/api/user/dashboard";
                backButtonApply();
            }
        }).fail(function (err) {
            messagePopup("error", err.status, err.responseText || err.statusText);

        });
    });
}

export function applyButtonClicks(data) {
    updateHTML(data, false, "user");
    $("main").fadeIn(1000);
    buttonClicks();
}

function applyPageSwitch(e) {
    e.preventDefault();
    const api_link = $(e.currentTarget).attr("href");

    $.get(api_link, function (data) {
        updateHTML(data, false, "user");
        buttonClicks();
        backButtonApply(goBackLink);//so when the user switches page and clicks back link it goes back to the dashboard
    })
}

//special function because I can't use applyButtonClicks in clickItemCard due to a different way of
// updating data on the html file
function buttonClicks() {
    import("../entrance_functions/logout.js").then(module => {
        $("#logout-button").off("click").on("click", function (e) {
          e.preventDefault();
          module.userLogoutButtonClick(e);
        })
    });

    $(".store-card").off("click").on("click",clickItemCard);
    $("#order-button").off("click").on("click", clickShowOrderButton);
    $("#cart-button").off("click").on("click", clickShowCartButton);
    $(".add-to-cart").off("submit").on("submit", clickAddToCartButton);
    $(".page-switch").off("click").on("click", applyPageSwitch);
}

function applyCategoryButtonClick(back_link) {
    $(".category-link").off("click").on("click", function (e) {
        e.preventDefault();
        const category_products_api_link = $(e.currentTarget).attr("href");
        $.get(category_products_api_link, function (data) {
            updateHTML(data, false, "user");
            buttonClicks();
            applyCategoryButtonClick(back_link);
            backButtonApply(back_link);
        })
    })
}

//Adds the closing functionality of overlays open, to prevent repetitive code.
export function applyOverlayCloseButton() {
    $("#close-button").off("click").on("click", function () {
        $(".overlay").fadeOut(300);
    })
}