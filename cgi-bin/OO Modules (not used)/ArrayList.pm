#!/usr/bin/perl -w

#---
# ArrayList Class
# An array-backed implementation of the Java List interface.
#
# The array is embedded in a hash so that we can sort the list
# (possibly changing the array's reference) and not destroy
# the instance reference (which would still point to the hash).
# Using just an anonymous array alone doesn't allow this.
#
# @author  Steve Maguire, Storm Development
# @version 1.0, 02/10/16


package ArrayList;
@ISA = ();

use Assertions;
use constant TRUE => 1;

#---
# Construct a new ArrayList
#
#   $inst = ArrayList->new()
#   $inst = ArrayList->new($obj1, $obj2, ...)

sub new {
    my $ref = shift;
    my $class = ref($ref) || $ref;
    
    my $self = {                    # ->new()
        list => [],
    };
    bless $self, $class;
    
    while (@_) {                    # ->new($obj1, $obj2,...)
        my $obj = shift;
        $self->add($obj);
    }
    
    return $self;
}


#---
# Returns the number of elements in this list.
#
#   $size = $inst->size();

sub size {
    my $self = shift;
    return scalar(@{$self->{list}});
}


#---
# Returns true if the list is empty.
#
#   $inst->isEmpty()

sub isEmpty {
    my $self = shift;
    return ($self->size() == 0);
}


#---
# If no $index is supplied, appends the $object to the end of this list.
# If the $index is supplied, adds the $object at the specified $index,
# shifting all objects currently at that index or higher one to the right.
# The inserted object can be of any type or null.
#
#   $inst->add($obj)
#   $inst->add($index, $obj)

sub add {
    my $self = shift;
    if (@_ == 1) {                      # ->add($obj)
        my $obj  = shift;
        push @{$self->{list}}, $obj;
    }
    else {                              # ->add($index, $obj)
        my ($index, $obj) = @_;
        assert_array_length_min(@{$self->{list}}, $index);
        splice(@{$self->{list}}, $index, 0, $obj);
    }
    return TRUE;
}


#---
# Removes the element at the user-supplied index.
#
#   $obj = $inst->remove($index)
 
sub remove {
    my ($self, $index) = @_;
    assert_array_bounds(@{$self->{list}}, $index);
    my $obj = splice(@{$self->{list}}, $index, 1);
    return $obj;
}


#---
# Sets the element at the specified index.  The new element, $obj,
# can be an object of any type or null.
#
#   $objPrev = $inst->set($index, $objNew);

sub set {
    my ($self, $index, $obj) = @_;
    assert_array_bounds(@{$self->{list}}, $index);
    $prevObj = $self->{list}->[$index];
    $self->{list}->[$index] = $obj;
    return $prevObj;
}


#---
# Retrieves the element at the user-supplied index.
#
#   $obj = $inst->get($index);

sub get {
    my ($self, $index) = @_;
    assert_array_bounds(@{$self->{list}}, $index);
    return $self->{list}->[$index];
}


#---
# Returns an array containing all of the elements in this
# list in proper sequence (from first to last element).
# The array is independent of this list.
#
#   @array = $inst->toArray();

sub toArray {
    my $self = shift;
    return @{$self->{list}};
}



1;
