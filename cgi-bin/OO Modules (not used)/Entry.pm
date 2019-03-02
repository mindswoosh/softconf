#/usr/bin/perl -w

#---
# Entry class - immutable
#
# @author Steve Maguire
# @version 1.0
#
# The setters in this class start with "set" because they
# always return an Entry object and not the value that
# they just set. 

package Entry;
use parent qw(ImmutableObject);

use Settings;
use Carp::Assert;
use DateTime;
use Database;
use strict;



#---
# Create a new Entry object.
#
#   $entry = Entry->new(...settings...)
#
#   // Create a new $entry with the same ID as the original
#   $entryNew = $entry->new(...changed settings...);

sub new {
    my $self = shift;
    my $class = ref($self) || $self;
    
    if (ref($self)) {       # instance   
        $self = {
            %$self,         # Original values
            #@_              # Override values
        };
    }
    else {
        my $startDate = DateTime->new();
        
        $self = {
            # Set defaults
            dateCreated    => "",
            entryID        => -1,                   # Not in database
            calendarID     => "",
            seriesID       => "",
            seriesDate     => "",
            
            entryPrefix    => "",
            entryType      => "",
            startDate      => $startDate,
            endDate        => $startDate,
            timeZone       => "",
            repeatType     => "",                   # Non-repeating
            repeatDay      => "",
            repeatNum      => "",
            hidden         => "",
            exceptions     => "",

            speaker        => "",
            imageURLs      => "",
            photoSize      => "LARGE",
            descriptionURL => "",
            description    => "",
            contact1       => "",
            contact2       => "",
            directions     => "",
            mapURL         => "",
            expectsRSVP    => FALSE,
            rsvpLimit      => "",
            rsvpEmails     => "",

            #@_              # Override defaults
        };
    }
    
    bless $self, $class;

    #  Override defaults. Much slower than the code commented out above, but
    #  this ensures that all values are validated as they are set and that
    #  all sets go through the public interface.
    while (@_ >= 2) {
        my $prop = shift;
        my $val = shift;
        
        my $setter = "set" . ucfirst($prop);
        #print "<br>\$self->".$setter."(\"".$val."\")";
        $self = $self->$setter($val);
    }
            
    return $self;
}



#---
#  Get the date created. Should never need to set this date.

sub dateCreated {
    return shift->{dateCreated};
}


#---
#  Set/Get the Entry ID
#
#  $entryID = $entry->entryID();
#  $entry = $entry->setEntryID($entryID);

sub entryID {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setEntryID?")  if DEBUG;
    return $self->{entryID};
}

sub setEntryID {
    assert(@_ == 2);
    my ($self, $id) = @_;
    return $self->_setHashField("entryID", $id);
}


#---
#  Set/Get the Calendar ID
#
#  $calID = $entry->calendarID();
#  $entry = $entry->setCalendarID($calID);

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
#  Set/Get the Series ID. This is the ID of the parent series.
#
#  $entryID = $entry->seriesID();
#  $entry = $entry->setSeriesID($entryID);

sub seriesID {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setSeriesID?")  if DEBUG;
    return $self->{seriesID};
}

sub setSeriesID {
    assert(@_ == 2);
    my ($self, $id) = @_;
    return $self->_setHashField("seriesID", $id);
}


#---
#  Set/Get the specific date of this entry in the parent series. The
#  date can be "undef" if this entry is not part of a series.
#
#  $date = $entry->seriesDate;
#  $entry = $entry->setEntryDate($date);

sub seriesDate {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setSeriesDate?")  if DEBUG;
    return $self->{seriesDate};
}

sub setSeriesDate {
    assert(@_ == 2);
    my ($self, $date) = @_;
    return $self->_setHashField("seriesDate", $date);
}


#---
#  Set/Get the Entry Prefix.
#  This is usually the name of a Metro area and region, such
#  as "Los Angeles (Hollywood)" or "Seattle (Downtown)". It may
#  simply be the name of a small town.
#
#  It is called a prefix because it is pre-pended to the entry
#  type to give a full title:
#
#     Los Angeles (Hollywood) Travel Party
#
#  $entryPrefix = $entry->entryPrefix();
#  $entry = $entry->setEntryPrefix($entryPrefix);

sub entryPrefix {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setEntryPrefix?")  if DEBUG;
    return $self->{entryPrefix};
}

