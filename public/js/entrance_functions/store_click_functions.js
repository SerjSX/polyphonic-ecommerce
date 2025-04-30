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
        $(".overlay").fadeOut(300);
        $(".overlay").html("");//clearing the content in the .overlay section element

        let overlayHeaderContent = tempBody.querySelector(".overlay-header");
        let overlayBodyContent = tempBody.querySelector(".overlay-item-list");
        $(".overlay").append(overlayHeaderContent);
        $(".overlay").append(overlayBodyContent);

        $(".overlay").fadeIn(300);
    } else {
        //clearing the body of the current page to insert the new page 
        $("body").html("");
        contentOne = "header";
        contentTwo = "main";

        let mainContent = tempBody.querySelector(contentTwo);
        let headerContent = tempBody.querySelector(contentOne);
        $("body").append(mainContent);
        $("body").prepend(headerContent);

        $("main").fadeIn(1000);
    }
}

//refreshes primary page when store adds, deletes or modifies a product.
function refreshPrimaryPage() {
    $.get("/api/store/product/limited/0/10/", function(data) {
        applyButtonClicks(data);
    })
}

function deleteProduct(e) {
    e.preventDefault();
    const api_link = $(e.currentTarget).attr("action");
    console.log(api_link);

    $.ajax({
        url: window.location.origin + api_link,
        type: 'DELETE',
        contentType: 'application/json',
        success: function (data) {
            alert(data);
            refreshPrimaryPage();
        }
    })
}

function addProduct(e) {
    e.preventDefault();
    $(".overlay").fadeOut(300);

    $(".overlay").load("templates/product_add.html", function () {
        $(".overlay").fadeIn(300);

        // Use .off() to ensure no duplicate event handlers are attached
        $('#confirm-add-product-button').off('submit').on('submit', function (e) {
            e.preventDefault();
            const link = $(e.currentTarget).attr("action");

            const name = $("#name").val();
            const description = $("#description").val();
            const price = $("#price").val();
            const pay_by_installment = $("#pay_by_installment").prop("checked");
            const category = $("#category").val();

            $.ajax({
                url: window.location.origin + link,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    name: name,
                    description: description,
                    price: price,
                    pay_by_installment: pay_by_installment,
                    category: category,
                }),
                success: function (data) {
                    if (data == "Product Exists") {
                        alert("There is already a product with this name. Please make the name unique.");
                    } else if (data == "No Category") {
                        alert("This category does not exist, do you want us to automatically create it?");
                    } else {
                        alert(data);
                        refreshPrimaryPage();
                    }
                },
                error: function (err) {
                    console.error('Error when trying to add product:', err);
                    alert("Your session is expired. Please login again.");
                    location.reload();
                }
            });
        });

        $('#close-button').off('click').on('click', function () {
            $(".overlay").fadeOut(300);
        })
    });

}

function updateProduct(e) {
    e.preventDefault();
    // Getting the current data of the clicked product
    const product_card_parent = $(this).parents(".product-card").get(0);

    const category = $(product_card_parent).find("#category").text().trim();
    const name = $(product_card_parent).find("#name").text().trim();
    const description = $(product_card_parent).find("#description").text().trim();
    const price = $(product_card_parent).find("#price").text().trim();
    const installment = $(product_card_parent).find("#installment").attr("title");
    const product_id = $(product_card_parent).attr("product_id");

    $.ajax({
        url: window.location.origin + "/api/store/product/update-page",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            category,
            name,
            description,
            price,
            installment
        }),
        success: function (data) {
            updateHTML(data, true);

            $("#close-button").off("click").on("click", function(e) {
                $(".overlay").fadeOut(300);
            })

            $("#confirm-update-product-button").off("click").on("click", function (e) {
                e.preventDefault();

                // getting the current updated input values
                const new_product_card_parent = $(this).parents(".overlay-item-list").get(0);
                console.log(new_product_card_parent);

                const new_name = $(new_product_card_parent).find("#name").val().trim();
                const new_description = $(new_product_card_parent).find("#description").val().trim();
                const new_price = $(new_product_card_parent).find("#price").val().trim();
                const new_installment = $(new_product_card_parent).find("#installment").is(':checked');

                $.ajax({        
                    url: window.location.origin + "/api/store/product/update/",
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        product_name_modifying: name,
                        name: new_name,
                        description: new_description,
                        price: new_price,
                        installment: new_installment,
                        product_id: product_id
                    }), success: function (data) {
                        alert("Updated the data successfully");
                        refreshPrimaryPage();
                    }, error: function(err) {
                        const err_status = err.status

                        if (err_status === 403) {
                            alert("You cannot change the name of the product to the following inserted name since there is already another product with the same name under your store.")
                        } else {
                            alert("An error occured, please double check information and login credentials. Error is printed in console.")
                        }
                        console.log("Error: " + err)
                    }})
                
            });


        },
        error: function (err) {
            console.error('Error:', err);
            alert('An error occured. The page will refresh to ensure login security.');
        }
    });
}

