#--------------------------------------------------------------------------------
#  Because generating some of these reports is a bit complicated, we use a
#  single function to generate both the HTML and CSV outputs so that the two
#  never differ in their results due to logic.
#
#  This design choice makes the subs look a little busy, but it was a lot
#  messier when we used two totally different functions to generate each type
#  of file.
#
#  NOTE: Excel will not handle comma separated files as you would expect if
#  there are spaces around the commas. Make sure you don't include any extra
#  spaces, especially if you're quoting columns with commas.
#--------------------------------------------------------------------------------

package Reports;

use strict;
use warnings;

use List::MoreUtils qw(first_index);
use JSON::PP;

use Globals;
use TextTools qw(trim boolToYesNo pluralizeText);
use Database;
use Lists;
use EventInfo;
use Common qw(
    is_fully_paid
    is_complete
    age_from_birthdate
);

use Exporter 'import';
our @EXPORT = qw(
    contact_summary

    reception_html
    reception_csv

    welcome_dinner_html
    welcome_dinner_csv

    workshop_attendance_html
    workshop_attendance_csv

    clinics_html
    clinics_csv

    childcare_html
    childcare_csv

	sibouting_html
	sibouting_csv

    picnic_html
    picnic_csv

    remembrance_html
    remembrance_csv

    chapterchair_html
    chapterchair_csv

    breakfast_html
    breakfast_csv

    shirts_ordered_html
    shirts_ordered_csv

    directory_html
    directory_csv

    notes_html
    notes_csv
);


sub qualifiesChildCare {
    my $age      = shift;
    my $sess_ref = shift;
    my $isBoardMember;

    return (!$sess_ref->{pre5Only} || $age < 5) && (!$sess_ref->{boardOnly} || $isBoardMember);
}


sub add_line {
    my $indent = shift;
    my $str    = shift;

    return (" " x ($indent * 3)) . $str . "\n";
}


