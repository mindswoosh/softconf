#/usr/bin/perl -w

#---
# DateTime class - immutable
#
# @author Steve Maguire
# @version 1.0
#
# The setters in this class start with "set" because they
# always return an Entry object and not the value that
# they just set. 

package DateTime;
use parent qw(ImmutableObject);

use Carp::Assert;
use Time::Local;            # For dayOfWeek()
use strict;



#---
# Create a new DateTime object
#
#   $now      = DateTime->new();
#   $date     = DateTime->new($month, $day, $year);
#   $datetime = DateTime->new($month, $day, $year, $hour, $min, $sec);

sub new {
    my $class = shift;
    my $self = { hour => 0, min => 0, sec => 0 };
    
    assert(@_%3 == 0, "Incorrect # of args")  if DEBUG;
    
    if (@_ == 0) {
        my ($day, $month, $year, $hour, $min, $sec) = (localtime)[3,4,5,2,1,0];
        $self->{month} = $month+1;
        $self->{day}   = $day;
        $self->{year}  = $year + 1900;
        $self->{hour}  = $hour;
        $self->{min}   = $min;
        $self->{sec}   = $sec;
    } else {
        $self->{month} = shift;
        $self->{day}   = shift;
        $self->{year}  = shift;
        if (@_) {
            $self->{hour} = shift;
            $self->{min}  = shift;
            $self->{sec}  = shift;
        }
    }
    
    bless $self, $class;
    return $self;
}


#----------------------------------------------------------------------
#  Setters & Getters


#---
#  Set/Get the month
#
#  $month = $date->month;
#  $date  = $date->setMonth($month);

sub month {
    my $self = shift;
    assert(@_ == 0, "Use setMonth")  if DEBUG;
    return $self->{month};
}

sub setMonth {
    my ($self, $month) = @_;
    return $self->_setHashField("month", $month);
}


#---
#  Set/Get the day
#
#  $day  = $date->day;
#  $date = $date->setDay($day);

sub day {
    my $self = shift;
    assert(@_ == 0, "Use setDay")  if DEBUG;
    return $self->{day};
}

sub setDay {
    my ($self, $day) = @_;
    return $self->_setHashField("day", $day);
}


#---
#  Set/Get the year
#
#  $year = $date->year;
#  $date = $date->setYear($year);

sub year {
    my $self = shift;
    assert(@_ == 0, "Use setYear")  if DEBUG;
    return $self->{year};
}

sub setYear {
    my ($self, $year) = @_;
    return $self->_setHashField("year", $year);
}


#---
#  Set/Get the hour
#
#  $hour = $date->hour;
#  $date = $date->setHour($hour);

sub hour {
    my $self = shift;
    assert(@_ == 0, "Use setHour")  if DEBUG;
    return $self->{hour};
}

sub setHour {
    my ($self, $hour) = @_;
    return $self->_setHashField("hour", $hour);
}


#---
#  Set/Get the minutes
#
#  $min  = $date->minutes;
#  $date = $date->setMinutes($min);

sub minutes {
    my $self = shift;
    assert(@_ == 0, "Use setMinutes")  if DEBUG;
    return $self->{min};
}

sub setMinutes {
    my ($self, $min) = @_;
    return $self->_setHashField("min", $min);
}


#---
#  Set/Get the seconds
#
#  $secs = $date->seconds;
#  $date = $date->setSeconds($secs);

sub seconds {
    my $self = shift;
    assert(@_ == 0, "Use setSeconds")  if DEBUG;
    return $self->{sec};
}

sub setSeconds {
    my ($self, $secs) = @_;
    return $self->_setHashField("sec", $secs);
}


#----------------------------------------------------------------------
#  Methods to manipulate dates and times


#  Set just the Date part of a DateTime leaving the Time unchanged
sub setDate {
	my ($self, $mon, $day, $year) = @_;
	
	my $date = $self->clone();
	$date->{month} = $mon;
	$date->{day} = $day;
	$date->{year} = $year;
	
	return $date;
}


