#!/usr/bin/perl

use lib '/home4/softconf/public_html/cgi-bin';

use strict;
use warnings;

use Settings;
use Globals qw($otherDiagnosisTitle %peopleTypes %reg_type $CONFERENCE_ID $report_dir $system_url);

use CGI;
use CGI::Carp 'fatalsToBrowser';

use Interface;



print_header();

print qq~
	<center>
		<div style="color: #2e3a97; font-size: 16px; padding: 0 10%;">
			<h2>Welcome!</h2>
			<h3 class="inline-info">We're sorry, but registration is now closed...</h3>
			<br>
			You are more than welcome to attend the 2019 SOFT Conference by registering at the door,
			but the workshops and clinics are subject to space availability and there may not be meals
			at events where meals needed to be ordered in advanced.<br>
			<br><br>
			If you have questions, please send an email to <b>help\@softconf.org</b>.<br>
			<br><br>
			The 2019 SOFT Conference is going to be held on July 17-21, 2019 in Ann Arbor Michigan at the Marriott
			Ypsilanti at Eagle Creek, 1275 South Huron St., Ypsilanti, MI, 48197.<br>
			<br>
			If you haven't read the 2019 Conference Brochure yet, you'll want to do that first before going
			through this form so you know exactly what's going on. Having the brochure open in another window
			as you fill out this registration form will be helpful.<br>
			<br>
			If you need to review the brochure, click this button:<br>
			<br>
			<div class="welcome-button-pos">
				<a class="welcome-button" target="_blank" href="https://trisomy.org/conference-brochure-ann-arbor-2019/">View Online Brochure</a>
			</div>
			<br>
		</div>
	</center>
~;

print_footer('', '<center><br><a href="https://softconf.org/cgi-bin/validate.cgi">admin</a></center>');


1;
