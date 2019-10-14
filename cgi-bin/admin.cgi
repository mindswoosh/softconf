#!/usr/bin/perl

use strict;
use warnings;

use Settings;
use Globals qw($otherDiagnosisTitle %peopleTypes %reg_type $CONFERENCE_ID $report_dir $system_url);
use Database;

use CGI;
use CGI::Carp 'fatalsToBrowser';

use Reports;
use TextTools qw(trim quote textToHTML);
use Lists;
use Interface;
use Common qw(is_fully_paid is_late_registrant redirect contactNameHTML sort_by_field);

our $q = CGI->new;

our $tab    = $q->param('tab')    || "registrations";
our $action = $q->param('action') || "";
our $search = $q->param('search') || "";
our $id     = $q->param('id')     || "";


#----------------------------------------------------------------------------------------------------


if ($action eq "summary") {
    display_contact($id);
}
elsif ($action eq "mark_paid") {
	mark_paid($id);
}
elsif ($action eq "toggle_archive") {
	toggle_archive($id);
}
elsif ($tab eq "registrations") {
    list_contacts($action || "all", $search);
}
elsif ($tab eq "reports") {
    show_reports($action || "select_rep");
}
elsif ($tab eq "form") {
    form_editor();
}
else {
    print_header();
    print_navigation("registrations");
    print_reg_menu($action);

    print "<br><br>Not yet implemented...";
    print_footer();
}

exit;


#----------------------------------------------------------------------------------------------------


sub list_contacts {
    my $reg_type = shift;
    my $search = shift || "";

    my @matching_contacts;

    if ($reg_type eq "abandoned") {

        @matching_contacts = get_contact_list($search, "completed", "all");

        my %emails;
        for my $contact_ref (@matching_contacts) {
            my $contact_email = lc $contact_ref->{email};
            $emails{$contact_email}++;
        }

        @matching_contacts = grep { my $contact_email = lc($_->{email}); !$emails{$contact_email} } get_contact_list($search, "abandoned", "all");

    }
    elsif ($reg_type eq "archived") {
    	@matching_contacts = get_archived_list($search);
    }
    elsif ($reg_type eq "unpaid") {
        @matching_contacts = get_contact_list($search, "completed", "all", "unpaid");
    }
    else {
        @matching_contacts = get_contact_list($search, "completed", $reg_type, "all");
    }

    print_header();
    print_navigation("registrations");

    print qq~<h3 class="admin-indent">Show Registrations:</h3>~;
    print_reg_menu($reg_type);
    print qq~<h3 class="admin-indent">&nbsp; Search:</h3>~;
    print qq~
      <form action="/cgi-bin/admin.cgi" method="GET" style="display: inline-block;">
        <input type="hidden" name="tab" value="$tab">
        <input type="hidden" name="action" value="$reg_type">
        <input type="text"   name="search" value="" size="20" maxlength="40" autofocus>
        <button type="submit">Go</button>
      </form>
    ~;
    print qq~<br><br><br><div class="admin-twice-indent">~;

    if (@matching_contacts != 0) {
        my $i = 1;
        for my $contact_ref (@matching_contacts) {
            my %contact = %{$contact_ref};

            next if ($reg_type eq "unpaid" && is_fully_paid(%contact));

            print qq~
          <span class="row-num">$i: </span><a href="/cgi-bin/admin.cgi?action=summary&id=$contact{id}">~ . contactNameHTML(%contact) . qq~</a><br><br>
        ~;
            $i++;
        }
    }
    else {
        print qq~<br><span class="admin-indent">No matches.</span><br><br>~;
    }

    if ($search ne "") {
        print qq~<br><br><a class="admin-indent" href="/cgi-bin/admin.cgi?tab=registrations&action=$reg_type&search="">Show All</a>~;
    }
    print "</div><br><br>";

    print_footer();
}


#----------------------------------------------------------------------------------------------------


