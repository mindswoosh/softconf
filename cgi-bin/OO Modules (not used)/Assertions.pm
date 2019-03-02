package Assertions;

use v5.10;
use strict;
use warnings;

use constant DEBUG => 1;

use Carp::Assert;

our @ISA = 'Exporter';
our @EXPORT       = @Carp::Assert::EXPORT_OK;
our %EXPORT_TAGS  = %Carp::Assert::EXPORT_TAGS;


# Extend the Assert::Conditional package.
# This almost certainly isn't the proper way to do it and this
# function doesn't benefit from the automatic removal in
# production code that the core routines do.

#sub assert_array_bounds( \@ $ )
#{
#    my($aref, $index) = @_;
#    my $have = @$aref;
#    assert_happy_code {$index >= 0  &&  $index < $have};
#}
#
#push @EXPORT, "assert_array_bounds";


1;
