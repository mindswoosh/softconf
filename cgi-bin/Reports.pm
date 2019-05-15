package Reports;

use strict;
use warnings;

use Globals;
use TextTools qw(trim boolToYesNo);
use Database;
use Lists;
use EventInfo;
use Common 'is_fully_paid';

use Exporter 'import';
our @EXPORT_OK = qw(
    contact_summary
    welcome_dinner
    workshop_attendance
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

    my $output = "$contact{firstName} $contact{lastName}\n\n";

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

    return $output;
}


sub welcome_dinner {
    my @contacts = @_;

    return "" unless (@contacts != 0);

    my $html = "";
    my %meal_types_paid;
    my %meal_types_unpaid;

    my $i = 1;
    for my $contact_ref (@contacts) {
        my %contact = %{$contact_ref};

        my $not_paid = is_fully_paid(%contact) ? "" : " &mdash; Not Paid Yet";

        $html .= qq~<div class="admin-linespace-after"><span class="row-num">$i: </span><a href="/cgi-bin/admin.cgi?action=summary&id=$contact{id}">$contact{firstName} $contact{lastName}</a>$not_paid</div><br>~;
        my @attendees = get_attendee_list($contact{id});

        for my $attendee_ref (@attendees) {
            my %attendee = %$attendee_ref;

            $attendee{welcomeDinner} = "None" unless ($attendee{welcomeDinner});

            if ($not_paid) {
                $meal_types_unpaid{ $attendee{welcomeDinner} }++;
            }
            else {
                $meal_types_paid{ $attendee{welcomeDinner} }++;
            }

            $html .= qq~<span class="row-num"></span><span class="admin-name">$attendee{firstName} $attendee{lastName}:</span>$attendee{welcomeDinner}<br>~;
        }
        $html .= "<br>";
        $i++;
    }

    $html .= "<h3>Totals:</h3>";

    #  List paid meals
    $html .= "Paid meals:<br><br>";
    for my $meal (sort keys %meal_types_paid) {
        next if ($meal eq "None");
        $html .= qq~<span class="row-num">$meal_types_paid{$meal}</span>$meal<br>~;
    }
    $html .= qq~<span class="row-num">$meal_types_paid{"None"}</span>None<br>~;
    $html .= "<br>" x 2;

    #  List unpaid meals
    $html .= "Unpaid meals:<br><br>";
    for my $meal (sort keys %meal_types_unpaid) {
        next if ($meal eq "None");
        $html .= qq~<span class="row-num">$meal_types_unpaid{$meal}</span>$meal<br>~;
    }
    $html .= qq~<span class="row-num">$meal_types_unpaid{"None"}</span>None<br>~;

    return $html;
}


sub workshop_attendance {
    my $conference_id = shift;

    my $html             = "";
    my @workshopsessions = get_workshop_info($conference_id);

    for my $session_ref (@workshopsessions) {
        my %session = %$session_ref;

        $html .= "$session{name}<br><br>";

        for my $workshop_ref (@{ $session{workshops} }) {
            my %workshop = %$workshop_ref;

            next if ($workshop{title} =~ /None/i);

            $html .= qq~<span class="admin-twice-indent">$workshop{id}: $workshop{title}</span><br><br>~;

            my @workshop_attendees = get_workshop_attendee_list($workshop{id});

            my $i = 1;
            for my $workshop_attendee_ref (@workshop_attendees) {
                my %workshop_attendee = %$workshop_attendee_ref;

                my %attendee = GetAttendee($workshop_attendee{attendee_id});

                $html .= qq~<div class="admin-linespace-after"><span class="admin-twice-indent"></span><span class="row-num">$i.</span><a href="/cgi-bin/admin.cgi?action=summary&id=$attendee{contact_id}">$attendee{firstName} $attendee{lastName}</a></div><br>~;
                $i++;
            }
            $html .= "<br>";
        }

        $html .= "<br>";

    }

    return $html;
}

1;
