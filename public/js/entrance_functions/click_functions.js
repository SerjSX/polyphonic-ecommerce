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
        updateHTML(data, true);

        applyCategoryButtonClick(link);
        applyOverlayCloseButton();

        backButtonApply();

        buttonClicks();

    }).fail(function () {
        alert("Your session is expired. Please login again.")
        location.reload();
    });
}

function clickShowOrderButton(e) {
    e.preventDefault();
    $.get("/api/user/orders", function (data) {

        if (data != "empty") {
            updateHTML(data, true);
            $(".overlay").fadeIn(200);
            
            applyOverlayCloseButton();

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
                        clickShowOrderButton(e);
                    },
                    error: function (err) {
                        console.error('Error occured when attempting to delete order:', err);
                    }
                })
            })
        } else {
            alert("Your orders list is now empty.");
        }


    }).fail(function () {
        alert("Your session is expired. Please login again.")
        location.reload();
    })

}

function clickShowCartButton(e) {
    e.preventDefault();
    $.get("/api/user/get-cart", function (data) {
        if (data != "empty") {
            updateHTML(data, true);
            $(".overlay").fadeIn(200);

            applyOverlayCloseButton();

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
                        clickShowCartButton(e);
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
                        $(".overlay").fadeOut(300, function () { $(this).remove(); })
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
    }).fail(function () {
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
    }).fail(function () {
        alert('Session or connection timeout. Reloading the page, please login again.')
        location.reload();
    })
}


/*This function is responsible to update the HTML elements
It accepts the following parameters:
    data: the content to update the html to
    overlay: the type of the content whether it's a full page change (seeing store names) or an overlay on the site (carts page in user)
    overlay_show: whether to show the overlay side content when the user clicks on a new page. For example, when the user
                  clicks on a category it both refreshes the page to show the products AND keeps the side overlay the same 
                  that way the user can change categories on the same spot.
                  This is false when the user goes BACK from the products seeing page, that way the overlay would be removed 
One of the core functions done to prevent repetitve functionality written.
*/
export function updateHTML(data, overlay, overlay_show) {
    // Create a temporary DOM element to parse the HTML string
    // This way we can only replace the header and main section
    // We can't remove it from primary dashboard.ejs as it's being used to add the header and script, or else
    // when nodejs renders the dashboard.ejs without head it makes it empty by default and it gets broken.
    let tempBody = document.createElement('body');
    tempBody.innerHTML = data;

    //Initializing variables to identify which elements to extract from the data passed and add it to the
    // current body.
    let contentOne, contentTwo;

    // Extract the header, main content and footer depending if it's an overlay or no. Overlay is something like seeing
    // user cart, since it's a popup on the page.
    if (overlay == true) {
        $(".overlay").fadeOut(300);
        $(".overlay").html("");//clearing the content in the .overlay section element

        let overlayHeaderContent = tempBody.querySelector(".overlay-header");
        let overlayBodyContent = tempBody.querySelector(".overlay-item-list");
        let overlayFooterContent = tempBody.querySelector(".overlay-footer");

        $(".overlay").append(overlayHeaderContent);
        $(".overlay").append(overlayBodyContent);
        $(".overlay").append(overlayFooterContent);

        $(".overlay").fadeIn(300);
    } else {
        // Getting how many overlay headers we have, this tells us if there was an overlay before already.
        // this way we can back it up to show it again later
        const overlay_count = $(".overlay-header").length;


        if (overlay_count == 1 && overlay_show == true) {
            //clearing the body of the current page to insert the new page 
            overlay = $("body").find(".overlay");
        }

        $("body").html("");

        contentOne = "header";
        contentTwo = "main";

        let mainContent = tempBody.querySelector(contentTwo);
        let headerContent = tempBody.querySelector(contentOne);
        $("body").append(mainContent);
        $("body").prepend(headerContent);

        if (overlay_count == 1 && overlay_show == true) {
            $("main").prepend(overlay);
            $(".overlay").show();
            applyOverlayCloseButton();
        }

        $("main").fadeIn(1000);
    }
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
        }).fail(function () {
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
    $(".product-click").off("click").on("click", clickItemCard);
    $("#order-button").off("submit").on("submit", clickShowOrderButton);
    $("#cart-button").off("submit").on("submit", clickShowCartButton);
    $(".add-to-cart").off("submit").on("submit", clickAddToCartButton);
    $(".page-switch-buttons").off("click").on("click", clickItemCard);

}

function applyCategoryButtonClick(back_link) {
    $(".item-card").off("click").on("click", function (e) {
        e.preventDefault();
        const category_products_api_link = $(e.currentTarget).attr("href");
        $.get(category_products_api_link, function (data) {
            updateHTML(data,false, true);
            buttonClicks();
            applyCategoryButtonClick(back_link);
            backButtonApply(back_link);
        })
    })
}

//Adds the closing functionality of overlays open, to prevent repetitive code.
function applyOverlayCloseButton() {
    $("#close-button").off("click").on("click", function() {
        $(".overlay").fadeOut(300);
    })
}