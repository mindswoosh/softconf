
#----------------------------------------------------------------------
#  Module: Interface
#
#  The functions in this module help build HTML pages dynamically
#  on the fly. Many of these functions still use HTML 1.0 rather
#  than CSS and should be phased out over time.
#


package Interface;

require Exporter;
@ISA = qw(Exporter);
@EXPORT = qw(

	htmlPageHeader
	htmlStartBodyText
	htmlEndBodyText
	htmlPageFooter
	
	htmlCalendarHeader
	htmlBackofficeFooter
	
	htmlBackofficeBody
	htmlBackofficeFooter
	
	htmlTrackingCode
	
	VIEW_CALENDAR
	
	EDIT_TODAYS_EVENTS
	MANAGE_PHOTOS
    htmlEventMenuBar
	
	VIEW_MOD_REPORTS
	SET_SEARCHES
	CHANGE_SETTINGS
	htmlAdminMenuBar
	
	htmlBackofficeMenuBar
	
	htmlTab
	
	strCalsPopdown
	htmlMonthsPopdown
	htmlStateProvPopdown
	
	PrintTimes
	PrintTimeZones
	PrintMonths
	PrintDays
	PrintYears
	PrintEvents
	PrintWeekdays
	PrintFrequency
	PrintPhotoFormat
	PrintYesNo
	PrintHeader
	PrintFooter
	PrintJavascript
);


use Settings;
use Globals;
use Common;
use Database;
use DateTimeManipulations;
use strict;




#----------------------------------------------------------------------
#  Back Office tabbed page support
#
#  The following functions allow us to easily create consistent-
#  looking tabbed pages inside the back office of the calendar.
#

sub htmlPageHeader {
	my $title = shift;
	
    my $html = qq~
		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
        <html>
        <head>
        <meta http-equiv="Content-Language" content="en-us">
		<meta http-equiv="Content-type" content="text/html;charset=UTF-8">
        <title>$title</title>
		<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.16/angular.min.js"></script>
		<link href="/css/kalendre.css" rel="stylesheet" type="text/css">
        </head>
        <body bgcolor="#FFFFFF">
        <center>
        <table border="1" width="525" bgcolor="#FFFFFF">
          <tr>
            <td width="865">
              <div align="left">
                <center>
                <table border="0" cellPadding="0" cellSpacing="0">
                  <tr>
                    <td height="47" vAlign="top" width="626">
                      <img border="0" src="$acct_images_url/mediumbanner.jpg">
					</td>
                  </tr>
                </table>
                </center>
              </div>
	~;
	
	return $html;
}


sub htmlPageFooter {
	my $title = shift;
	
	my $html = qq~
              <center>
                <font face="Arial" size="2">For support, email <a href="mailto:$support_email">$support_email</a></font>
              </center>
              <br>
            </td>
          </tr>
        </table>
        <p>&nbsp;</p>
        </center>
        </body>
		<script type="text/javascript" language="javascript">
            function openWindow(theURL) {
                newWindow = window.open(theURL,'newWindow','toolbar=no,menubar=no,resizable=yes,scrollbars=yes,status=no,location=no,width=575,height=700,left=50,top=50');
                newWindow.focus();
            }
        </script>
        </html>
    ~;
	
	return $html;
}


sub htmlStartBodyText {
	my $title = shift;
	
	my $html = qq~
	    <div align="left">
          <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse" bordercolor="#111111" width="509" bgcolor="#FFFFFF">
            <tr>
              <td width="24">&nbsp;</td>
              <td width="521" bordercolor="#FFFFFF">
                <p align="left">&nbsp;</p>
                <p align="center"><font size="6">$title</font></p>
				<p><font face="Arial" size="3">
    ~;
	
	return $html;
}


sub htmlEndBodyText {
	
	my $html = qq~
				</font></p>
              </td>
            </tr>
          </table>
	    </div>
    ~;
	
	return $html;
}