#  $text = contact_summary($contact_id);
sub contact_summary {
    my $contact_id = shift;

    my %contact = GetContact($contact_id);

    my @softangels = get_softangels_list($contact_id);
    my @attendees  = get_attendee_list($contact_id);
    my @clinics    = get_clinics($contact_id);

    # my @shirts     = get_shirt_list($contact_id);

    my $output = "$contact{firstName} $contact{lastName}\n";
    $output .= add_line(0, 'Contact ID: ' . $contact{id} . "\n");

    my $reg = $reg_type{ $contact{attendance} } || 'Problem with the type of attendance';

    $output .= add_line(0, 'Registration: ' . $reg . "\n");

    my $payment_status = "No charge";
    if ($contact{attendance} ne "balloon" || $contact{grandTotal} > 0) {
        $payment_status = is_fully_paid(%contact) ? "Fully Paid" : "Not Paid Yet";
    }

    $output .= add_line(0, "Payment Status:    $payment_status");
    if ($contact{paymentID}) {
        $output .= add_line(0, "Confirmation ID:   $contact{paymentID}");
    }
    if ($contact{paymentNotes}) {
        $output .= add_line(0, "Payment Notes:     $contact{paymentNotes}");
    }
    $output .= "\n";

    if ($contact{attendance} eq 'full') {
        $output .= add_line(0, sprintf("%-32s%s", 'Attending Wednesday reception? ', boolToYesNo($contact{reception})));
        $output .= add_line(0, sprintf("%-32s%s", 'Attending Sunday breakfast? ',    boolToYesNo($contact{sundayBreakfast})));
        $output .= "\n";

        $output .= add_line(0, sprintf("%-32s%s", 'Are you a SOFT member?',     boolToYesNo($contact{softMember})));
        $output .= add_line(0, sprintf("%-32s%s", 'Your first time attending?', boolToYesNo($contact{firstTime})));
        $output .= add_line(0, sprintf("%-32s%s", 'Are you a Board member?',    boolToYesNo($contact{boardMember})));
        $output .= add_line(0, sprintf("%-32s%s", 'Are you a Chapter Chair?',   boolToYesNo($contact{chapterChair})));
        $output .= add_line(0, sprintf("%-32s%s", 'Joey Watson Fund?',          boolToYesNo($contact{joeyWatson})));
        if ($contact{joeyWatson}) {
            $output .= add_line(0, sprintf("%-32s%s", 'Joey Watson Code? ', $contact{joeyWatsonCode}));
        }
    }

    $output .= "\n";

    $output .= add_line(0, "\nContact Information:");
    $output .= "\n";

    $output .= add_line(1, $contact{firstName} . ' ' . $contact{lastName});
    $output .= add_line(1, $contact{address1});
    if ($contact{address2} ne "") {
        $output .= add_line(1, $contact{address2});
    }

    $output .= add_line(1, $contact{city} . ' ' . $contact{stateProv} . ' ' . $contact{postalCode});
    $output .= add_line(1, $contact{country});
    $output .= "\n";

    $output .= add_line(1, sprintf("%-15s%s", 'Mobile phone:', $contact{phoneMobile}));
    $output .= add_line(1, sprintf("%-15s%s", 'Home phone:',   $contact{phoneHome}));
    $output .= add_line(1, sprintf("%-15s%s", 'Work phone:',   $contact{phoneWork}));
    $output .= "\n";

    $output .= add_line(1, 'Email: ' . $contact{email});
    $output .= "\n";

    #----

    if ($contact{attendance} ne 'workshops') {    #  not workshops-only

        $output .= add_line(0, "\nSOFT Angel" . (@softangels == 1 ? "" : 's') . ':');
        $output .= "\n";
        if (@softangels == 0) {
            $output .= add_line(1, 'There are no SOFT angels.');
            $output .= "\n";
        }
        else {
            for my $softangel_ref (@softangels) {
                my %softangel = %{$softangel_ref};

                $output .= add_line(1, $softangel{firstName} . ' ' . $softangel{lastName});
                $output .= add_line(1, 'Date of birth: ' . $softangel{birthDate});
                $output .= add_line(1, 'Date of death: ' . $softangel{deathDate});
                $output .= add_line(1, 'Diagnosis: ' . ($softangel{diagnosis} eq $otherDiagnosisTitle ? $softangel{otherDiagnosis} : $softangel{diagnosis}));
                $output .= "\n";
            }
        }
    }

    #  If 'balloon'-only, then we're done summarizing

    if ($contact{attendance} ne 'balloon') {    #  if (full|workshops|picnic)

        $output .= add_line(0, "\nAttendees:");
        $output .= "\n";

        if (@attendees == 0) {
            $output .= add_line(1, 'There are no Attendees listed.');
        }
        else {
            for my $attendee_ref (@attendees) {

                my %attendee = %{$attendee_ref};

                $output .= add_line(1, "$attendee{firstName} $attendee{lastName}");

                if ($attendee{peopleType} eq $peopleTypes{CHILD}) {
                    $output .= add_line(2, "Child, age: $attendee{age}");

                    if ($attendee{sibOuting}) {
                        warn('Attendee too young for a sibling outing') if ($attendee{age} < 5);
                        $output .= add_line(2, "Attending younger-sibling outing");
                        $output .= add_line(2, "Shirt size: " . $attendee{sibShirtSize});
                    }
                    else {
                        if ($contact{attendance} eq 'full') {
                            $output .= add_line(2, 'Attending Sibling outing:  No');
                        }
                    }
                }
                elsif ($attendee{peopleType} eq $peopleTypes{TEEN}) {

                    $output .= add_line(2, 'Teen, age: ' . $attendee{age});

                    if ($attendee{sibOuting}) {
                        $output .= add_line(2, "Attending older-sibling outing");
                        $output .= add_line(2, "Shirt size: " . $attendee{sibShirtSize});
                    }
                    elsif ($contact{attendance} eq 'full') {
                        $output .= add_line(2, 'Attending Sibling outing:  No');
                    }
                }
                elsif ($attendee{peopleType} eq $peopleTypes{SOFTCHILD}) {

                    $output .= add_line(2, $attendee{peopleType});
                    $output .= add_line(2, 'Date of birth: ' . $attendee{birthDate});
                    $output .= add_line(2, 'Diagnosis: ' . ($attendee{diagnosis} eq $otherDiagnosisTitle ? $attendee{otherDiagnosis} : $attendee{diagnosis}));
                    $output .= add_line(2, 'Eats meals: ' . boolToYesNo($attendee{eatsMeals}));
                }
                else {
                    $output .= add_line(2, $attendee{peopleType});    #  Adult and Professional
                }

                if ($contact{attendance} eq 'full' && ($attendee{peopleType} ne $peopleTypes{SOFTCHILD} || $attendee{eatsMeals})) {
                    $output .= add_line(2, 'Welcome dinner meal: ' . ($attendee{welcomeDinner} ne "" ? $attendee{welcomeDinner} : 'N/A'));
                }

                $output .= "\n";
            }
        }

        #----

        if ($contact{attendance} eq 'full') {

            my @softChildren = grep { $_->{peopleType} eq $peopleTypes{SOFTCHILD} } @attendees;

            if (@softChildren) {

                if ($contact{attendingClinics}) {
                    $output .= add_line(0, "\nClinics:");
                    $output .= "\n";
                    if ($contact{needsClinicsTrans}) {
                        $output .= add_line(1, 'Transportation tie-downs needed:  ' . $contact{clinicTieDowns});
                        $output .= add_line(1, 'Transportation bus seats needed:  ' . $contact{clinicBusSeats});
                    }
                    else {
                        $output .= add_line(1, 'Needs transportation to clinics:  No');
                    }
                    $output .= "\n";

                    my $clinicOrder = 1;
                    for my $title (@clinics) {

                        my $siffix = 'th';
                        $siffix = 'st' if ($clinicOrder == 1);
                        $siffix = 'nd' if ($clinicOrder == 2);
                        $siffix = 'rd' if ($clinicOrder == 3);
                        $output .= add_line(1, $clinicOrder . $siffix . ' Choice: ' . $title);

                        $clinicOrder++;
                    }
                }
                else {
                    $output .= add_line(0, "\nAttending clinics:  No");
                }

                $output .= "\n";
            }
        }

        #----

        my @workshopSessions = get_workshop_info($CONFERENCE_ID);

        if ($contact{attendance} eq 'full' || $contact{attendance} eq 'workshops') {

            my @adults = grep { $_->{peopleType} eq $peopleTypes{ADULT} || $_->{peopleType} eq $peopleTypes{PROFESSIONAL} } @attendees;

            if (@adults > 0) {

                $output .= add_line(0, "\nWorkshops:");
                $output .= "\n";

                for my $adult_ref (@adults) {
                    my %adult = %{$adult_ref};

                    $output .= add_line(1, "$adult{firstName} $adult{lastName}:");

                    for my $sess_ref (@workshopSessions) {
                        my %sess = %{$sess_ref};

                        my %workshopChoices = get_workshop_choices($adult{id});

                        # let workshop = sess.workshops.find( ws => ws.id eq $adult{workshops[sess.id]});

                        my @workshop_refs = grep { $_->{id} eq $workshopChoices{ $sess{id} } } @{ $sess{workshops} };    #  Should only match one
                        my %workshop = %{ $workshop_refs[0] };

                        my $wholeTitle = $workshop{title} . ($workshop{moderator} ne "" ? ' - ' . $workshop{moderator} : "");
                        if (length($wholeTitle) > 90) {
                            $wholeTitle = substr($wholeTitle, 0, 90) . "...";
                        }
                        $output .= add_line(2, $sess{name} . ': ');
                        $output .= add_line(2, $wholeTitle);
                        $output .= "\n";
                    }
                    $output .= "\n";
                }
            }
        }

        #----

        if ($contact{attendance} ne 'workshops') {

            if ($contact{attendance} ne 'picnic') {

                #  Include Childcare section?
                my @children = grep { $_->{peopleType} eq $peopleTypes{CHILD} || $_->{peopleType} eq $peopleTypes{SOFTCHILD} } @attendees;

                if (@children > 0) {

                    $output .= add_line(0, "\nChildcare:");
                    $output .= "\n";

                    for my $child_ref (@children) {
                        my %child = %$child_ref;

                        $output .= add_line(1, $child{firstName} . ' ' . $child{lastName} . ':');

                        my %childCareNeeds = get_childcare_needs($child{id});

                        my $numSessions       = 0;
                        my @childCareSessions = get_childcare_info($CONFERENCE_ID);

                        for my $sess_ref (@childCareSessions) {
                            my %sess = %$sess_ref;

                            # child.childCareSessions:  { ccID1: bool, ccID2: bool, ccID3:bool... }
                            if (defined($childCareNeeds{ $sess{id} }) && qualifiesChildCare($child{age}, \%sess, $contact{boardMember})) {
                                $output .= add_line(2, sprintf("%-25s%s", $sess{title} . ': ', boolToYesNo($childCareNeeds{ $sess{id} })));
                                $numSessions++;
                            }
                        }

                        $output .= add_line(2, "None") if ($numSessions == 0);
                        $output .= "\n";
                    }
                }

                #----

                #  Include Chapter Chair section?
                if ($contact{chapterChair}) {
                    $output .= add_line(0, "\nAttending Chapter Chair Luncheon:");
                    $output .= "\n";

                    for my $attendee_ref (@attendees) {
                        my %attendee = %{$attendee_ref};

                        if ($attendee{peopleType} eq $peopleTypes{ADULT} || $attendee{peopleType} eq $peopleTypes{PROFESSIONAL}) {
                            $output .= add_line(1, sprintf("%-28s%s", $attendee{firstName} . ' ' . $attendee{lastName} . ": ", boolToYesNo($attendee{chapterChairLunch})));
                        }
                    }

                    $output .= "\n";
                }

                #----

                #  Include Remembrance Outing section?
                if (@softangels != 0) {
                    $output .= add_line(0, "\nAttending Remembrance Outing:");
                    $output .= "\n";

                    my @attending = grep { ($_->{peopleType} eq $peopleTypes{ADULT} || $_->{peopleType} eq $peopleTypes{PROFESSIONAL}) && $_->{rembOuting} } @attendees;

                    if (@attending) {
                        $output .= add_line(1, sprintf("%-28s%s", 'Needs transportation: ', boolToYesNo($contact{needsRembTrans})));
                        $output .= "\n";
                        $output .= add_line(1, 'People Attending:');
                        $output .= "\n";

                        for my $attendee_ref (@attendees) {
                            my %attendee = %{$attendee_ref};

                            if ($attendee{peopleType} eq $peopleTypes{ADULT} || $attendee{peopleType} eq $peopleTypes{PROFESSIONAL}) {
                                $output .= add_line(1, sprintf("%-28s%-4s%s", "$attendee{firstName} $attendee{lastName}: ", boolToYesNo($attendee{rembOuting}), ($attendee{rembOuting} ? ' - meal: ' . $attendee{rembLunch} : "")));
                            }
                        }
                    }
                    else {
                        $output .= add_line(1, 'No one is attending');
                    }
                    $output .= "\n";
                }

                #----

                $output .= add_line(0, "\nNeeds transportation to the picnic:");
                $output .= "\n";

                for my $attendee_ref (@attendees) {
                    my %attendee = %{$attendee_ref};

                    if ($attendee{peopleType} eq $peopleTypes{SOFTCHILD}) {
                        $output .= add_line(1, sprintf("%-28s%-5s%s", $attendee{firstName} . ' ' . $attendee{lastName} . ": ", boolToYesNo($attendee{picnicTrans}), ($attendee{picnicTrans} ? ' - Needs tie-down: ' . boolToYesNo($attendee{picnicTiedown}) : "")));
                    }
                    else {
                        $output .= add_line(1, sprintf("%-28s%s", $attendee{firstName} . ' ' . $attendee{lastName} . ": ", boolToYesNo($attendee{picnicTrans})));
                    }
                }
                $output .= "\n";

                #----

                if ($contact{specialNeeds} ne "") {
                    $output .= add_line(0, "\nSpecial Needs:");
                    $output .= "\n";

                    my $specialNeeds = $contact{specialNeeds};
                    $specialNeeds =~ s/^/   /mg;    #  Indent this data

                    $output .= $specialNeeds;
                    $output .= "\n\n";
                }

            }

            #----

            $output .= add_line(0, "\nSOFT Wear Shirts:");
            $output .= "\n";

            my @shirtTypesInfo = get_shirttypes_info($CONFERENCE_ID);

            for my $shirtType_ref (@shirtTypesInfo) {
                my %shirtType = %$shirtType_ref;

                $output .= add_line(1, $shirtType{description});

                my $totalShirts        = 0;
                my @shirtsOrdered_refs = get_shirtsordered_list($contact{id});

                for my $shirt_ref (@shirtsOrdered_refs) {
                    my %shirt = %$shirt_ref;

                    if ($shirt{shirt_id} && $shirt{shirt_id} eq $shirtType{id}) {
                        $output .= add_line(2, 'Ordered: ' . $shirt{quantity} . ' x ' . $shirt{shirtSize} . ', $' . $shirt{quantity} * $shirtType{cost});
                        $totalShirts++;
                    }
                }

                if ($totalShirts == 0) {
                    $output .= add_line(2, 'None ordered');
                }

                $output .= "\n";
            }
        }

    }

    #----

    if ($contact{attendance} eq 'full' || $contact{attendance} eq 'picnic') {

        $output .= add_line(0, "\nFamily Directory:");
        $output .= "\n";
        $output .= add_line(1, sprintf("%-16s%s", 'Include phone: ', boolToYesNo($contact{dir_phone})));
        $output .= add_line(1, sprintf("%-16s%s", 'Include email: ', boolToYesNo($contact{dir_email})));
        $output .= add_line(1, sprintf("%-16s%s", 'Include city: ',  boolToYesNo($contact{dir_city})));
        $output .= "\n";
    }

    #----

    $output .= add_line(0, "\nDonations:\n");
    if ($contact{softDonation} == 0 && $contact{fundDonation} == 0) {
        $output .= add_line(1, 'No donations');
    }
    else {
        $output .= add_line(1, sprintf("%-20s\$%7.2f", "SOFT Conference:", $contact{softDonation}));
        $output .= add_line(1, sprintf("%-20s\$%7.2f", "General Fund:",    $contact{fundDonation}));
    }

    #----

    $output =~ s/\n\n+/\n\n/g;

    my %post = GetPost($contact{id});
    my $json = JSON::PP->new->ascii->pretty->allow_nonref;
    my %userData = %{$json->decode($post{json})};

    $output .= "\n\nINVOICE:\n$userData{invoice}";


    return $output;
}



