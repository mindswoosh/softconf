#!/usr/bin/perl

use strict;
use warnings;

use Settings;
use Globals qw($otherDiagnosisTitle %peopleTypes %reg_type $CONFERENCE_ID $report_dir $system_url);

use CGI;
use CGI::Carp 'fatalsToBrowser';

use Interface;



print_header();

print qq~
  <h3 class="inline-info">Sorry. Registration is closed...</h3>

  
~;

print_footer();


1;
