#!/usr/bin/perl -w
#use lib("/root/perl5/lib/perl5/");

use v5.10;
use CGI::Carp qw(fatalsToBrowser);

# The classes we're testing
use Carp::Assert;
use Account;
use Contact;
use DateTime;
use Entry;
use Photo;


my $now = DateTime->new();
my $strNow = $now->toString();

print "Content-type: text/html\n\n";
print qq~
	<br>
	<h2>LegalShieldCalendar.com Testing Suite</h2>
	<style type="text/css"> .tab { margin-left: 20px; } </style>
	<h3>Testing each class...<br>$strNow</h3>
~;

my @testClasses = qw(
	ImmutableObject
	Contact
	Account
	DateTime
	Entry
	Photo
);

#---------------------------------------------------------

foreach my $class (@testClasses) {
	print qq~ <p class="tab">Testing $class... ~;
	$class->testClass();
	print qq~ test passed.</p> ~;
}

print "<h3>DONE -- all tests passed!</h3>";



1;