#--------------------------------------------------------------------------------


sub _buffet {
	my $type = shift;
    my @contacts = @_;

    die "Bad buffet type: $type"  if ($type !~ /^(reception|breakfast)$/);

    return "" unless (@contacts != 0);

    my $html = "";
    my $csv = "Contact ID, Contact, Email, Phone, Attendee, Eats?\n";

    my $numAttendees = 0;
    my $eaters = 0;

    my $i = 1;
    for my $contact_ref (@contacts) {
        my %contact = %$contact_ref;

        next if ($type eq "reception"  &&  !$contact{reception});
        next if ($type eq "breakfast"  &&  !$contact{sundayBreakfast});

        my $not_paid = is_fully_paid(%contact) ? "" : " — Not Paid Yet";

        $html .= qq~<div class="admin-linespace-after"><span class="row-num">$i: </span><a href="/cgi-bin/admin.cgi?action=summary&id=$contact{id}">$contact{firstName} $contact{lastName}</a>$not_paid</div><br>~;
        my @attendees = get_attendee_list($contact{id});

        for my $attendee_ref (@attendees) {
            my %attendee = %$attendee_ref;

            $numAttendees++;

            my $nonEater = "";
            if ($attendee{peopleType} eq $peopleTypes{SOFTCHILD}  &&  !$attendee{eatsMeals}) {
            	$nonEater = " - Does not eat";
            }
            else {
            	$eaters++;
            }

            $html .= qq~<div class="admin-linespace-after"><span class="row-num"></span><span class="admin-name">$attendee{firstName} $attendee{lastName}</span>$nonEater</div><br>~;

            $csv .= csv_column($contact{id}) . ",";
            $csv .= csv_column("$contact{firstName} $contact{lastName}") . ",";
            $csv .= csv_column($contact{email}) . ",";
            $csv .= csv_column($contact{phoneMobile} || $contact{phoneHome} ||  $contact{phoneWork}) . ",";

            $csv .= csv_column("$attendee{firstName} $attendee{lastName}") . ",";
            $csv .= csv_column($nonEater ne "" ? "No" : "Yes") . "\n";
        }
        $html .= "<br>";
        $i++;
    }

    #  List the meal totals
    $html .= "<br><b>Totals:</b><br><br>";
    $csv  .= "\nTotals:\n";

    $html .= qq~<span class="admin-narrow-box"></span>$numAttendees people attending the $type<br>~;
    $html .= qq~<span class="admin-narrow-box"></span>$eaters people eating at the $type<br>~;

    $csv .= ", $numAttendees people attending the $type\n";
    $csv .= ", $eaters people eating at the $type\n";

    return ($html, $csv);
}


sub reception_html {
    my @contacts = @_;

    return (_buffet("reception", @contacts))[0];
}


sub reception_csv {
    my @contacts = @_;

    return (_buffet("reception", @contacts))[1];
}


sub breakfast_html {
    my @contacts = @_;

    return (_buffet("breakfast", @contacts))[0];
}


sub breakfast_csv {
    my @contacts = @_;

    return (_buffet("breakfast", @contacts))[1];
}


#--------------------------------------------------------------------------------