sub display_contact {
    my $contact_id = shift;

    my %contact = GetContact($contact_id);

    my $text = contact_summary($contact_id);

    $text = textToHTML($text);

    $text =~ s/Not&nbsp;Paid&nbsp;Yet/Not Paid Yet<span class="admin-medium-box"><\/span><button id="paymentbtn" type="button" onclick="ensurePayment($contact_id);">Mark as Paid<\/button>/;

    print_header();
    print_navigation("registrations");
    print qq~
    	<div style="margin-left: 10px;">
			<input action="action" type="button" value="<< Go Back" onclick="window.history.go(-1); return false;"><br><br>
			<h1>Registration for:</h1>
	~;

	if ($contact{archived}) {
		print qq~<h3><font color="red">THIS CONTACT IS ARCHIVED</font></h3><font color="red">Archive reason: $contact{archiveNotes}</font><br>~;
	}

    if (is_late_registrant($contact{id})) {
        print qq~<h3><font color="orange">Late Registrant</font></h3>~;
    }
    else {
        print "<br>";
    }

	print qq~
			<div style="font-family: monospace, monospace; font-size: 14px; margin-left: 15px;">
			 $text
			 <br><br>
			</div>
	~;

	if ($contact{archived}) {
		print qq~<button id="paymentbtn" type="button" onclick="toggleArchive($contact_id, $contact{archived});">Restore Contact<\/button>~;
	}
	else {
		print qq~<button id="paymentbtn" type="button" onclick="toggleArchive($contact_id, $contact{archived});">Archive Contact<\/button>~;
	}

	print qq~</div>~;
    print_footer();

    exit;
}


#----------------------------------------------------------------------------------------------------


sub reception_report {

	#  Create the .csv version
	
    my $csv = "Welcome Reception - Fully Paid:\n\n";
    my @matching_contacts = get_contact_list($search, "completed", "full", "paid");
    $csv .= reception_csv(@matching_contacts);

    $csv .= "\n\n\nWelcome Reception - Not Paid:\n\n";
    @matching_contacts = get_contact_list($search, "completed", "full", "unpaid");
    $csv .= reception_csv(@matching_contacts);

    #  Save the .csv file
    open(my $fh, '>', "$report_dir/reception.csv") or die "Could not save reception.csv";
    print $fh $csv;
    close $fh;


    #  Display the HTML version...

    my $html = "<h3>Welcome Reception - Fully Paid:</h3>";
    @matching_contacts = get_contact_list($search, "completed", "full", "paid");
    $html .= reception_html(@matching_contacts);

    $html .= "<br><br><h3>Welcome Reception - Not Paid:</h3>";
    @matching_contacts = get_contact_list($search, "completed", "full", "unpaid");
    $html .= reception_html(@matching_contacts);

    $html .= "<br>"x3 . qq~<a href="/reports/reception.csv" download="reception.csv">Download CSV Report</a><br><br>~;

    return $html;
}


#----------------------------------------------------------------------------------------------------


sub general_meals_report {

	#  Create the .csv version
	
    my $csv = "General Meals for Fully Registered - Fully Paid:\n\n";
    my @matching_contacts = get_contact_list($search, "completed", "full", "paid");
    $csv .= general_meals_csv(@matching_contacts);

    $csv .= "\n\n\nGeneral Meals for Fully Registered - Not Paid:\n\n";
    @matching_contacts = get_contact_list($search, "completed", "full", "unpaid");
    $csv .= general_meals_csv(@matching_contacts);

    #  Save the .csv file
    open(my $fh, '>', "$report_dir/general_meals.csv") or die "Could not save general_meals.csv";
    print $fh $csv;
    close $fh;


    #  Display the HTML version...

    my $html = "<h3>General Meals for Fully Registered - Fully Paid:</h3>";
    @matching_contacts = get_contact_list($search, "completed", "full", "paid");
    $html .= general_meals_html(@matching_contacts);

    $html .= "<br><br><h3>General Meals for Fully Registered - Not Paid:</h3>";
    @matching_contacts = get_contact_list($search, "completed", "full", "unpaid");
    $html .= general_meals_html(@matching_contacts);

    $html .= "<br>"x3 . qq~<a href="/reports/general_meals.csv" download="general_meals.csv">Download CSV Report</a><br><br>~;

    return $html;
}

#----------------------------------------------------------------------------------------------------


