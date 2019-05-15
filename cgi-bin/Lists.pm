package Lists;

use strict;
use warnings;

use Settings;
use Globals;
use Database;
use Common 'is_fully_paid';

use Exporter 'import';
our @EXPORT = qw(
    get_contact_list
    get_attendee_list
    get_softangels_list
    get_clinics
    get_workshop_choices
    get_workshop_attendee_list
    get_childcare_needs
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

    die "Bad status: $status"  if ($status !~ /^(all|completed|abandoned)$/);    
    die "Bad type: $type "     if ($type   !~ /^(all|full|workshops|picnic|balloon|unpaid)$/);

    my @matching_contacts = ();
    my ($dbh, $sth, %contact);

    $dbh = OpenDatabase();
    {
        $sth = $dbh->prepare("SELECT * FROM contacts ORDER BY lastName");
        $sth->execute();

        while (my $contact_ref = $sth->fetchrow_hashref()) {
            my %contact = %$contact_ref;

            next unless ($status eq "all"     ||  $status eq ($contact{paymentPage} ? "completed" : "abandoned"));
            next unless ($type   eq "all"     ||  $type eq "unpaid"  ||  $contact{attendance} eq $type);
            next     if ($type   eq "unpaid"  &&  is_fully_paid(%contact));

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
        $sth = $dbh->prepare("SELECT * FROM softangels WHERE contact_id=? ORDER by id");
        $sth->execute($contact_id);

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

1;
