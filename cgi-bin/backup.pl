#!/usr/bin/perl

#  What is the PATH to the top-level HTML directory for the $weburl website?
my $CgiBinPath = "/home4/softconf/public_html/cgi-bin";

#  What is your support email address?
my $support_email = "stormdevelopment\@gmail.com";

#  What email address would you like programmer development messages sent to?
my $developer_email = "stormdevelopment\@gmail.com";

#  This script uses the MySQL database. Set the username and password here.
my $mysql_database = "softconf_registration";
my $mysql_username = "softconf_reg";
my $mysql_password = "Trisomy18!";

#------------------------------------------------------------------------

#  Pull in the support modules
# use DBI;
# use Time::Local;


#------------------------------------------------------------------------
#  Backup...
#
#  This script will back up the calendar every day storing the day's
#  backup in one of 7 directories: Sunday DATE/ .. Saturday DATE/
#
#  The script will send an email message to the $support_email every
#  Saturday reminding the support folks to create a remote copy from
#  the Saturday backup. With this model, we should be able to restore
#  to previous day's backup, and if the worst happens and the server
#  is wiped out, we can restore to a point that is, at worst, only
#  7 days old.

@DayNames = ( Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday );

our @timeData  = localtime(time);
$timeData[4]++;
$timeData[5] += 1900;

our $dayofweek   = $timeData[6];
our $datetext    = sprintf("%02u-%02u-%04u", $timeData[4], $timeData[3], $timeData[5]);
our $backup_dir  = "$CgiBinPath/backups/$DayNames[$dayofweek]" ;

print "Backup dir ==> $backup_dir\n";

unless (-e $backup_dir) {
    mkdir $backup_dir;
}

our $backup_file = "$backup_dir/backup$datetext.sql";

print "Backup file ==> $backup_file\n";

#  Delete any existing .sql files in the directory. I couldn't get the
#  rm command to do this using rm "$backupdir/*.sql so I delete each
#  file separately here...

`rm $backup_dir/backup*`;
`mysqldump -u softconf_reg -pTrisomy18! --opt softconf_registration > "$backup_file"`;

if ($dayofweek == 6) {
    #  Send email to support staff to download this week's backup...

    open  MAIL, "|/usr/sbin/sendmail -t";
    print MAIL "From: SOFT Conf <$developer_email>\n";
    print MAIL "To: $support_email\n";
    print MAIL "Subject: Time to back up the SOFT Conf database...\n";
    print MAIL "\n";
    print MAIL "\nThe most recent backup file is in the $DayNames[$dayofweek]/ directory.";
    close MAIL;
}

	print "Content-type: text/html\n\n<br>";
    print "Done.";
1;