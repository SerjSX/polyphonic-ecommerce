//This function runs when the user clicks on an item card, for example a store name.
//I stored it in a separate file because when the user clicks on the back button I have to add the 
//same functionality to the item cards again, this way I can just call the same function to prevent repetition.
let goBackLink = ""; // Global variable to store the back link
let link = "";
export function clickItemCard(e) {
    e.preventDefault();
    link = $(e.currentTarget).attr("href");
    console.log("Link clicked: " + link);
    $.get(link, function (data) {
        // Handle back button logic
        if (link.includes("/api/category/get-products")) {
            const splitted = link.split("/api/category/get-products/")[1].split("-");
            const merged = splitted[0] + "-" + splitted[1];
            goBackLink = "/api/category/get/" + merged;
        } else if (link.includes("/api/category/get/")) {
            goBackLink = "/api/user/dashboard";
        } else {
            goBackLink = "/api/user/dashboard";
        }

        $("body").html(data);
        $("main").fadeIn(1000);

        backButtonApply();

        buttonClicks();

    }).fail(function() {
        alert("Your session is expired. Please login again.")
        location.reload();
    });
}

function clickShowOrderButton(e) {
    e.preventDefault();
    $.get("/api/user/orders", function (data) {

        if (data != "empty") {
            $(".overlay").remove();
            updateHTML(data, true);
            $(".overlay").fadeIn(200);

            $("#close-orders-button").off("click").on("click", function (e) {
                $(".overlay").fadeOut(300, function () { $(this).remove(); });
            });

            $("#delete-order-button").off("click").on("click", function (e) {
                e.preventDefault();
                const api_link = $("#delete-order-button").attr("action");

                $.ajax({
                    url: window.location.origin + api_link,
                    type: 'DELETE',
                    contentType: 'application/json',
                    success: function (data) {
                        //Informs the user on the message returned from the DELETE route, and then 
                        //refreshes the order menu
                        alert(data);
                        $(".overlay").fadeOut(300, function () { 
                            $(this).remove(); 
                            clickShowOrderButton(e);
                        });
                    },
                    error: function (err) {
                        console.error('Error occured when attempting to delete order:', err);
                    }
                })
            })
        } else {
            alert("Your orders list is now empty.");
        }


    }).fail(function() {
        alert("Your session is expired. Please login again.")
        location.reload();
    })

}

function clickShowCartButton(e) {
    e.preventDefault();
    $.get("/api/user/get-cart", function (data) {
        if (data != "empty") {
            $(".overlay").remove();
            updateHTML(data, true);
            $(".overlay").fadeIn(200);

            $("#close-cart-button").off("click").on("click", function (e) {
                $(".overlay").fadeOut(300, function () { $(this).remove(); });
            });

            $(".delete-cart-button").off("click").on("click", function (e) {
                e.preventDefault();
                const api_link = $(".delete-cart-button").attr("action");

                $.ajax({
                    url: window.location.origin + api_link,
                    type: 'DELETE',
                    contentType: 'application/json',
                    success: function (data) {
                        //Informs the user on the message returned from the DELETE route, and then 
                        //refreshes the order menu
                        alert(data);
                        $(".overlay").fadeOut(300, function () { 
                            $(".overlay").remove();
                            clickShowCartButton(e);
                        });
                    },
                    error: function (err) {
                        alert('Session or connection timeout. Reloading the page, please login again.');
                        location.reload();
                    }
                })
            })

            $("#confirm-button").off("click").on("click", function (e) {
                e.preventDefault();
                $.ajax({
                    url: window.location.origin + "/api/user/confirm-cart/",
                    type: 'POST',
                    success: function (data) {
                        //Informs the user on the message returned from the DELETE route, and then 
                        //refreshes the order menu
                        alert(data);
                        $(".overlay").fadeOut(300, function(){$(this).remove();})
                    },
                    error: function (err) {
                        alert('Session or connection timeout. Reloading the page, please login again.');
                        location.reload();
                    }
                })
            })
        } else {
            alert("Your cart is now empty.");
        }
    }).fail(function() {
        alert('Session or connection timeout. Reloading the page, please login again.')
        location.reload();
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
            alert("Successfully added item to your cart.")
            $(".cart-ping").fadeIn(300).delay(5000).fadeOut("slow");

            },
        error: function (err) {
            console.error('Error:', err);
            alert('Error occured when trying to add this item to your cart. Check logs for more info.');
        }
    }).fail(function() {
        alert('Session or connection timeout. Reloading the page, please login again.')
        location.reload();
    })
}


// This function updates the body of the html page, and takes into consideration replacing 
// the back link to whatever that is needed. If/else condition checks if we need to change
// any link, if so it replaces
export function updateHTML(data, overlay, replace_this, replace_to) {
    if (replace_this && replace_to) {
        data = data.replace(replace_this, replace_to);
    }

    // Create a temporary DOM element to parse the HTML string
    // This way we can only replace the header and main section
    // We can't remove it from primary dashboard.ejs as it's being used to add the header and script, or else
    // when nodejs renders the dashboard.ejs without head it makes it empty by default and it gets broken.
    let tempBody = document.createElement('body');
    tempBody.innerHTML = data;

    //Initializing variables to identify which elements to extract from the data passed and add it to the
    // current body.
    let contentOne, contentTwo;

    // Extract the header and main content depends if it's an overlay or no. Overlay is something like seeing
    // user cart, since it's a popup on the page.
    if (overlay == true) {
        contentOne = "section";
    } else {
        //clearing the body of the current page to insert the new page 
        $("body").html("");
        contentOne = "header";
        contentTwo = "main";

        let mainContent = tempBody.querySelector(contentTwo);
        $("body").append(mainContent);
    }

    let headerContent = tempBody.querySelector(contentOne);
    $("body").prepend(headerContent);

    // empty the body and append the header first, then the main.

    $("main").fadeIn(1000);
}

function backButtonApply() {
    $("#back-button").off("click").on("click", function (e) {
        e.preventDefault();
        console.log("Link: ", link)
        console.log("Go back link: " + goBackLink);
        $.get(goBackLink, function (data) {
            applyButtonClicks(data);

            //if the gobacklink is currently at /api/category/get, that means the user was browsing the 
            //store's category so it sets the new goBackLink to the dashboard. That way, after the new page
            // is loaded and the user clicks on the gobacklink, it would redirect to the dashboard.
            if (goBackLink.includes("/api/category/get/") || goBackLink == "") {
                goBackLink = "/api/user/dashboard";
                backButtonApply();
            }
        }).fail(function() {
            alert('Session or connection timeout. Reloading the page, please login again.')
            location.reload();
        });
    });
}

export function applyButtonClicks(data) {
    updateHTML(data);
    $("main").fadeIn(1000);
    buttonClicks();
}

//special function because I can't use applyButtonClicks in clickItemCard due to a different way of
// updating data on the html file
function buttonClicks() {
    $(".item-card").off("click").on("click", clickItemCard);
    $("#order-button").off("submit").on("submit", clickShowOrderButton);
    $("#cart-button").off("submit").on("submit", clickShowCartButton);
    $(".add-to-cart").off("submit").on("submit", clickAddToCartButton);
    $(".page-switch-buttons").off("click").on("click", clickItemCard);

}