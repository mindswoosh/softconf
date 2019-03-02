#/usr/bin/perl -w

#---
# Account class - immutable
#
# @author Steve Maguire
# @version 1.0
#
# The setters in this class start with "set" because they
# always return an Account object and not the value that
# they just set. 

package Account;
use parent qw(ImmutableObject);

use Carp::Assert;
use Contact;
use String;
use Database;
use strict;


#---
# Create a new Account object. The constructor has two forms. In the
# second form, $line is a string in database format.
#
#   $acct = Account->new(...settings...)
#
#   $acctNew = $acct->new(...changed settings...);

sub new {
    my $self = shift;
    my $class = ref($self) || $self;
    
    if (ref($self)) {       # instance   
        $self = {
            %$self,         # Original values
            @_              # Override values
        };
    }
    else {
        $self = {
            # Set defaults
            accountID     => -1,
            dateCreated   => "",
            accountName   => "",
            accountTitle  => "",
            adminFirst    => "",
            adminLast     => "",
            adminEmail    => "",
            adminPhone    => "",
            password      => "12345",
            headerStyle   => "FULL",
            titlebarColor => "0000ff",
            countryTitle  => "Country",
            regionTitle   => "State",
            bkgndColor    => "FFFFCC",
            referralCode  => "",
            couponCode    => "",
            
            @_              # Override defaults
        };
    }
    
    $self->{accountName} = lc(String->trim($self->{accountName}));
    
    die "Non-existent name in Account->new()" if ($self->{accountName} eq "");
    
    bless $self, $class;
    return $self;
}


sub accountID {
    my $self = shift;
    assert(!@_, "No args allowed. Can't set accountID")  if DEBUG;
    return $self->{accountID};
}


sub dateCreated {
    my $self = shift;
    assert(!@_, "No args allowed. Can't set dateCreated")  if DEBUG;
    return $self->{dateCreated};
}


#---
#  Set/Get the Account name
#
#  $accountName = $acct->accountName();
#  $acct = $acct->accountName($accountName);

sub accountName {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setAccountName?")  if DEBUG;
    return $self->{accountName};
}


sub setAccountName {
    my ($self, $name) = @_;
    return $self->_setHashField("accountName", $name);
}


#---
#  Set/Get the account's menu time title text
#
#  $title = $acct->countryTitle;
#  $acct = $acct->setCountryTitle($title);

sub accountTitle {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setAccountTitle?")  if DEBUG;
    return $self->{accountTitle};
}

sub setAccountTitle {
    my ($self, $title) = @_;
    return $self->_setHashField("accountTitle", $title);
}


#---
#  Set/Get the Admin's name
#
#  $contact = $acct->adminContact();
#  $acct = $acct->setAdminName($contact);

sub adminContact {
    my $self = shift;
    
    return Contact->new(
        firstName => $self->{adminFirst},
        lastName  => $self->{adminLast},
        email     => $self->{adminEmail},
        phone     => $self->{adminPhone}
    );
}


sub setAdminContact {
    my ($self, $contact) = @_;

    $self = $self->clone();
    $self->{adminFirst} = $contact->firstName;
    $self->{adminLast}  = $contact->lastName;
    $self->{adminEmail} = $contact->email;
    $self->{adminPhone} = $contact->phone;
    
    return $self;
}


#---
#  Set/Get the Admin's password
#
#  $password = $acct->password;
#  $acct = $acct->setPassword($password);

sub password {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setPassword?")  if DEBUG;
    return $self->{password};
}

sub setPassword {
    my ($self, $password) = @_;
    return $self->_setHashField("password", $password);
}


#---
#  Set/Get the calendar header style
#
#  $style = $acct->headerStyle;
#  $acct = $acct->setHeaderStyle($style);

sub headerStyle {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setHeaderStyle?")  if DEBUG;
    return $self->{headerStyle};
}

sub setHeaderStyle {
    my ($self, $style) = @_;
    return $self->_setHashField("headerStyle", $style);
}


#---
#  Set/Get the calendar title bar color
#
#  $color = $acct->titlebarColor;
#  $acct = $acct->setTitlebarColor($color);

sub titlebarColor {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setTitlebarColor?")  if DEBUG; 
    return $self->{titlebarColor};
}

sub setTitlebarColor {
    my ($self, $color) = @_;
    return $self->_setHashField("titlebarColor", $color);
}


#---
#  Set/Get the name of the continent this account belongs to
#
#  $name = $acct->continentName;
#  $acct = $acct->setContinentName($name);

sub continentName {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setContinentName?")  if DEBUG; 
    return $self->{continentName};
}

sub setContinentName {
    my ($self, $name) = @_;
    return $self->_setHashField("continentName", $name);
}