sub _welcome_dinner {
    my @contacts = @_;

    return "" unless (@contacts != 0);

    my $html = "";
    my $csv = "Contact ID, Contact, Email, Phone, Attendee, Meal, Paid?\n";

    my %meal_counts;

    my $i = 1;
    for my $contact_ref (@contacts) {
        my %contact = %$contact_ref;

        my $not_paid = is_fully_paid(%contact) ? "" : " — Not Paid Yet";

        $html .= qq~<div class="admin-linespace-after"><span class="row-num">$i: </span><a href="/cgi-bin/admin.cgi?action=summary&id=$contact{id}">$contact{firstName} $contact{lastName}</a>$not_paid</div><br>~;
        my @attendees = get_attendee_list($contact{id});

        for my $attendee_ref (@attendees) {
            my %attendee = %$attendee_ref;

            $attendee{welcomeDinner} = "None" unless ($attendee{welcomeDinner});

            $meal_counts{ $attendee{welcomeDinner} }++;

            $html .= qq~<div class="admin-linespace-after"><span class="row-num"></span><span class="admin-name">$attendee{firstName} $attendee{lastName}:</span>$attendee{welcomeDinner}</div><br>~;

            $csv .= csv_column($contact{id}) . ",";
            $csv .= csv_column("$contact{firstName} $contact{lastName}") . ",";
            $csv .= csv_column($contact{email}) . ",";
            $csv .= csv_column($contact{phoneMobile} || $contact{phoneHome} ||  $contact{phoneWork}) . ",";

            $csv .= csv_column("$attendee{firstName} $attendee{lastName}") . ",";
            $csv .= csv_column($attendee{welcomeDinner}) . ",";
            $csv .= csv_column($not_paid ? "Not Paid" : "Fully Paid") . "\n";
        }
        $html .= "<br>";
        $i++;
    }

    #  List the meal totals
    $html .= "<br><b>Total meals:</b><br><br>";
    $csv  .= "\nTotal meals:\n";

    for my $meal (sort keys %meal_counts) {
        next if ($meal eq "None");

        $html .= qq~<span class="row-num">$meal_counts{$meal}</span>$meal<br>~;
        
        $csv .= csv_column($meal_counts{$meal}) . ",";
        $csv .= csv_column($meal) . "\n";
    }

    $html .= qq~<span class="row-num">$meal_counts{"None"}</span>None<br>~;
    $csv .= csv_column($meal_counts{"None"}) . ", None\n";

    return ($html, $csv);
}


sub welcome_dinner_html {
    my @contacts = @_;

    return (_welcome_dinner(@contacts))[0];
}


sub welcome_dinner_csv {
    my @contacts = @_;

    return (_welcome_dinner(@contacts))[1];
}


#--------------------------------------------------------------------------------

#  Workshops are attendee-based, not contact-based, so we don't pass in a list
#  of contacts...

sub _workshop_attendance {
    my $status = shift;   #  "paid" or "unpaid"

    die "Incorrect workshop status: $status" unless ($status =~ /^(all|paid|unpaid)$/);

    my $html = "";
    my $csv = "Session Name, Workshop Name, Contact ID, Contact, Email, Phone, Attendee\n";

    my @workshopsessions = get_workshop_info($CONFERENCE_ID);

    for my $session_ref (@workshopsessions) {
        my %session = %$session_ref;

        $html .= "$session{name}<br><br>";

        for my $workshop_ref (@{ $session{workshops} }) {
            my %workshop = %$workshop_ref;

            next if ($workshop{title} =~ /None/i);

            my $moderator = ($workshop{moderator} ne "") ? " - $workshop{moderator}" : "";

            $html .= qq~<span class="admin-twice-indent">$workshop{id}: $workshop{title} $moderator</span><br><br>~;

            my @workshop_attendees = get_workshop_attendee_list($workshop{id});

            my $i = 1;
            for my $workshop_attendee_ref (@workshop_attendees) {
                my %workshop_attendee = %$workshop_attendee_ref;

                my %attendee = GetAttendee($workshop_attendee{attendee_id});
                my %contact = GetContact($attendee{'contact_id'});

                next unless (is_complete(%contact));
                next if ($status eq "paid"    &&  !is_fully_paid(%contact));
                next if ($status eq "unpaid"  &&  is_fully_paid(%contact));

                $html .= qq~<div class="admin-linespace-after"><span class="admin-twice-indent"></span><span class="row-num">$i.</span><a href="/cgi-bin/admin.cgi?action=summary&id=$attendee{contact_id}">$attendee{firstName} $attendee{lastName}</a></div><br>~;

                $csv .= csv_column($session{name}) . ",";
                $csv .= csv_column("$workshop{id}: $workshop{title} $moderator") . ",";
                $csv .= csv_column($contact{id}) . ",";
                $csv .= csv_column("$contact{firstName} $contact{lastName}") . ",";
                $csv .= csv_column($contact{email}) . ",";
                $csv .= csv_column($contact{phoneMobile} || $contact{phoneHome} ||  $contact{phoneWork}) . ","; 
                $csv .= csv_column("$attendee{firstName} $attendee{lastName}") . "\n";
                $i++;
            }
            $html .= "<br>";
            $csv  .= "\n";
        }
        $html .= "<br>";
    }

    return ($html, $csv);
}




sub workshop_attendance_html {
    my $status = shift;

    return (_workshop_attendance($status))[0];
}


sub workshop_attendance_csv {
    my $status = shift;

    return (_workshop_attendance($status))[1];
}


#--------------------------------------------------------------------------------

our @shirtSizes = (
    'Youth - S',  
    'Youth - M',
    'Youth - L',
    'Adult - S',
    'Adult - M',
    'Adult - L',
    'Adult - XL',
    'Adult - XXL',
    'Adult - 3XL',
    'Adult - 4XL',
    'Adult - 5XL',
);


sub sort_by_size {
    my ($size1, $size2) = @_;

    my $index1 = first_index { $_ eq $size1 } @shirtSizes;
    my $index2 = first_index { $_ eq $size2 } @shirtSizes;

    return ($index1 <=> $index2);
}


sub sort_by_shirtkey {
    my ($key1, $key2) = @_;

    my ($description1, $size1) = split(/::/, $key1);
    my ($description2, $size2) = split(/::/, $key2);

    return ($description1 cmp $description2  ||  sort_by_size($size1, $size2));
}