sub welcome_report {

	#  Create the .csv version
	
    my $csv = "Welcome Dinners - Fully Paid:\n\n";
    my @matching_contacts = get_contact_list($search, "completed", "full", "paid");
    $csv .= welcome_dinner_csv(@matching_contacts);

    $csv .= "\n\n\nWelcome Dinners - Not Paid:\n\n";
    @matching_contacts = get_contact_list($search, "completed", "full", "unpaid");
    $csv .= welcome_dinner_csv(@matching_contacts);

    #  Save the .csv file
    open(my $fh, '>', "$report_dir/welcome_dinner.csv") or die "Could not save welcome_dinner.csv";
    print $fh $csv;
    close $fh;


    #  Display the HTML version...

    my $html = "<h3>Welcome Dinners - Fully Paid:</h3>";
    @matching_contacts = get_contact_list($search, "completed", "full", "paid");
    $html .= welcome_dinner_html(@matching_contacts);

    $html .= "<br><br><h3>Welcome Dinners - Not Paid:</h3>";
    @matching_contacts = get_contact_list($search, "completed", "full", "unpaid");
    $html .= welcome_dinner_html(@matching_contacts);

    $html .= "<br>"x3 . qq~<a href="/reports/welcome_dinner.csv" download="welcome_dinner.csv">Download CSV Report</a><br><br>~;

    return $html;
}


#----------------------------------------------------------------------------------------------------


sub first_timers_report {

	#  Create the .csv version
	
    my $csv = "First Time Attendees - Fully Paid:\n\n";
    my @matching_contacts = get_contact_list($search, "completed", "full", "paid");
    $csv .= first_timers_csv(@matching_contacts);

    $csv .= "\n\n\nFirst Time Attendees - Not Paid:\n\n";
    @matching_contacts = get_contact_list($search, "completed", "full", "unpaid");
    $csv .= first_timers_csv(@matching_contacts);

    #  Save the .csv file
    open(my $fh, '>', "$report_dir/first_timers.csv") or die "Could not save first_timers.csv";
    print $fh $csv;
    close $fh;


    #  Display the HTML version...

    my $html = "<h3>First Time Attendees - Fully Paid:</h3>";
    @matching_contacts = get_contact_list($search, "completed", "full", "paid");
    $html .= first_timers_html(@matching_contacts);

    $html .= "<br><br><h3>First Time Attendees - Not Paid:</h3>";
    @matching_contacts = get_contact_list($search, "completed", "full", "unpaid");
    $html .= first_timers_html(@matching_contacts);

    $html .= "<br>"x3 . qq~<a href="/reports/first_timers.csv" download="first_timers.csv">Download CSV Report</a><br><br>~;

    return $html;
}


#----------------------------------------------------------------------------------------------------


sub softwear_report {

	#  Create the .csv version
	
    my $csv = "Shirts ordered - Fully Paid:\n\n";
    my @matching_contacts = get_contact_list($search, "completed", "all", "paid");
    $csv .= shirts_ordered_csv(@matching_contacts);

    $csv .= "\n\n\nShirts ordered - Not Paid:\n\n";
    @matching_contacts = get_contact_list($search, "completed", "all", "unpaid");
    $csv .= shirts_ordered_csv(@matching_contacts);

    #  Save the .csv file
    open(my $fh, '>', "$report_dir/softwear.csv") or die "Could not save softwear.csv";
    print $fh $csv;
    close $fh;


    #  Display the HTML version...

    my $html = "<h3>SOFT Wear Orders - Fully Paid:</h3>";
    @matching_contacts = get_contact_list($search, "completed", "all", "paid");
    $html .= shirts_ordered_html(@matching_contacts);

    $html .= "<br><br><h3>SOFT Wear Orders - Not Paid:</h3>";
    @matching_contacts = get_contact_list($search, "completed", "all", "unpaid");
    $html .= shirts_ordered_html(@matching_contacts);

    $html .= "<br>"x3 . qq~<a href="/reports/softwear.csv" download="softwear.csv">Download CSV Report</a><br><br>~;

    return $html;
}


#----------------------------------------------------------------------------------------------------


sub workshop_report {

	#  Create the .csv version
	
    my $csv = "Workshop Attendance - Fully Paid:\n\n";
    $csv .= workshop_attendance_csv("paid");

    $csv .= "\n\n\nWorkshop Attendance - Not Paid:\n\n";
    $csv .= workshop_attendance_csv("unpaid");

    #  Save the .csv file
    open(my $fh, '>', "$report_dir/workshops.csv") or die "Could not save workshops.csv";
    print $fh $csv;
    close $fh;


    #  Display the HTML version...

    my $html = "<h3>Workshop Attendance - Fully Paid:</h3>";
    $html .= workshop_attendance_html("paid");

    $html .= "<br><h3>Workshop Attendance - Not Paid:</h3>";
    $html .= workshop_attendance_html("unpaid");

    $html .= qq~<br><a href="/reports/workshops.csv" download="workshops.csv">Download CSV Report</a><br><br>~;

    return $html;
}