#---
#  Set/Get the Country popdown title text
#
#  $title = $acct->countryTitle;
#  $acct = $acct->setCountryTitle($title);

sub countryTitle {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setCountryTitle?")  if DEBUG; 
    return $self->{countryTitle};
}

sub setCountryTitle {
    my ($self, $title) = @_;
    return $self->_setHashField("countryTitle", $title);
}


#---
#  Set/Get the Region popdown title text, usually "State"
#
#  $title = $acct->regionTitle;
#  $acct = $acct->setRegionTitle($title);

sub regionTitle {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setRegionTitle?")  if DEBUG;
    return $self->{regionTitle};
}

sub setRegionTitle {
    my ($self, $title) = @_;
    return $self->_setHashField("regionTitle", $title);
}


#---
#  Set/Get the calendar background color
#
#  $color = $acct->bkgndColor;
#  $acct = $acct->setBkgndColor($color);

sub bkgndColor {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setBkgndColor?")  if DEBUG;
    return $self->{bkgndColor};
}

sub setBkgndColor {
    my ($self, $color) = @_;
    return $self->_setHashField("bkgndColor", $color);
}


#---
#  Set/Get the Referral Code
#
#  $code = $acct->referralCode;
#  $acct = $acct->setReferralCode($code);

sub referralCode {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setReferralCode?")  if DEBUG; 
    return $self->{referralCode};
}

sub setReferralCode {
    my ($self, $code) = @_;
    return $self->_setHashField("referralCode", $code);
}


#---
#  Set/Get the Coupon Code
#
#  $code = $acct->couponCode;
#  $acct = $acct->setCouponCode($code);

sub couponCode {
    my $self = shift;
    assert(!@_, "No args allowed. Did you mean setCouponCode?")  if DEBUG;
    return $self->{couponCode};
}

sub setCouponCode {
    my ($self, $code) = @_;
    return $self->_setHashField("couponCode", $code);
}


#---
#  Get an account by name from the database
#
#  $acct = Account->getByName($accountName);

sub getByName {
    my $class = shift;
    my $accountName = String->trim(shift);
    my $self = {};
    
    assert($accountName ne "", "Invalid account name")  if DEBUG;
    
    my $dbh = OpenDatabase();
    {
        my $sth = $dbh->prepare("SELECT * FROM accounts WHERE account_name=?");
        $sth->execute($accountName);

        my $hashref = $sth->fetchrow_hashref();   # Should only be 1...
        if (defined($hashref)) {
            $self = _initAccountHash($hashref);
        }

        $sth->finish();
    }
    CloseDatabase($dbh);
    
    bless $self, $class;
    return $self;
}


#---
# Get an account by ID from the database
#
#   $acct = Account->getByID()

sub getByID {
    my $class = shift;
    my $accountID = shift;
    my $self = {};
    
    assert($accountID > 0, "Invalid account ID")  if DEBUG;
    
    my $dbh = OpenDatabase();
    {
        my $sth = $dbh->prepare("SELECT * FROM accounts WHERE id=?");
        $sth->execute($accountID);

        my $hashref = $sth->fetchrow_hashref();   # Should only be 1...
        if (defined($hashref)) {
            $self = _initAccountHash($hashref);
        }

        $sth->finish();
    }
    CloseDatabase($dbh);
    
    bless $self, $class;
    return $self;
}