sub setEntryPrefix {
    assert(@_ == 2);
    my ($self, $entryPrefix) = @_;
    return $self->_setHashField("entryPrefix", $entryPrefix);
}


#---
#  Set/Get the Entry Type.
#  The entry type stored with an existing entry may not match
#  the current list of entry types if the list was changed
#  after the entry was originally created. In practice, this
#  doesn't hurt anything.
#
#  $entryType = $entry->entryType();
#  $entry = $entry->setEntryType($entryType);

sub entryType {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setEntryType?")  if DEBUG;
    return $self->{entryType};
}

sub setEntryType {
    assert(@_ == 2);
    my ($self, $entryType) = @_;
    return $self->_setHashField("entryType", $entryType);
}


#---
#  Set/Get the Start and End dates.
#
#  $date = $entry->startDate();
#  $date = $entry->endDate();
#  $entry = $entry->setStartDate($date);
#  $entry = $entry->setEndDate($date);

sub startDate {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setStartDate?")  if DEBUG;
    return $self->{startDate};
}

sub setStartDate {
    assert(@_ == 2);
    my ($self, $date) = @_;
    return $self->_setHashField("startDate", $date);
}

sub endDate {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setEndDate?")  if DEBUG;
    return $self->{endDate};
}

sub setEndDate {
    assert(@_ == 2);
    my ($self, $date) = @_;
    return $self->_setHashField("endDate", $date);
}


#---
#  Set/Get the Time Zone.
#
#  $timeZone = $entry->entryType();
#  $entry = $entry->setTimeZone($timeZone);

sub timeZone {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setTimeZone?")  if DEBUG;
    return $self->{timeZone};
}

sub setTimeZone {
    assert(@_ == 2);
    my ($self, $timeZone) = @_;
    return $self->_setHashField("timeZone", $timeZone);
}


#---
#  Set/Get the repeat type.
#
#  ""  = non-repeating event
#  "D" = daily repeating event
#  "W" = weekly repeating event
#  "M" = monthly repeating event
#  "T" = same date each month
#  "S" = first Sunday of each Monthly View
#  "O" = Repeats every other week
#
#  $repeatType = $entry->repeatType();
#  $entry = $entry->setRepeatType($repeatType);

sub repeatType {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setRepeatType?")  if DEBUG;
    return $self->{repeatType};
}

sub setRepeatType {
    assert(@_ == 2);
    my $self = shift;
    my $repeatType = uc(shift);
    assert($repeatType eq ""  ||  $repeatType =~ m/^[DWMTSO]$/);
    return $self->_setHashField("repeatType", $repeatType);
}


#---
#  Set/Get the Speaker text.
#
#  $speaker = $entry->speaker();
#  $entry = $entry->setSpeaker($speaker);

sub speaker {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setSpeaker?")  if DEBUG;
    return $self->{speaker};
}

sub setSpeaker {
    assert(@_ == 2);
    my ($self, $speaker) = @_;
    return $self->_setHashField("speaker", $speaker);
}


#---
#  Set/Get the comma-separated list of image URLs.
#
#  $urls = $entry->imageURLs();
#  $entry = $entry->setImageURLs($urls);

sub imageURLs {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setImageURLs?")  if DEBUG;
    return $self->{imageURLs};
}

sub setImageURLs {
    assert(@_ == 2);
    my ($self, $urls) = @_;
    $urls =~ s/\s//g;
    $urls =~ s/,/, /g;
    return $self->_setHashField("imageURLs", lc($urls));
}


#---
#  Set/Get the size of the photo in the thumbnail.
#
#  $size = $entry->photoSize();
#  $entry = $entry->setPhotoSize($size);

sub photoSize {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setPhotoSize?")  if DEBUG;
    return $self->{photoSize};
}

sub setPhotoSize {
    assert(@_ == 2);
    my ($self, $size) = @_;
    assert($size eq "LARGE"  ||  $size eq "SMALL"  || $size eq "NONE")  if DEBUG;
    return $self->_setHashField("photoSize", $size);
}


#---
#  Set/Get the off-calendar URL for the pop up, if it exists.
#
#  $url = $entry->descriptionURL();
#  $entry = $entry->setDescriptionURL($url);

sub descriptionURL {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setDescriptionURL?")  if DEBUG;
    return $self->{descriptionURL};
}

