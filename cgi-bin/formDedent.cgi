#!/usr/bin/perl

use strict;
use warnings;

use Settings;
use Globals;
use Database;

use CGI;
use CGI::Carp;
use JSON::PP;
use MIME::Lite;

my $json = JSON::PP->new->ascii->pretty->allow_nonref;

my $q = CGI->new;


#  Handle CORS request.  Allow cross-origin.
#  Eventually, we want to get the front end and back end on the same server
if (defined($ENV{REQUEST_METHOD})  &&  $ENV{REQUEST_METHOD} eq "OPTIONS") {
  print "Access-Control-Allow-Origin: *\n";
  print "Access-Control-Allow-Methods: GET,POST,OPTIONS\n";
  print "Access-Control-Allow-Credentials: false\n";
  print "Content-type: text/html\n\n";
  exit;
}

my $hash;

my $successful = 0;

if ($q->param)            #  fetches the names of the params as a list
{
  my $jsonData = $q->param('POSTDATA');
  my %userData = %{$json->decode($jsonData)};

  if ($userData{formID} eq "") {        #  bot trying to post something. Bail
    exit;
  }


  my %post = (
    conference_id => $userData{conferenceID},
    json => $jsonData
  );
  
  %post = InsertPost(%post);


  if (%post) {
  
    my %contactInfo     = %{$userData{contactInfo}};
   
    #  Did they back up, edit their form, and resubmit before paying?
    my %contact = GetContactByFormID($userData{formID});
    if (%contact) {
      if ($contact{paid}) {
        warn("Dup form submission with payment already made");
      }
      else {
        TotallyDeleteContact($contact{id});
      }
    }


    #  Create Contact
    my %directory       = %{$userData{directory}};

    %contact = (
      conference_id     => $userData{conferenceID},
      post_id           => $post{id},
      form_id           => $userData{formID},

      firstName         => $contactInfo{firstName},
      lastName          => $contactInfo{lastName},
      address1          => $contactInfo{address1},
      address2          => $contactInfo{address2},
      city              => $contactInfo{city},
      stateProv         => $contactInfo{stateProv},
      country           => $contactInfo{country},
      postalCode        => $contactInfo{postalCode},
      phoneMobile       => $contactInfo{phoneMobile},
      phoneWork         => $contactInfo{phoneWork},
      phoneHome         => $contactInfo{phoneHome},
      email             => $contactInfo{email},

      attendance        => $userData{attendance},

      photoWaiver       => $userData{photoWaiver},
      reception         => $userData{reception},
      sundayBreakfast   => $userData{sundayBreakfast},
      softMember        => $userData{softMember},
      boardMember       => $userData{boardMember},
      chapterChair      => $userData{chapterChair},
      joeyWatson        => $userData{joeyWatson},
      joeyWatsonCode    => $userData{joeyWatsonCode},
      
      conferenceTotal   => $userData{conferenceTotal},
      softDonation      => $userData{softDonation},
      fundDonation      => $userData{fundDonation},
      grandTotal        => $userData{grandTotal},

      attendingClinics  => $userData{attendingClinics},
      needsClinicsTrans => $userData{needsClinicsTrans},
      clinicBusSeats    => $userData{clinicBusSeats},
      clinicTieDowns    => $userData{clinicTieDowns},
      numClinicMeals    => $userData{numClinicMeals},

      needsRembTrans    => $userData{needsRembTrans},
      numRembTrans      => $userData{numRembTrans},

      dir_phone         => $directory{phone},
      dir_email         => $directory{email},
      dir_city          => $directory{city},

      specialNeeds      => $userData{specialNeeds},

      paid              => $userData{paid},
      payerID           => $userData{payerID},
      paymentID         => $userData{paymentID},
      paymentToken      => $userData{paymentToken},
    );


    #  Clean up some of the fields to keep the db as consistent as possible

    if ($userData{attendance} =~ /workshops|picnic|balloon/i) {
      $contact{reception} = $FALSE;
      $contact{sundayBreakfast} = $FALSE;
      $contact{boardMember} = $FALSE;
      $contact{chapterChair} = $FALSE;
      $contact{joeyWatson} = $FALSE;

      $contact{attendingClinics} = $FALSE;
      $contact{needsClinicsTrans} = $FALSE;
      $contact{clinicBusSeats} = 0;
      $contact{clinicTieDowns} = 0;

      $contact{needsRembTrans} = $FALSE;
      $contact{numRembTrans} = 0;
    }

    if ($userData{attendance} =~ /workshops|balloon/i) {
      $contact{dir_phone} = $FALSE;
      $contact{dir_email} = $FALSE;
      $contact{dir_city} = $FALSE;
    }

    if ($userData{attendance} =~ /full/i) {

      if ($contact{attendingClinics}) {
        #  If using transportation, deduce the number of clinic meals needed...
        if ($contact{needsClinicsTrans}) {
          my $numSoftNoneaters = grep { $_->{peopleType} eq "SOFT Child"  &&  not $_->{eatsMeals} }  @{$userData{attendees}};
          $contact{numClinicMeals} = ($contact{clinicBusSeats} + $contact{clinicTieDowns}) - $numSoftNoneaters;
        }
      }
      else {
        #  Not attending clinics, so make sure db shows that
        $contact{clinicBusSeats} = 0;
        $contact{clinicTieDowns} = 0;
        $contact{numClinicMeals} = 0;
      }
    }

    unless ($contact{needsRembTrans}) {
      $contact{numRembTrans} = 0;           #  No transportation needed? Set bus seat count to 0
    };

    %contact = InsertContact(%contact);

    $successful = %contact;


    #  Create Attendees

    if ($userData{attendance} =~ /full|workshops|picnic/i  &&  $userData{attendees}) {

      foreach my $attendee_ref (@{$userData{attendees}}) {

        my %attendee = (
          contact_id          => $contact{id},
          firstName           => $attendee_ref->{firstName},
          lastName            => $attendee_ref->{lastName},
          peopleType          => $attendee_ref->{peopleType},

          welcomeDinner       => $attendee_ref->{welcomeDinner},

          rembOuting          => $attendee_ref->{rembOuting},
          rembLunch           => $attendee_ref->{rembLunch},
          chapterChairLunch   => $attendee_ref->{chapterChairLunch},

          # workshops
          # childCareSessions

          age                 => $attendee_ref->{age},
          sibOuting           => $attendee_ref->{sibOuting},
          sibShirtSize        => $attendee_ref->{sibShirtSize},

          birthDate           => $attendee_ref->{birthDate} || "",
          diagnosis           => $attendee_ref->{diagnosis},
          otherDiagnosis      => $attendee_ref->{otherDiagnosis},
          eatsMeals           => $attendee_ref->{eatsMeals},

          picnicTrans         => $attendee_ref->{picnicTrans},
          picnicTiedown       => $attendee_ref->{picnicTiedown},
        );

        #  Only children (not even SOFT Children) have ages
        $attendee{age} = 0  if ($attendee{peopleType} !~ /^(Child|Teen)$/i);     

        %attendee = InsertAttendee(%attendee);
        $successful &&= %attendee;


        #  Each attendee can have unique workshop settings...

        if ($userData{attendance} =~ /full|workshops/i  &&  $attendee{peopleType} =~ /Adult|Professional/i  &&  $attendee_ref->{workshops}) {

          #  From JavaScript: {  "1": "1n", "2": "2a", "3": "3c" }
          #  Loop over the keys which are session ID's and the values are the session choices

          my %workshop_choices = %{$attendee_ref->{workshops}};

          foreach my $sessionID (sort keys %workshop_choices) {

            my %workshop = (             
              contact_id      => $contact{id},
              attendee_id     => $attendee{id},
              session_id      => $sessionID,
              workshop_id     => $workshop_choices{$sessionID},
            );

            %workshop = InsertWorkshop(%workshop);
            $successful &&= %workshop;
          }
        }

        #  Each Child (11 or under) and all SOFT Children can have daycare

        if ($userData{attendance} =~ /full/i  &&
            ($attendee{peopleType} =~ /^SOFT Child$/i  ||  $attendee{peopleType} =~ /^Child$/i)  &&  
            $attendee_ref->{childCareSessions}) {

          #  From JavaScript: {  "1": "1n", "2": "2a", "3": "3c" }
          #  Loop over the keys which are session ID's and the values are the session choices

          my %childcare_choices = %{$attendee_ref->{childCareSessions}};

          foreach my $sessionID (sort keys %childcare_choices) {

            my %childcare = (             
              contact_id      => $contact{id},
              attendee_id     => $attendee{id},
              session_id      => $sessionID,
              needed          => $childcare_choices{$sessionID},
            );

            %childcare = InsertChildCare(%childcare);
            $successful &&= %childcare;
          }
        }

      }
    }


    #  Create SOFT Angels

    if ($userData{softAngels}) {

      foreach my $softangel_ref (@{$userData{softAngels}}) {

        my %softangel = (
          contact_id          => $contact{id},
          firstName           => $softangel_ref->{firstName},
          lastName            => $softangel_ref->{lastName},

          birthDate           => $softangel_ref->{birthDate} || "",
          deathDate           => $softangel_ref->{deathDate} || "",
          diagnosis           => $softangel_ref->{diagnosis},
          otherDiagnosis      => $softangel_ref->{otherDiagnosis},
        );

        %softangel = InsertSoftAngel(%softangel);
        $successful &&= %softangel;
      }

    }


    #  Create Clinics

    if ($userData{attendance} eq "full"  &&  $contact{attendingClinics}) {

      my $position = 0;

      foreach my $title (@{$userData{clinics}}) {

        my %clinic = (
          contact_id  => $contact{id},
          position    => $position++,
          title       => $title
        );

        %clinic = InsertClinic(%clinic);
        $successful &&= %clinic;
      }

    }


    #  Create Shirts

    if ($userData{attendance} =~ /full|picnic/i  &&  $userData{shirtsOrdered}) {

      foreach my $shirt_ref (@{$userData{shirtsOrdered}}) {

        my %shirt = (
          contact_id  => $contact{id},
          shirt_id    => $shirt_ref->{shirtID},
          shirtSize   => $shirt_ref->{size},
          quantity    => $shirt_ref->{quantity},
        );

        %shirt = InsertShirt(%shirt);
        $successful &&= %shirt;
      }

    }




    $contact{grandTotal} = trim($contact{grandTotal});

    $userData{summary} =~ s/ /&nbsp;/g;
    $userData{invoice} =~ s/ /&nbsp;/g;


    my $message = dedent(qq~

      Hello $contact{firstName},

      Thank you for registering for this year's SOFT conference!

    ~);

    if ($contact{paid}) {
      $message += dedent(qq~
        Below is a summary of exactly what you signed up for, along with the paid
        invoice for \$$contact{grandTotal}.

        Your payment confirmation ID is: $contact{paymentID}
      ~);
    }
    elsif ($contact{grandTotal} > 0) {      #  Not paid and grand total > 0 ==> Send check
      $message += dedent(qq~
        Below is a summary of exactly what you signed up for, along with an
        invoice for your check payment. To finish your registration, please send
        a check for \$$contact{grandTotal} to:

            Support Organization for Trisomy
            2982 South Union St.
            Rochester, NY  14624

        Please include your invoice number with your check:  $contact{form_id}
      ~);
    }
    else {        #  Must be fully comp'd
      $message += dedent(qq~
        Thank you for registering for this year's SOFT conference! Below is a 
        summary of exactly what you signed up for.
      ~);
    }

    $message += dedent(qq~

      Here are a few more suggestions to help you get ready for the conference...
    ~);

    if (!$userData{softMember}) {
      $message += dedent(qq~

        Please consider becoming a SOFT member. Registration is free. For
        more information, click on this link:

             <a target="_blank" rel="noopener noreferrer" href="https://trisomy.org/soft-membership-information/">Become a Member of SOFT</a>
      ~);
    }

    $message += dedent(qq~

      *  Submit family and "SOFT" child photos. We invite you to share a family 
         photo and a photo of your SOFT Child for the conference directory or
         to be displayed during the conference. Submit photos to:

              <a href="mailto:trisomyawareness\@gmail.com">trisomyawareness\@gmail.com</a>

      *  Submit your photos or short video for the Annual "SOFT Friends" Video.
         Choose your favorite photo of your SOFT Child and submit for the Annual
         "SOFT Friends" video created in memory of Kari Holladay. Photos can be
         submitted here:

              <a href="https://trisomy.org/kris-holladay-soft-video/" target="_blank" rel="noopener noreferrer">Submit to "SOFT Friends"</a>
    ~);

    if ($userData{attendance} =~ /full|workshops/i) {
      $message += dedent(qq~

        *  Reserve your hotel room at the conference hotel:

                Ann Arbor Marriott Ypsilanti at Eagle Creek
                1275 South Huron St.
                Ypsilanti, MI, 48197
                Phone: 734-487-2000

           The room rate is \$140 per night. Click here to book a room using the special SOFT rate:

                <a target="_blank" rel="noopener noreferrer" href="https://www.marriott.com/meeting-event-hotels/group-corporate-travel/groupCorp.mi?resLinkData=Support%20Organization%20for%20Trisomy%5Edtwys%60sotsota%7Csotsotd%60140.00%60USD%60false%604%607/16/19%607/21/19%606/24/19&app=resvlink&stop_mobi=yes">Book Hotel Room</a>

           Our rate code is "SOFT".
      ~);
    }

    $message += dedent(qq~

      *  Donate items for the auction. SOFT's Annual Auction will be held Saturday.
         There will be both a silent and live auction. Your auction donation items
         can be sent to:

              Kayse Whitaker
              619 William St.
              Kalamazoo, MI 49007

      *  Set up your fund-raising page for the Stroll for Hope.

              <a href="http://www.firstgiving.com/softstrollforhope/2019-SOFT-Stroll-for-Hope" target="_blank" rel="noopener noreferrer">Stroll for Hope"</a>

      *  Consider sponsoring an event/item for the conference:

              <a href="https://trisomy.org/conference-wish-list-2019-ann-arbor-2/" target="_blank" rel="noopener noreferrer">Sponsor an Event/Item"</a>


      Thanks again!


      ----------
    ~);

    $message += "$userData{summary}\n\nInvoice:\n\n$userData{invoice}\n\nInvoice #: $contact{form_id}";
    $message += "Payment Confirmation ID: $contact{paymentID}"  if ($contact{paid});

    $message =~ s/\n\n\n+/\n\n/g;
    $message =~ s/\n/<br>/g;

    my $htmlEmail = qq~
    <!DOCTYPE html>
    <html>
        <body style="font-family: monospace, monospace; font-size: 14px;">
            $message
        </body>
    </html>
    ~;

    my $from = '"SOFT Registration" <invoices@softconf.org>';
    my $to = "\"$contact{firstName} $contact{lastName}\" <$contact{email}>";
    my $subject = "SOFT Conference Invoice for $contact{firstName} $contact{lastName}";

    if ($successful) {
     
      my $message = MIME::Lite->new(
        From     => $from,
        To       => $to,
        Cc       => 'support@softconf.org',
        Subject  => $subject,
        Type     => 'text/html',
        Encoding => 'quoted-printable',
        Data     => $htmlEmail
      );
      
      $message->send();

    }
    else {
      my $message = MIME::Lite->new(
        From     => $from,
        To       => 'support@softconf.org',
        Subject  => "Failed: Not registered for SOFT Conference",
        Type     => "text/html",
        Encoding => "quoted-printable",
        Data     => $htmlEmail
      );
      
      $message->send();
    }

  }


  my %msg = ( 
    message  => $successful ? "Contact inserted" : "Contact NOT inserted!",
  );

  print "Access-Control-Allow-Origin: *\n";
  print "Access-Control-Allow-Methods: GET,POST,OPTIONS\n";
  print "Access-Control-Allow-Headers: X-Requested-With\n";
  print "Content-type: text/html\n\n";
  print $json->encode(\%msg);
}
else {
    print "Access-Control-Allow-Origin: *\n";
    print "Access-Control-Allow-Methods: GET,POST,OPTIONS\n";
    print "Access-Control-Allow-Headers: X-Requested-With\n";
    print "Content-type: text/html\n\n";
    print "No params...";
}



#------------------------------------------------
# Strip whitespace from both ends of a string
#------------------------------------------------

sub trim {
    my $text = shift;

    $text = ""  if (!defined($text));

    $text =~ s/^\s+//;
    $text =~ s/\s+$//;

    return $text;
}


#------------------------------------------------
# Remove leading indentation from a string
#------------------------------------------------

sub dedent {
    my @lines = split /\n/, shift;

    shift @lines  if ($lines[0] =~ /^\s*$/);    #  Ignore first line if blank

    my $indent = 1000;                          #  Assume absurd indentation
    foreach my $line (@lines) {
        next if ($line =~ /^\s*$/);             #  Don't consider blank lines

        if ($line =~ /^(\s*)/) {                #  Is this line indented?
            my $this_indent = length($1);
            $indent = $this_indent  if ($this_indent < $indent);
        }
        else {
            $indent = 0;
        }
    }

    return join "\n", map { substr($_, $indent) } @lines;
}


1;
