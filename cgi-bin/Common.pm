
#----------------------------------------------------------------------
#  Module: Common
#
#  This module has commonly needed, but generally unrelated
#  functions and routines.
#

package Common;

require Exporter;
@ISA    = qw(Exporter);
@EXPORT = qw(
    trim
    titlecase
    BrowserRefresh
    GetTemplate
    GetBodyFromTemplate
    StripHTML
    modification_time
    is_fully_paid
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


sub BrowserRefresh {
    my ($location) = @_;

    print "Content-type: text/html\n\n";

    # This is faster and cleaner but doesn't update the address bar
    #     my $template = get($location);
    #     print $template;
    #     exit;

    print "<html><head>\n";
    print "<meta http-equiv='refresh' content='0; url=$location'>\n";
    print "</head></html>";
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
#  encapsulate that here...


sub is_fully_paid {
    my %contact = @_;

    #  The only registrations that are free are balloon releases, but
    #  they might have pledged some donations. A family could also be
    #  fully comp'd with a Joey Watson scholarship.

    my $paid = 1;
    if ($contact{attendance} ne "balloon" || $contact{grandTotal} > 0) {
        $paid = $contact{paid} ? 1 : 0;    # "$contact{paid}" is a flag, not a payment
    }

    return $paid;
}

#----------------------------------------------------------------------
#  Report Module Success
#

1;