#----------------------------------------------------------------------------------------------------


sub clinic_report {

	#  Create the .csv version
	
    my $csv = "Clinic Choices - Fully Paid:\n\n";
    $csv .= clinics_csv("paid");

    $csv .= "\n\n\nClinic Choices - Not Paid:\n\n";
    $csv .= clinics_csv("unpaid");

    #  Save the .csv file
    open(my $fh, '>', "$report_dir/clinics.csv") or die "Could not save clinics.csv";
    print $fh $csv;
    close $fh;


    #  Display the HTML version...

    my $html = "<h3>Clinic Choices - Fully Paid:</h3>";
    $html .= clinics_html("paid");

    $html .= "<br><h3>Clinic Choices - Not Paid:</h3>";
    $html .= clinics_html("unpaid");

    $html .= qq~<br><a href="/reports/clinics.csv" download="clinics.csv">Download CSV Report</a><br><br>~;

    return $html;
}


#----------------------------------------------------------------------------------------------------


sub sibouting_report {

	#  Create the .csv version
	
    my $csv = "Sib Outings - Fully Paid:\n\n";
    my @matching_contacts = get_contact_list($search, "completed", "all", "paid");
    $csv .= sibouting_csv(@matching_contacts);

    $csv .= "Sib Outings - Not Paid:\n\n";
    @matching_contacts = get_contact_list($search, "completed", "all", "unpaid");
    $csv .= sibouting_csv(@matching_contacts);

    #  Save the .csv file
    open(my $fh, '>', "$report_dir/sibouting.csv") or die "Could not save sibouting.csv";
    print $fh $csv;
    close $fh;


    #  Display the HTML version...

    my $html = "<h3>Sib Outings - Fully Paid:</h3>";
    @matching_contacts = get_contact_list($search, "completed", "all", "paid");
    $html .= sibouting_html(@matching_contacts);

    $html .= "<br><br><h3>Sib Outings - Not Paid:</h3>";
    @matching_contacts = get_contact_list($search, "completed", "all", "unpaid");
    $html .= sibouting_html(@matching_contacts);

    $html .= "<br>"x3 . qq~<a href="/reports/sibouting.csv" download="sibouting.csv">Download CSV Report</a><br><br>~;

    return $html;
}


#----------------------------------------------------------------------------------------------------


sub childcare_report {

	#  Create the .csv version
	
    my $csv = "Childcare Attendance - Fully Paid:\n\n";
    $csv .= childcare_csv("paid");

    $csv .= "\n\n\nChildcare Attendance - Not Paid:\n\n";
    $csv .= childcare_csv("unpaid");

    #  Save the .csv file
    open(my $fh, '>', "$report_dir/childcare.csv") or die "Could not save childcare.csv";
    print $fh $csv;
    close $fh;


    #  Display the HTML version...

    my $html = "<h3>Childcare Attendance - Fully Paid:</h3>";
    $html .= childcare_html("paid");

    $html .= "<br><h3>Childcare Attendance - Not Paid:</h3>";
    $html .= childcare_html("unpaid");

    $html .= qq~<br><a href="/reports/childcare.csv" download="childcare.csv">Download CSV Report</a><br><br>~;

    return $html;
}


#----------------------------------------------------------------------------------------------------


sub picnic_report {

	#  Create the .csv version

    my $csv = "Picnic Attendance - Fully Paid:\n\n";
    my @matching_contacts = get_contact_list($search, "completed", "full", "paid");
    push @matching_contacts, get_contact_list($search, "completed", "picnic", "paid");
    @matching_contacts = sort_by_field("lastName", @matching_contacts);
    $csv .= picnic_csv(@matching_contacts);

    $csv .= "\n\n\nPicnic Attendance - Not Paid:\n\n";
    @matching_contacts = get_contact_list($search, "completed", "full", "unpaid");
    push @matching_contacts, get_contact_list($search, "completed", "picnic", "unpaid");
    @matching_contacts = sort_by_field("lastName", @matching_contacts);
    $csv .= picnic_csv(@matching_contacts);

    #  Save the .csv file
    open(my $fh, '>', "$report_dir/picnic.csv") or die "Could not save picnic.csv";
    print $fh $csv;
    close $fh;


    #  Display the HTML version...

    my $html = "<h3>Picnic Attendance - Fully Paid:</h3>";
    @matching_contacts = get_contact_list($search, "completed", "full", "paid");
    push @matching_contacts, get_contact_list($search, "completed", "picnic", "paid");
    @matching_contacts = sort_by_field("lastName", @matching_contacts);
    $html .= picnic_html(@matching_contacts);

    $html .= "<br><br><h3>Picnic Attendance - Not Paid:</h3>";
    @matching_contacts = get_contact_list($search, "completed", "full", "unpaid");
    push @matching_contacts, get_contact_list($search, "completed", "picnic", "unpaid");
    @matching_contacts = sort_by_field("lastName", @matching_contacts);
    $html .= picnic_html(@matching_contacts);

    $html .= "<br>"x3 . qq~<a href="/reports/picnic.csv" download="picnic.csv">Download CSV Report</a><br><br>~;

    return $html;
}


