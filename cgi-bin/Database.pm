
#----------------------------------------------------------------------
#  Module: Database
#
#  This module defines and isolates all of the data structures and
#  database access routines for the system so that any of a number
#  of database engines can be used with the system.
#
#  This particular file implements access to a MySQL database.
#
#  Because of the repetative nature of these subs, this is a
#  perfect use of higher order sub factories to build each
#  function at compile time... See "Higher Order Perl" by
#  Mark Jason Dominus.

package Database;

use strict;
use warnings;
use 5.010;

use Settings;
use DBI;

use Exporter 'import';
our @EXPORT = qw(
    OpenDatabase
    CloseDatabase
    
    GetPost
    UpdatePost
    InsertPost
    DeletePost
    
    GetContact
    UpdateContact
    InsertContact
    DeleteContact
    GetContactByFormID
    TotallyDeleteContact

    GetAttendee
    UpdateAttendee
    InsertAttendee
    DeleteAttendee
    DeleteContactAttendees

    GetSoftAngel
    UpdateSoftAngel
    InsertSoftAngel
    DeleteSoftAngel
    DeleteContactSoftAngels

    GetWorkshop
    UpdateWorkshop
    InsertWorkshop
    DeleteWorkshop
    DeleteContactWorkshops

    GetChildCare
    UpdateChildCare
    InsertChildCare
    DeleteChildCare
    DeleteContactChildCare

    GetClinic
    UpdateClinic
    InsertClinic
    DeleteClinic
    DeleteContactClinics

    GetShirt
    UpdateShirt
    InsertShirt
    DeleteShirt
    DeleteContactShirts
);



#------------------------------------------------------------------------


sub OpenDatabase {
    my $dbh;

    $dbh = DBI->connect(
        "DBI:mysql:$mysql_database:$mysql_host", $mysql_username, $mysql_password,
        {PrintError => 0, RaiseError => 1}
    );
    return $dbh;
}


sub CloseDatabase {
    my $dbh = shift;
    return $dbh->disconnect();
}


#------------------------------------------------------------------------


our @post_cols = qw(
    date_created
    conference_id
    json
);


sub GetPost {
    my $id = shift;
    return GetObject("posts", $id);
}

sub UpdatePost {
    my %post = @_;
    return UpdateObject("posts", \@post_cols, %post);
}

sub InsertPost {
    my %post = @_;
    return InsertObject("posts", \@post_cols, %post);
}

sub DeleteAPost {
    my $id = shift;
    DeleteObject("posts", $id);
}


#------------------------------------------------------------------------


our @contact_cols = qw(
    date_created

    conference_id
    post_id
    form_id

    firstName
    lastName
    address1
    address2
    city
    stateProv
    country
    postalCode
    phoneMobile
    phoneWork
    phoneHome
    email

    attendance

    photoWaiver
    reception
    sundayBreakfast
    boardMember
    chapterChair
    joeyWatson
    joeyWatsonCode

    attendingClinics
    needsClinicsTrans
    clinicBusSeats
    clinicTieDowns
    numClinicMeals

    needsRembTrans
    numRembTrans

    dir_phone
    dir_email
    dir_city

    conferenceTotal
    softDonation
    fundDonation
    grandTotal

    paid
    payerID
    paymentID
    paymentToken
);


sub GetContact {
    my $id = shift;
    return GetObject("contacts", $id);
}

sub UpdateContact {
    my %contact = @_;
    return UpdateObject("contacts", \@contact_cols, %contact);
}

sub InsertContact {
    my %contact = @_;
    return InsertObject("contacts", \@contact_cols, %contact);
}

sub DeleteContact {
    my $id = shift;
    DeleteObject("contacts", $id);
}

sub GetContactByFormID {
    my $form_id   = shift;
    my ($dbh, $sth, %contact);

    $dbh = OpenDatabase();
    {
        $sth = $dbh->prepare("SELECT * FROM contacts WHERE form_id=?");
        $sth->execute($form_id);

        my $rhash = $sth->fetchrow_hashref();   # Should only be 1...
        %contact = %$rhash  if (defined($rhash));

        $sth->finish();
    }
    CloseDatabase($dbh);

    return(%contact);
}

sub TotallyDeleteContact {
    my $contact_id = shift;

    DeleteContactAttendees($contact_id);
    DeleteContactSoftAngels($contact_id);
    DeleteContactClinics($contact_id);
    DeleteContactWorkshops($contact_id);
    DeleteContactChildCare($contact_id);
    DeleteContactShirts($contact_id);
    DeleteContact($contact_id);
}

