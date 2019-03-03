
#----------------------------------------------------------------------
#  Module: Database
#
#  This module defines and isolates all of the data structures and
#  database access routines for the system so that any of a number
#  of database engines can be used with the system.
#
#  This particular file implements access from a MySQL database.
#

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

        GetAttendee
        UpdateAttendee
        InsertAttendee
        DeleteAttendee

        GetSoftAngel
        UpdateSoftAngel
        InsertSoftAngel
        DeleteSoftAngel

        GetWorkshop
        UpdateWorkshop
        InsertWorkshop
        DeleteWorkshop

        GetChildCare
        UpdateChildCare
        InsertChildCare
        DeleteChildCare

        GetClinic
        UpdateClinic
        InsertClinic
        DeleteClinic

        GetShirt
        UpdateShirt
        InsertShirt
        DeleteShirt
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


sub GetPost {
    my $id   = shift;
    my ($dbh, $sth, %post);

    $dbh = OpenDatabase();
    {
        $sth = $dbh->prepare("SELECT * FROM posts WHERE id=?");
        $sth->execute($id);

        my $rhash = $sth->fetchrow_hashref();   # Should only be 1...
        %post = %$rhash  if (defined($rhash));

        $sth->finish();
    }
    CloseDatabase($dbh);

    return(%post);
}


sub UpdatePost {
    my %post = @_;
    my ($dbh, $result);

    $dbh = OpenDatabase();
    $result = $dbh->do (
        "UPDATE posts SET
            conference_id = ?, json = ?
        WHERE id = ?",
            undef,
            $post{conference_id}, $post{json},
        $post{id}
    );
    CloseDatabase($dbh);

    return $result ? %post : undef;
}


sub InsertPost {
    my %post = @_;
    my ($dbh, $result);

    $dbh = OpenDatabase();
    $result = $dbh->do (
        "INSERT INTO posts (
            date_created,
            conference_id,
            json
        )
        VALUES(NOW(),?,?)",
        undef,
        $post{conference_id},
        $post{json}
    );

    $post{id} = $dbh->{mysql_insertid};
    CloseDatabase($dbh);

    return $result ? %post : undef;
}


sub DeletePost {
    my $id = shift;
    my $dbh;

    $dbh = OpenDatabase();
    {
        $dbh->do(
            "DELETE FROM posts WHERE id=?",
            undef, $id
        );
    }
    CloseDatabase($dbh);
}


#------------------------------------------------------------------------

our @contact_insert_cols = qw(
    date_created
);

our @contact_cols = qw(
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

    attendingClinics
    clinicTieDowns

    dir_phone
    dir_email
    dir_city

    paid
    transactionCode
);


sub GetContact {
    my $id   = shift;
    my ($dbh, $sth, %contact);

    $dbh = OpenDatabase();
    {
        $sth = $dbh->prepare("SELECT * FROM contacts WHERE id=?");
        $sth->execute($id);

        my $rhash = $sth->fetchrow_hashref();   # Should only be 1...
        %contact = %$rhash  if (defined($rhash));

        $sth->finish();
    }
    CloseDatabase($dbh);

    return(%contact);
}


sub UpdateContact {
    my %contact = @_;
    my ($dbh, $result);

    $dbh = OpenDatabase();

        my $stmt = "UPDATE contacts SET " . UpdateColumns(@contact_cols) . " WHERE id = ?";
        $result = $dbh->do($stmt, undef, ColumnValues(\%contact, @contact_cols), $contact{id});

    CloseDatabase($dbh);

    return $result ? %contact : undef;
}


sub InsertContact {
    my %contact = @_;
    my ($dbh, $result);

    $dbh = OpenDatabase();

        $result = $dbh->do ("INSERT INTO contacts " .
            InsertColumns(@contact_insert_cols, @contact_cols),
            undef,
            ColumnValues(\%contact,  @contact_insert_cols, @contact_cols)
        );

        $contact{id} = $dbh->{mysql_insertid};
        
    CloseDatabase($dbh);

    return $result ? %contact : undef;
}


sub DeleteContact {
    my $id = shift;
    my $dbh;

    $dbh = OpenDatabase();
    {
        $dbh->do(
            "DELETE FROM attendees WHERE id=?",
            undef, $id
        );
    }
    CloseDatabase($dbh);
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
    dateOfBirth
    diagnosis
    otherDiagnosis
    eatsMeals
    picnic
    picnicTiedown
);


sub GetAttendee {
    my $id   = shift;
    my ($dbh, $sth, %attendee);

    $dbh = OpenDatabase();
    {
        $sth = $dbh->prepare("SELECT * FROM attendees WHERE id=?");
        $sth->execute($id);

        my $rhash = $sth->fetchrow_hashref();   # Should only be 1...
        %attendee = %$rhash  if (defined($rhash));

        $sth->finish();
    }
    CloseDatabase($dbh);

    return(%attendee);
}


sub UpdateAttendee {
    my %attendee = @_;
    my ($dbh, $result);

    $dbh = OpenDatabase();

        my $stmt = "UPDATE attendees SET " . UpdateColumns(@attendee_cols) . " WHERE id = ?";
        $result = $dbh->do($stmt, undef, ColumnValues(\%attendee, @attendee_cols), $attendee{id});

    CloseDatabase($dbh);

    return $result ? %attendee : undef;
}


sub InsertAttendee {
    my %attendee = @_;
    my ($dbh, $result);

    $dbh = OpenDatabase();

        $result = $dbh->do ("INSERT INTO attendees " .
            InsertColumns(@attendee_cols),
            undef,
            ColumnValues(\%attendee,  @attendee_cols)
        );

        $attendee{id} = $dbh->{mysql_insertid};

    CloseDatabase($dbh);

    return $result ? %attendee : undef;
}


