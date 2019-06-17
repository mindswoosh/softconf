
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
    age_from_birthdate
    age_of_softangel
    friendly_date
    file_version
    diagnosis
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
    return $contact{paymentPage} != 0;
}


sub age_from_birthdate {
	my $birthdate = shift;			#  MM/DD/YYYY

	my ($month, $day, $year);

	if ($birthdate =~ m/(\d\d)\/(\d\d)\/(\d\d\d\d)/) {
		($month, $day, $year) = ($1, $2, $3);
	}
	else {
		die "Bad birthdate!";
	}

	# $day = 20; $month = 5; $year = 2019;
	my $dt_birth = DateTime->new(year => $year, month => $month, day => $day);
	my $dt_today = DateTime->new(year => 2019, month => 5, day => 21);

	my $age = int(($dt_today->epoch() - $dt_birth->epoch()) / (86400*365));

	return ($age);
}


sub age_of_softangel {
	my %softangel = @_;			#  MM/DD/YYYY

	my ($bmonth, $bday, $byear);
	my ($dmonth, $dday, $dyear);

	if ($softangel{birthDate} =~ m/(\d\d)\/(\d\d)\/(\d\d\d\d)/) {
		($bmonth, $bday, $byear) = ($1, $2, $3);
	}
	else {
		die "Bad birthdate!";
	}

	if ($softangel{deathDate} =~ m/(\d\d)\/(\d\d)\/(\d\d\d\d)/) {
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


sub diagnosis {
	my %softangel = @_;

	my $diagnosis = $softangel{diagnosis};
	if ($softangel{diagnosis} eq $otherDiagnosisTitle) {

		$diagnosis = $softangel{otherDiagnosis};
	}
	
	$diagnosis =~ s/trisomy/Trisomy/ig;
	$diagnosis =~ s/partial/Partial/ig;
	$diagnosis =~ s/trisomy partial/Partial Trisomy/ig;

	return $diagnosis;
}


#----------------------------------------------------------------------
#  Report Module Success
#

1;
