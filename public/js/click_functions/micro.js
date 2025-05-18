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
    // user cart, since it's a popup on the page. Sidebars fall under this category as well.
    if (overlay == true) {
        $(".overlay").fadeOut(300, function () { $(this).remove(); });

        //Adding the overlay element that was passed as data to the body's beginning.
        $("body").prepend(tempBody.querySelector(".overlay"));

        //Fades in the overlay element
        $(".overlay").fadeIn(300);
    } else {
        //Clearing the body element
        $("body").html("");

        //Adding the header and main content to the body
        let mainContent = tempBody.querySelector("main");
        let lowMidContent = tempBody.querySelector(".enter-container");
        let headerContent = tempBody.querySelector("header");
        $("body").append(lowMidContent);
        $("body").append(mainContent);
        $("body").prepend(headerContent);

        //Fades in the main content
        $("main").fadeIn(500);
    }
}

//this is for timeouts later in messagePopup function
var timeout;

//This function is used to show a message popup on the screen, it takes in the type of message (error or success),
// the status code and the message to be displayed. It uses jQuery to load a template from a file and then displays
export function messagePopup(msg_type, err_status, err_response) {
    //clears previous timeout so there won't be double.
    clearTimeout(timeout);

    //If the message type is error, it loads the error template, if it's success, it loads the success template
    let load_file, text_box;
    if (msg_type == "error") {
        load_file = "./templates/error_template.html";
        text_box = ".error-message-text";
    } else if (msg_type == "success") {
        load_file = "./templates/success_template.html";
        text_box = ".success-message-text";
    }

    $(".message-popup").load(load_file, function () {
        //Fades in the message popup, enters the error response text into the text box and sets a timeout to fade out the message popup after 2 seconds
        $(".message-popup").fadeIn(300);
        $(".message-popup").find(text_box).text(err_response);
        timeout = setTimeout(function () {
            $(".message-popup").fadeOut(200, function () {
                $(".message-popup").html("");
            })
        }, 2000);
    })

    //If the message type is error, it checks the status code and if it's 401, it reloads the page, if it's 404, it fades out the overlay
    if (msg_type == "error") {
        if (err_status === 401) {
            location.reload();
        } else if (err_status === 404) {
            $(".overlay").fadeOut(300);
        }

        console.log(`Error Status: ${err_status}\nMessage: ${err_response}`);

    }


}