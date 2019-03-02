#/usr/bin/perl -w

#---
# String class - immutable
#
# @author Steve Maguire, Storm Development
# @version 1.0


package String;
use parent qw(ImmutableObject);

use strict;

# When String objects are used in Perl string context, return the string.
use overload '""' => 'toText';


#---
# Allocate a new non-mutable string
#
#   $string = String->new("text");

sub new {
    #assert_array_length_minmax(@_, 2, 2);
    my ($pkg, $text) = @_;
    my $class = ref($pkg) || $pkg;          # Handle SUPER::new case also
    
    $text = ""  if (!defined($text));
    my $self = [
        $text
    ];
    
    bless $self, $class;
    return $self;
}


#---
# Return the string stripped of leading and trailing whitespace.
#
#   $text = String->trim($text);
#   $string = $string->trim();

sub trim {
    my $self = shift;
    
    if (ref($self)) {
        my $text = $self->[0];
        $text =~ s/^\s+|\s+$//g;
        return $self->new($text);
    }
    else {
        my $text = shift;
        $text = ""  if (!defined($text));
        $text =~ s/^\s+|\s+$//g;
        return $text;
    }
}


#---
# Return the textual representation of this string
#
#   $text = $str->toText();     #or, simply $str in Perl string context

sub toText {
    my $self = shift;
    return $self->[0];
}


1;
