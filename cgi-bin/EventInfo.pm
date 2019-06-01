package EventInfo;

use strict;
use warnings;

use Settings;
use Globals;
use Database;

use Exporter 'import';
our @EXPORT = qw(
    get_workshop_info
    get_clinic_info
    get_childcare_info
    get_shirttypes_info
);


#----------------------------------------------------------------------------------------------------
#  Return an array of workshop sessions
#
#  my @workshopsessions = get_workshop_info($conference_id);


sub get_workshop_info {
    my $conference_id = shift || "";

    my @workshopSessions = (
        {
            id        => 1,
            name      => "Session 1: 9am-10am",
            workshops => [
                {
                    id          => "1n",
                    title       => "None",
                    moderator   => "",
                    description => ""
                },
                {
                    id          => "1a",
                    title       => "Cardiac Surgery in T18, T13, and related disorders",
                    moderator   => "Dr. James Hammel",
                    description => ""
                },
                {
                    id          => "1b",
                    title       => "Self Care",
                    moderator   => "",
                    description => ""
                },
                {
                    id          => "1c",
                    title       => "Wheelchair and seating",
                    moderator   => "Julie Hawkins, Mike Barner",
                    description => ""
                },
                {
                    id          => "1d",
                    title       => "Simon's law",
                    moderator   => "Sheryl Crosier",
                    description => ""
                },

            ]
        },
        {
            id        => 2,
            name      => "Session 2: 10:10am-11:10am",
            workshops => [
                {
                    id          => "2n",
                    title       => "None",
                    moderator   => "",
                    description => ""
                },
                {
                    id          => "2a",
                    title       => "The TRIS Project",
                    moderator   => "Debbie Bruns",
                    description => ""
                },
                {
                    id          => "2b",
                    title       => "Art Party",
                    moderator   => "Denise Ferber",
                    description => ""
                },
                {
                    id          => "2c",
                    title       => "Wheelchair and seating",
                    moderator   => "Julie Hawkins, Mike Barner",
                    description => ""
                },
                {
                    id          => "2d",
                    title       => "Crafting Your Story",
                    moderator   => "Terre Krotzer",
                    description => ""
                },
            ]
        },
        {
            id        => 3,
            name      => "Session 3: 11:20am-12:20pm",
            workshops => [
                {
                    id          => "3n",
                    title       => "None",
                    moderator   => "",
                    description => ""
                },
                {
                    id          => "3a",
                    title       => "Genetics",
                    moderator   => "Dr. John Carey",
                    description => ""
                },
                {
                    id => "3b",
                    title       => "Trisomy 18, 13. Preventing Seizures, Light Sensitivity and Headaches",
                    moderator   => "Dr. Steve Cantrell",
                    description => ""
                },
                {
                    id          => "3c",
                    title       => "Wheelchair and seating",
                    moderator   => "Julie Hawkins, Mike Barner",
                    description => ""
                },
                {
                    id          => "3d",
                    title       => '"I am" =>  The Journey',
                    moderator   => "Martiana Biagi",
                    description => ""
                },
            ]
        },
        {
            id        => 4,
            name      => "Session 4: 1:40pm-3:25pm",
            workshops => [
                {
                    id          => "4n",
                    title       => "None",
                    moderator   => "",
                    description => ""
                },
                {
                    id          => "4a",
                    title       => "Moms Only - Sharing Workshop",
                    moderator   => "",
                    description => ""
                },
                {
                    id          => "4b",
                    title       => "Dads Only - Sharing Workshop",
                    moderator   => "",
                    description => ""
                },
            ]
        },
    );

    return @workshopSessions;
}




#----------------------------------------------------------------------------------------------------
#  Return an array of hash references to child care sessions
#
#  my @childcareSessions = get_childcare_info($conference_id);

sub get_childcare_info {
    my $conference_id = shift || "";

    my @childCareSessions = (
        {
            id => 'cc1',
            title => "Wednesday 8am-5:30pm",
            pre5Only => $FALSE,
            boardOnly => $TRUE,
        },
        {
            id => 'cc2',
            title => "Thursday 8am-2pm",
            pre5Only => $FALSE,
            boardOnly => $FALSE,
        },
        {
            id => 'cc3',
            title => "Thursday 2pm-4:30pm",
            pre5Only => $FALSE,
            boardOnly => $FALSE,
        },
        {
            id => 'cc4',
            title => "Friday 11:45am-5pm",
            re5Only => $FALSE,
            boardOnly => $FALSE,
        },
    );

    return @childCareSessions;
}



#----------------------------------------------------------------------------------------------------
#  Return an array of hash references to shirt types
#
#  my @shirtTypesInfo = get_shirttypes_info($conference_id);

sub get_shirttypes_info {
    my $conference_id = shift || "";

    my @shirtTypesInfo = (
        {
            id => "shirt1",
            description => "Basic Unisex Tee. \$20 each.",
            cost => 20,
            sizes => [
                'Youth - S',  
                'Youth - M',
                'Youth - L',
                'Adult - S',
                'Adult - M',
                'Adult - L',
                'Adult - XL',
                'Adult - XXL',
                'Adult - 3XL',
                'Adult - 4XL',
                'Adult - 5XL',
            ]
        },
        {
            id => "shirt2",
            description => "Hoodies in Adult sizes only. \$35 each.",
            cost => 35,
            sizes => [
                'Adult - S',
                'Adult - M',
                'Adult - L',
                'Adult - XL',
                'Adult - XXL',
                'Adult - 3XL',
                'Adult - 4XL',
                'Adult - 5XL',
              ]
        },
    );

    return @shirtTypesInfo;
}




#----------------------------------------------------------------------------------------------------
#  Return an array of clinic titles -- that's all we're doing so far...
#
#  my @clinicInfo = get_info_info($conference_id);

sub get_clinic_info {
    my $conference_id = shift || "";

    my @clinicNames = (
        'Orthopedic',
        'Otolaryngology',
        'GI',
        'Pulmonology',
        'Genetics',
        'Immuno-Hematology',
        'Infectious Disease',
    );

    return @clinicNames;
}



1;