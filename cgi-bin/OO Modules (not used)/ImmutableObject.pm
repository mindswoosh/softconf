#/usr/bin/perl -w

#---
# ImmutableObject class - immutable
#
# Common methods for Immutable Objects
#
# @author Steve Maguire, Storm Development
# @version 1.0


package ImmutableObject;
@ISA = ();

use Carp::Assert;
use strict;



sub new {
    my $pkg = shift;
    my $class = ref($pkg) || $pkg;
    
    my $self = {};
    bless $self, $class;
    return $self;
}


#---
#  Do a shallow copy of the object
#
#  We can do a shallow copy because immutable objects
#  don't change and should never contain mutable objects.

sub clone {
    my $self = shift;
    my $class = ref($self);
    
    my %copy = %$self;
    $self = \%copy;
    
    bless $self, $class;
    return $self;
}


#----------------------------------------------------------------------
#  Methods which are private to this class and its ancestors

sub _setHashField {
    my ($obj, $field, $setting) = @_;
    $obj = $obj->clone();
    $obj->{$field} = $setting;
    return $obj;
}


#----------------------------------------------------------------------

sub testClass {
    my $pkg = shift;
    assert($pkg eq __PACKAGE__, "Package mismatch: $pkg/".__PACKAGE__);
    
    my $obj = ImmutableObject->new();
    assert(defined($obj));
    assert($obj->isa("ImmutableObject"));
    
    $obj->{value} = "bigfoot";
    
    my $obj2 = $obj->clone();
    assert(defined($obj2));
    assert($obj2->isa("ImmutableObject"));
    
    assert($obj != $obj2);
    assert($obj2->{value} eq "bigfoot");
    
    $obj2->{value} = "alien";
    assert($obj->{value} eq "bigfoot");
}


1;
