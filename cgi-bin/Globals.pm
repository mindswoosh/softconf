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
  $dbh
  CONFERENCE_ID
  DEBUG 
	TRUE
	FALSE
);


use Settings;
use strict;



#----------------------------------------------------------------------
#  This year's conference ID.  State abbreviation + year

use constant CONFERENCE_ID  => "MI2019";



#----------------------------------------------------------------------
#  Open the database at the start of each script

our $dbh;



#----------------------------------------------------------------------
#  Include DEBUG code?

use constant DEBUG  => 1;



#----------------------------------------------------------------------
#  We use TRUE and FALSE all the time...


use constant FALSE  => 0;
use constant TRUE   => 1;



#------------------------------------------------------------------------
#  This is the HTML FORM code for including a PayPay link. PayPal links
#  are specified in an event using the PAYPAL inline function:
#
#       PAYPAL{email address; event name; cost}


our $paypal_template = qq~
    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
    <i><font face="Arial Black" color="#000080" size="4">
    </font></i><font color="#000080">
    <input type="hidden" value="EMAILADDRESS" name="business">
    <input type="hidden" value="_xclick" name="cmd">
    <input type="hidden" value="1" name="undefined_quantity">
    <input type="hidden" value="EVENTNAME" name="item_name">
    <input type="hidden" value="LegalShieldEvent" name="item_number">
    <input type="hidden" value="COST" name="amount">
    <input type="hidden" value="1" name="no_shipping">
    <input type="hidden" value="USD" name="currency_code">
    <input type="hidden" value="US" name="lc"><strong>
    <font face="Arial">
    <input type="image" alt="Make payments with PayPal - it's fast, free and secure!"
    src="$system_web_url/images/buynow.jpg" border="0" name="I1">
    </font></strong></font></p></form>
~;



#----------------------------------------------------------------------
#  Report Module Success
#

1;