#  Set just the Time part of a DateTime leaving the Date unchanged
sub setTime {
	my ($self, $hour, $min, $sec) = @_;
	
	my $date = $self->clone();
	$date->{hour} = $hour;
	$date->{min} = $min;
	$date->{sec} = $sec;
	
	return $date;
}


#  Given a date, return a neighboring date +/- the number of days specified.
sub addDays {
    my ($self, $daysoffset) = @_;
    my $time;

	#  We offset at noon time to avoid Daylight Savings anomolies
	#  that occur in the early morning hours.
	
    eval { $time = timelocal(0, 0, 12, $self->{day}, $self->{month}-1, $self->{year}-1900); };
    my ($day, $mon, $year) = (localtime($time + ($daysoffset*24*60*60)))[3,4,5];

    my $date = $self->clone();
    $date->{month} = $mon+1;
    $date->{day} = $day;
    $date->{year} = $year+1900;
    
    return $date;
}


#  Return the date one week before this date
sub addWeeks {
	return $_[0]->addDays($_[1]*7);
}


#  Return the date before this date
sub yesterday {
	return $_[0]->addDays(-1);
}


#  Return the date after this date
sub tomorrow {
	return $_[0]->addDays(1);
}


#  Return the day of the week: 0=Sunday, 1=Monday, etc.
sub dayOfWeek {
    my $self = shift;
    my $time;

    eval { $time = timelocal(0, 0, 0, $self->{day}, $self->{month}-1, $self->{year}-1900); };
    return ((localtime($time))[6]);
}


#  Return the number of days in this month
sub daysInMonth {
	return $_[0]->nextMonth->addDays(-1)->{day};
}


#  Returns the first day of the previous month
sub prevMonth {
    return $_[0]->setDay(1)->addDays(-1)->setDay(1);
}


#  Returns the first day of next month
sub nextMonth {
    return $_[0]->setDay(1)->addDays(31)->setDay(1);
}


#  Returns Sunday of this calendar week (Sunday is the first day of the week)
sub startOfWeek {
	return $_[0]->addDays( -($_[0]->dayOfWeek) );
}


#  Returns the Saturday of this week
sub endOfWeek {
	return $_[0]->addDays(6 - $_[0]->dayOfWeek);
}


#  Return date in Unix Time format: YYYYMMDDHHMMSS
sub valueOf {
    my $self = shift;
    
    return $self->{year}*10000000000 + $self->{month}*100000000 +
        $self->{day}*1000000 + $self->{hour}*10000 +
        $self->{min}*100 + $self->{sec};
}


# Is this date between dateStart and dateEnd, inclusive?
#
#   if ($date->isInRange($dateStart, $dateEnd)) ...
sub isInRange {
	my ($self, $dateStart, $dateEnd) = @_;
	assert($dateStart->valueOf() <= $dateEnd->valueOf())  if DEBUG;
	
	my $valueOfSelf = $self->valueOf();
	return ($dateStart->valueOf() <= $valueOfSelf  &&  $valueOfSelf <= $dateEnd->valueOf());
}


#  Return date string in SQL format
sub formatSQL {
    my $self = shift;
    return sprintf("%04d-%02d-%02d %02d:%02d:%02d",
        $self->{year}, $self->{month}, $self->{day},
        $self->{hour}, $self->{min}, $self->{sec});
}


# Eventually pull these from locale or gettext
my @dayNames = qw(Sunday Monday Tuesday Wednesday Thursday Friday Saturday);

sub dayName {
	return $dayNames[$_[0]->dayOfWeek];
}


my @monthNames = qw(January February March April May June July August September October November December);
					
sub formatDate {
	my $self = shift;
	return $monthNames[$self->{month}-1]." ".$self->{day}.", ".$self->{year};
}


sub formatTime {
	my $self = shift;
	my $hour = $self->{hour};
	my $ampm = "a";
	
	if ($self->{hour} == 0) {
		$hour = "12";
	} else {
		$ampm = "p"  if ($hour >= 12);
		$hour -= 12  if ($hour >= 13);
	}

    return sprintf("%d:%02d%s", $hour, $self->{min}, $ampm);
}


