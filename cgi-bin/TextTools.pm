package TextTools;

use strict;
use warnings;

use Exporter 'import';
our @EXPORT_OK = qw(
    commify 
    trim 
    quote 
    boolToYesNo 
    textToHTML
    pluralize_person
    pluralize
);


#------------------------------------------------
# commify a number
#------------------------------------------------

sub commify {
    my $input = shift;
    $input = reverse $input;
    $input =~ s<(\d\d\d)(?=\d)(?!\d*\.)><$1,>g;
    return reverse $input; 
}


#------------------------------------------------
# trim whitespace from a string
#------------------------------------------------

sub trim {
    my $str = shift || '';
    $str =~ s/^\s+|\s+$//g;
    return $str;
}


#------------------------------------------------
# Backslash all non-numeric characters except %
#------------------------------------------------

sub quote {
    my $str = quotemeta(shift);
    $str =~ s/\\%/%/g;
    return $str;
}



#------------------------------------------------
# Convert boolean to "Yes" or "No" string
#------------------------------------------------

sub boolToYesNo {
    my $bool = shift;
    return $bool ? "Yes" : "No";
}



#------------------------------------------------
# Convert text meant for email to HTML output
#------------------------------------------------

sub textToHTML {
    my $text = shift;

    $text =~ s/ /&nbsp;/g;
    $text =~ s/\n/<br>/g;
    return $text;
}



#------------------------------------------------
# Pluralize a word based on the number of "things"
#------------------------------------------------

my %plurals = (
	"belief"	=> "beliefs",
	"chef"		=> "chefs",
	"chief"		=> "chiefs",
	"child" 	=> "children",
	"deer"		=> "deer",
	"foot"		=> "feet",
	"gas"		=> "gasses",
	"goose"		=> "geese",
	"halo"		=> "halos",
	"man"		=> "men",
	"mouse"		=> "mice",
	"person" 	=> "people",
	"photo"		=> "photos",
	"piano"		=> "pianos",
	"roof"		=> "roofs",
	"series"	=> "series",
	"sheep"		=> "sheep",
	"species"	=> "species",
	"tooth"		=> "teeth",
	"woman"		=> "women",
);


sub pluralize {
	my ($num, $noun) = @_;

	return $noun  if ($num == 1);

	#  Handle multi-word phrases

	my $phrase_start = "";

	if ($noun =~ m/^(.*)\s(\w+)$/) {
		$phrase_start = $1;
		$noun = $2;
	}

	my $plural = $plurals{lc($noun)};

	unless ($plural) {

		#  See for rule: https://www.grammarly.com/blog/plural-nouns/
		if ($noun =~ /(o|s|sh|ch|x|z)$/i) {
			$plural = $noun . "es";
		}
		elsif ($noun =~ /(.+)(f|fe)$/i) {
			$plural = $1 . "ves";
		}
		elsif ($noun =~ /(.+[^aeiou])(y)$/i) {
			$plural = $1 . "ies";
		}
		elsif ($noun =~ /(.+[aeiou])(y)$/i) {
			$plural = $1 . "ys";
		}
		elsif ($noun =~ /(.+)(is)$/i) {
			$plural = $1 . "es";
		}
		else  {
			$plural = $noun . "s";
		}
	}

	if ($noun =~ /^[A-Z]/) {
		$plural = ucfirst($plural);
	}

	$plural = "$phrase_start $plural"  if ($phrase_start ne "");

	return $plural;
}


sub pluralize_person {
	my $num = shift;
	return pluralize($num, "person");
}



1;
