package Lists;

use strict;
use warnings;

use Settings;
use Globals;
use Database;
use Common qw(is_fully_paid is_complete);

use Exporter 'import';
our @EXPORT = qw(
    get_contact_list
    get_archived_list
    
    get_attendee_list
    get_softangels_list
    get_all_softangels_list
    
    get_clinics
    get_clinic_choices
    
    get_workshop_choices
    get_workshop_attendee_list
    
    get_childcare_needs
    get_childcare_attendee_list

    get_shirtsordered_list
);


#----------------------------------------------------------------------------------------------------
#  Search for constacts, returning an array of hash references to contacts
#
#  my @contacts_refs = get_contact_list($search_term, $status, $type);
#
#  All arguments are optional. The second arg is "completed" or "abandoned" or "all". The third
#  argument is "all", "full", "picnic", "workshops", or "balloon".


sub get_contact_list {
    my $search_term = shift || "";
    my $status = shift || "completed";
    my $type = shift || "all";
    my $paymentType = shift || "all";

    die "Bad status: $status"             if ($status      !~ /^(all|completed|abandoned)$/);    
    die "Bad type: $type"                 if ($type        !~ /^(all|full|workshops|picnic|balloon)$/);
    die "Bad payment type: $paymentType"  if ($paymentType !~ /^(all|paid|unpaid)$/);

    my @matching_contacts = ();
    my ($dbh, $sth, %contact);

    $dbh = OpenDatabase();
    {
        $sth = $dbh->prepare("SELECT * FROM contacts WHERE archived IS FALSE ORDER BY lastName");
        $sth->execute();

        while (my $contact_ref = $sth->fetchrow_hashref()) {
            my %contact = %$contact_ref;

            next unless ($status      eq "all"  ||  $status eq (is_complete(%contact) ? "completed" : "abandoned"));
            next unless ($type        eq "all"  ||  $contact{attendance} eq $type);
            next unless ($paymentType eq "all"  ||  ( $paymentType eq "paid"  &&  is_fully_paid(%contact) )  ||  ($paymentType eq "unpaid"  &&  !is_fully_paid(%contact) ) );

            if ($search_term eq ""  ||  $contact{firstName} =~ m/$search_term/i  ||  $contact{lastName} =~ m/$search_term/i  ||  $contact{email} =~ m/$search_term/i) {
                push @matching_contacts, $contact_ref;
            }
        }

        $sth->finish();
    }
    CloseDatabase($dbh);

    return @matching_contacts;
}


sub get_archived_list {
	my $search_term = shift || "";
	my $status = shift || "all";

    my @matching_contacts = ();
    my ($dbh, $sth, %contact);

    $dbh = OpenDatabase();
    {
        $sth = $dbh->prepare("SELECT * FROM contacts WHERE archived IS TRUE ORDER BY lastName");
        $sth->execute();

        while (my $contact_ref = $sth->fetchrow_hashref()) {
            my %contact = %$contact_ref;

            next if ($status eq "paid"   &&  !is_fully_paid(%contact));
            next if ($status eq "unpaid" &&   is_fully_paid(%contact));

            if ($search_term eq ""  ||  $contact{firstName} =~ m/$search_term/i  ||  $contact{lastName} =~ m/$search_term/i  ||  $contact{email} =~ m/$search_term/i) {
                push @matching_contacts, $contact_ref;
            }
        }

        $sth->finish();
    }
    CloseDatabase($dbh);

    return @matching_contacts;
}



#----------------------------------------------------------------------------------------------------
#  Search for attendees of specified contact, returning an array of hash references to attendees
#
#  my @attendee_refs = get_attendee_list($contact_id);


sub get_attendee_list {
    my $contact_id = shift;

    my @matching_attendees = ();
    my ($dbh, $sth);

    $dbh = OpenDatabase();
    {
        $sth = $dbh->prepare("SELECT * FROM attendees WHERE contact_id=? ORDER BY id");
        $sth->execute($contact_id);

        while (my $attendee_ref = $sth->fetchrow_hashref()) {
          push @matching_attendees, $attendee_ref;
        }

        $sth->finish();
    }
    CloseDatabase($dbh);

    return @matching_attendees;
}


sub get_workshop_attendee_list {
    my $workshop_id = shift;

    my @matching_attendees = ();
    my ($dbh, $sth);

    my %seen;

    $dbh = OpenDatabase();
    {
        $sth = $dbh->prepare("SELECT * FROM workshops WHERE workshop_id=? ORDER BY id");
        $sth->execute($workshop_id);

        # There should never be a duplicate attendee for the same workshop
        while (my $attendee_ref = $sth->fetchrow_hashref()) {
          push @matching_attendees, $attendee_ref;
          die "Duplicate attendee in workshop"  if ($seen{$attendee_ref->{attendee_id}}++);
        }

        $sth->finish();
    }
    CloseDatabase($dbh);

    return @matching_attendees;
}



#----------------------------------------------------------------------------------------------------
#  Search for SOFT Angels of specified contact, returning an array of hash references to SOFT angels
#
#  my @softangels_refs = get_softangels_list($contact_id);


sub get_softangels_list {
    my $contact_id = shift;

    my @matching_softangels = ();
    my ($dbh, $sth);

    $dbh = OpenDatabase();
    {
        $sth = $dbh->prepare("SELECT * FROM softangels WHERE contact_id=? ORDER BY id");
        $sth->execute($contact_id);

        while (my $softangel_ref = $sth->fetchrow_hashref()) {
          push @matching_softangels, $softangel_ref;
        }

        $sth->finish();
    }
    CloseDatabase($dbh);

    return @matching_softangels;
}


