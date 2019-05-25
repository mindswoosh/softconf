#!/usr/bin/perl

use strict;
use warnings;

use Settings;
use Globals '$system_url';
use Common 'redirect';
use Interface;

use CGI;
use CGI::Carp 'fatalsToBrowser';

our $q = CGI->new;

our $password = $q->param('password');

if ($password eq "") {
	prompt();
}

if ($password eq "Trisomy18139") {
	redirect("$system_url/cgi-bin/admin.cgi?tab=registrations");
}


print_header();
print "<h3>Oops! Incorrect password...</h3>";
print "Click on the BACK button and try again...<br><br><br>";
print_footer();

exit;


sub prompt {

	print_header();

    print qq~
    	<br>
    	<h3 class="admin-indent">Enter Password:</h3><br><br>
		<form action="/cgi-bin/validate.cgi" method="GET" style="display: inline-block;">
			<span class="admin-indent"><input type="password" name="password"></span> &nbsp;
			<button type="submit">Submit</button>
		</form>
		<br><br><br>
    ~;

    print_footer();

    exit;
}

exit;