sub toString {
	my $self = shift;
	return $self->dayName." ".$self->formatDate." ".$self->formatTime;
}



#----------------------------------------------------------------------
# Test this class
#

sub testClass {
    my $pkg = shift;
    assert($pkg eq __PACKAGE__, "Package mismatch: $pkg/".__PACKAGE__);
	
    # Get the current system time
    my $sys_time = time();
    
    my $date = DateTime->new();
    assert(defined($date));
    assert($date->isa("DateTime"));
    
    # Confirm that DateTime->new returns a date that is very close to the system time
    my $time_today = timelocal($date->seconds, $date->minutes, $date->hour, $date->day, $date->month-1, $date->year-1900);
    assert($time_today >= $sys_time);
    assert($time_today < $sys_time + 2, "$time_today < $sys_time");
    
    $date = DateTime->new(3, 25, 1962);
	$date->assertEqual(3, 25, 1962, 0, 0, 0);   

    $date = DateTime->new(2, 28, 2016, 11, 22, 33);
	$date->assertEqual(2, 28, 2016, 11, 22, 33);
    
    $date = $date->addDays(0);
	$date->assertEqual(2, 28, 2016, 11, 22, 33);

    $date = $date->addDays(1);
	$date->assertEqual(2, 29, 2016, 11, 22, 33);

    $date = $date->addDays(1);
	$date->assertEqual(3, 1, 2016, 11, 22, 33);
    
    $date = $date->addDays(-1);
	$date->assertEqual(2, 29, 2016, 11, 22, 33);
    
    my $dateOrig = $date;
    
    $date = $date->setMonth(4);
	$date->assertEqual(4, 29, 2016, 11, 22, 33);
    
    $date = $date->setDay(17);
	$date->assertEqual(4, 17, 2016, 11, 22, 33);
    
    $date = $date->setYear(2001);
	$date->assertEqual(4, 17, 2001, 11, 22, 33);
    
    $date = $date->setHour(23);
	$date->assertEqual(4, 17, 2001, 23, 22, 33);
    
    $date = $date->setMinutes(43);
	$date->assertEqual(4, 17, 2001, 23, 43, 33);
    
    $date = $date->setSeconds(57);
	$date->assertEqual(4, 17, 2001, 23, 43, 57);
    
    # Make sure $dateOrig didn't change
	$dateOrig->assertEqual(2, 29, 2016, 11, 22, 33);

	# Test setDate and setTime
	$date = DateTime->new(3, 4, 2016, 13, 45, 21);
	
	my $dateChangeTime = $date->setTime(1, 2, 3);
	$date->assertEqual(3, 4, 2016, 13, 45, 21);
	$dateChangeTime->assertEqual(3, 4, 2016, 1, 2, 3);
	
	my $dateChangeDate = $date->setDate(7, 11, 1962);
	$date->assertEqual(3, 4, 2016, 13, 45, 21);
	$dateChangeDate->assertEqual(7, 11, 1962, 13, 45, 21);
	
    # Test dayOfWeek. March 4, 2016 is a Friday
    $date = DateTime->new(3, 4, 2016);
    assert($date->dayOfWeek == 5);
    assert($date->daysInMonth == 31);
    
    # Test dayOfWeek. March 4, 2016 is a Wednesday and Feb 2016 is a leap year 
    $date = DateTime->new(2, 3, 2016);
    assert($date->dayOfWeek == 3);
    assert($date->daysInMonth == 29);
    
    $date = $date->prevMonth;
	$date->assertEqual(1, 1, 2016, 0, 0, 0);
    
    $date = $date->prevMonth;
    $date->assertEqual(12, 1, 2015, 0, 0, 0);

    $date = $date->setDay(15);
    $date = $date->nextMonth;
	$date->assertEqual(1, 1, 2016, 0, 0, 0);
    
    $date = $date->setDay(15);
    $date = $date->nextMonth;
    $date->assertEqual(2, 1, 2016, 0, 0, 0);

    $date = $date->nextMonth;
    $date->assertEqual(3, 1, 2016, 0, 0, 0);
	
	
	# Test addWeeks
	$date = DateTime->new(2, 29, 2016, 17, 23, 57);
	
	$date = $date->addWeeks(1);
	$date->assertEqual(3, 7, 2016, 17, 23, 57);

	$date = $date->addWeeks(-1);
	$date->assertEqual(2, 29, 2016, 17, 23, 57);


    # Test startOfWeek and endOfWeek. March 4, 2016 is a Friday
    $date = DateTime->new(3, 4, 2016, 14, 41, 44);
    assert($date->dayOfWeek == 5);
	
	my $dateTest = $date->startOfWeek;
	assert($dateTest->dayOfWeek == 0);
	$dateTest->assertEqual(2, 28, 2016, 14, 41, 44);
	
	$dateTest = $date->endOfWeek;
	assert($dateTest->dayOfWeek == 6);
	$dateTest->assertEqual(3, 5, 2016, 14, 41, 44);
	
	# Test isInRange methods
	
	$date = DateTime->new(9, 2, 1988, 12, 30, 9);
    my $dateStart = DateTime->new(7, 4, 1976, 12, 15, 35);
	my $dateEnd   = DateTime->new(3, 11, 2001, 17, 45, 23);
	assert($date->isInRange($dateStart, $dateEnd));
	
	# Do boundary tests
	$date = DateTime->new(7, 4, 1976, 12, 15, 35);
	assert($date->isInRange($dateStart, $dateEnd));	
	
	$date = $date->setTime(12, 15, 34);
	assert(!$date->isInRange($dateStart, $dateEnd));
	
	$date = DateTime->new(3, 11, 2001, 17, 45, 23);
	assert($date->isInRange($dateStart, $dateEnd));
	
	$date = $date->setTime(17, 45, 24);
	assert(!$date->isInRange($dateStart, $dateEnd));	

	# Test string functions
	$date = DateTime->new(3, 25, 2016);
	assert($date->dayName eq "Friday");
	assert($date->formatDate eq "March 25, 2016");
	assert($date->formatTime eq "12:00a");
	$date = $date->setHour(11);
	assert($date->formatTime eq "11:00a");	
	$date = $date->setHour(12);
	assert($date->formatTime eq "12:00p");		
	$date = $date->setHour(13);
	assert($date->formatTime eq "1:00p");


	# Regression tests
		
	# Test when doing date math around Daylight Savings switchovers. The
	# dates should change properly regardless of the time change. These
	# broke when we did date math at midnight. Now we do it at noon.
	
	$date = DateTime->new(3, 15, 2016);
	$date = $date->tomorrow;
	$date->assertEqual(3, 16, 2016, 0, 0, 0);
	$date = $date->tomorrow;
	$date->assertEqual(3, 17, 2016, 0, 0, 0);
	$date = $date->tomorrow;
	$date->assertEqual(3, 18, 2016, 0, 0, 0);

	$date = DateTime->new(11, 5, 2016);
	$date = $date->tomorrow;
	$date->assertEqual(11, 6, 2016, 0, 0, 0);
	$date = $date->tomorrow;
	$date->assertEqual(11, 7, 2016, 0, 0, 0);
	$date = $date->tomorrow;
	$date->assertEqual(11, 8, 2016, 0, 0, 0);
}


sub assertEqual {
	my $self = shift;
	my ($mon, $day, $year, $hour, $min, $sec) = @_;
	
	assert($self->{month} == $mon, "Invalid month: $self->{month} != $mon");
	assert($self->{day} == $day,   "Invalid day: $self->{day} != $day");
	assert($self->{year} == $year, "Invalid year: $self->{year} != $year");
	assert($self->{hour} == $hour, "Invalid hour: $self->{hour} != $hour");
	assert($self->{min} == $min,   "Invalid minutes: $self->{min} != $min");
	assert($self->{sec} == $sec,   "Invalid seconds: $self->{sec} != $sec");
	
	return 1;
}


1;
