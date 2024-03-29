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
my $hash;

my $successful = 0;

if ($q->param)            #  fetches the names of the params as a list
{
  my $data = $q->param('POSTDATA');

  my %post = (
    conference_id => $CONFERENCE_ID,
    json => $data
  );

  %post = InsertPost(%post);

  if (%post) {

    my %userData        = %{$json->decode($data)};
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
      conference_id     => $CONFERENCE_ID,
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

    # warn("Contact email is '" . $contactInfo{email} . "'");

    # my $to = 'stormdevelopment@gmail.com';
    # # my $from = 'invoice@softconf.org';
    # my $from = 'invoice@greatday.biz';
    # my $subject = 'Registered for SOFT Conference';
     
    # open(MAIL, "|/usr/sbin/sendmail -t -oi -oem");
     
    # # Email Header
    # print MAIL "From: $from\n";
    # print MAIL "To: $to\n";
    # print MAIL "From: $from\n";
    # print MAIL "Subject: $subject\n\n";
    # print MAIL "Test message";

    # warn(close(MAIL));
    # warn "Email Sent Successfully\n";


    #     my $htmlEmail = qq~
    #       <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
    #       <html>
    #       <head>
    #       <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    #       </head>
    #       <body>
    #           $userData{invoice}
    #       </body>
    #       </html>
    #     ~;



    my $from = "SOFT Registration <invoice\@greatday.biz>";
    # my $from = "SOFT Registration <invoices\@softconf.org>";

    my $message = $userData{summary} . "\n". $userData{invoice};
    $message =~ s/\n/<br>/g;

    my $htmlEmail = qq~
    <!DOCTYPE html>
    <html>
        <body>
            $message
        </body>
    </html>
    ~;




# MIME::Lite->send('smtp','smtp.gmail.com', SSL=>1, AuthUser=>"stormdevelopment\@gmail.com", AuthPass=>"Bigfoot3600!", DEBUG=>1);

    if ($successful) {
     
      my $message = MIME::Lite->new(
        From     => $from,
        To       => $contactInfo{email},
        Cc       => "stormdevelopment\@gmail.com",
        Subject  => "Registered for SOFT Conference",
        Type     => "text/html",
        Encoding => "quoted-printable",
        Data     => $htmlEmail
      );
      
      $message->send();

    }
    else {
      my $message = MIME::Lite->new(
        From     => $from,
        To       => $contactInfo{email},
        Cc       => "stormdevelopment\@gmail.com",
        Subject  => "Failed: Registered for SOFT Conference",
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

  print "Content-type: text/html\n\n";
  print $json->encode(\%msg);
}
else {
    print "Content-type: text/html\n\n";
    print "No params...";
}

1;
