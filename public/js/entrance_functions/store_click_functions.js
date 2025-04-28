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
        $("body").prepend(data);
    } else {
        $("body").html(data);
        /*
        //clearing the body of the current page to insert the new page 
        $("body").html("");
        contentOne = "header";
        contentTwo = "main";

        let mainContent = tempBody.querySelector(contentTwo);
        $("body").append(mainContent);*/
    }
    /*
    let headerContent = tempBody.querySelector(contentOne);
    $("body").prepend(headerContent);
*/
    // empty the body and append the header first, then the main.

    $("main").fadeIn(1000);
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
            location.reload();
        }
    })
}

function addProduct(e) {
    e.preventDefault();
    $(".overlay").load("templates/product_add.html", function () {
        $(".overlay").fadeIn(300);

        // Use .off() to ensure no duplicate event handlers are attached
        $('#confirm-add-product-button').off('submit').on('submit', function (e) {
            e.preventDefault();
            const link = $(e.currentTarget).attr("action");

            const name = $("#name").val();
            const description = $("#description").val();
            const price = $("#price").val();
            const pay_by_installment = $("#pay_by_installment").val();
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
                        location.reload();
                    }
                },
                error: function (err) {
                    console.error('Error when trying to add product:', err);
                    alert("Your session is expired. Please login again.");
                    location.reload();
                }
            });
        });

        $('#close-button').off('click').on('click', function() {
            $(".overlay").fadeOut(300);
        })
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
    $(".delete-form").off("submit").on("submit", deleteProduct);
    $("#add-product-button").off("click").on("click", addProduct);
}