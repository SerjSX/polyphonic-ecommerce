// This function updates the body of the html page, and takes into consideration replacing 
// the back link to whatever that is needed. If/else condition checks if we need to change
// any link, if so it replaces
export function updateHTML(data, overlay) {
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
            $(".overlay").fadeOut(300);
        }

        $("body").html("");

        const contentOne = "header";
        const contentLowerMid = ".enter-container";
        const contentMiddle = ".overlay"; //adds side menus like my cart and my orders whenever needed in this container
        const contentTwo = "main";

        let mainContent = tempBody.querySelector(contentTwo);
        let lowMidContent = tempBody.querySelector(contentLowerMid);
        let middleContent = tempBody.querySelector(contentMiddle);
        let headerContent = tempBody.querySelector(contentOne);
        $("body").append(middleContent);
        $("body").append(lowMidContent);
        $("body").append(mainContent);
        $("body").prepend(headerContent);

        if (overlay_count == 1) {
            $("body").prepend(overlay);
            $(".overlay").show();
            applyOverlayCloseButton();
        }

        $("main").fadeIn(500);
    }
}