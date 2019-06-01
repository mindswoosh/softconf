#----------------------------------------------------------------------
#   Module: Globals
#
#   Although it's generally not a great idea to write a bunch
#   of code that transfers information through globals rather
#   than in passed paramaters, there are some globals that
#   really make sense to be globals. Most of the globals in this
#   package fit that bill. Some don't...
#
#   For those variables that shouldn't really be globals, they
#   should be generated on-the-fly as needed through function calls.
#


package Globals;

use strict;
use warnings;

use Exporter 'import';
our @EXPORT = qw(
  $TRUE
  $FALSE
  $dbh
  $CONFERENCE_ID
  $DEBUG

  $otherDiagnosisTitle
  %peopleTypes
  %reg_type

  $system_url
  $system_dir

  $report_dir
);



#----------------------------------------------------------------------
#  Useful constants

our $TRUE = 1;
our $FALSE = 0;


#----------------------------------------------------------------------
#  This year's conference ID.  State abbreviation + year

our $CONFERENCE_ID = "MI2019";



#----------------------------------------------------------------------
#  Open the database at the start of each script

our $dbh;


#----------------------------------------------------------------------
#  The directory where all of our .csv reports are written to

our $report_dir = "/home4/softconf/public_html/reports";


#----------------------------------------------------------------------
#  Include DEBUG code?

our $DEBUG = 1;


#----------------------------------------------------------------------
#  This title is used in menus and compared against explicitly

our $otherDiagnosisTitle = 'Other Diagnosis';


#----------------------------------------------------------------------
#  What website are we running on?

our $system_url = "https://softconf.org";
our $system_dir = "/home4/softconf/public_html";


#------------------------------------------------------------------------


our %peopleTypes = (
    SOFTCHILD    => "SOFT Child",
    CHILD        => "Child",
    TEEN         => "Teen",
    ADULT        => "Adult",
    PROFESSIONAL => "Professional",
    SOFTANGEL    => "SOFT Angel",
);



our %reg_type = (
    full      => 'Attending the full Conference',
    workshops => 'Attending only the workshops (for Professionals only)',
    picnic    => 'Only attending the picnic',
    balloon   => 'Requesting a balloon (not attending)'
);



#----------------------------------------------------------------------
#  Report Module Success
#

1;