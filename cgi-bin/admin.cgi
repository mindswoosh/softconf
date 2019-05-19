#!/usr/bin/perl

use strict;
use warnings;

use Settings;
use Globals qw($otherDiagnosisTitle %peopleTypes %reg_type $CONFERENCE_ID);
use Database;

use CGI;
use CGI::Carp 'fatalsToBrowser';

use Reports;
use TextTools qw(trim quote textToHTML);
use Lists;
use Interface;
use Common 'is_fully_paid';

our $q = CGI->new;

our $tab    = $q->param('tab')    || "registrations";
our $action = $q->param('action') || "";
our $search = $q->param('search') || "";

#----------------------------------------------------------------------------------------------------

if ($action eq "summary") {
    display_contact($q->param('id'));
}
elsif ($action eq "welcome_csv") {
    welcome_report_csv();
}
elsif ($action eq "shirts_csv") {
    shirts_csv();
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
    print "<br><br>";

    if (@matching_contacts != 0) {
        my $i = 1;
        for my $contact_ref (@matching_contacts) {
            my %contact = %{$contact_ref};

            next if ($reg_type eq "unpaid" && is_fully_paid(%contact));

            print qq~
          <span class="row-num">$i: </span><a href="/cgi-bin/admin.cgi?action=summary&id=$contact{id}">$contact{firstName} $contact{lastName}</a><br><br>
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
    print "<br><br>";

    print_footer();
}

#----------------------------------------------------------------------------------------------------


sub display_contact {
    my $contact_id = shift;

    my $text = contact_summary($contact_id);

    $text = textToHTML($text);

    print_header();
    print_navigation("registrations");
    print qq~
      <h1 style="margin-left: 10px;">Registration for:</h1>
      <br>
      <div style="font-family: monospace, monospace; font-size: 14px; margin-left: 15px;">
         $text
         <br><br>
      </div>
    ~;

    print_footer();

    exit;
}

#----------------------------------------------------------------------------------------------------


sub show_reports {
    my $rep_type = shift;

    print_header();
    print_navigation("reports");

    print qq~<div><h3 class="admin-indent">Show Report:</h3>~;
    print_report_menu($rep_type);
    print "</div><br>";

    my $html = "";

    if ($rep_type eq "welcome_rep") {
        $html .= welcome_report();
    }
    elsif ($rep_type eq "softwear_rep") {
        $html .= softwear_report();
    }
    elsif ($rep_type eq "workshop_rep") {
        $html .= workshop_report();
    }
    else {
        $html .= "<br>"x20;
    }

    print qq~<div class="admin-indent">~;
    print $html;
    print qq~</div>~;

    print_footer();

    exit;
}

#----------------------------------------------------------------------------------------------------


sub welcome_report {

    my @matching_contacts = get_contact_list($search, "completed", "full");

    my $html = "<h3>Welcome Dinner:</h3>";

    $html .= welcome_dinner(@matching_contacts);

    $html .= "<br>"x3 . qq~<a href="/cgi-bin/admin.cgi?action=welcome_csv" target="_blank">CSV Report</a><br><br>~;

    return $html;
}


sub welcome_report_csv {

    my @matching_contacts = get_contact_list($search, "completed", "full");

    print "Content-type: text/plain\n\n";
    print welcome_dinner_csv(@matching_contacts);

    exit;
}


#----------------------------------------------------------------------------------------------------

sub softwear_report {

    my @matching_contacts = get_contact_list($search, "completed", "full");


    my $html = "<h3>SOFT Wear Orders fully Paid:</h3>";

    $html .= shirts_ordered_html(@matching_contacts);

    $html .= "<br>"x3 . qq~<a href="/cgi-bin/admin.cgi?action=shirts_csv" target="_blank">CSV Report</a><br><br>~;

    return $html;
}


sub shirts_csv {

    my @matching_contacts = get_contact_list($search, "completed", "full");

    print "Content-type: text/plain\n\n";
    print shirts_ordered_csv(@matching_contacts);

    exit;
}


#----------------------------------------------------------------------------------------------------


sub workshop_report {

    my $html = "<h3>Workshop Attendance:</h3>";
    $html .= workshop_attendance($CONFERENCE_ID);

    return $html;
}

#----------------------------------------------------------------------------------------------------


sub form_editor {

    print_header();
    print_navigation("form");

    print qq~
      <h3 class="inline-info">Can't edit the form yet...</h3>
    ~;

    print_footer();
}

1;
