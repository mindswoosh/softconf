
#----------------------------------------------------------------------
#  Module: Settings
#
#  Specify the settings for this particular implementation
#

package Settings;

use strict;
use warnings;

use Exporter 'import';
our @EXPORT = qw(
	$system_name
	$system_domain

	$system_codepath
	$system_httpdocs

	$system_messageid
	
	$system_web_url
	$system_code_url
	
	$paypal_listener_url

	$sendmail

	$mysql_database
	$mysql_host
	$mysql_username
	$mysql_password
	
	TRUE
	FALSE
);

use strict;



#----------------------------------------------------------------------
#  System settings
#
#  These settings define how this system is presented to the world
#  and how it is represented on this operating system.
#

our $system_name          =  "SOFTConf.org";      # Spoken/Documentation name
our $system_domain        =  "softconf.org";      # Computer name...

our $system_codepath      =  "/var/www/vhosts/$system_domain/httpdocs/cgi-bin";
our $system_httpdocs      =  "/var/www/vhosts/$system_domain/httpdocs";

our $system_messageid     =  "216-55-166-174.dedicated.abac.net";  # Unique string ID'ing our server

our $system_web_url       =  "http://www.$system_domain"; 
our $system_code_url      =  "$system_web_url/cgi-bin";

our $sendmail             =  "/usr/sbin/sendmail";



#----------------------------------------------------------------------
#  MySQL database settings
#
#  You may need to contact your web hosting service to create a
#  database for you, but most hosting services provide a control
#  panel where you can create a new MySQL database
#

our $mysql_database = "softconf";
#our $mysql_host     = "www.softconf.org";     # This works if the DB is on another server
our $mysql_host     = "localhost";
#our $mysql_host     = "74.53.157.98";
our $mysql_username = "softconf";
our $mysql_password = "Trisomy2019!";



#----------------------------------------------------------------------
#  Report Module Success
#

1;