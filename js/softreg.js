//--------------------------------------------------------------------------------
//  softreg.js
//


function redirect(url) {
    window.location.href = url;
}


$(document).ready(function() {

    $("#registration").selectmenu();
    $("#registration").on("selectmenuchange", function(event, ui) {
        redirect("https://www.softconf.org/cgi-bin/admin.cgi?tab=registrations&action="+ui.item.value);
    });


    $("#reports").selectmenu();
    $("#reports").on("selectmenuchange", function(event, ui) {
        if (!ui.item.value.match(/select/i)) {
            redirect("https://www.softconf.org/cgi-bin/admin.cgi?tab=reports&action="+ui.item.value);
        }
    });

    console.log( "ready!" );
});