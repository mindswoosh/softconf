
//----------------------------------------------------------------------
//  Module: SmartFix
//
//  Users enter the darndest stuff when creating new calendar entries...
//  Some people insist on entering entries entirely in uppercase; others
//  enter everything entirely in lowercase...
//
//  The following "Smart" routines clean up user input so that calendar
//  entries are consistent and present our best "face" to users.

package SmartFix;

require Exporter;
@ISA = qw(Exporter);
@EXPORT = qw(
            SmartFixName
            SmartFixEmail
            SmartFixAddress
            SmartFixText
            SmartFixPhone
            SmartFixLinks
          );

use strict;


//----------------------------------------------------------------------


function ucFirst(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function SmartFixName(text) {

    //  Don't do anything if the text has BOTH upper and lowercase letters
    if (text.match(/[A-Z]/)  &&  text.match(/[a-z]/)) {
        return text;
    }

    //  This name is either entirely uppercase or entirely lowercase. Either
    //  way, lets start with entirely lowercase and construct a properly
    //  capitalized name from there. As we do this this, we must remember
    //  to always account for hyphenated names, treating "-" as a name
    //  separator equivalent to a space...

    text = text.toLowerCase();

    //  Handle some directional abbreviations
    text = text.replace(/\bne\b/ig, "NE");
    text = text.replace(/\bnw\b/ig, "NW");
    text = text.replace(/\bse\b/ig, "SE");
    text = text.replace(/\bsw\b/ig, "SW");


    //  Upcase the first letter of each name in the full name
    $name = ucFirst($name);
    text = text.replace(/([\s\-]+)(.)/g, "$1\U$2");

    text = text.replace(/([\s\-]Mc)(.)/g, "$1\U$2");          // McNames
    text = text.replace(/([\s\-]Mac)(.)/g, "$1\U$2");         // MacNames
    text = text.replace(/([\s\-]O')(.)/g, "$1\U$2");          // O'Names
    text = name.replace(/([\s\-]Le)(.)eu/g, "$1\U$2\Leu");    // LeFeuvre, LeBeuf, etc.

    //  What about names like:
    //  DeWitt, DeWalt, DeVries, DeVoss, DeGeneris, AuCoin, DaVinci, etc.?
    //  Consider Davis - not DaVis, etc...

    return(text);
}


function SmartFixEmail(email) {

    //  Fix common misspellings of large ISPs...
    //  @comcast.com     @comcast.net
    //  @bellsouth.com   @bellsouth.net
    //  @sbcglobal.com   @sbcglobal.net
    //  @verizon.com     @verizon.net
    //  @cox.com         @cox.net
    //  @charter.com     @charter.net
    //  @att.com         @att.net
    //  @netzero.com     @netzero.net
    //  @earthlink.com   @earthlink.net
    //  @alltell.com     @alltel.net

    return email.toLowerCase();
}


sub SmartFixAddress {
    my $text = shift;

    $text = SmartFixName($text);

    //  No need for double spaces in addresses
    $text =~ s/\s\s/ /ig;

    //  The substitions, below, are made even if the
    //  address is entered in mixed case.

    $text =~ s/\bp[\.]?o[\.]?\b/P.O./ig;        // po, PO ==> P.O.
    $text =~ s/\bbox\b/Box/ig;                  // Box

    //  Handle some place abbreviations
    $text =~ s/\bst\b/St/ig;                    // St.
    $text =~ s/\bstreet\b/St\./ig;              // St.
    $text =~ s/\bave\b/Ave/ig;                  // Ave
    $text =~ s/\bavenue\b/Ave./ig;              // Ave
    $text =~ s/\brd\b/Rd/ig;                    // Rd
    $text =~ s/\broad\b/Rd\./ig;                // Rd.
    $text =~ s/\bblvd\b/Blvd/ig;                // Blvd
    $text =~ s/\bpl\b/Pl/ig;                    // Pl
    $text =~ s/\bct\b/Ct/ig;                    // Ct
    $text =~ s/\bln\b/Ln/ig;                    // Ln
    $text =~ s/\bcir\b/Cir/ig;                  // Cir
    $text =~ s/\bway\b/Way/ig;                  // Way

    $text =~ s/\bapt\b/Apt/ig;                  // Apt
    $text =~ s/\bunit\b/Unit/ig;                // Unit
    $text =~ s/\bbldg\b/Bldg/ig;                // Bldg

    //  Handle digits followed by "st", "nd", "rd", or "th"
    $text =~ s/\b(\d+)st\b/$1st/ig;             // 1st
    $text =~ s/\b(\d+)nd\b/$1nd/ig;             // 2nd
    $text =~ s/\b(\d+)rd\b/$1rd/ig;             // 3rd
    $text =~ s/\b(\d+)th\b/$1th/ig;             // 4th

    //  Handle some directional abbreviations
    $text =~ s/\bn\b/N/ig;                      // N
    $text =~ s/\be\b/E/ig;                      // E
    $text =~ s/\bs\b/S/ig;                      // S
    $text =~ s/\bso\b/S/ig;                     // S
    $text =~ s/\bw\b/W/ig;                      // W
    $text =~ s/\bn\s*e\b/NE/ig;                 // NE
    $text =~ s/\bn\s*w\b/NW/ig;                 // NW
    $text =~ s/\bs\s*e\b/SE/ig;                 // SE
    $text =~ s/\bs\s*w\b/SW/ig;                 // SW
    $text =~ s/\bnorth\b/North/ig;              // North
    $text =~ s/\beast\b/East/ig;                // East
    $text =~ s/\bsouth\b/South/ig;              // South
    $text =~ s/\bwest\b/West/ig;                // West

    return($text);
}



sub SmartFixText {
    my $text = shift;
    
    //  If there are more uppercase letters than lowercase letters, assume that
    //  the text needs to be lowercased...
    
    my ($i, $lowercase, $uppercase);

    for ($i = 0; $i < length($text); $i++) {

        //  We're looping through the string properly, but both tests are failing...
        //  Improper subtext referencing?

        my $ch = substr($text, $i, 1);
        if ($ch =~ /[a-z]/) {
            $lowercase++;
        } elsif ($ch =~ /[A-Z]/) {
            $uppercase++;
        }
    }

	//  Don't mess with the text for super-short strings...
    //if (length ($text) > 10  &&  $uppercase > $lowercase/1.5) {
    //    $text = lc($text);
    //    $text =~ s/(\s+)(.)/$1\U$2/g;      // Title-case
    //    $text =~ s/-(.)/-\U$1/g;           // Hyphenated Title-case
    //    $text = ucfirst($text);
    //}

    //  Now that the text is mixed case, let's do some other general cleanups
    //  and spelling corrections.

    $text = &SmartFixName($text);

    //  Remove unnecessary blank lines. Two blank lines is the maximum...
    $text =~ s/\n\s*\n\s*\n\s*\n/\n\n\n/g;
    
    //  Remove all overly excited exclamations!!!!!!!!
    $text =~ s/!+/!/g;

    //  Fix cutesy $'s insted of S's such as $uccess, Fast$tart, etc.
    $text =~ s/\$([a-zA-Z])/S$1/g;            

    //  Now let's do some spell-checking types of cleanups...

    //  Let's always spell Pre-Paid Legal and PPL properly
    //  Fix things like "Prepaid Legal" etc... We also correct
    //  entries where people use PPL as an abbreviation for our
    //  company. PPL is corrected with "Pre-Paid Legal"

    $text =~ s/\bpre[\s-]*?paid[\s]+legal\b/Pre-Paid Legal/ig;
    $text =~ s/\bppl([\s\.\'\"!\?\),;:])/Pre-Paid Legal$1/ig;        // Exclude @ for email addresses: ppl@...
	
	
	//  Our new company name is always spelled "LegalShield" and correct
	//  when "Shield" is misspelled.
	$text =~ s/\blegal[\s]+shield\b/LegalShield/ig;
	$text =~ s/\blegal[\s]+sheild\b/LegalShield/ig;
	$text =~ s/\blegalsheild\b/LegalShield/ig;

    //  The names of our Pre-Paid Legal plans should always be in uppercase...

    $text =~ s/\bcdlp\b/CDLP/ig;
    $text =~ s/\bbolsp\b/BOLSP/ig;
    $text =~ s/\bhbbr\b/HBBR/ig;
    $text =~ s/\blolp\b/LOLP/ig;
    $text =~ s/\badrs\b/ADRS/ig;
    $text =~ s/\bcft\b/CFT/ig;
    $text =~ s/\bcitrms\b/CITRMS/ig;
    $text =~ s/\bssma\b/SSMA/ig;
	
    //  Other common abbreviations...

    $text =~ s/\bokc\b/OKC/ig;
    $text =~ s/\bpplsi\b/PPLSI/ig;
    $text =~ s/\btba\b/TBA/ig;
    $text =~ s/\btbd\b/TBD/ig;
    $text =~ s/\bpbr\b/PBR/ig;

    //  Let's handle some very common misspellings...

    $text =~ s/Cordinator/Coordinator/ig;
    $text =~ s/([Bb])reifing/$1riefing/ig;
    $text =~ s/Power[-]*[Pp]oint/PowerPoint/ig;
    $text =~ s/([Hh])iway/$1ighway/ig;
    $text =~ s/(\d)th/$1th/ig;
    $text =~ s/(\d)nd/$1nd/ig;
    $text =~ s/(\d)rd/$1rd/ig;
    // Restaurant, Every Day,

    //  Let's clean up some bad characters...
    // $text =~ s/\x92/'/g;                  // Substitute  close single parenthis with '	
    $text =~ s/–/-/g;                     // Substitute  m-dash with dash
    $text =~ s/,([^0-9\s])/, $1/g;        // Ensure space after commas, except in //'s
    $text =~ s/!(\w)/! $1/g;              // Ensure a space after an exclamation point
    
    return($text);
}



sub SmartFixPhone {
    my $phone = shift;

    $phone =~ s/\D//g;
    $phone =~  s/(\d\d\d)(\d\d\d)(\d\d\d\d)/($1) $2-$3/;

    return($phone);
}


sub DisplayFixText {
    my $text = shift;

    // $text =~ s/\r//g;
    $text =~ s/[\r\t ]+$//mg;

    return $text;
}


sub SmartFixLinks {
    my $text = shift;

    $text =~ s/LINK\{(.+?);\s*(.+?)\}/<a href="$1" target="_blank">$2<\/a>/g;

    //  If there appear to be hyperlinks in the text, convert them
    //  to true clickable hyperlinks...

    $text = &DisplayFixText($text);   // Convert special Windows characters to normal characters

    //  Convert email addresses to live "mailto:" links. Convert both inline and only-thing-on-line
    $text =~ s|([\s:])([\w.\-]+\@[a-zA-Z\d.\-]+\.[a-zA-Z\d]+)|$1<a href=\"mailto:$2\">$2</a>|g;
    $text =~ s|^([\w.\-/]+\@[a-zA-Z\d.\-/]+\.[a-zA-Z\d]+)|<a href=\"mailto:$1\">$1</a>|g;
    
    //  This transforms simple www.url links inline, or at the start of the text
	//  (These don't work any more, but at one time they did. Not sure what broke them...)
    //  $text =~ s|(\s:)(www\.[\w\%\.\-/]+[a-zA-Z\d/](\?[\w%&/=\+\.]+)?)|$1<a href=\"http://$2\" target=\"_blank">$2</a>|ig;
    //  $text =~ s|^(www\.[\w\%\.\-/]+[a-zA-Z\d/](\?[\w%&/=\+\.]+)?)|<a href=\"http://$1\" target=\"_blank">$1</a>|ig;
	
	//  This transforms simple www.url links inline, or at the start of the text (these don't work for all "correct"
	//  links, but they work for what people really enter...)
	$text =~ s|([\s:])(www\.[\w\.]+\.[\w\/]+(\?[\w%&/=\+\.]+)?)|$1<a href=\"http://$2\" target=\"_blank">$2</a>|img;
	$text =~ s|^(www\.[\w\.]+\.[\w\/]+(\?[\w%&/=\+\.]+)?)|<a href=\"http://$1\" target=\"_blank">$1</a>|img;
	
    //  Review: Why are these two replacements made in SmartFixLinks?
    $text =~ s/\n/<br>/g;
    $text =~ s/  /&nbsp;&nbsp;/g;

    //  Now, in the next few lines we are going to be searching the text not for embedded
    //  links included in HTML that the user may have entered, but we're searching instead
    //  for plain text entries that are web addresses so that we can convert them to actual
    //  hyperlinks. To do this properly, we need to make sure we don't change existing HTML
    //  links, and instead change only plain text links.

//    //  This transforms http://url links, but not simple www.url links...
//    $text =~ s|(\"http:)(//[a-zA-Z\d.\-/]+[a-zA-Z\d/](\?[\w%&=\+]+)?)|$1:$2|g;        // Protect existing, real, HTML links (="link")
//    $text =~ s|(http://[a-zA-Z\d.\-/]+[a-zA-Z\d/](\?[\w%&=\+]+)?)|<a href=\"$1\" target=\"_blank">$1</a>|g;
//    $text =~ s|(\"http::)(//[a-zA-Z\d.\-/]+[a-zA-Z\d/](\?[\w%&=\+]+)?)|\"http:$2|g;   // Convert back

    //  This transforms http://url links, but not simple www.url links which has already been done.
	//  If the http: is preceded by a " then it's already part of an href="..." so don't change those
	
    $text =~ s|(\"http:)(//[\w\%\.\-/]+[a-z\d/](\?[\w%&/=\+\.]+)?)|$1:$2|ig;        // Protect existing, real, HTML href="link"
    $text =~ s|(http://[\w\%\.\-/]+[a-z\d/](\?[\w%&/=\+\.]+)?)|<a href=\"$1\" target=\"_blank">$1</a>|ig;
    $text =~ s|(\"http::)(//[\w\%\.\-/]+[a-z\d/](\?[\w%&/=\+\.]+)?)|\"http:$2|ig;   // Convert back

    //  Now do secure links...
    $text =~ s|(\"https:)(//[\w\%\.\-/]+[a-z\d/](\?[\w%&/=\+\.]+)?)|$1:$2|ig;        // Protect existing, real, HTML href="link"
    $text =~ s|(https://[\w\%\.\-/]+[a-z\d/](\?[\w%&/=\+\.]+)?)|<a href=\"$1\" target=\"_blank">$1</a>|ig;
    $text =~ s|(\"https::)(//[\w\%\.\-/]+[a-z\d/](\?[\w%&/=\+\.]+)?)|\"https:$2|ig;   // Convert back
    
    return($text);
}


//----------------------------------------------------------------------
//  Report Module Success
//

1;