sub setDescriptionURL {
    assert(@_ == 2);
    my ($self, $url) = @_;
    return $self->_setHashField("descriptionURL", $url);
}


#---
#  Set/Get the on-calendar description for the pop up.
#
#  $desc = $entry->description();
#  $entry = $entry->setDescription($desc);

sub description {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setDescription?")  if DEBUG;
    return $self->{description};
}

sub setDescription {
    assert(@_ == 2);
    my ($self, $desc) = @_;
    return $self->_setHashField("description", $desc);
}


#---
#  Set/Get the contact fields.
#
#  $contact1 = $entry->contact1();
#  $contact2 = $entry->contact2();
#  $entry = $entry->setContact1($contact1);
#  $entry = $entry->setContact2($contact2);

sub contact1 {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setContact1?")  if DEBUG;
    return $self->{contact1};
}

sub setContact1 {
    assert(@_ == 2);
    my ($self, $contact1) = @_;
    return $self->_setHashField("contact1", $contact1);
}

sub contact2 {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setContact2?")  if DEBUG;
    return $self->{contact2};
}

sub setContact2 {
    assert(@_ == 2);
    my ($self, $contact2) = @_;
    return $self->_setHashField("contact2", $contact2);
}


#---
#  Set/Get the directions for this entry.
#
#  $directions = $entry->directions();
#  $entry = $entry->setDirections($directions);

sub directions {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setDirections?")  if DEBUG;
    return $self->{directions};
}

sub setDirections {
    assert(@_ == 2);
    my ($self, $directions) = @_;
    return $self->_setHashField("directions", $directions);
}


#---
#  Set/Get the URL for the map.
#
#  $mapURL = $entry->mapURL();
#  $entry = $entry->setMapURL($mapURL);

sub mapURL {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setMapURL?")  if DEBUG;
    return $self->{mapURL};
}

sub setMapURL {
    assert(@_ == 2);
    my ($self, $mapURL) = @_;
    return $self->_setHashField("mapURL", $mapURL);
}


#---
#  Set/Get whether an RSVP is expected for this entry.
#
#  $expectsRSVP = $entry->expectsRSVP();
#  $entry = $entry->setHasRSVP($hasRSVP);

sub expectsRSVP {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setExpectsRSVP?")  if DEBUG;
    return $self->{expectsRSVP};
}

sub setExpectsRSVP {
    assert(@_ == 2);
    my ($self, $expectsRSVP) = @_;
    return $self->_setHashField("expectsRSVP", $expectsRSVP);
}


#---
#  Set/Get the max # of people who can attend the event.
#
#  $rsvpLimit = $entry->rsvpLimit();
#  $entry = $entry->setRsvpLimit($rsvpLimit);

sub rsvpLimit {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setRsvpLimit?")  if DEBUG;
    return $self->{rsvpLimit};
}

sub setRsvpLimit {
    assert(@_ == 2);
    my ($self, $rsvpLimit) = @_;
    return $self->_setHashField("rsvpLimit", $rsvpLimit);
}


#---
#  Set/Get the comma separated list of event-holder email addresses.
#
#  $rsvpEmails = $entry->rsvpEmails();
#  $entry = $entry->setRsvpEmails($rsvpEmails);

sub rsvpEmails {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setRsvpEmails?")  if DEBUG;
    return $self->{rsvpEmails};
}

sub setRsvpEmails {
    assert(@_ == 2);
    my ($self, $rsvpEmails) = @_;
    $rsvpEmails =~ s/\s//g;
    $rsvpEmails =~ s/,/, /g;
    return $self->_setHashField("rsvpEmails", lc($rsvpEmails));
}


#---
#  Is the $date in this series hidden?
#
#  $bool = $entry->isHidden($date);

sub isHidden {
    assert(@_ == 2);
    my ($self, $date) = @_;
    my $dateValue = sprintf("%04d%02d%02d", $date->year, $date->month, $date->day);
    return ($self->{hidden} =~ m/\|$dateValue/);
}


#----------------------------------------------------------------------
#  fullTitle
#
#  fullTitle returns the actual full title that will be
#  displayed for an entry. Typically the title would simply
#  be the event's prefix followed by it's type:
#
#       "Los Angeles" + " " + "Super Saturday"
#
#  If the event type is "Other", then we assume that the prefix
#  is the full title by itself. This is useful for events that
#  don't really have a type, such as "Home Office Closed Today".
#

