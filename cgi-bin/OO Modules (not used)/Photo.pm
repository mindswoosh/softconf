#/usr/bin/perl -w

#---
# Photo class - immutable
#
# Photos hold pictures of the speakers.
#
# @author Steve Maguire, Storm Development
# @version 1.0


package Photo;
@ISA = (ImmutableObject);

use Carp::Assert;
use ImmutableObject;
use strict;


#---
# Allocate a new non-mutable string
#
#   $photo = Photo->new(...settings...);

sub new {
    my $class = shift;

    my $self = {
        calendarID   => "",
        speakerName  => "",
        filename     => "",
        image        => "",
        dateLastUsed => "",
        @_
    };
    
    bless $self, $class;
    return $self;
}


#---
#  Set/Get the Calendar ID
#
#  $calID = $photo->calendarID();
#  $photo = $photo->setCalendarID($calID);

sub calendarID {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setCalendarID?")  if DEBUG;
    return $self->{calendarID};
}

sub setCalendarID {
    assert(@_ == 2);
    my ($self, $id) = @_;
    return $self->_setHashField("calendarID", $id);
}


#---
#  Set/Get the speaker's name for this photo

sub speakerName {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setSpeakerName?")  if DEBUG;
    return $self->{speakerName};
}

sub setSpeakerName {
    my ($self, $name) = @_;
    return $self->_setHashField("speakerName", $name);
}


#---
#  Set/Get the MIME type of the photo

sub mimeType {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setMimeType?")  if DEBUG;
    return $self->{mimeType};
}

sub setMimeType {
    my ($self, $mimeType) = @_;
    return $self->_setHashField("mimeType", $mimeType);
}


#---
#  Set/Get the image data for the photo

sub image {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setImage?")  if DEBUG;
    return $self->{image};
}

sub setImage {
    my ($self, $image) = @_;
    return $self->_setHashField("image", $image);
}


#---
#  Set/Get the date the photo was last used (in Unix date format YYYYMMDD)
#
#  A CRON job runs on a regular basis that deletes all photos which
#  have not been used after a certain period of time. This removes
#  speakers who are no longer with the organization that the
#  calendar represents.

sub dateLastUsed {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setDateLastUsed?")  if DEBUG;
    return $self->{dateLastUsed};
}

sub setDateLastUsed {
    my ($self, $dateLastUsed) = @_;
    return $self->_setHashField("dateLastUsed", $dateLastUsed);
}



#---
# Test to confirm that Photo is working correctly
# This test does not do a thorough test -- it can pass
# and Photo could still be broken.

sub testClass {
    my $pkg = shift;
    assert($pkg eq __PACKAGE__, "Package mismatch: $pkg/".__PACKAGE__);
    
    my $photo = Photo->new(
        calendarID   => "12345",
        speakerName  => "Johnny Walker",
        type         => "jpg",
        image        => "ABCDEFG",
        dateLastUsed => "20170621"
    );

    assert(defined($photo));
    assert($photo->isa("Photo"));
    
    assert($photo->calendarID eq "12345");
    assert($photo->speakerName eq "Johnny Walker");
    assert($photo->type eq "jpg");
    assert($photo->image eq "ABCDEFG");
    assert($photo->dateLastUsed eq "20170621");
}


1;