sub htmlCalendarHeader {
	my $title   = shift;
	
	my $args = "m=$INFO{m}&amp;d=$INFO{d}&amp;y=$INFO{y}&amp;vm=$INFO{vm}&amp;ssid=$ssid";
		
    my $html = qq~
		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
        <html>
        <head>
		<meta http-equiv="Content-Language" content="en-us">
		<meta http-equiv="Content-type" content="text/html;charset=UTF-8">
        <title>$title</title>
		<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.16/angular.min.js"></script>
		<!-- Compiled and minified CSS from Twitter's GetBootstrap.com -->
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
		<link rel="stylesheet" href="/css/kalendre.css" type="text/css">
		<script type="text/javascript" src="/js/kalendre.js"></script>
	~;
	
	$html .= htmlTrackingCode();
	
	$html .= qq~
        </head>
	~;
	
	return $html;
}


sub htmlBackofficeBody {
	my $page_id = shift;
	
	my $args = "m=$INFO{m}&amp;d=$INFO{d}&amp;y=$INFO{y}&amp;vm=$INFO{vm}&amp;ssid=$ssid";
		
    my $html = qq~
          <body id="$page_id">
		    <div class="backoffice-page">
		      <div class="backoffice-header">
			    <img src="$acct_images_url/mediumbanner.jpg">
		      </div>
			  <div class="nav-event">
			    <ul>
			      <li class="viewcalendar"><a href="$cgiurl?$args">View Calendar</a></li>
			      <li class="vieweventlist"><a href="$cgiurl?op=view&amp;$args">Edit Today's Events</a>
			      <li class="managephotos"><a href="$cgiurl?op=upload&amp;$args&page=5">Manage Photos</li>
			    </ul>
			  </div>
	~;
	
	return $html;
}



sub htmlBackofficeFooter {
	my $html = qq~
			  <div class="backoffice-footer">
				<p>For support, email <a href="mailto:$support_email">$support_email</a></p>
			  </div>
			</div>
		  </body>
		</html>
	~;
	
	return $html;
}


sub htmlTrackingCode {
	
	my $html;
	
	if ($FORM{cal} eq "legalshieldcal") {
		$html = qq~	
		<script src='//js.clkfm.com/funnelmagick.js?id=12541'></script>
		~;
	}
	else {
		$html = qq~
		<script src="//track.clkmg.com/js/clickmagick.dev.js"></script>
		<script>var pid = 13574, uid = 19852; clickmagick(uid, pid);</script>
		~;
	}
	
	return $html;
}



#----------------------------------------------------------------------
#  Tabbed Panel support
#
#  (The panels really should be handled using CSS these days...)
#


use constant VIEW_CALENDAR      => 0;

use constant EDIT_TODAYS_EVENTS => 1;
use constant MANAGE_PHOTOS      => 2;

use constant VIEW_MOD_REPORTS   => 1;
use constant SET_SEARCHES       => 2;
use constant CHANGE_SETTINGS    => 3;



sub htmlEventMenuBar {
	my $selected = shift;
	my $html;
	my $line;
	
	my $args = "m=$INFO{m}&amp;d=$INFO{d}&amp;y=$INFO{y}&amp;vm=$INFO{vm}&amp;ssid=$ssid";

	$html = qq~<br><img height="30" width="8" src="/images/tabbaseline.jpg" alt="">~;
	
	#  View Calendar tab
    $line = qq~<a href="$cgiurl?$args"><img border="0" src="/images/viewcalendar_deselected.jpg" alt="View Calendar"></a>~;
	$html .= htmlTab($line, "viewcalendar", $selected == VIEW_CALENDAR);

		#  Edit Today's Events tab
	$line = qq~<a href="$cgiurl?op=view&amp;$args"><img border="0" src="/images/edittodaysevents_deselected.jpg" alt="Edit Today's Events"></a>~;
	$html .= htmlTab($line, "edittodaysevents", $selected == EDIT_TODAYS_EVENTS);

	#  Manage Photos tab
    $line = qq~<a href="$cgiurl?op=upload&amp;$args"><img border="0" src="/images/managephotos_deselected.jpg" alt="Manage Photos"></a>~;
    $html .= htmlTab($line, "managephotos", $selected == MANAGE_PHOTOS);

	$html .= qq~<img height="30" width="130" src="/images/tabbaseline.jpg" alt=""></div>~;
	
	return $html;
}



