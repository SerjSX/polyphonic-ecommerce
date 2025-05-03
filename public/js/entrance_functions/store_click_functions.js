function errorHandler(err_status, err_response) {
    alert(err_response);

    if (err_status === 401) {
        location.reload();
    } else if (err_status === 404) {
        $(".overlay").fadeOut(300);
    }

    console.log(`Error Status: ${err_status}\nMessage: ${err_response}`);
}

// This function updates the body of the html page, and takes into consideration replacing 
// the back link to whatever that is needed. If/else condition checks if we need to change
// any link, if so it replaces
export function updateHTML(data, overlay, replace_this, replace_to) {
    if (replace_this && replace_to) {
        data = data.replace(replace_this, replace_to);
    }

    let tempBody = document.createElement('body');
    tempBody.innerHTML = data;

    let contentOne, contentTwo;

    if (overlay == true) {
        $(".overlay").fadeOut(300);
        $(".overlay").html("");

        let overlayHeaderContent = tempBody.querySelector(".overlay-header");
        let overlayBodyContent = tempBody.querySelector(".overlay-item-list");
        $(".overlay").append(overlayHeaderContent);
        $(".overlay").append(overlayBodyContent);

        $(".overlay").fadeIn(300);
    } else {
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

function refreshPrimaryPage() {
    $.get("/api/store/product/limited/0/10/", function(data) {
        applyButtonClicks(data);
    }).fail(function(err) {
        errorHandler(err.status, err.responseText);
    });
}

function deleteProduct(e) {
    e.preventDefault();

    if (confirm("Are you sure you want to delete this product?")) {
        const api_link = $(e.currentTarget).attr("action");
        console.log(api_link);
    
        $.ajax({
            url: window.location.origin + api_link,
            type: 'DELETE',
            contentType: 'application/json',
            success: function (data) {
                alert(data);
                refreshPrimaryPage();
            },
            error: function (err) {
                errorHandler(err.status, err.responseText);
            }
        });
    }

}

function addProduct(e) {
    e.preventDefault();
    $(".overlay").fadeOut(300);

    $(".overlay").load("templates/product_add.html", function () {
        $(".overlay").fadeIn(300);

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
                    errorHandler(err.status, err.responseText);
                }
            });
        });

        $('#close-button').off('click').on('click', function () {
            $(".overlay").fadeOut(300);
        });
    });
}

function updateProduct(e) {
    e.preventDefault();
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
            });

            $("#confirm-update-product-button").off("click").on("click", function (e) {
                e.preventDefault();

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
                    }), 
                    success: function (data) {
                        alert("Updated the data successfully");
                        refreshPrimaryPage();
                    }, 
                    error: function(err) {
                        errorHandler(err.status, err.responseText);
                    }
                });
            });
        },
        error: function (err) {
            errorHandler(err.status, err.responseText);
        }
    });
}

function seeTransactions(e) {
    e.preventDefault();
    $.get("/api/store/transactions", function(data) {
        updateHTML(data, true);

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
                }, 
                error: function(err) {
                    errorHandler(err.status, err.responseText);
                }
            });
        });

        $(".customer-info-button").off("click").on("click", function(e) {
            const api_link = e.target.dataset.transactionid;
            console.log(api_link);

            $.get(window.location.origin + api_link, function(data) {
                const name = data.name;
                const email = data.email;
                const address = data.address;
                const phone_number = data.phone_number;

                alert(`Here are information about the user of this transaction:\n\tName: ${name}\n\tEmail: ${email}\n\tAddress: ${address}\n\tPhone Number: ${phone_number}`);
            }).fail(function(err) {
                errorHandler(err.status, err.responseText);
            });
        });

        $("#close-transactions-button").off("click").on("click", function(e) {
            $(".overlay").fadeOut(300);
        });
    }).fail(function(err) {
        errorHandler(err.status, err.responseText);
    });
}

function seeCategories(e) {
    e.preventDefault();
    $.get("/api/store/category/get/", function (data) {
        updateHTML(data, true);

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
                    refreshPrimaryPage();
                },
                error: function(err) {
                    errorHandler(err.status, err.responseText);
                }
            });
        });

        $("#close-category-button").off("click").on("click", function() {
            $(".overlay").fadeOut(300);
        });
    }).fail(function(err) {
        errorHandler(err.status, err.responseText);
    });
}

export function applyButtonClicks(data) {
    updateHTML(data);
    $("main").fadeIn(1000);
    buttonClicks();
}

function buttonClicks() {
    $(".delete-form").off("submit").on("submit", deleteProduct);
    $(".edit-button").off("click").on("click", updateProduct);
    $("#add-product-button").off("click").on("click", addProduct);
    $("#see-transactions").off("click").on("click", seeTransactions);
    $("#see-categories").off("click").on("click", seeCategories);
}