sub _shirts_ordered {
    my @contacts = @_;

    return ("", "") unless (@contacts != 0);

    my $html = "";
    my $csv = "Contact ID, Contact, Email, Phone, Shirt Type, Shirt Size, Quantity, Cost\n";

    my @shirtTypesInfo = get_shirttypes_info($CONFERENCE_ID);

    my %shirt_quantities;
    my %shirt_quantities_cost;

    my $i = 1;

    for my $contact_ref (@contacts) {
        my %contact = %$contact_ref;

        my @shirtsOrdered_refs = get_shirtsordered_list($contact{id});

        next unless(@shirtsOrdered_refs);

        my $not_paid = is_fully_paid(%contact) ? "" : " &mdash; Not Paid Yet";

        $html .= qq~<br><span class="row-num">$i: </span><a href="/cgi-bin/admin.cgi?action=summary&id=$contact{id}">$contact{firstName} $contact{lastName}</a>$not_paid<br>~;

        my $shirt_id_cur = "";

        for my $shirtOrdered_ref (@shirtsOrdered_refs) {
            my %shirtOrdered = %$shirtOrdered_ref;

            my @shirtType_refs = grep { $shirtOrdered{shirt_id} eq $_->{id} } @shirtTypesInfo;

            die "Unknown shirt type..."  unless (@shirtType_refs);

            my %shirtType = %{$shirtType_refs[0]};

            #  HTML output
            if ($shirt_id_cur ne $shirtType{id}) {
                $html .= qq~<div class="admin-linespace-before"><span class="row-num"></span>$shirtType{description}</div><br>~;
                $shirt_id_cur = $shirtType{id};
            }
            $html .= qq~<span class="row-num"></span><span class="admin-indent"></span><span class="admin-name">$shirtOrdered{quantity} &nbsp;x&nbsp; $shirtOrdered{shirtSize}</span><span class="admin-twice-indent"></span><span class="admin-cost">~;
            $html .= sprintf("\$ %0.2f", $shirtOrdered{quantity} * $shirtType{cost}) . qq~</span><br>~;

            #  CSV output
            $csv .= csv_column($contact{id}) . ",";
            $csv .= csv_column("$contact{firstName} $contact{lastName}") . ",";
            $csv .= csv_column($contact{email}) . ",";
            $csv .= csv_column($contact{phoneMobile} || $contact{phoneHome} ||  $contact{phoneWork}) . ",";
            
            $csv .= csv_column($shirtType{description}) . ",";
            $csv .= csv_column($shirtOrdered{shirtSize}) . ",";
            $csv .= csv_column($shirtOrdered{quantity}) . ",";

            $csv .= csv_column(sprintf("\$%5.2f", $shirtOrdered{quantity} * $shirtType{cost})) . "\n";

            $shirt_quantities{"$shirtType{description}::$shirtOrdered{shirtSize}"} += $shirtOrdered{quantity};
            $shirt_quantities_cost{"$shirtType{description}::$shirtOrdered{shirtSize}"} += $shirtOrdered{quantity} * $shirtType{cost};
        }

        $html .= "<br>";
        $i++;
    }

    #----------

    $html .= "<br><b>Total orders:</b><br>";

    $csv .= "\n\n\n";
    $csv .= "Total orders:\n";

    my $total_cost = 0;

    my $this_description = "";

    for my $key (sort { sort_by_shirtkey($a, $b) } keys %shirt_quantities) {

        my ($description, $size) = split(/::/, $key);
        my $quantity = $shirt_quantities{$key};
        my $cost = $shirt_quantities_cost{$key};

        if ($description ne $this_description) {
            $html .= qq~<div class="admin-linespace-before"><span class="row-num"></span>$description</div><br>~;
            $this_description = $description;
        }
        $html .= qq~<span class="row-num"></span><span class="admin-indent"></span><span class="admin-name">$quantity &nbsp;x&nbsp; $size</span><span class="admin-twice-indent"></span><span class="admin-cost">~;
        $html .= sprintf("\$ %0.2f", $cost) . qq~</span><br>~; 

        $csv .= ",";       
        $csv .= csv_column($description) . ",";
        $csv .= csv_column($size) . ",";
        $csv .= csv_column($quantity) . ",";

        $csv .= csv_column(sprintf("\$%5.2f", $cost)) . "\n";

        $total_cost += $cost;
    }

    $html .= qq~<div class="admin-linespace-before"><span class="row-num"></span><span class="admin-indent"></span><span class="admin-name" style="text-align: right;">Total:</span><span class="admin-twice-indent"></span><span class="admin-cost">~;
    $html .= sprintf("\$ %0.2f",  $total_cost) . qq~</span></div><br>~;

    $csv .= ",,,Total:,";
    $csv .= csv_column(sprintf("\$%5.2f", $total_cost)) . "\n";

    return ($html, $csv);
}


sub shirts_ordered_html {
    my @contacts = @_;

    return (_shirts_ordered(@contacts))[0];
}


sub shirts_ordered_csv {
    my @contacts = @_;

    return (_shirts_ordered(@contacts))[1];
}


#--------------------------------------------------------------------------------

#  Sibling Outings have younger and older outings. List both

sub _sibouting {
    my @contacts = @_;

    my $html = "";
    my $csv = "";

    #  Gather all the attendees, sorted by age groups

    my @youngers = ();
    my @olders = ();

    for my $contact_ref (@contacts) {
    	my %contact = %$contact_ref;

    	my @attendees = get_attendee_list($contact{id});

    	for my $attendee_ref (@attendees) {
    		my %attendee = %$attendee_ref;

    		next unless ($attendee{sibOuting});		#  Not going...

    		die "Wrong age for Sib Outings"  unless ($attendee{age} >= 5  &&  $attendee{age} <= 17);

    		if ($attendee{age} <= 11) {
    			push @youngers, $attendee_ref; 
    		}
    		else {
    			push @olders, $attendee_ref;
    		}
    	}
    }

    @youngers = sort { $a->{age} <=> $b->{age}} @youngers;
    @olders   = sort { $a->{age} <=> $b->{age}} @olders;

    my ($outing_html, $outing_csv) = _outing(@youngers);
    $html .= qq~<span class="admin-narrow-box"></span><b>Younger Sibling Outing:</b><br><br>~;
    $html .= $outing_html;
    $csv  .= "Younger Sibling Outing:\n";
    $csv  .= $outing_csv;

    ($outing_html, $outing_csv) = _outing(@olders);
    $html .= qq~<br><br><span class="admin-narrow-box"></span><b>Older Sibling Outing:</b><br><br>~;
    $html .= $outing_html;
    $csv  .= "Older Sibling Outing:\n";
    $csv  .= $outing_csv;

    return ($html, $csv);
}


sub _outing {
	my @attendees = @_;

	my $html = "";
	my $csv = ",Contact ID, Contact, Email, Phone, Child, Age, Shirt Size\n";
	my %shirt_quantities;

	my $i = 1;
	for my $attendee_ref (@attendees) {
		my %attendee = %$attendee_ref;

		my %contact = GetContact($attendee{contact_id});

		$shirt_quantities{$attendee{sibShirtSize}}++;

		$html .= qq~<div class="admin-linespace-after"><span class="admin-twice-indent"></span><span class="row-num">$i.</span><span class="admin-name">$attendee{firstName} $attendee{lastName}</span><span class="admin-medium-box">Age $attendee{age}</span><span class="admin-medium-box">$attendee{sibShirtSize}</span><span class="admin-indent"><a href="/cgi-bin/admin.cgi?action=summary&id=$contact{id}">$contact{firstName} $contact{lastName}</a></span></div><br>~;
 		
 		$csv .= ",";
 		$csv .= csv_column($contact{id}) . ",";
        $csv .= csv_column("$contact{firstName} $contact{lastName}") . ",";
        $csv .= csv_column($contact{email}) . ",";
        $csv .= csv_column($contact{phoneMobile} || $contact{phoneHome} ||  $contact{phoneWork}) . ","; 
        $csv .= csv_column("$attendee{firstName} $attendee{lastName}") . ",";
        $csv .= csv_column($attendee{age}) . ",";
        $csv .= csv_column($attendee{sibShirtSize}) . "\n";

 		$i++;
	}

	$html .= qq~<br><span class="admin-narrow-box"></span>Shirt Totals:<br><br>~;
	$csv  .= "\n\n,Shirt Totals:\n";

    for my $size (sort { sort_by_size($a, $b) } keys %shirt_quantities) {

        my $quantity = $shirt_quantities{$size};
        $html .= qq~<span class="row-num"></span><span class="admin-indent"></span><span class="admin-name">$quantity &nbsp;x&nbsp; $size</span><br>~;

   		$csv .= ",,";
        $csv .= csv_column($size) . ",";
        $csv .= csv_column($quantity) . "\n";
    }
    $csv .= "\n\n";

    return ($html, $csv);
}


sub sibouting_html {
    my @contacts = @_;

    return (_sibouting(@contacts))[0];
}


sub sibouting_csv {
    my @contacts = @_;

    return (_sibouting(@contacts))[1];
}