sub get_all_softangels_list {

    my @matching_softangels = ();
    my ($dbh, $sth);

    $dbh = OpenDatabase();
    {
        $sth = $dbh->prepare("SELECT * FROM softangels ORDER BY id");
        $sth->execute();

        while (my $softangel_ref = $sth->fetchrow_hashref()) {
          push @matching_softangels, $softangel_ref;
        }

        $sth->finish();
    }
    CloseDatabase($dbh);

    return @matching_softangels;
}




#----------------------------------------------------------------------------------------------------
#  Search for clinics of specified contact, returning an ordered array of clinic titles
#
#  my @clinics = get_clinics($contact_id);


sub get_clinics {
    my $contact_id = shift;

    my @clinics = ();
    my ($dbh, $sth);

    $dbh = OpenDatabase();
    {
        $sth = $dbh->prepare("SELECT * FROM clinics WHERE contact_id=? ORDER BY position");
        $sth->execute($contact_id);

        while (my $clinic_ref = $sth->fetchrow_hashref()) {
          push @clinics, $clinic_ref->{title};
        }

        $sth->finish();
    }
    CloseDatabase($dbh);

    return @clinics;
}


sub get_clinic_choices {
	my $clinicName = shift;
	my $clinicChoice = shift;

	my @matching_clinics = ();
    my ($dbh, $sth);

    $dbh = OpenDatabase();
    {
        $sth = $dbh->prepare("SELECT * FROM clinics WHERE title=? and position=? ORDER by id");
        $sth->execute($clinicName, $clinicChoice);

        while (my $clinic_ref = $sth->fetchrow_hashref()) {
          push @matching_clinics, $clinic_ref;
        }

        $sth->finish();
    }
    CloseDatabase($dbh);

    return @matching_clinics;
}


#----------------------------------------------------------------------------------------------------
#  Search for workshop sessions of specified attendee, returning a hash
#
#  my %workshopChoices = get_workshop_choices($attendee_id);


sub get_workshop_choices {
    my $attendee_id = shift;

    my %choices = ();
    my ($dbh, $sth);

    $dbh = OpenDatabase();
    {
        $sth = $dbh->prepare("SELECT * FROM workshops WHERE attendee_id=?");
        $sth->execute($attendee_id);

        while (my $workshop_ref = $sth->fetchrow_hashref()) {
            $choices{$workshop_ref->{session_id}} = $workshop_ref->{workshop_id};
        }

        $sth->finish();
    }
    CloseDatabase($dbh);

    return %choices;
}



#----------------------------------------------------------------------------------------------------
#  Search for child care sessions of specified attendee, returning a hash
#
#  my %childCareNeeds = get_childcare_needs($attendee_id);


sub get_childcare_needs {
    my $attendee_id = shift;

    my %childCareNeeds = ();
    my ($dbh, $sth);

    $dbh = OpenDatabase();
    {
        $sth = $dbh->prepare("SELECT * FROM childcare WHERE attendee_id=?");
        $sth->execute($attendee_id);

        while (my $childcare_ref = $sth->fetchrow_hashref()) {
            $childCareNeeds{$childcare_ref->{session_id}} = $childcare_ref->{needed};
        }

        $sth->finish();
    }
    CloseDatabase($dbh);

    return %childCareNeeds;
}


sub get_childcare_attendee_list {
	my $session_id = shift;

    my @matching_children = ();
    my ($dbh, $sth);

    $dbh = OpenDatabase();
    {
        $sth = $dbh->prepare("SELECT * FROM childcare WHERE session_id=? ORDER by id");
        $sth->execute($session_id);

        while (my $child_ref = $sth->fetchrow_hashref()) {
          push @matching_children, $child_ref;
        }

        $sth->finish();
    }
    CloseDatabase($dbh);

    return @matching_children;
}



#----------------------------------------------------------------------------------------------------
#  Return an array of hash references for shirts ordered
#
#  my @shirtsOrdered_refs = get_shirtsordered_list($contact_id);


sub get_shirtsordered_list {
    my $contact_id = shift;

    my @shirtsordered = ();
    my ($dbh, $sth);

    $dbh = OpenDatabase();
    {
        $sth = $dbh->prepare("SELECT * FROM shirts WHERE contact_id=? ORDER by id");
        $sth->execute($contact_id);

        while (my $shirtsordered_ref = $sth->fetchrow_hashref()) {
          push @shirtsordered, $shirtsordered_ref;
        }

        $sth->finish();
    }
    CloseDatabase($dbh);

    return @shirtsordered;
}




# #----------------------------------------------------------------------------------------------------
# #  Return an array of hash references for shirts ordered
# #
# #  my @shirtsOrdered_refs = get_shirtsordered_list($contact_id);


# sub get_sibouting_list {

#     my @attendees = ();
#     my ($dbh, $sth);

#     $dbh = OpenDatabase();
#     {
#         $sth = $dbh->prepare("SELECT * FROM attendees WHERE contact_id=? ORDER by id");
#         $sth->execute();

#         while (my $shirtsordered_ref = $sth->fetchrow_hashref()) {
#           push @shirtsordered, $shirtsordered_ref;
#         }

#         $sth->finish();
#     }
#     CloseDatabase($dbh);

#     return @shirtsordered;
# }

1;