#----------------------------------------------------------------------------------------------------


sub remembrance_report {

	#  Create the .csv version

    my $csv = "Remembrance Outing - Fully Paid:\n\n";
    my @matching_contacts = get_contact_list($search, "completed", "full", "paid");
    $csv .= remembrance_csv(@matching_contacts);

    $csv .= "\n\n\nRemembrance Outing - Not Paid:\n\n";
    @matching_contacts = get_contact_list($search, "completed", "full", "unpaid");
    $csv .= remembrance_csv(@matching_contacts);

    #  Save the .csv file
    open(my $fh, '>', "$report_dir/remembrance.csv") or die "Could not save remembrance.csv";
    print $fh $csv;
    close $fh;


    #  Display the HTML version...

    my $html = "<h3>Remembrance Outing - Fully Paid:</h3>";
    @matching_contacts = get_contact_list($search, "completed", "full", "paid");
    $html .= remembrance_html(@matching_contacts);

    $html .= "<br><br><h3>Remembrance Outing - Not Paid:</h3>";
    @matching_contacts = get_contact_list($search, "completed", "full", "unpaid");
    $html .= remembrance_html(@matching_contacts);

    $html .= "<br>"x3 . qq~<a href="/reports/remembrance.csv" download="remembrance.csv">Download CSV Report</a><br><br>~;

    return $html;
}


#----------------------------------------------------------------------------------------------------


sub chapterchair_report {

	#  Create the .csv version

    my $csv = "Chapter Chair Lunch - Fully Paid:\n\n";
    my @matching_contacts = get_contact_list($search, "completed", "full", "paid");
    $csv .= chapterchair_csv(@matching_contacts);

    $csv .= "\n\n\nChapter Chair Lunch - Not Paid:\n\n";
    @matching_contacts = get_contact_list($search, "completed", "full", "unpaid");
    $csv .= chapterchair_csv(@matching_contacts);

    #  Save the .csv file
    open(my $fh, '>', "$report_dir/chapterchair.csv") or die "Could not save chapterchair.csv";
    print $fh $csv;
    close $fh;


    #  Display the HTML version...

    my $html = "<h3>Chapter Chair Lunch - Fully Paid:</h3>";
    @matching_contacts = get_contact_list($search, "completed", "full", "paid");
    $html .= chapterchair_html(@matching_contacts);

    $html .= "<br><br><h3>Chapter Chair Lunch - Not Paid:</h3>";
    @matching_contacts = get_contact_list($search, "completed", "full", "unpaid");
    $html .= chapterchair_html(@matching_contacts);

    $html .= "<br>"x3 . qq~<a href="/reports/chapterchair.csv" download="chapterchair.csv">Download CSV Report</a><br><br>~;

    return $html;
}



#----------------------------------------------------------------------------------------------------


sub balloons_report {

	#  Create the .csv version
	
    my $csv = "Balloon Requests:\n\n";
    $csv .= balloons_csv();

    #  Save the .csv file
    open(my $fh, '>', "$report_dir/balloons.csv") or die "Could not save balloons.csv";
    print $fh $csv;
    close $fh;


    #  Display the HTML version...

    my $html = "<h3>Balloon Requests:</h3>";
    $html .= balloons_html();

    $html .= "<br>"x3 . qq~<a href="/reports/balloons.csv" download="balloons.csv">Download CSV Report</a><br><br>~;

    return $html;
}


#----------------------------------------------------------------------------------------------------