#--------------------------------------------------------------------------------

#  Childcare is attendee-based, not contact-based, so we don't pass in a list
#  of contacts...

sub _childcare {
    my $status = shift;   #  "paid" or "unpaid"

    die "Incorrect childcare status: $status" unless ($status =~ /^(all|paid|unpaid)$/);

    my $html = "";
    my $csv = "Session, Contact ID, Contact, Email, Phone, Child, Age, SOFT Child?\n";

    my @childcare_sessions = get_childcare_info($CONFERENCE_ID);

    for my $session_ref (@childcare_sessions) {
        my %session = %$session_ref;

        $html .= "$session{title}<br><br>";

        my @childcare_refs = get_childcare_attendee_list($session{id});

        #  Build attendee list sorted by age
        my @attendee_refs;
        for my $childcare_ref (@childcare_refs) {

            next unless ($childcare_ref->{needed});

            my %attendee = GetAttendee($childcare_ref->{attendee_id});

            #  Compute SOFT Child ages from their birth dates
            if ($attendee{age} == 0  &&  $attendee{peopleType} eq $peopleTypes{SOFTCHILD}) {
                $attendee{age} = age_from_birthdate($attendee{birthDate});
            }
            push @attendee_refs, \%attendee;
        }

        @attendee_refs = sort { $a->{age} <=> $b->{age} } @attendee_refs;

        my $i = 1;
        for my $attendee_ref (@attendee_refs) {
            my %attendee = %$attendee_ref;

            my %contact = GetContact($attendee{'contact_id'});

            next unless (is_complete(%contact));

            next if ($status eq "paid"    &&  !is_fully_paid(%contact));
            next if ($status eq "unpaid"  &&  is_fully_paid(%contact));

            my $isSoftChild = $attendee{peopleType} eq $peopleTypes{SOFTCHILD};

            my $softchild = "";
            if ($isSoftChild) {
                $softchild = "SOFT Child";
            }

            $html .= qq~<div class="admin-linespace-after"><span class="admin-twice-indent"></span><span class="row-num">$i.</span><span class="admin-name">$attendee{firstName} $attendee{lastName}</span><span class="admin-medium-box">Age $attendee{age}</span><span class="admin-medium-box">$softchild</span><span class="admin-indent"><a href="/cgi-bin/admin.cgi?action=summary&id=$contact{id}">$contact{firstName} $contact{lastName}</a></span></div><br>~;

            $csv .= csv_column($session{title}) . ",";
            $csv .= csv_column($contact{id}) . ",";
            $csv .= csv_column("$contact{firstName} $contact{lastName}") . ",";
            $csv .= csv_column($contact{email}) . ",";
            $csv .= csv_column($contact{phoneMobile} || $contact{phoneHome} ||  $contact{phoneWork}) . ","; 
            $csv .= csv_column("$attendee{firstName} $attendee{lastName}") . ",";
            $csv .= csv_column($attendee{age}) . ",";
            $csv .= csv_column($isSoftChild ? "SOFT Child" : "") . "\n";
            $i++;
        }

        if ($i == 1) {
            $html .= qq~<div class="admin-linespace-after"><span class="admin-twice-indent"></span>&nbsp; No children have signed up<br>~;
        }

        $html .= "<br>";
        $csv  .= "\n";
    }

    return ($html, $csv);
}


sub childcare_html {
    my $status = shift;

    return (_childcare($status))[0];
}


sub childcare_csv {
    my $status = shift;

    return (_childcare($status))[1];
}


#--------------------------------------------------------------------------------

#  Clinics is attendee-based, not contact-based, so we don't pass in a list
#  of contacts...

my @ordinalNames = qw(First Second Third Fourth Fifth Sixth Seventh Eight Nineth Tenth Eleventh Twelfth);

sub _clinics {
    my $status = shift;   #  "paid" or "unpaid"

    die "Incorrect clinics status: $status" unless ($status =~ /^(all|paid|unpaid)$/);

    my $html = "";
    my $csv = "Choice, Clinic Name, Contact ID, Contact, Email, Phone, # Meals, # Seats, # Tie-Downs\n";

    my $totalMeals = 0;
    my $totalBusSeats = 0;
    my $totalTieDowns = 0;

    my @clinicInfo = get_clinic_info($CONFERENCE_ID);

    for (my $choice = 0; $choice < @clinicInfo; $choice++) {

    	if ($choice < 3) {
	        $html .= qq~<br><div class="admin-linespace-before"><span class="admin-indent"></span><b>~ . $ordinalNames[$choice] . " Choices:</b></div><br>";
	    }

        for (my $clinicID = 0; $clinicID <  @clinicInfo; $clinicID++) {

            my @clinic_refs = get_clinic_choices($clinicInfo[$clinicID], $choice);

            my $i = 1;
            for my $clinic_ref (@clinic_refs) {
                my %clinicChoice = %$clinic_ref;

                my %contact = GetContact($clinicChoice{contact_id});

                next unless (is_complete(%contact));

                next if ($status eq "paid"    &&  !is_fully_paid(%contact));
                next if ($status eq "unpaid"  &&  is_fully_paid(%contact));

                if ($choice < 3) {
	                if ($i == 1) {
	                	$html .= qq~<br><div class="admin-linespace-before"><span class="admin-twice-indent"></span>$clinicInfo[$clinicID]</div><br><br>~;
	                }

	                $html .= qq~<div class="admin-linespace-after"><span class="admin-twice-indent"></span><span class="admin-indent"></span><span class="row-num">$i.</span><span class="admin-name"><a href="/cgi-bin/admin.cgi?action=summary&id=$contact{id}">$contact{firstName} $contact{lastName}</a></span>~;
	            }

	            $csv .= csv_column($choice+1) . ",";
	            $csv .= csv_column($clinicInfo[$clinicID]) . ",";

				$csv .= csv_column($contact{id}) . ",";
	            $csv .= csv_column("$contact{firstName} $contact{lastName}") . ",";
	            $csv .= csv_column($contact{email}) . ",";
	            $csv .= csv_column($contact{phoneMobile} || $contact{phoneHome} ||  $contact{phoneWork}) . ",";

                #  Only show meals and transportation for first choices
                if ($choice == 0) {
                	$totalMeals += $contact{numClinicMeals};

                	if ($choice < 3) {
		                $html .= qq~<span class="admin-medium-box">~;
		                if ($contact{numClinicMeals} == 0) {
		                	$html .= "No Meals";
		                }
		                else {
		                	$html .= "$contact{numClinicMeals} " . pluralizeText($contact{numClinicMeals}, "Meal");
		                }
		                $html .= "</span>";
		            }

	                $csv .= csv_column($contact{numClinicMeals}) . ",";
	                
	                if ($contact{needsClinicsTrans}) {
	                	
	                	$totalBusSeats += $contact{clinicBusSeats};
	                	$totalTieDowns += $contact{clinicTieDowns};

	                	if ($choice < 3) {
		                	$html .= qq~<span class="admin-medium-box">$contact{clinicBusSeats} Bus Seat~;
		                	$html .= "s" if ($contact{clinicBusSeats} != 1);
		                	$html .= qq~</span><span>$contact{clinicTieDowns} Tie-Down~;
		                	$html .= "s" if ($contact{clinicTieDowns} != 1);
		                	$html .= "</span>";
		                }

	            		$csv .= csv_column($contact{clinicBusSeats}) . ",";
	            		$csv .= csv_column($contact{clinicTieDowns}) . ",";
	                }
	            }
                

                $html .= "</div><br>"  if ($choice < 3);
                $csv  .= "\n";

            	$i++;
            }

            # if ($i == 1) {
            # 	$html .= qq~<div class="admin-linespace-after"><span class="admin-twice-indent"></span><span class="admin-indent"></span>None chosen</div><br>~;
            # }
        }

        
    }

    $html .= qq~<br><br><div class="admin-linespace-after"><span class="admin-twice-indent"></span><span class="admin-indent"></span><span class="row-num"></span><span class="admin-name" style="text-align: right;"><b>Totals:</b>&nbsp; &nbsp;</span><span class="admin-medium-box">$totalMeals Meals</span><span class="admin-medium-box">$totalBusSeats Bus Seats</span>$totalTieDowns Tie-Downs<br><br>~;

    $csv  .= "\n,,,,Totals:, $totalMeals, $totalBusSeats, $totalTieDowns\n\n";

    return ($html, $csv);
}