sub DeleteAttendee {
    my $id = shift;
    my $dbh;

    $dbh = OpenDatabase();
    {
        $dbh->do(
            "DELETE FROM attendees WHERE id=?",
            undef, $id
        );
    }
    CloseDatabase($dbh);
}




#------------------------------------------------------------------------


our @softangels_cols = qw(
    contact_id
    firstName
    lastName
    dateOfBirth
    dateOfDeath
    diagnosis
    otherDiagnosis
);


sub GetSoftAngel {
    my $id   = shift;
    my ($dbh, $sth, %softangel);

    $dbh = OpenDatabase();
    {
        $sth = $dbh->prepare("SELECT * FROM softangels WHERE id=?");
        $sth->execute($id);

        my $rhash = $sth->fetchrow_hashref();   # Should only be 1...
        %softangel = %$rhash  if (defined($rhash));

        $sth->finish();
    }
    CloseDatabase($dbh);

    return(%softangel);
}


sub UpdateSoftAngel {
    my %softangel = @_;
    my ($dbh, $result);

    $dbh = OpenDatabase();

        my $stmt = "UPDATE softangels SET " . UpdateColumns(@softangels_cols) . " WHERE id = ?";
        $result = $dbh->do($stmt, undef, ColumnValues(\%softangel, @softangels_cols), $softangel{id});

    CloseDatabase($dbh);

    return $result ? %softangel : undef;
}


sub InsertSoftAngel {
    my %softangel = @_;
    my ($dbh, $result);

    $dbh = OpenDatabase();

        $result = $dbh->do ("INSERT INTO softangels " .
            InsertColumns(@softangels_cols),
            undef,
            ColumnValues(\%softangel,  @softangels_cols)
        );

        $softangel{id} = $dbh->{mysql_insertid};

    CloseDatabase($dbh);

    return $result ? %softangel : undef;
}


sub DeleteSoftAngel {
    my $id = shift;
    my $dbh;

    $dbh = OpenDatabase();
    {
        $dbh->do(
            "DELETE FROM softangels WHERE id=?",
            undef, $id
        );
    }
    CloseDatabase($dbh);
}




#------------------------------------------------------------------------


our @workshops_cols = qw(
    contact_id
    attendee_id
    session_id
    workshop_id
);


sub GetWorkshop {
    my $id   = shift;
    my ($dbh, $sth, %workshop);

    $dbh = OpenDatabase();
    {
        $sth = $dbh->prepare("SELECT * FROM workshops WHERE id=?");
        $sth->execute($id);

        my $rhash = $sth->fetchrow_hashref();   # Should only be 1...
        %workshop = %$rhash  if (defined($rhash));

        $sth->finish();
    }
    CloseDatabase($dbh);

    return(%workshop);
}


sub UpdateWorkshop {
    my %workshop = @_;
    my ($dbh, $result);

    $dbh = OpenDatabase();

        my $stmt = "UPDATE workshops SET " . UpdateColumns(@workshops_cols) . " WHERE id = ?";
        $result = $dbh->do($stmt, undef, ColumnValues(\%workshop, @workshops_cols), $workshop{id});

    CloseDatabase($dbh);

    return $result ? %workshop : undef;
}


sub InsertWorkshop {
    my %workshop = @_;
    my ($dbh, $result);

    $dbh = OpenDatabase();

        $result = $dbh->do ("INSERT INTO workshops " .
            InsertColumns(@workshops_cols),
            undef,
            ColumnValues(\%workshop,  @workshops_cols)
        );

        $workshop{id} = $dbh->{mysql_insertid};

    CloseDatabase($dbh);

    return $result ? %workshop : undef;
}


sub DeleteWorkshop {
    my $id = shift;
    my $dbh;

    $dbh = OpenDatabase();
    {
        $dbh->do(
            "DELETE FROM workshops WHERE id=?",
            undef, $id
        );
    }
    CloseDatabase($dbh);
}



#------------------------------------------------------------------------


our @clinics_cols = qw(
    contact_id
    position
    title
);


sub GetClinic {
    my $id   = shift;
    my ($dbh, $sth, %clinic);

    $dbh = OpenDatabase();
    {
        $sth = $dbh->prepare("SELECT * FROM clinics WHERE id=?");
        $sth->execute($id);

        my $rhash = $sth->fetchrow_hashref();   # Should only be 1...
        %clinic = %$rhash  if (defined($rhash));

        $sth->finish();
    }
    CloseDatabase($dbh);

    return(%clinic);
}


sub UpdateClinic {
    my %clinic = @_;
    my ($dbh, $result);

    $dbh = OpenDatabase();

        my $stmt = "UPDATE clinics SET " . UpdateColumns(@clinics_cols) . " WHERE id = ?";
        $result = $dbh->do($stmt, undef, ColumnValues(\%clinic, @clinics_cols), $clinic{id});

    CloseDatabase($dbh);

    return $result ? %clinic : undef;
}


sub InsertClinic {
    my %clinic = @_;
    my ($dbh, $result);

    $dbh = OpenDatabase();

        $result = $dbh->do ("INSERT INTO clinics " .
            InsertColumns(@clinics_cols),
            undef,
            ColumnValues(\%clinic,  @clinics_cols)
        );

        $clinic{id} = $dbh->{mysql_insertid};

    CloseDatabase($dbh);

    return $result ? %clinic : undef;
}


sub DeleteClinic {
    my $id = shift;
    my $dbh;

    $dbh = OpenDatabase();
    {
        $dbh->do(
            "DELETE FROM clinics WHERE id=?",
            undef, $id
        );
    }
    CloseDatabase($dbh);
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


#------------------------------------------------------------------------


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