sub breakfast_report {

	#  Create the .csv version
	
    my $csv = "Final Breakfast - Fully Paid:\n\n";
    my @matching_contacts = get_contact_list($search, "completed", "full", "paid");
    $csv .= breakfast_csv(@matching_contacts);

    $csv .= "\n\n\nFinal Breakfast - Not Paid:\n\n";
    @matching_contacts = get_contact_list($search, "completed", "full", "unpaid");
    $csv .= breakfast_csv(@matching_contacts);

    #  Save the .csv file
    open(my $fh, '>', "$report_dir/breakfast.csv") or die "Could not save breakfast.csv";
    print $fh $csv;
    close $fh;


    #  Display the HTML version...

    my $html = "<h3>Final Breakfast - Fully Paid:</h3>";
    @matching_contacts = get_contact_list($search, "completed", "full", "paid");
    $html .= breakfast_html(@matching_contacts);

    $html .= "<br><br><h3>Final Breakfast - Not Paid:</h3>";
    @matching_contacts = get_contact_list($search, "completed", "full", "unpaid");
    $html .= breakfast_html(@matching_contacts);

    $html .= "<br>"x3 . qq~<a href="/reports/breakfast.csv" download="breakfast.csv">Download CSV Report</a><br><br>~;

    return $html;
}


#----------------------------------------------------------------------------------------------------


sub sort_directory {
	return sort { $a->{attendance} cmp $b->{attendance}  ||  $a->{id} cmp $b->{id}}  @_;
}

sub directory_report {

	#  Create the .csv version

    my $csv = "Directory Information - Fully Paid:\n\n";
    my @matching_contacts = get_contact_list($search, "completed", "all", "paid");
    @matching_contacts = sort_directory(@matching_contacts);
    $csv .= directory_csv(@matching_contacts);

    $csv .= "\n\n\nDirectory Information - Not Paid:\n\n";
    @matching_contacts = get_contact_list($search, "completed", "all", "unpaid");
    @matching_contacts = sort_directory(@matching_contacts);
    $csv .= directory_csv(@matching_contacts);

    #  Save the .csv file
    open(my $fh, '>', "$report_dir/directory.csv") or die "Could not save directory.csv";
    print $fh $csv;
    close $fh;


    #  Display the HTML version...

    my $html = "<h3>Directory Information - Fully Paid:</h3>";
    @matching_contacts = get_contact_list($search, "completed", "all", "paid");
    $html .= directory_html(@matching_contacts);

    $html .= "<br><br><h3>Directory Information - Not Paid:</h3>";
    @matching_contacts = get_contact_list($search, "completed", "all", "unpaid");
    $html .= directory_html(@matching_contacts);

    $html .= "<br>"x3 . qq~<a href="/reports/directory.csv" download="directory.csv">Download CSV Report</a><br><br>~;

    return $html;
}


#----------------------------------------------------------------------------------------------------

sub sort_attendance {
	return sort { $a->{attendance} cmp $b->{attendance}  ||  $a->{lastName} cmp $b->{lastName}}  @_;
}

sub attendance_report {

	#  Create the .csv version

    my $csv = "Attendance Report - Fully Paid:\n\n";
    my @matching_contacts = get_contact_list($search, "completed", "all", "paid");
    @matching_contacts = sort_attendance(@matching_contacts);
    $csv .= attendance_csv(@matching_contacts);

    $csv .= "\n\n\nAttendance Report - Not Paid:\n\n";
    @matching_contacts = get_contact_list($search, "completed", "all", "unpaid");
    @matching_contacts = sort_attendance(@matching_contacts);
    $csv .= attendance_csv(@matching_contacts);

    #  Save the .csv file
    open(my $fh, '>', "$report_dir/attendance.csv") or die "Could not save attendance.csv";
    print $fh $csv;
    close $fh;


    #  Display the HTML version...

    my $html = "<h3>Attendance Report - Fully Paid:</h3>";
    @matching_contacts = get_contact_list($search, "completed", "all", "paid");
    @matching_contacts = sort_attendance(@matching_contacts);
    $html .= attendance_html(@matching_contacts);

    $html .= "<br><br><h3>Attendance Report - Not Paid:</h3>";
    @matching_contacts = get_contact_list($search, "completed", "all", "unpaid");
    @matching_contacts = sort_attendance(@matching_contacts);
    $html .= attendance_html(@matching_contacts);

    $html .= "<br>"x3 . qq~<a href="/reports/attendance.csv" download="attendance.csv">Download CSV Report</a><br><br>~;

    return $html;
}


#----------------------------------------------------------------------------------------------------