sub clinics_html {
    my $status = shift;

    return (_clinics($status))[0];
}


sub clinics_csv {
    my $status = shift;

    return (_clinics($status))[1];
}



#--------------------------------------------------------------------------------


sub _picnic {
    my @contacts = @_;

    return "" unless (@contacts != 0);

    my $html = "";
    my $csv = "Contact ID, Contact, Email, Phone, Attendee, # Bus Seats, # Tie-Downs\n";

    my $totalBusSeats = 0;
    my $totalTieDowns = 0;

    my $i = 1;
    for my $contact_ref (@contacts) {
        my %contact = %$contact_ref;

        my $not_paid = is_fully_paid(%contact) ? "" : " — Not Paid Yet";

        $html .= qq~<div class="admin-linespace-after"><span class="row-num">$i: </span><a href="/cgi-bin/admin.cgi?action=summary&id=$contact{id}">$contact{firstName} $contact{lastName}</a>$not_paid</div><br>~;
        my @attendees = get_attendee_list($contact{id});

        for my $attendee_ref (@attendees) {
            my %attendee = %$attendee_ref;

            my $numBusSeats = ($attendee{picnicTrans}  &&  !$attendee{picnicTiedown}) ? 1 : 0;
            my $numTieDowns = ($attendee{picnicTrans}  &&   $attendee{picnicTiedown}) ? 1 : 0;

            $totalBusSeats += $numBusSeats;
            $totalTieDowns += $numTieDowns;

            $html .= qq~<div class="admin-linespace-after"><span class="row-num"></span><span class="admin-name">$attendee{firstName} $attendee{lastName}:</span>~;
            $html .= "1 Bus Seat"  if ($numBusSeats);
			$html .= qq~<span class="admin-wide-box"></span>1 Tie-Down~  if ($numTieDowns);
            $html .= qq~</div><br>~;

            $csv .= csv_column($contact{id}) . ",";
            $csv .= csv_column("$contact{firstName} $contact{lastName}") . ",";
            $csv .= csv_column($contact{email}) . ",";
            $csv .= csv_column($contact{phoneMobile} || $contact{phoneHome} ||  $contact{phoneWork}) . ",";

            $csv .= csv_column("$attendee{firstName} $attendee{lastName}") . ",";
            $csv .= csv_column($numBusSeats) . ",";
            $csv .= csv_column($numTieDowns) . "\n";
        }
        $html .= "<br>";
        $i++;
    }

    #  List the meal totals
    $html .= "<br><b>Total Transportation Needs:</b><br><br>";
    $html .= qq~<div class="admin-linespace-after"><span class="row-num"></span><span class="admin-name"></span><span class="admin-wide-box">$totalBusSeats Bus ~ . 
             pluralizeText($totalBusSeats, "Seat") . "</span>$totalTieDowns Tie-" . pluralizeText($totalTieDowns, "Down") . "</div><br>";

    $csv  .= "\n,,,,Total Transportation Needs:,$totalBusSeats,$totalTieDowns\n";

    return ($html, $csv);
}


sub picnic_html {
    my @contacts = @_;

    return (_picnic(@contacts))[0];
}


sub picnic_csv {
    my @contacts = @_;

    return (_picnic(@contacts))[1];
}



#--------------------------------------------------------------------------------


sub _remembrance {
    my @contacts = @_;

    return "" unless (@contacts != 0);

    my $html = "";
    my $csv = "Contact ID, Contact, Email, Phone, Attendee, # Bus Seats, Meal\n";

    my $totalBusSeats = 0;
    my %numMeals;

    my $i = 1;
    for my $contact_ref (@contacts) {
        my %contact = %$contact_ref;

        my $not_paid = is_fully_paid(%contact) ? "" : " — Not Paid Yet";

        my $busSeat = $contact{numRembTrans} ? 1 : 0;

        my $contactHtml .= qq~<div class="admin-linespace-after"><span class="row-num">$i: </span><a href="/cgi-bin/admin.cgi?action=summary&id=$contact{id}">$contact{firstName} $contact{lastName}</a>$not_paid</div><br>~;
        my @attendees = get_attendee_list($contact{id});

        my $numAttendees = 1;
        for my $attendee_ref (@attendees) {
            my %attendee = %$attendee_ref;

            next  unless ($attendee{rembOuting});

            if ($numAttendees == 1) {
            	$html .= $contactHtml;
            	$i++;
            }

            $totalBusSeats += $busSeat;
            $numMeals{$attendee{rembLunch}}++;

            $html .= qq~<div class="admin-linespace-after"><span class="row-num"></span><span class="admin-name">$attendee{firstName} $attendee{lastName}:</span>~;
            $html .= qq~<span class="admin-wide-box">~;
            $html .= "1 Bus Seat"  if ($busSeat);
			$html .= qq~</span>$attendee{rembLunch} meal~;
            $html .= qq~</div><br>~;

            $csv .= csv_column($contact{id}) . ",";
            $csv .= csv_column("$contact{firstName} $contact{lastName}") . ",";
            $csv .= csv_column($contact{email}) . ",";
            $csv .= csv_column($contact{phoneMobile} || $contact{phoneHome} ||  $contact{phoneWork}) . ",";

            $csv .= csv_column("$attendee{firstName} $attendee{lastName}") . ",";
            $csv .= csv_column($busSeat) . ",";
            $csv .= csv_column($attendee{rembLunch}) . "\n";

            $numAttendees++;
        }
        $html .= "<br>"  if ($numAttendees != 1);
    }

    #  List the meal totals
    $html .= "<br><b>Totals:</b><br><br>";
    $html .= qq~<div class="admin-linespace-after"><span class="admin-narrow-box"></span>$totalBusSeats Bus ~ . pluralizeText($totalBusSeats, "Seat") . "</div><br>";
    for my $meal (keys %numMeals) {
    	$html .= qq~<div class="admin-linespace-after"><span class="admin-narrow-box"></span>$numMeals{$meal} $meal ~ . pluralizeText($totalBusSeats, "Meal") . "</div><br>";
    }

    $csv .= "\nTotals:\n";
    $csv .= ",";
    $csv .= csv_column("$totalBusSeats Bus " . pluralizeText($totalBusSeats, "Seat"));
    $csv .= "\n\n";

    for my $meal (keys %numMeals) {
    	$csv .= ",";
    	$csv .= csv_column("$numMeals{$meal} $meal " . pluralizeText($numMeals{$meal}, "Meal"));
    	$csv .= "\n";
    }

    return ($html, $csv);
}


sub remembrance_html {
    my @contacts = @_;

    return (_remembrance(@contacts))[0];
}