#------------------------------------------------------------------------


our @attendee_cols = qw(
    contact_id
    firstName
    lastName
    peopleType
    welcomeDinner
    rembOuting
    rembLunch
    chapterChairLunch
    age
    sibOuting
    shirtSize
    birthDate
    diagnosis
    otherDiagnosis
    eatsMeals
    picnicTrans
    picnicTiedown
);


sub GetAttendee {
    my $id = shift;
    return GetObject("attendees", $id);
}

sub UpdateAttendee {
    my %attendee = @_;
    return UpdateObject("attendees", \@attendee_cols, %attendee);
}

sub InsertAttendee {
    my %attendee = @_;
    return InsertObject("attendees", \@attendee_cols, %attendee);
}

sub DeleteAttendee {
    my $id = shift;
    DeleteObject("attendees", $id);
}

sub DeleteContactAttendees {
    my $contact_id = shift;
    DeleteContactObjects("attendees", $contact_id);
}


#------------------------------------------------------------------------


our @softangels_cols = qw(
    contact_id
    firstName
    lastName
    birthDate
    deathDate
    diagnosis
    otherDiagnosis
);


sub GetSoftAngel {
    my $id = shift;
    return GetObject("softangels", $id);
}

sub UpdateSoftAngel {
    my %softangel = @_;
    return UpdateObject("softangels", \@softangels_cols, %softangel);
}

sub InsertSoftAngel {
    my %softangel = @_;
    return InsertObject("softangels", \@softangels_cols, %softangel);
}

sub DeleteSoftAngel {
    my $id = shift;
    DeleteObject("softangels", $id);
}

sub DeleteContactSoftAngels {
    my $contact_id = shift;
    DeleteContactObjects("softangels", $contact_id);
}


#------------------------------------------------------------------------


our @workshops_cols = qw(
    contact_id
    attendee_id
    session_id
    workshop_id
);


sub GetWorkshop {
    my $id = shift;
    return GetObject("workshops", $id);
}

sub UpdateWorkshop {
    my %workshop = @_;
    return UpdateObject("workshops", \@workshops_cols, %workshop);
}

sub InsertWorkshop {
    my %workshop = @_;
    return InsertObject("workshops", \@workshops_cols, %workshop);
}

sub DeleteWorkshop {
    my $id = shift;
    DeleteObject("workshops", $id);
}

sub DeleteContactWorkshops {
    my $contact_id = shift;
    DeleteContactObjects("workshops", $contact_id);
}


#------------------------------------------------------------------------


our @clinics_cols = qw(
    contact_id
    position
    title
);


sub GetClinic {
    my $id = shift;
    return GetObject("clinics", $id);
}

sub UpdateClinic {
    my %clinic = @_;
    return UpdateObject("clinics", \@clinics_cols, %clinic);
}

sub InsertClinic {
    my %clinic = @_;
    return InsertObject("clinics", \@clinics_cols, %clinic);
}

sub DeleteClinic {
    my $id = shift;
    DeleteObject("clinics", $id);
}

sub DeleteContactClinics {
    my $contact_id = shift;
    DeleteContactObjects("clinics", $contact_id);
}


#------------------------------------------------------------------------


our @childcare_cols = qw(
    contact_id
    attendee_id
    session_id
    needed
);

sub GetChildCare {
    my $id = shift;
    return GetObject("childcare", $id);
}

sub UpdateChildCare {
    my %childcare = @_;
    return UpdateObject("childcare", \@childcare_cols, %childcare);
}

sub InsertChildCare {
    my %childcare = @_;
    return InsertObject("childcare", \@childcare_cols, %childcare);
}

sub DeleteChildCare {
    my $id = shift;
    DeleteObject("childcare", $id);
}

sub DeleteContactChildCare {
    my $contact_id = shift;
    DeleteContactObjects("childcare", $contact_id);
}


#------------------------------------------------------------------------


our @shirts_cols = qw(
    contact_id
    shirt_id
    shirtSize
    quantity
);

sub GetShirt {
    my $id = shift;
    return GetObject("shirts", $id);
}

sub UpdateShirt {
    my %shirt = @_;
    return UpdateObject("shirts", \@shirts_cols, %shirt);
}

sub InsertShirt {
    my %shirt = @_;
    return InsertObject("shirts", \@shirts_cols, %shirt);
}

sub DeleteShirt {
    my $id = shift;
    DeleteObject("shirts", $id);
}

sub DeleteContactShirts {
    my $contact_id = shift;
    DeleteContactObjects("shirts", $contact_id);
}


