// This function updates the body of the html page, and takes into consideration replacing 
// the back link to whatever that is needed. If/else condition checks if we need to change
// any link, if so it replaces
export function updateHTML(data, overlay, acc_type) {
    // Create a temporary DOM element to parse the HTML string
    // This way we can only replace the header and main section
    // We can't remove it from primary dashboard.ejs as it's being used to add the header and script, or else
    // when nodejs renders the dashboard.ejs without head it makes it empty by default and it gets broken.
    let tempBody = document.createElement('body');
    tempBody.innerHTML = data;


    // Extract the header, main content and footer depending if it's an overlay or no. Overlay is something like seeing
    // user cart, since it's a popup on the page.
    if (overlay == true) {
        $(".overlay").fadeOut(300, function () { $(this).remove(); });
        $("body").prepend(tempBody.querySelector(".overlay"));//clearing the content in the sidebar-overlay section element

        $(".overlay").fadeIn(300);
    } else {
        // Getting how many overlay headers we have, this tells us if there was an overlay before already.
        // this way we can back it up to show it again later
        const overlay_count = $(".overlay").length;

        if (overlay_count == 1) {
            //clearing the body of the current page to insert the new page 
            overlay = $("body").find(".overlay");
        }

        $("body").html("");

        const contentOne = "header";
        const contentLowerMid = ".enter-container";
        const contentTwo = "main";

        let mainContent = tempBody.querySelector(contentTwo);
        let lowMidContent = tempBody.querySelector(contentLowerMid);
        let headerContent = tempBody.querySelector(contentOne);
        $("body").append(lowMidContent);
        $("body").append(mainContent);
        $("body").prepend(headerContent);

        if (overlay_count == 1) {
            if (acc_type == "store") {
                import("./store_click_functions.js").then(module => {
                    module.applyOverlayCloseButton();
                });
            } else if (acc_type == "user") {
                import("./click_functions.js").then(module => {
                    module.applyOverlayCloseButton();
                });
            }
        }

        $("main").fadeIn(500);
    }
}

//this is for timeouts later in messagePopup function
var timeout;

export function messagePopup(msg_type,err_status, err_response) {
    //clears previous timeout so there won't be double.
    clearTimeout(timeout);
    
    let load_file,text_box;
    if (msg_type == "error") {
        load_file = "./templates/error_template.html";
        text_box = ".error-message-text";
    } else if (msg_type == "success") { 
        load_file = "./templates/success_template.html";
        text_box = ".success-message-text";
    }
    console.log(msg_type, err_status, err_response);
    console.log(load_file, text_box);

    $(".message-popup").load(load_file, function () {
        $(".message-popup").fadeIn(300);
        $(".message-popup").find(text_box).text(err_response);
        timeout = setTimeout(function () {
            $(".message-popup").fadeOut(200, function () {
                $(".message-popup").html("");
            })
        }, 2000);
    })

    if (msg_type == "error") {
        if (err_status === 401) {
            location.reload();
        } else if (err_status === 404) {
            $(".overlay").fadeOut(300);
        }
        
        console.log(`Error Status: ${err_status}\nMessage: ${err_response}`);

    }


}

//Adds the closing functionality of overlays open, to prevent repetitive code.
export function applyOverlayCloseButton(acc_type) {
    $("#close-button").off("click").on("click", function () {
        $(".overlay").fadeOut(300);
    })
}