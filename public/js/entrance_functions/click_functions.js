function errorHandler(err_status, err_response) {
    alert(err_response);

    if (err_status === 401) {
        location.reload();
    } else if (err_status === 404) {
        $(".overlay").fadeOut(300);
    }

    console.log(`Error Status: ${err_status}\nMessage: ${err_response}`);
}

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


    }).fail(function (err) {
        errorHandler(err.status, err.responseText || err.statusText);
    });
}

function clickShowOrderButton(e) {
    e.preventDefault();
    $.get("/api/user/orders", function (data) {

        updateHTML(data, true);
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
                        alert(data);
                        clickShowOrderButton(e);
                    },
                    error: function (err) {
                        errorHandler(err.status, err.responseText || err.statusText);
                    }
                });
            }

        });

    }).fail(function (err) {
        errorHandler(err.status, err.responseText || err.statusText);
    });
}

function clickShowCartButton(e) {
    e.preventDefault();
    $.get("/api/user/get-cart", function (data) {
        updateHTML(data, true);
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
                        alert(data);
                        clickShowCartButton(e);
                    },
                    error: function (err) {
                        errorHandler(err.status, err.responseText || err.statusText);
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
                        alert(data);
                        $(".overlay").fadeOut(300);
                    },
                    error: function (err) {
                        errorHandler(err.status, err.responseText || err.statusText);
                    }
                })
            }

        })
    }).fail(function (err) {
        errorHandler(err.status, err.responseText || err.statusText);
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
            errorHandler(err.status, err.responseText || err.statusText);
        }
    }).fail(function (err) {
        errorHandler(err.status, err.responseText || err.statusText);
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


    // Extract the header, main content and footer depending if it's an overlay or no. Overlay is something like seeing
    // user cart, since it's a popup on the page.
    if (overlay == true) {
        $(".overlay").fadeOut(300, function() {$(this).remove();});
        $("body").prepend(tempBody.querySelector(".overlay"));//clearing the content in the .overlay section element

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

        const contentOne = "header";
        const contentMiddle = ".overlay"; //adds side menus like my cart and my orders whenever needed in this container
        const contentTwo = "main";

        let mainContent = tempBody.querySelector(contentTwo);
        let middleContent = tempBody.querySelector(contentMiddle);
        let headerContent = tempBody.querySelector(contentOne);
        $("body").append(middleContent);
        $("body").append(mainContent);
        $("body").prepend(headerContent);

        if (overlay_count == 1 && overlay_show == true) {
            $("main").prepend(overlay);
            $(".overlay").show();
            applyOverlayCloseButton();
        }

        $("main").fadeIn(500);
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
        }).fail(function (err) {
            errorHandler(err.status, err.responseText || err.statusText);

        });
    });
}

export function applyButtonClicks(data) {
    updateHTML(data);
    $("main").fadeIn(1000);
    buttonClicks();
}

function applyPageSwitch(e) {
    e.preventDefault();
    const api_link = $(e.currentTarget).attr("href");

    $.get(api_link, function (data) {
        updateHTML(data);
        buttonClicks();
        backButtonApply(goBackLink);//so when the user switches page and clicks back link it goes back to the dashboard
    })
}

//special function because I can't use applyButtonClicks in clickItemCard due to a different way of
// updating data on the html file
function buttonClicks() {
    import("./logout.js").then(module => {
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
            updateHTML(data, false, true);
            buttonClicks();
            applyCategoryButtonClick(back_link);
            backButtonApply(back_link);
        })
    })
}

//Adds the closing functionality of overlays open, to prevent repetitive code.
function applyOverlayCloseButton() {
    $("#close-button").off("click").on("click", function () {
        $(".overlay").fadeOut(300);
    })
}