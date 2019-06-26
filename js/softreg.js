//--------------------------------------------------------------------------------
//  softreg.js
//


function redirect(url) {
    window.location.href = url;
}


function ensurePayment(contact_id) {
	var notes = prompt('Mark contact as "Paid"?\n\nPayment Notes: (Check #, PayPal, etc.)');

	if (notes != null) {
		notes = encodeURIComponent(notes);
		redirect('http://softconf.org/cgi-bin/admin.cgi?action=mark_paid&id=' + contact_id + '&msg=' + notes);
	}

	return false;
}


//  Toggle the archive state of a contact. isArchived is the current state, not the new state
function toggleArchive(contact_id, isArchived) {
	var notes = '';

	if (isArchived) {
		notes = prompt('Restore this archived contact?\n\nEnter reason:');
	}
	else {
		notes = prompt('Archive this contact?\n\nEnter reason:');
	}

	if (notes != null) {
		notes = encodeURIComponent(notes);
		redirect('http://softconf.org/cgi-bin/admin.cgi?action=toggle_archive&id=' + contact_id + '&archive=' + isArchived + '&msg=' + notes);
	}

	return false;
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

});