#------------------------------------------------------------------------
#
#  These are the workhorse functions for working with tables
#
#

sub valid_table_name {
    my $table = shift;
    return scalar($table =~ /^(posts|contacts|attendees|softangels|clinics|workshops|childcare|shirts)$/i);
}


#  my %object = GetObject("tablename", id)
sub GetObject {
    my $table = shift;
    my $id   = shift;
    my ($dbh, $sth, %object);

    warn("Bad table name: " . $table)  unless (valid_table_name($table));

    $dbh = OpenDatabase();
    {
        $sth = $dbh->prepare("SELECT * FROM $table WHERE id=?");
        $sth->execute($id);

        my $rhash = $sth->fetchrow_hashref();   # Should only be 1...
        %object = %$rhash  if (defined($rhash));

        $sth->finish();
    }
    CloseDatabase($dbh);

    return(%object);
}


#  %object = UpdateObject("tablename", \@colnames, %object)
sub UpdateObject {
    my $table = shift;
    my $cols_ref = shift;
    my %object = @_;
    my ($dbh, $result);

    warn("Bad table name: " . $table)  unless (valid_table_name($table));

    $dbh = OpenDatabase();

        my $stmt = "UPDATE $table SET " . UpdateColumns(@{$cols_ref}) . " WHERE id = ?";
        $result = $dbh->do($stmt, undef, ColumnValues(\%object, @{$cols_ref}), $object{id});

    CloseDatabase($dbh);

    return $result ? %object : undef;
}


#  %object = InsertObject("tablename", \@colnames, %object)
sub InsertObject {
    my $table = shift;
    my $cols_ref = shift;
    my %object = @_;
    my ($dbh, $result);

    warn("Bad table name: " . $table)  unless (valid_table_name($table));

    $dbh = OpenDatabase();

        $result = $dbh->do ("INSERT INTO $table " .
            InsertColumns(@{$cols_ref}),
            undef,
            ColumnValues(\%object,  @{$cols_ref})
        );

        $object{id} = $dbh->{mysql_insertid};

    CloseDatabase($dbh);

    return $result ? %object : undef;
}


sub DeleteObject {
    my $table = shift;
    my $id = shift;
    my $dbh;

    warn("Bad table name: " . $table)  unless (valid_table_name($table));

    $dbh = OpenDatabase();
    {
        $dbh->do(
            "DELETE FROM $table WHERE id=?",
            undef, $id
        );
    }
    CloseDatabase($dbh);
}


sub DeleteContactObjects {
    my $table = shift;
    my $contact_id = shift;
    my $dbh;

    warn("Bad table name: " . $table)  unless (valid_table_name($table));

    $dbh = OpenDatabase();
    {
        $dbh->do(
            "DELETE FROM $table WHERE contact_id=?",
            undef, $contact_id
        );
    }
    CloseDatabase($dbh);
}


#------------------------------------------------------------------------
#  Query building subs


#  Build "(field1, field2, field3,...) VALUES(?,?,?...)" list
sub InsertColumns {
    my @field_names = @_;

    my $stmt = "(";

    #  Build "field1, field2, field3,..." list
    my @fields = @field_names;
    while (@fields) {
        my $field = shift @fields;
        $stmt .= $field;
        $stmt .= ", "  if (@fields);
    }
    $stmt .= ") VALUES(";

    @fields = @field_names;
    while (@fields) {
        my $field = shift @fields;
        $stmt .= ($field eq "date_created") ? "NOW()" : "?";
        $stmt .= ", "  if (@fields);
    }

    return $stmt . ")";
}



sub UpdateColumns {
    my @field_names = @_;

    my $stmt = "";

    #  Build "field1=?, field2=?, field3=?,..." list
    my @fields = @field_names;
    while (@fields) {
        my $field = shift @fields;
        next if ($field eq "date_created");             #  Creation dates don't get updated
        $stmt .= $field . "=?";
        $stmt .= ", "  if (@fields);
    }

    return $stmt;
}



sub ColumnValues {
    my $hash_ref = shift;
    my @field_names = @_;

    my @result;

    foreach my $field (@field_names) {

        #  Creation dates don't get set from object values. Updates don't do it
        #  at all, and inserts use NOW().

        if ($field ne "date_created") {
            warn ("Undefined column: " . $field)  if (!defined($hash_ref->{$field}));
            push @result, $hash_ref->{$field};
        }
    }

    return @result;
}





#----------------------------------------------------------------------
#  Report Module Success
#

1;