sub softchild_report {

	#  Create the .csv version
	
    my $csv = "Soft Children of Attendees - Fully Paid:\n\n";
    my @matching_contacts = get_contact_list($search, "completed", "full", "paid");
    push @matching_contacts, get_contact_list($search, "completed", "picnic", "paid");
    @matching_contacts = sort_by_field("lastName", @matching_contacts);
    $csv .= softchildren_csv(@matching_contacts);

    $csv .= "\n\n\nSoft Children of Attendees - Not Paid:\n\n";
    @matching_contacts = get_contact_list($search, "completed", "full", "unpaid");
    push @matching_contacts, get_contact_list($search, "completed", "picnic", "unpaid");
    @matching_contacts = sort_by_field("lastName", @matching_contacts);
    $csv .= softchildren_csv(@matching_contacts);

    #  Save the .csv file
    open(my $fh, '>', "$report_dir/softchildren.csv") or die "Could not save softchildren.csv";
    print $fh $csv;
    close $fh;


    #  Display the HTML version...

    my $html = "<h3>Soft Children of Attendees - Fully Paid:</h3>";
    @matching_contacts = get_contact_list($search, "completed", "full", "paid");
    push @matching_contacts, get_contact_list($search, "completed", "picnic", "paid");
    @matching_contacts = sort_by_field("lastName", @matching_contacts);
    $html .= softchildren_html(@matching_contacts);

    $html .= "<br><br><h3>Soft Children of Attendees - Not Paid:</h3>";
    @matching_contacts = get_contact_list($search, "completed", "full", "unpaid");
    push @matching_contacts, get_contact_list($search, "completed", "picnic", "unpaid");
    @matching_contacts = sort_by_field("lastName", @matching_contacts);
    $html .= softchildren_html(@matching_contacts);

    $html .= "<br>"x3 . qq~<a href="/reports/softchildren.csv" download="softchildren.csv">Download CSV Report</a><br><br>~;

    return $html;
}


#----------------------------------------------------------------------------------------------------


sub notes_report {

	#  Create the .csv version

    my $csv = "Additional Notes - Fully Paid:\n\n";
    my @matching_contacts = get_contact_list($search, "completed", "all", "paid");
    $csv .= notes_csv(@matching_contacts);

    $csv .= "\n\n\nAdditional Notes - Not Paid:\n\n";
    @matching_contacts = get_contact_list($search, "completed", "all", "unpaid");
    $csv .= notes_csv(@matching_contacts);

    #  Save the .csv file
    open(my $fh, '>', "$report_dir/notes.csv") or die "Could not save notes.csv";
    print $fh $csv;
    close $fh;


    #  Display the HTML version...

    my $html = "<h3>Additional Notes - Fully Paid:</h3>";
    @matching_contacts = get_contact_list($search, "completed", "all", "paid");
    $html .= notes_html(@matching_contacts);

    $html .= "<br><br><h3>Additional Notes - Not Paid:</h3>";
    @matching_contacts = get_contact_list($search, "completed", "all", "unpaid");
    $html .= notes_html(@matching_contacts);

    $html .= "<br>"x3 . qq~<a href="/reports/notes.csv" download="notes.csv">Download CSV Report</a><br><br>~;

    return $html;
}



#----------------------------------------------------------------------------------------------------


sub financial_report {

	#  Create the .csv version

    my $csv = "Financial Report:\n\n";
    my @matching_contacts = get_contact_list($search, "completed", "all", "paid");
    $csv .= financials_csv(@matching_contacts);

    $csv .= "\n\n\nArchived Registrations With Payments\n";
    @matching_contacts = get_archived_list("", "paid");
    $csv .= financials_csv(@matching_contacts);

    #  Save the .csv file
    open(my $fh, '>', "$report_dir/financial.csv") or die "Could not save financial.csv";
    print $fh $csv;
    close $fh;


    #  Display the HTML version...

    my $html = "<h3>Financial Report:</h3>";
    @matching_contacts = get_contact_list($search, "completed", "all", "paid");
    $html .= financials_html(@matching_contacts);

    $html .= "<br><br><h3>Archived Registrations With Payments</h3>";
    @matching_contacts = get_archived_list("", "paid");
    $html .= financials_html(@matching_contacts);

    $html .= "<br>"x3 . qq~<a href="/reports/financial.csv" download="financial.csv">Download CSV Report</a><br><br>~;

    return $html;
}


#----------------------------------------------------------------------------------------------------