sub fullTitle {
	my $self = shift;
    my $fullTitle =  $self->entryPrefix;
	if (lc($self->entryType) !~ /\bother\b/  &&  lc($self->entryType) ne "notice") {
        $fullTitle .= " " . $self->entryType;
    }
	return $fullTitle;
}


#-------- UNIMPLEMENTED BELOW -------------

#---
# Get an entry by ID from the database
#
#   $entry = Entry->getByID()

sub getByID {
    my $class = shift;
    my $entryID = shift;
    my $self = {};
    
    #assert_nonnegative($entryID);
    
    my $dbh = OpenDatabase();
    {
        my $sth = $dbh->prepare("SELECT * FROM entries WHERE id=?");
        $sth->execute($entryID);

        my $hashref = $sth->fetchrow_hashref();   # Should only be 1...
        if (defined($hashref)) {
            $self = _initEntryHash($hashref);
        }

        $sth->finish();
    }
    CloseDatabase($dbh);
    
    bless $self, $class;
    return $self;
}


sub insertEntry {
    my $self = shift;
    
    my $dbh = OpenDatabase();
    
        my $success = $dbh->do (
            "INSERT INTO entries (
                date_created,
                entry_name,
                entry_title,
                password,
                
                first_name,
                last_name,
                email,
                phone,
                
                referral,
                coupon_code,
                
                banner_style,
                bkgnd_color,
                titlebar_color,
                continent,
                country_title,
                region_title
            )
            VALUES(NOW(),?,?,?,  ?,?,?,?,  ?,?,  ?,?,?,?,?,?)",
            undef,
                $self->{entryName},
                $self->{entryTitle},
                $self->{password},
                
                $self->{adminFirst},
                $self->{adminLast},
                $self->{adminEmail},
                $self->{adminPhone},
                
                $self->{referralCode},
                $self->{couponCode},
                
                $self->{headerStyle},
                $self->{bkgndColor},
                $self->{titlebarColor},
                $self->{continentName},
                $self->{countryTitle},
                $self->{regionTitle}
        );
    
        my $assignedID = $dbh->{mysql_insertid};
        
    CloseDatabase($dbh);
    
    die "Unable to insert entry '$self->{entryName}'" if (!$success);
    
    #  Must reload to grab any default SQL table settings
    return Entry->getByID($assignedID);
}


#---
# Update an entry in the database
#
#   $entry = $entry->updateEntry();

sub updateEntry {
    my $self = shift;
    
    my $dbh = OpenDatabase();
        my $success = $dbh->do (
            "UPDATE entries SET
                entry_name     = ?,
                entry_title    = ?,
                password       = ?,
    
                first_name     = ?,
                last_name      = ?,
                email          = ?,
                phone          = ?,
                
                banner_style   = ?,
                bkgnd_color    = ?,
                titlebar_color = ?,
                continent      = ?,
                country_title  = ?,
                region_title   = ?,
                
                referral	   = ?,
                coupon_code    = ?
            WHERE id = ?",
                undef,
                $self->{entryName},
                $self->{entryTitle},
                $self->{password},
    
                $self->{adminFirst},
                $self->{adminLast},
                $self->{adminEmail},
                $self->{adminPhone},
    
                $self->{headerStyle},
                $self->{bkgndColor},
                $self->{titlebarColor},
                $self->{continentName},
                $self->{countryTitle},
                $self->{regionTitle}, 
                
                $self->{referralCode},
                $self->{couponCode},           
            $self->{entryID}
        );
    CloseDatabase($dbh);
    
    die "Unable to update entry '$self->{entryName}'"   if (!$success);
    
    return $self;
}




#----------------------------------------------------------------------
# Test this class
#