sub htmlAdminMenuBar {
	my $selected = shift;
	my $html;
	my $line;
	
	my $args = "m=$INFO{m}&amp;d=$INFO{d}&amp;y=$INFO{y}&amp;vm=$INFO{vm}&amp;ssid=$ssid";

	$html = qq~<br><img height="30" width="8" src="/images/tabbaseline.jpg" alt="">~;
	
	#  View Calendar tab
    $line = qq~<a href="$cgiurl?$args"><img border="0" src="/images/viewcalendar_deselected.jpg" alt="View Calendar"></a>~;
	$html .= htmlTab($line, "viewcalendar", $selected == VIEW_CALENDAR);

	#  View Moderator Reports tab
	$line = qq~<a href="$cgiurl?op=viewmodreports&amp;$args"><img border="0" src="/images/viewmodreports_deselected.jpg" alt="View Reports"></a>~;
	$html .= htmlTab($line, "viewmodreports", $selected == VIEW_MOD_REPORTS);
	
	if ($this_cal{calendar} eq "global") {
		#  Set predefined searches tab
		$line = qq~<a href="$cgiurl?op=setsearches&amp;$args"><img border="0" src="/images/setsearches_deselected.jpg" alt="Set Searches"></a>~;
		$html .= htmlTab($line, "setsearches", $selected == SET_SEARCHES);
	}
	
	#  Change Settings tab
    $line = qq~<a href="$cgiurl?op=changesettings&amp;$args"><img border="0" src="/images/changesettings_deselected.jpg" alt="Change Settings"></a>~;
    $html .= htmlTab($line, "changesettings", $selected == CHANGE_SETTINGS);
	
	if ($this_cal{calendar} ne "global") {
		$html .= qq~<img height="30" width="100" src="/images/tabbaseline.jpg" alt="">~;
	}
	
	return $html . qq~<img height="30" width="35" src="/images/tabbaseline.jpg" alt="">~;
}



sub htmlTab {
    my ($html, $tab, $selected) = @_;
	
	$html =~ s/($tab)_deselected/$1_selected/  if ($selected);
	return $html;
}



#----------------------------------------------------------------------
#  Various Interface element constructors
#

#  Return a space-separated list of the calendars names that appear
#  in the calendar popdown menu.

sub strCalsPopdown {
	my $account_id = shift;
	my $dbh;
	my $sth;
	my $str = "";
	
	$dbh = OpenDatabase();
	{
		$sth = $dbh->prepare("SELECT calendar FROM calendars WHERE account_id=? ORDER BY calendar");
		$sth->execute($account_id);

		while (my $calref = $sth->fetchrow_hashref()) {
			my $calendar = $calref->{calendar};
			
			next  if ($calendar eq $global_calendar_name);

			$str .= "$calendar ";
		}

		$sth->finish();
	}
	CloseDatabase($dbh);
	
	return $str;
}


sub htmlMonthsPopdown {
	my $month = shift;
	
	my $html = qq~ <select name="Month"> ~;
	
	foreach my $this_month (1..12) {
        my $monthname = $MonthNames[$this_month-1];
        my $selected = ($this_month == $month) ? "selected" : "";
		
        $html .= qq~
		   <option value="$this_month" $selected>$monthname</option>
		~;
    }
	
	$html .= "</select>";
	
	return $html;
}


