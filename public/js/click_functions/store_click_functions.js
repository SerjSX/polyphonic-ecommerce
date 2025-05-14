import {updateHTML, errorHandler} from "./micro.js";


function refreshPrimaryPage() {
    $.get("/api/store/product/limited/0/", function (data) {
        applyButtonClicks(data);
    }).fail(function (err) {
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

    $.get('/api/store/product/add-page', function (data) {
        updateHTML(data, true, "store");

        $('#add-product-form').off('submit').on('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(this); //to handle uploads

            const link = $(e.currentTarget).attr("action");

            $.ajax({
                url: window.location.origin + link,
                type: 'POST',
                data: formData,
                processData:false,//prevent jquery from processing data
                contentType:false,//prevent jquery from setting content type
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

        applyOverlayCloseButton();
    });


}

function updateProduct(e) {
    e.preventDefault();
    const product_card_parent = $(this).parents(".product-card").get(0);
    console.log(product_card_parent);

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
            updateHTML(data, true, "store");

            applyOverlayCloseButton();

            $("#update-product-form").off("submit").on("submit", function (e) {
                e.preventDefault();

                const new_product_card_parent = $(this).get(0);

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
                    error: function (err) {
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
    $.get("/api/store/transactions", function (data) {
        updateHTML(data, true, "store");

        $(".status-button").off("click").on("click", function (e) {
            e.preventDefault();
            const value_clicked = $(e.currentTarget).attr("value");
            const api_link = $(e.currentTarget).parent().attr("action") + "-" + value_clicked;

            if (value_clicked == "completed") {
                if (!confirm('Please note that once you confirm, this transaction will be completed and archived. You will not be able to see it anymore. Are you sure you want to mark it as complete?')) {
                    return;
                }
            }
            
            $.ajax({
                url: window.location.origin + api_link,
                type: 'POST',
                contentType: 'application/json',
                success: function (data) {
                    alert("Updated the status successfully");
                    seeTransactions(e);
                },
                error: function (err) {
                    errorHandler(err.status, err.responseText);
                }
            });
        });

        $(".customer-info-button").off("click").on("click", function (e) {
            const api_link = e.target.dataset.transactionid;
            console.log(api_link);

            $.get(window.location.origin + api_link, function (data) {
                const name = data.name;
                const email = data.email;
                const address = data.address;
                const phone_number = data.phone_number;

                alert(`Here are information about the user of this transaction:\n\tName: ${name}\n\tEmail: ${email}\n\tAddress: ${address}\n\tPhone Number: ${phone_number}`);
            }).fail(function (err) {
                errorHandler(err.status, err.responseText);
            });
        });

        applyOverlayCloseButton();
    }).fail(function (err) {
        errorHandler(err.status, err.responseText);
    });
}

function seeCategories(e) {
    e.preventDefault();
    $.get("/api/store/category/get/", function (data) {
        updateHTML(data, true, "store");

        $(".delete-category-form").off("submit").on("submit", function (e) {
            e.preventDefault();
            const api_link = $(e.currentTarget).attr("action");

            $.ajax({
                url: window.location.origin + api_link,
                type: 'DELETE',
                contentType: 'application/json',
                success: function (data) {
                    alert(data);
                    refreshPrimaryPage();
                    seeCategories(e);
                },
                error: function (err) {
                    errorHandler(err.status, err.responseText);
                }
            });
        });

        applyOverlayCloseButton();
    }).fail(function (err) {
        errorHandler(err.status, err.responseText);
    });
}

export function applyButtonClicks(data) {
    updateHTML(data, false, "store");
    $("main").fadeIn(1000);
    buttonClicks();
}

//Adds the closing functionality of overlays open, to prevent repetitive code.
export function applyOverlayCloseButton() {
    $("#close-button").off("click").on("click", function () {
        $(".overlay").fadeOut(300);
        buttonClicks();
    })
}

function applyPageSwitch(e) {
    e.preventDefault();
    const api_link = $(e.currentTarget).attr("href");

    $.get(api_link, function (data) {
        updateHTML(data, false, "store");
        buttonClicks();
    })
}

function buttonClicks() {
    $(".delete-form").off("submit").on("submit", deleteProduct);
    $(".edit-button").off("click").on("click", updateProduct);
    $("#add-product-button").off("click").on("click", addProduct);
    $("#see-transactions").off("click").on("click", seeTransactions);
    $("#see-categories").off("click").on("click", seeCategories);
    $(".pagination-button").off("click").on("click", applyPageSwitch);
}