sub insertAccount {
    my $self = shift;
    
    my $dbh = OpenDatabase();
    
        my $success = $dbh->do (
            "INSERT INTO accounts (
                date_created,
                account_name,
                account_title,
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
                $self->{accountName},
                $self->{accountTitle},
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
    
    die "Unable to insert account '$self->{accountName}'" if (!$success);
    
    #  Must reload to grab any default SQL table settings
    return Account->getByID($assignedID);
}


#---
# Update an account in the database
#
#   $acct = $acct->updateAccount();

sub updateAccount {
    my $self = shift;
    
    my $dbh = OpenDatabase();
        my $success = $dbh->do (
            "UPDATE accounts SET
                account_name   = ?,
                account_title  = ?,
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
                $self->{accountName},
                $self->{accountTitle},
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
            $self->{accountID}
        );
    CloseDatabase($dbh);
    
    die "Unable to update account '$self->{accountName}'"   if (!$success);
    
    return $self;
}



#----------------------------------------------------------------------
# Test this class
#

sub testClass {
    my $pkg = shift;
    assert($pkg eq __PACKAGE__, "Package mismatch: $pkg/".__PACKAGE__);
    
    my $acct = Account->new(
        accountName   => "test",
        accountTitle  => "My Test",
        adminFirst    => "Testing",
        adminLast     => "Monster",
        adminEmail    => "monster\@yahoo.com",
        adminPhone    => "(866) 555-4433",
        password      => "1234567",
        headerStyle   => "FULL",
        titlebarColor => "0000ff",
        continentName => "northamerica",
        countryTitle  => "Select Country",
        regionTitle   => "State / Territory",
        bkgndColor    => "FFFFCC",
        referralCode  => "REFCODE",
        couponCode    => "COUPON",
    );
    
    assert (defined($acct));
    assert($acct->isa("Account"));

    assert($acct->accountID == -1);
    assert($acct->dateCreated eq "");
    assert($acct->accountName eq "test");
    
    my $contact = $acct->adminContact;
    assert($contact->isa("Contact"));
    assert($contact->can("firstName"));
  
    # Test getters
    
    assert($contact->firstName eq "Testing");
    assert($contact->lastName eq "Monster");
    assert($contact->email eq "monster\@yahoo.com");
    assert($contact->phone eq "(866) 555-4433");
    
    assert($acct->headerStyle eq "FULL");
    assert($acct->titlebarColor eq "0000ff");
    assert($acct->continentName eq "northamerica");
    assert($acct->countryTitle eq "Select Country");
    assert($acct->regionTitle eq "State / Territory");
    assert($acct->bkgndColor eq "FFFFCC");
    
    assert($acct->referralCode eq "REFCODE");
    assert($acct->couponCode eq "COUPON");
    
    # Test $inst->new();
    
    my $acct2 = $acct->new(
        adminLast     => "Fiend",
        titlebarColor => "888888"
    );
    
    assert($acct != $acct2);
    assert(defined($acct2));
    assert($acct2->isa("Account"));

    assert($acct2->accountID == "-1");
    assert($acct2->dateCreated eq "");
    assert($acct2->accountName eq "test");
    
    $contact = $acct2->adminContact;
    assert($contact->isa("Contact"));
    assert($contact->firstName eq "Testing");
    assert($contact->lastName eq "Fiend");
    assert($contact->email eq "monster\@yahoo.com");
    assert($contact->phone eq "(866) 555-4433");
    
    assert($acct2->headerStyle eq "FULL");
    assert($acct2->titlebarColor eq "888888");
    assert($acct2->continentName eq "northamerica");
    assert($acct2->countryTitle eq "Select Country");
    assert($acct2->regionTitle eq "State / Territory");
    assert($acct2->bkgndColor eq "FFFFCC");
    
    assert($acct2->referralCode eq "REFCODE");
    assert($acct2->couponCode eq "COUPON");
    
    # Test setters
    
    $acct2 = $acct2->setAccountName("testing");
    assert($acct2->accountName eq "testing");
    
    $contact = Contact->new(
        firstName => "Joe",
        lastName => "Johnson",
        email    => "jj\@yahoo.com",
        phone     => "(513) 513-5133"
    );

    $acct2 = $acct2->setAdminContact($contact);
    my $contact2 = $acct2->adminContact;
    assert($contact2->isa("Contact"));
    assert($contact2->firstName eq "Joe");
    assert($contact2->lastName eq "Johnson");
    assert($contact2->email eq "jj\@yahoo.com");
    assert($contact2->phone eq "(513) 513-5133");
    
    $acct2 = $acct2->setHeaderStyle("CENTER");
    assert($acct2->headerStyle eq "CENTER");

    $acct2 = $acct2->setTitlebarColor("00FF00");
    assert($acct2->titlebarColor eq "00FF00");        

    $acct2 = $acct2->setContinentName("africa");
    assert($acct2->continentName eq "africa");
    
    $acct2 = $acct2->setCountryTitle("Pais");
    assert($acct2->countryTitle eq "Pais");

    $acct2 = $acct2->setRegionTitle("Estado");
    assert($acct2->regionTitle eq "Estado");

    $acct2 = $acct2->setBkgndColor("FF00FF");
    assert($acct2->bkgndColor eq "FF00FF");

    $acct2 = $acct2->setReferralCode("ABCDEF");
    assert($acct2->referralCode eq "ABCDEF");

    $acct2 = $acct2->setCouponCode("CODECOUP");
    assert($acct2->couponCode eq "CODECOUP");
}


#----------------------------------------------------------------------
# Private functions below
#


# Convert the database representation to our object
# representation

sub _initAccountHash {
    #assert_private_method();
    
    my $hashref = shift;
    #assert_hashref($hashref);
    
    return {
        accountID     => $hashref->{id},
        dateCreated   => $hashref->{date_created},
        accountName   => $hashref->{account_name},
        accountTitle  => $hashref->{account_title},
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