sub htmlStateProvPopdown {
	my $account_id = shift;
	my $default    = shift;
	my $html;
	
	#  This list will eventually be auto-generated from the DB once the
	#  Admin front-end has been coded that gives the Admin some options
	#  about what calendars show up in the popdown, and in what order.
	#  (e.g., All calendars, only state/prov calendars, etc., selected
	#  depending upon which calendar is being displayed. LegalShield does
	#  not need any of that extra functionality, but other accounts do.)
	
	if (LEGALSHIELD) {
		$html = qq~
			<select size="1" name="destination" onchange="location.href=this.form.destination.options[this.form.destination.selectedIndex].value">		
			   <option value="http://$calendar_domain">-----</option>
			   <option value="http://$calendar_domain/platinum">Platinum Calendar</option>
			   <option value="http://$calendar_domain/AL">Alabama</option>
			   <option value="http://$calendar_domain/AK">Alaska</option>
			   <option value="http://$calendar_domain/AB">Alberta</option>
			   <option value="http://$calendar_domain/AR">Arkansas</option>
			   <option value="http://$calendar_domain/AZ">Arizona</option>
			   <option value="http://$calendar_domain/BC">British Columbia</option>
			   <option value="http://$calendar_domain/norcal">Northern California</option>
			   <option value="http://$calendar_domain/legalshieldcal">Southern California</option>
			   <option value="http://$calendar_domain/CO">Colorado</option>
			   <option value="http://$calendar_domain/CT">Connecticut</option>
			   <option value="http://$calendar_domain/DC">Washington D.C.</option>
			   <option value="http://$calendar_domain/DE">Delaware</option>
			   <option value="http://$calendar_domain/FL">Florida</option>
			   <option value="http://$calendar_domain/GA">Georgia</option>
			   <option value="http://$calendar_domain/HI">Hawaii</option>
			   <option value="http://$calendar_domain/ID">Idaho</option>
			   <option value="http://$calendar_domain/IA">Iowa</option>
			   <option value="http://$calendar_domain/IL">Illinois</option>
			   <option value="http://$calendar_domain/IN">Indiana</option>
			   <option value="http://$calendar_domain/KS">Kansas</option>
			   <option value="http://$calendar_domain/KY">Kentucky</option>
			   <option value="http://$calendar_domain/LA">Louisiana</option>
			   <option value="http://$calendar_domain/ME">Maine</option>
			   <option value="http://$calendar_domain/mb">Manitoba</option>
			   <option value="http://$calendar_domain/md">Maryland</option>
			   <option value="http://$calendar_domain/MA">Massachusetts</option>
			   <option value="http://$calendar_domain/MI">Michigan</option>
			   <option value="http://$calendar_domain/MN">Minnesota</option>
			   <option value="http://$calendar_domain/MS">Mississippi</option>
			   <option value="http://$calendar_domain/MO">Missouri</option>
			   <option value="http://$calendar_domain/MT">Montana</option>
			   <option value="http://$calendar_domain/NE">Nebraska</option>
			   <option value="http://$calendar_domain/NH">New Hampshire</option>
			   <option value="http://$calendar_domain/NJ">New Jersey</option>
			   <option value="http://$calendar_domain/NM">New Mexico</option>
			   <option value="http://$calendar_domain/NV">Nevada</option>
			   <option value="http://$calendar_domain/NY">New York</option>
			   <option value="http://$calendar_domain/NC">North Carolina</option>
			   <option value="http://$calendar_domain/ND">North Dakota</option>
			   <option value="http://$calendar_domain/OH">Ohio</option>
			   <option value="http://$calendar_domain/OK">Oklahoma</option>
			   <option value="http://$calendar_domain/ON">Ontario</option>
			   <option value="http://$calendar_domain/OR">Oregon</option>
			   <option value="http://$calendar_domain/PA">Pennsylvania</option>
			   <option value="http://$calendar_domain/RI">Rhode Island</option>
			   <option value="http://$calendar_domain/SC">South Carolina</option>
			   <option value="http://$calendar_domain/SD">South Dakota</option>
			   <option value="http://$calendar_domain/TN">Tennessee</option>
			   <option value="http://$calendar_domain/legalshieldoftx">Central / South Texas</option>
			   <option value="http://$calendar_domain/legalshieldoftx2">Dallas / Ft. Worth Texas</option>
			   <option value="http://$calendar_domain/legalshieldoftx1">Southeast Texas</option>
			   <option value="http://$calendar_domain/legalshieldoftx3">West Texas</option>
			   <option value="http://$calendar_domain/UT">Utah</option>
			   <option value="http://$calendar_domain/VT">Vermont</option>
			   <option value="http://$calendar_domain/VA">Virginia</option>
			   <option value="http://$calendar_domain/WA">Washington State</option>
			   <option value="http://$calendar_domain/WV">West Virginia</option>
			   <option value="http://$calendar_domain/WI">Wisconsin</option>
			   <option value="http://$calendar_domain/co">Wyoming</option>
			</select>
		~;
	}
	else {
		
		#  For all other businesses/organizations, just list all the calendars in
		#  the account...
		
		my $dbh;
		my $sth;
	
		$html = qq~
			<select size="1" name="destination" onchange="location.href=this.form.destination.options[this.form.destination.selectedIndex].value">
			<option value="http://$calendar_domain/$global_calendar_name">-----</option>
		~;
		
		$dbh = OpenDatabase();
		{
			$sth = $dbh->prepare("SELECT calendar,description FROM calendars WHERE account_id=? ORDER BY calendar");
			$sth->execute($account_id);
	
			while (my $calref = $sth->fetchrow_hashref()) {
				my $calendar    = $calref->{calendar};
				my $description = $calref->{description};
				
				if ($calendar eq $global_calendar_name) {
					#$html =~ s/\{GLOBAL\}/$description/;
					next;
				}
				
				$html .= qq~
					<option value="http://$calendar_domain/$calendar">$description</option>"
				~;
			}
	
			$sth->finish();
		}
		CloseDatabase($dbh);
		
		$html .= "</select>";
	}
	
	#  Choose selected calendar if it's in the list
	$html =~ s|(/$default")|$1 selected|i;
	
	return $html;
}



#-----------------------------------------------------------------------------
#  The following "Print" routines are used to create the HTML output
#  necessary for dropdown listboxes found in the various input forms
#  in the calendar, from creating new calendars, creating new calendar
#  entries, to creating dropdowns on the main calendar display to hop
#  from state to state or province to pronvince.
#
#  All of these helper routines are very, very similar and could probably
#  be generalized into a single subroutine with a bit of thought... Having
#  said that, this is what we have for now!
#
#  At some point all of these routines will be rolled into Interface.pm
#  and redesigned for use with CSS.
#


sub PrintTimes {
    my $defaulttime = shift;
    my $stdtime ;

    my $time = 0;
    while ($time < 2400) {
        $stdtime = &MilitaryToStdTime($time);
        my $selected = ($time == $defaulttime) ? " selected" : "";
        print "               <option value=\"$time\"$selected>$stdtime</option>\n";
        $time += 15;
        $time += 40 if (($time % 100) == 60);
    }
}


sub PrintTimeZones {
    my $default = shift;
    my $timezone;

    $default = $TimeZones[0] if ($default eq "");

    foreach $timezone (@TimeZones) {
        my $selected = ($timezone eq $default) ? " selected" : "";
        print "               <option value=\"$timezone\"$selected>$timezone</option>\n";
    }
}


sub PrintMonths {
    my $default = shift;
    my $monthname;
    my $month;

    foreach $month (1..12) {
        $monthname = $MonthNames[$month-1];
        my $selected = ($month == $default) ? " selected" : "";
        print "               <option value=\"$month\"$selected>$monthname</option>\n";
    }
}


sub PrintDays {
    my $default = shift;
    my $day;

    foreach $day (1..31) {
        my $selected = ($day == $default) ? " selected" : "";
        print "               <option$selected>$day</option>\n";
    }
}


sub PrintYears {
    my $default = shift;
    my $year;
    
    my $start_year = ($default > 0  &&  $default < $ThisCalYear) ? $default : $ThisCalYear-1;

    foreach my $year ($start_year..($ThisCalYear+3)) {
        my $selected = ($year == $default) ? " selected" : "";
        print "<option$selected>$year</option>\n";
    }
}


sub PrintEvents {
    my $default = shift;

    foreach my $event_ref (@EventTypes) {
        my $selected = ($event_ref->{event_type} eq $default) ? " selected" : "";
        print "               <option$selected>$event_ref->{event_type}</option>\n";
    }
}


sub PrintWeekdays {
    my $default = shift;
    my $day ;

    foreach $day (0..6) {
        my $selected = ($day == $default) ? " selected" : "";
        print "               <option value=\"$day\"$selected>$DayNames[$day]</option>\n";
    }
}


sub PrintFrequency {
    my ($repeattype, $repeatnum) = @_;

    my $value = -1;
	
    $value = 0 if ($repeattype eq "D");
    $value = 1 if ($repeattype eq "W");
    $value = 7 if ($repeattype eq "T");
    $value = 8 if ($repeattype eq "S");
    $value = 9 if ($repeattype eq "O");
	
    if ($repeattype eq "M") {
        $value = $repeatnum + 2;
    }

    foreach my $key (-1..scalar(@Frequency)-2) {
        my $selected = ($value == $key) ? " selected" : "";
        print "               <option value=\"$key\"$selected>$Frequency[$key+1]</option>\n";
    }
}


sub PrintPhotoFormat {
    my $default = shift;
    my $photofmt ;

    $default = 0 if ($default eq "");
    foreach $photofmt (0..2) {
        my $selected = ($photofmt == $default) ? " selected" : "";
        print "               <option value=\"$photofmt\"$selected>$PhotoFormat[$photofmt]</option>\n";
    }
}


sub PrintYesNo {
    my $default = shift;

    $default = "NO" if ($default eq "");
	
	if ($default eq "NO") {
        print "<option value=\"NO\" selected>NO</option>\n";
		print "<option value=\"YES\">YES</option>\n";
    } else {
	    print "<option value=\"NO\">NO</option>\n";
		print "<option value=\"YES\" selected>YES</option>\n";
	}
}


sub PrintHeader {
	my $title = shift;
	my $body_settings = shift;
	
	print qq~
		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
		<html>
		<head>
		<meta http-equiv="Content-Language" content="en-us">
		<meta http-equiv="Content-type" content="text/html;charset=UTF-8">
		<title>$title</title>
		<link rel="stylesheet" href="/css/style.css" type="text/css">
		<link rel="stylesheet" href="/css/kalendre.css" type="text/css">
		<script type="text/javascript" src="/js/kalendre.js"></script>
	~;
	
	print htmlTrackingCode();
	
	print qq~		
        </head>
		<body $body_settings>
	~;	
}


sub PrintFooter {
	print "</body></html>";
}


#  Note:  This is in kalendre.js now...  We should strip this from the code.
sub PrintJavascript {
    print qq~
        <script type="text/javascript" language="javascript">
            function openWindow(theURL) {
                newWindow = window.open(theURL,'newWindow','toolbar=no,menubar=no,resizable=yes,scrollbars=yes,status=no,location=no,width=575,height=700,left=50,top=50');
                newWindow.focus();
            }
            function openWindowWide(theURL) {
                newWindow = window.open(theURL,'newWindow','toolbar=no,menubar=no,resizable=yes,scrollbars=yes,status=no,location=no,width=725,height=575,left=50,top=50');
                newWindow.focus();
            }
            function openWindowSmall(theURL) {
                newWindow = window.open(theURL,'newWindow','toolbar=no,menubar=no,resizable=yes,scrollbars=yes,status=no,location=no,width=400,height=290,left=50,top=50');
                newWindow.focus();
            }
        </script>
    ~;
}



#----------------------------------------------------------------------
#  Report Module Success
#

1;