sub remembrance_csv {
    my @contacts = @_;

    return (_remembrance(@contacts))[1];
}



#--------------------------------------------------------------------------------


sub _chapterchair {
    my @contacts = @_;

    return "" unless (@contacts != 0);

    my $html = "";
    my $csv = "Contact ID, Contact, Email, Phone, Attendee\n";

    my $totalAttending = 0;

    my $i = 1;
    for my $contact_ref (@contacts) {
        my %contact = %$contact_ref;

        my $not_paid = is_fully_paid(%contact) ? "" : " — Not Paid Yet";

        my $contactHtml .= qq~<div class="admin-linespace-after"><span class="row-num">$i: </span><a href="/cgi-bin/admin.cgi?action=summary&id=$contact{id}">$contact{firstName} $contact{lastName}</a>$not_paid</div><br>~;
        my @attendees = get_attendee_list($contact{id});

        my $numAttendees = 1;
        for my $attendee_ref (@attendees) {
            my %attendee = %$attendee_ref;

            next  unless ($attendee{chapterChairLunch});

            if ($numAttendees == 1) {
            	$html .= $contactHtml;
            	$i++;
            }

            $totalAttending++;

            $html .= qq~<div class="admin-linespace-after"><span class="row-num"></span>$attendee{firstName} $attendee{lastName}</div><br>~;

            $csv .= csv_column($contact{id}) . ",";
            $csv .= csv_column("$contact{firstName} $contact{lastName}") . ",";
            $csv .= csv_column($contact{email}) . ",";
            $csv .= csv_column($contact{phoneMobile} || $contact{phoneHome} ||  $contact{phoneWork}) . ",";

            $csv .= csv_column("$attendee{firstName} $attendee{lastName}") . "\n";

            $numAttendees++;
        }
        $html .= "<br>"  if ($numAttendees != 1);
    }

    $html .= "<br><b>Totals:</b><br><br>";
    $html .= qq~<div class="admin-linespace-after"><span class="admin-narrow-box"></span>$totalAttending total people attending</div><br>~;

    $csv .= "\nTotals:\n";
    $csv .= ",";
    $csv .= csv_column("$totalAttending total people attending");
    $csv .= "\n\n";

    return ($html, $csv);
}


sub chapterchair_html {
    my @contacts = @_;

    return (_chapterchair(@contacts))[0];
}


sub chapterchair_csv {
    my @contacts = @_;

    return (_chapterchair(@contacts))[1];
}



#--------------------------------------------------------------------------------


sub _directory {
    my @contacts = @_;

    return "" unless (@contacts != 0);

    my $html .= qq~<div class="admin-linespace-after"><span class="row-num"></span><span class="admin-name">Contact Name</span>~;
       $html .= qq~<span class="admin-narrow-box"></span><span class="admin-medium-box">Phone?</span><span class="admin-medium-box">Email?</span><span class="admin-medium-box">City?</span></div><br><br>~;

	my $csv =  ",,,,,,Allowed, Allowed, Allowed, Allowed, Allowed, Allowed\n";
       $csv .= "Contact ID, Contact, Email, Contact Phone,,,Mobile Phone, Work Phone, Home Phone, Email, City, State/Prov\n\n";

    my $totalAttending = 0;

    my $i = 1;
    for my $contact_ref (@contacts) {
        my %contact = %$contact_ref;

        next if ($contact{attendance} eq "balloon");

        my $not_paid = is_fully_paid(%contact) ? "" : " — Not Paid Yet";

        my $dir_phone = $contact{dir_phone} ? "Yes" : "<b><font color=red>No</font></b>";
        my $dir_email = $contact{dir_email} ? "Yes" : "<b><font color=red>No</font></b>";
        my $dir_city  = $contact{dir_city} ? "Yes" : "<b><font color=red>No</font></b>";

        $html .= qq~<div class="admin-linespace-after"><span class="row-num">$i: </span><span class="admin-name"><a href="/cgi-bin/admin.cgi?action=summary&id=$contact{id}">$contact{firstName} $contact{lastName}</a></span>~;
        $html .= qq~<span class="admin-narrow-box"></span><span class="admin-medium-box">$dir_phone</span><span class="admin-medium-box">$dir_email</span><span class="admin-medium-box">$dir_city</span></div><br>~;

        $csv .= csv_column($contact{id}) . ",";
        $csv .= csv_column("$contact{firstName} $contact{lastName}") . ",";
        $csv .= csv_column($contact{email}) . ",";
        $csv .= csv_column($contact{phoneMobile} || $contact{phoneHome} ||  $contact{phoneWork}) . ",,,";
        $csv .= csv_column($contact{dir_phone} ? $contact{phoneMobile} : "") . ",";
        $csv .= csv_column($contact{dir_phone} ? $contact{phoneWork} : "") . ",";
        $csv .= csv_column($contact{dir_phone} ? $contact{phoneHome} : "") . ",";
        $csv .= csv_column($contact{dir_email} ? $contact{email} : "") . ",";
        $csv .= csv_column($contact{dir_city}  ? $contact{city} : "") . ",";
        $csv .= csv_column($contact{dir_city}  ? $contact{stateProv} : "") . "\n";

        $i++;
    }

    return ($html, $csv);
}


sub directory_html {
    my @contacts = @_;

    return (_directory(@contacts))[0];
}


sub directory_csv {
    my @contacts = @_;

    return (_directory(@contacts))[1];
}



#--------------------------------------------------------------------------------


sub _notes {
    my @contacts = @_;

    return "" unless (@contacts != 0);

    my $html = "";
	my $csv =  "Contact ID, Contact, Email, Contact Phone, Notes\n\n";

    my $i = 1;
    for my $contact_ref (@contacts) {
        my %contact = %$contact_ref;

        my $not_paid = is_fully_paid(%contact) ? "" : " — Not Paid Yet";

        my $specialNeeds = trim($contact{specialNeeds});
        next unless ($specialNeeds);

        my $specialNeedsHTML = $specialNeeds;
        $specialNeedsHTML =~ s/\n/<br>/g;

        my $specialNeedsCSV  = $specialNeeds;
        $specialNeedsCSV =~ s/\n/ \/ /g;

        $html .= qq~<div class="admin-linespace-after"><span class="row-num">$i: </span><a href="/cgi-bin/admin.cgi?action=summary&id=$contact{id}">$contact{firstName} $contact{lastName}</a></div><br>~;
        $html .= qq~<span class="row-num"></span><span class="admin-superwide-box">$specialNeedsHTML</span><br><br>~;

        $csv .= csv_column($contact{id}) . ",";
        $csv .= csv_column("$contact{firstName} $contact{lastName}") . ",";
        $csv .= csv_column($contact{email}) . ",";
        $csv .= csv_column($contact{phoneMobile} || $contact{phoneHome} ||  $contact{phoneWork}) . ",";
        $csv .= csv_column($specialNeedsCSV) . "\n\n";

        $i++;
    }

    return ($html, $csv);
}


sub notes_html {
    my @contacts = @_;

    return (_notes(@contacts))[0];
}


sub notes_csv {
    my @contacts = @_;

    return (_notes(@contacts))[1];
}

#--------------------------------------------------------------------------------
#  Support functions


#  Take the column text and escapes it as necessary
sub csv_column {
    my $text = shift;

    $text =~ s/"/""/g;

    if ($text =~ /,/) {
        $text = '"' . $text . '"';
    }

    return $text;
}


1;
