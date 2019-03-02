
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



#----------------------------------------------------------------------
#  Report Module Success
#

1;