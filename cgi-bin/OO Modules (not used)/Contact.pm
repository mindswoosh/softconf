#/usr/bin/perl -w

#---
# Contact class - immutable
#
# Contacts hold the contact information for a person.
#
# @author Steve Maguire, Storm Development
# @version 1.0


package Contact;
@ISA = (ImmutableObject);

use Carp::Assert;
use ImmutableObject;
use strict;



#---
# Allocate a new non-mutable string
#
#   $contact = Contact->new(...settings...);

sub new {
    my $class = shift;

    my $self = {
        firstName => "",
        lastName  => "",
        email     => "",
        phone     => "",
        
        @_
    };
    
    bless $self, $class;
    return $self;
}


#---
#  Set/Get the first name of the contact.

sub firstName {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setFirstName?")  if DEBUG;
    return $self->{firstName};
}

sub setFirstName {
    my ($self, $name) = @_;
    return $self->_setHashField("firstName", $name);
}


#---
#  Set/Get the last name of the contact

sub lastName {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setLastName?")  if DEBUG;
    return $self->{lastName};
}

sub setLastName {
    my ($self, $name) = @_;
    return $self->_setHashField("lastName", $name);
}


#---
#  Set/Get the email address of the contact

sub email {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setEmail?")  if DEBUG;
    return $self->{email};
}

sub setEmail {
    my ($self, $email) = @_;
    return $self->_setHashField("email", $email);
}


#---
#  Set/Get the phone number of the contact

sub phone {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setPhone?")  if DEBUG;
    return $self->{phone};
}

sub setPhone {
    my ($self, $phone) = @_;
    return $self->_setHashField("phone", $phone);
}



#---
# Test to confirm that Contact is working correctly
# This test does not do a thorough test -- it can pass
# and Contact could still be broken.

sub testClass {
    my $pkg = shift;
    assert($pkg eq __PACKAGE__, "Package mismatch: $pkg/".__PACKAGE__);
    
    my $contact = Contact->new(
        firstName => "Ima",
        lastName  => "Tester",
        email     => "tester\@gmail.com",
        phone     => "(555)123-4567"
    );

    assert(defined($contact));
    assert($contact->isa("Contact"));

    assert($contact->firstName eq "Ima");
    assert ($contact->lastName eq "Tester");
    assert($contact->email eq "tester\@gmail.com");
    assert($contact->phone eq "(555)123-4567");

    my $contact2 = $contact->setFirstName("John");
    assert($contact->firstName ne $contact2->firstName);
    assert($contact2->firstName eq "John");
  
    $contact2 = $contact2->setLastName("Doe");
    assert($contact->lastName ne $contact2->lastName);
    assert($contact2->lastName eq "Doe");
    
    $contact2 = $contact2->setEmail("test\@yahoo.com");
    assert($contact->email ne $contact2->email);
    assert($contact2->email eq "test\@yahoo.com");
    
    $contact2 = $contact2->setPhone("(800) 789-6543");
    assert($contact->phone ne $contact2->phone);
    assert($contact2->phone eq "(800) 789-6543");
}


1;
