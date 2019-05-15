package TextTools;

use strict;
use warnings;

use Exporter 'import';
our @EXPORT_OK = qw(
    commify trim quote boolToYesNo textToHTML
);


#------------------------------------------------
# commify a number
#------------------------------------------------

sub commify {
    my $input = shift;
    $input = reverse $input;
    $input =~ s<(\d\d\d)(?=\d)(?!\d*\.)><$1,>g;
    return reverse $input; 
}


#------------------------------------------------
# trim whitespace from a string
#------------------------------------------------

sub trim {
    my $str = shift || '';
    $str =~ s/^\s+|\s+$//g;
    return $str;
}


#------------------------------------------------
# Backslash all non-numeric characters except %
#------------------------------------------------

sub quote {
    my $str = quotemeta(shift);
    $str =~ s/\\%/%/g;
    return $str;
}



#------------------------------------------------
# Convert boolean to "Yes" or "No" string
#------------------------------------------------

sub boolToYesNo {
    my $bool = shift;
    return $bool ? "Yes" : "No";
}



#------------------------------------------------
# Convert text meant for email to HTML output
#------------------------------------------------

sub textToHTML {
    my $text = shift;

    $text =~ s/ /&nbsp;/g;
    $text =~ s/\n/<br>/g;
    return $text;
}



1;