sub testClass {
    my $pkg = shift;
    assert($pkg eq __PACKAGE__, "Package mismatch: $pkg/".__PACKAGE__);
    
    my $startDate = DateTime->new(2, 11, 2016);
    my $endDate = DateTime->new(3, 27, 2016);
    
    my $entry = Entry->new(
            calendarID     => 3,
            seriesID       => 2,
            seriesDate     => undef,
            
            entryPrefix    => "Cincinnati (Blue Ash)",
            entryType      => "Travel Party",
            startDate      => $startDate,
            endDate        => $endDate,
            timeZone       => "EST",

            repeatType     => "w",
            #repeatDay      => 0,
            #repeatNum      => 0,
            
            #hidden         => "",
            #exceptions     => "",
            
            speaker        => "Our guest speaker, Mr. Robert Burns, is from Seattle!",
            imageURLs      => "   robertburns.png , STEVe.pNg,   TheRing.jpg  ",
            photoSize      => "LARGE",
            descriptionURL => "Don't miss this exciting opportunity!",
            description    => "Holiday Inn Express",
            contact1       => "Steve Maguire",
            contact2       => "Beth Mountjoy",
            directions     => "Drive until you get there.",
            mapURL         => "http://www.google.com",
            
            expectsRSVP    => TRUE,
            rsvpLimit      => 25,
            rsvpEmails     => " John\@gmail.com,   JANE\@YAHOO.COM,steve\@MsN.CoM  ",
    );
    
    #  The following tests "know" that new() uses the setters to initialize
    #  the settings in the hash passed to it. For this reason, we don't
    #  include setter tests below that we would otherwise do if we didn't
    #  know this implementation detail.
    
    assert(defined($entry));
    assert($entry->isa("Entry"));

    assert($entry->entryID == "-1");
    assert($entry->dateCreated eq "");
    
    # Check the settings passed to new()
    assert($entry->seriesID == 2, $entry->seriesID . " should be 2");
    assert(!defined($entry->seriesDate));
    
    assert($entry->calendarID == 3, $entry->calendarID . " should be 3");
    assert($entry->entryPrefix eq "Cincinnati (Blue Ash)");    
    assert($entry->entryType eq "Travel Party");
    assert($entry->startDate->month == 2  &&  $entry->startDate->day == 11  &&  $entry->startDate->year == 2016);
    assert($entry->endDate->month == 3  &&  $entry->endDate->day == 27  &&  $entry->endDate->year == 2016);
    assert($entry->timeZone eq "EST");
    
    assert($entry->repeatType eq "W");
    assert($entry->speaker eq "Our guest speaker, Mr. Robert Burns, is from Seattle!");
    assert($entry->imageURLs eq "robertburns.png, steve.png, thering.jpg");
    assert($entry->photoSize eq "LARGE");
    assert($entry->descriptionURL eq "Don't miss this exciting opportunity!");
    assert($entry->description eq "Holiday Inn Express");
    assert($entry->contact1 eq "Steve Maguire");
    assert($entry->contact2 eq "Beth Mountjoy");
    assert($entry->directions eq "Drive until you get there.");
    assert($entry->mapURL eq "http://www.google.com");
    
    assert($entry->expectsRSVP);
    assert($entry->rsvpLimit == 25);
    assert($entry->rsvpEmails eq "john\@gmail.com, jane\@yahoo.com, steve\@msn.com");
    
    # Test different settings
    
    my $date = undef;
    
    $entry = $entry->setStartDate($date);
    assert(!defined($entry->startDate));
    
    $entry = $entry->setEndDate($date);
    assert(!defined($entry->endDate));
    
    # Test ->fullTitle
    assert($entry->fullTitle eq "Cincinnati (Blue Ash) Travel Party");
    $entry = $entry->setEntryType("Other");
    assert($entry->fullTitle eq "Cincinnati (Blue Ash)");
    $entry = $entry->setEntryType("Notice");
    assert($entry->fullTitle eq "Cincinnati (Blue Ash)");
    
}


#----------------------------------------------------------------------
# Private functions below
#


# Convert the database representation to our object
# representation

sub _initEntryHash {
   
    my $hashref = shift;
    
    return {
        entryID     => $hashref->{id},
        dateCreated   => $hashref->{date_created},
        entryName   => $hashref->{entry_name},
        entryTitle  => $hashref->{entry_title},
        adminFirst    => $hashref->{first_name},
        adminLast     => $hashref->{last_name},
        adminEmail    => $hashref->{email},
        adminPhone    => $hashref->{phone},
        password      => $hashref->{password},
        headerStyle   => $hashref->{banner_style},
        titlebarColor => $hashref->{titlebar_color},
        continentName => $hashref->{continent},
        countryTitle  => $hashref->{country_title},
        regionTitle   => $hashref->{region_title},
        bkgndColor    => $hashref->{bkgnd_color},
        referralCode  => $hashref->{referral},
        couponCode    => $hashref->{coupon_code},
    }
}


1;