function seeTransactions(e) {
    e.preventDefault();
    $.get("/api/store/transactions", function(data) {
        updateHTML(data, true)

        $(".status-button").off("click").on("click", function(e) {
            e.preventDefault();
            const value_clicked = $(e.currentTarget).attr("value");
            const api_link = $(e.currentTarget).parent().attr("action") + value_clicked;
            
            $.ajax({        
                url: window.location.origin + api_link,
                type: 'POST',
                contentType: 'application/json', 
                success: function (data) {
                    alert("Updated the status successfully");
                    seeTransactions(e);
                }, error: function(err) {
                    const err_status = err.status

                    if (err_status === 404) {
                        alert("This transaction does not exist! This shouldn't happen, contact the devs please.")
                        console.log("Does not exist ERROR: " + err);
                    } else if (error_status == 401) {
                        alert("Session timeout or not authorized to do this, please login again. The page will reload now.")
                        console.log("No Authorization Error: " + err)
                        location.reload();
                    } else {
                        alert("An unknown error occured. Please chech the console logs and report to the team.")
                        console.log("UNKNOWN ERROR: " + err);
                    }

                }})

        })

        $(".customer-info-button").off("click").on("click", function(e) {
            const api_link = e.target.dataset.transactionid;
            console.log(api_link);

            $.get(window.location.origin + api_link, function(data) {
                const name = data.name;
                const email = data.email;
                const address = data.address;
                const phone_number = data.phone_number;

                alert(`Here are information about the user of this transaction:\n\tName: ${name}\n\tEmail: ${email}\n\tAddress: ${address}\n\tPhone Number: ${phone_number}`)
            })
        })

        $("#close-transactions-button").off("click").on("click", function(e) {
            $(".overlay").fadeOut(300);
        })
    }).fail(function(err) {
        const error_status = err.status;
        $(".overlay").fadeOut(300);

        if (error_status == 404) {
            alert("No transactions!");
            console.log("No Transactions Error: " + err);
        } else if (error_status == 401) {
            alert("Session timeout or not authorized to do this, please login again. The page will reload now.")
            console.log("No Authorization Error: " + err)
            location.reload();
        } else {
            alert("An unknown error occured. Please chech the console logs and report to the team.")
            console.log("UNKNOWN ERROR: " + err);
        }

    })
}

function seeCategories(e) {
    e.preventDefault();
    $.get("/api/store/category/get/", function (data) {
        updateHTML(data, true)

        $(".delete-category-form").off("submit").on("submit", function(e) {
            e.preventDefault();
            const api_link = $(e.currentTarget).attr("action");

            $.ajax({
                url: window.location.origin + api_link,
                type: 'DELETE',
                contentType: 'application/json',
                success: function (data) {
                    alert(data);
                    seeCategories(e);
                }
            })
        })

        $("#close-category-button").off("click").on("click", function() {
            $(".overlay").fadeOut(300);
        })
    })


}

export function applyButtonClicks(data) {
    updateHTML(data);
    $("main").fadeIn(1000);
    buttonClicks();
}

//special function because I can't use applyButtonClicks in clickItemCard due to a different way of
// updating data on the html file
function buttonClicks() {
    $(".delete-form").off("submit").on("submit", deleteProduct);
    $(".edit-button").off("click").on("click", updateProduct);
    $("#add-product-button").off("click").on("click", addProduct);
    $("#see-transactions").off("click").on("click", seeTransactions);
    $("#see-categories").off("click").on("click", seeCategories);
}