sub donations_report {

	#  Create the .csv version

    my $csv = "Donations - Fully Paid:\n\n";
    my @matching_contacts = get_contact_list($search, "completed", "all", "paid");
    $csv .= donations_csv(@matching_contacts);

    $csv .= "\n\n\nDonations - Not Paid:\n\n";
    @matching_contacts = get_contact_list($search, "completed", "all", "unpaid");
    $csv .= donations_csv(@matching_contacts);

    #  Save the .csv file
    open(my $fh, '>', "$report_dir/donations.csv") or die "Could not save donations.csv";
    print $fh $csv;
    close $fh;


    #  Display the HTML version...

    my $html = "<h3>Donations - Fully Paid:</h3>";
    @matching_contacts = get_contact_list($search, "completed", "all", "paid");
    $html .= donations_html(@matching_contacts);

    $html .= "<br><br><h3>Donations - Not Paid:</h3>";
    @matching_contacts = get_contact_list($search, "completed", "all", "unpaid");
    $html .= donations_html(@matching_contacts);

    $html .= "<br>"x3 . qq~<a href="/reports/donations.csv" download="donations.csv">Download CSV Report</a><br><br>~;

    return $html;
}


#----------------------------------------------------------------------------------------------------


sub show_reports {
    my $rep_type = shift;

    our %dispatch = (
        "reception_rep"     => \&reception_report,
        "welcome_rep"       => \&welcome_report,
        "first_timer_rep"   => \&first_timers_report,
        "softwear_rep"      => \&softwear_report,
        "workshop_rep"      => \&workshop_report,
        "clinics_rep"       => \&clinic_report,
        "sibouting_rep"     => \&sibouting_report,
        "picnic_rep"        => \&picnic_report,
        "remembrance_rep"   => \&remembrance_report,
        "chapterchair_rep"  => \&chapterchair_report,
        "childcare_rep"     => \&childcare_report,
        "breakfast_rep"     => \&breakfast_report,
        "balloons_rep"      => \&balloons_report,
        "directory_rep"     => \&directory_report,
        "attendance_rep"    => \&attendance_report,
        "softchild_rep"     => \&softchild_report,
        "notes_rep"         => \&notes_report,
        "financial_rep"		=> \&financial_report,
        "donations_rep"		=> \&donations_report,
        "general_meals_rep" => \&general_meals_report,
    );

    print_header();
    print_navigation("reports");

    my $html = "";

    if (exists $dispatch{$rep_type}) {
        $html .= $dispatch{$rep_type}->();
    }
    else {
    	print qq~<div><h3 class="admin-indent admin-name">General Reports:</h3>~;
	    print_meeting_menu($rep_type);
	    print "</div><br><br>";

    	print qq~<div><h3 class="admin-indent admin-name">Meal Reports:</h3>~;
	    print_meal_menu($rep_type);
	    print "</div><br><br>";

    	print qq~<div><h3 class="admin-indent admin-name">Financial Reports:</h3>~;
	    print_financial_menu($rep_type);
	    print "</div><br>";

    	$html .= "<br>Choose a report from a drop-down menu.";
        $html .= "<br>"x20;
    }

    print qq~<div class="admin-indent">~;
    print $html;
    print qq~</div>~;

    print_footer();

    exit;
}


#----------------------------------------------------------------------------------------------------

sub mark_paid {
	my $contact_id = shift;

	my %contact = GetContact($contact_id);

	if ($contact{id} == $contact_id) {			#  Simple validation
		$contact{paid} = 1;
		$contact{paymentPage} = 1;

		my $notes = $q->param('msg') || "";
		$contact{paymentNotes} = $notes;

		UpdateContact(%contact);
	}

	redirect("$system_url/cgi-bin/admin.cgi?action=summary&id=$contact_id");
}

sub toggle_archive {
	my $contact_id = shift;

	my $archive = $q->param('archive') || "";

	my %contact = GetContact($contact_id);

	#  Simple validation. The current archive status must match the one in the URL
	if ($contact{id} == $contact_id  &&  !($contact{archived} xor $archive) ) {

		$contact{archived} = $archive ? 0 : 1;

		my $notes = $q->param('msg') || "";
		$contact{archiveNotes} = $notes;

		UpdateContact(%contact);	
	}

	redirect("$system_url/cgi-bin/admin.cgi?action=summary&id=$contact_id");
}


sub form_editor {

    print_header();
    print_navigation("form");

    print qq~
      <h3 class="inline-info">Can't edit the form yet...</h3>
    ~;

    print_footer();
}

1;
