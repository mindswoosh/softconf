
#----------------------------------------------------------------------
#  Module: Common
#
#  This module has commonly needed, but generally unrelated
#  functions and routines.
#

package Common;

use DateTime;
use Globals;
use List::Util 'max';
use POSIX qw(strftime);

require Exporter;
@ISA    = qw(Exporter);
@EXPORT = qw(
    trim
    titlecase
    redirect
    GetTemplate
    GetBodyFromTemplate
    StripHTML
    modification_time
    is_fully_paid
    is_complete
    is_late_registrant
    age_from_birthdate
    age_of_softangel
    friendly_date
    file_version
    eats_meals
    diagnosis
    contactNameHTML
    sort_by_field
);

use strict;
use Settings;

#----------------------------------------------------------------------


sub trim {
    my $text = shift;

    $text = "" if (!defined($text));

    $text =~ s/^\s+//;
    $text =~ s/\s+$//;

    return $text;
}


sub titlecase {
    my $text = shift;

    $text = lc($text);
    $text = ucfirst($text);
    $text =~ s/([\s\-]+)(.)/$1\U$2/g;

    return $text;
}


sub redirect {
	my $url = shift;

	# Prevent header injection
	$url =~ s/[\r\n]//g;

	print "Location: $url\n\n";
	exit;
}


use LWP::Simple;


sub GetTemplate {
    my $file_name = shift;
    my $template  = "";
    my $counter   = 0;

    if ($file_name =~ /^http/i) {    #  Fetch from the Web
        $template = get($file_name);
    }
    else                             #  Fetch from local file system
    {
        open DATA, "$system_httpdocs/templates/$file_name";

        while (my $line = <DATA>) {
            $template .= "$line";
            last if ($counter++ > 5000);
        }
        close DATA;
    }

    # Fix up some relative link issues
    $template =~ s|="images|="/images|ig;

    return $template;
}


sub GetBodyFromTemplate {
    my $file_name = shift;
    my $template  = GetTemplate($file_name);

    $template =~ s/^.*?<body>//si;
    $template =~ s/<\/body>.*?$//si;

    return $template;
}


#------------------------------------------------
# Converts the modtime of a file to base62 so the
# modtime can be used for short version strings
# with .js and .css files: 1542312959 => 1Gno3t
#
#     code.js?v=1Gno3t
#
# Using these version strings will cause browsers
# to automatically recache a .js or .css file
# when they are modified.
#------------------------------------------------

sub file_version {
   my $file = shift;        # Full path to file

   my $seconds = (stat $file)[9] || 0;
   warn "File '$file' not found"  unless ($seconds);

   my $version = "";
   do {
       $version .= ('0'..'9', 'a'..'z', 'A'..'Z')[$seconds%62];
       $seconds = int($seconds/62);
   }
   while ($seconds > 0);

   return reverse $version;
}



sub StripHTML {
    my $html = shift;

    #  Simplistic HTML tag removal. Don't use in anything critical. Doesn't
    #  remove Javascript code, styles, or anything between tags.

    $html =~ s/\<\/?[A-Z]+?\>//ig;

    return ($html);
}


#  Return the modification time of the filepath/file passed in
sub modification_time {
    return (stat(shift))[9];
}


#  Determining whether somebody owes anything has a few quirks, so let's
#  encapsulate that here... This deterimes whether somebody owes
#  anything for registration, not if they've pledged a donation.

sub is_fully_paid {
    my %contact = @_;

    my $paid = 1;
    if ($contact{attendance} ne "balloon"  &&  $contact{grandTotal} > 0) {
        $paid = $contact{paid};    # "$contact{paid}" is a flag, not a payment
    }

    return $paid;
}


sub is_complete {
    my %contact = @_;
    return !$contact{archived}  &&  $contact{paymentPage} != 0;
}


sub is_late_registrant {
    my $contact_id = shift;

    return $contact_id >= 1000;
}


sub age_from_dates {
	my ($birthdate, $deathdate) = @_;

	my ($bmonth, $bday, $byear);
	my ($dmonth, $dday, $dyear);

	if ($birthdate =~ m/(\d\d)\/(\d\d)\/(\d\d\d\d)/) {
		($bmonth, $bday, $byear) = ($1, $2, $3);
	}
	else {
		die "Bad birthdate!";
	}

	if ($deathdate =~ m/(\d\d)\/(\d\d)\/(\d\d\d\d)/) {
		($dmonth, $dday, $dyear) = ($1, $2, $3);
	}
	else {
		die "Bad deathdate!";
	}

	# $day = 20; $month = 5; $year = 2019;
	my $dt_birth = DateTime->new(year => $byear, month => $bmonth, day => $bday);
	my $dt_death = DateTime->new(year => $dyear, month => $dmonth, day => $dday);

	my $age = int(($dt_death->epoch() - $dt_birth->epoch()) / (86400*365));

	if ($age == 0) {
		my $days = max(1, int(($dt_death->epoch() - $dt_birth->epoch()) / 86400));

		if ($days < 60) {
			$age = "$days day" . ($days != 1 ? "s" : "");
		}
		else {
			my $num_months = int($days/30);
			$age = "$num_months month" . ($num_months != 1 ? "s" : "");
		}
	}

	return ($age);
}


sub age_from_birthdate {
	my $birthdate = shift;			#  MM/DD/YYYY

	my $now = DateTime->now;
	my $todate = $now->strftime('%m/%d/%Y');

	return age_from_dates($birthdate, $todate);
}


sub age_of_softangel {
	my %softangel = @_;
	return age_from_dates($softangel{birthDate}, $softangel{deathDate});
}


sub friendly_date {
	my $date = shift;

	my ($month, $day, $year);

	if ($date =~ m/(\d\d)\/(\d\d)\/(\d\d\d\d)/) {
		($month, $day, $year) = ($1, $2, $3);
	}
	else {
		die "Bad birthdate!";
	}

	my $dt_date = DateTime->new(year => $year, month => $month, day => $day);;

	return $dt_date->strftime("%b %e, %Y");
}


sub eats_meals {
	my %attendee = @_;

	return $attendee{peopleType} ne $peopleTypes{SOFTCHILD}  ||  $attendee{eatsMeals};
}


#  diagnosis() returns the diagnosis of either a SOFT child or a SOFT Angel
sub diagnosis {
	my %softangelchild = @_;

	my $diagnosis = $softangelchild{diagnosis};
	if ($softangelchild{diagnosis} eq $otherDiagnosisTitle) {

		$diagnosis = $softangelchild{otherDiagnosis};
	}
	
	$diagnosis =~ s/trisomy/Trisomy/ig;
	$diagnosis =~ s/partial/Partial/ig;
	$diagnosis =~ s/par\./Partial/ig;
	$diagnosis =~ s/trisomy partial/Partial Trisomy/ig;

	return $diagnosis;
}


sub contactNameHTML {
    my %contact = @_;

    my $fullname = "$contact{firstName} $contact{lastName}";
    if (is_late_registrant($contact{id})) {
        $fullname = "<font color=orange>$fullname</font>";
    }
    return $fullname;
}


sub sort_by_field {
	my $field = shift;
	my @contacts = @_;

	@contacts = sort { $a->{$field} cmp $b->{$field} } @contacts;
}


#----------------------------------------------------------------------
#  Report Module Success
#

1;
