#
#  To create these tables, use the following MySQL commands:
#
#  shell> mysql -u softconf -pTrisomy2019!
#
#
#  mysql> show databases;               #  View existing databases
#  mysql>
#  mysql> use softconf;                 #  Switch to our database
#  mysql>
#  mysql> source mysql_tables.sql;      #  Load this file, destroying existing data
#  mysql>
#  mysql> show tables;                  #  You should see the tables below
#  mysql>
#  mysql> describe accounts;            #  View format of each one
#  mysql> etc...
#  mysql>
#  mysql> exit;
#
#
#
#  To add these tables, issue this command from the mysql prompt:
#
#  mysql> source /var/www/vhosts/softconf.org/httpdocs/cgi-bin/mysql_tables.sql

#  shell> mysql -u softconf -p softconf < mysql_tables.sql



DROP TABLE IF EXISTS posts;
CREATE TABLE posts
(
    id              INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    date_created    DATETIME NOT NULL,
    conference_id   TINYTEXT,               #  eg. "2019" (Might have text in it at some point)
    json            TEXT
);




DROP TABLE IF EXISTS contacts;
CREATE TABLE contacts
(
    id                  INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    form_id             VARCHAR(30),

    firstName           VARCHAR(30),
    lastName            VARCHAR(30),
    address1            VARCHAR(50),
    address2            VARCHAR(50),
    city                VARCHAR(30),
    stateProv           VARCHAR(30),
    country             VARCHAR(30),
    postalCode          VARCHAR(30),
    phoneMobile         VARCHAR(20),
    phoneWork           VARCHAR(20),
    phoneHome           VARCHAR(20),
    email               VARCHAR(50),

    attendance          VARCHAR(20),                #  full, workshops, picnic, balloon  (all lowercase)

    photoWaiver         TINYINT DEFAULT FALSE,
    reception           TINYINT DEFAULT FALSE,
    sundayBreakfast     TINYINT DEFAULT FALSE,
    boardMember         TINYINT DEFAULT FALSE,
    chapterChair        TINYINT DEFAULT FALSE,
    joeyWatson          TINYINT DEFAULT FALSE,

    attendingClinics    TINYINT DEFAULT FALSE,
    clinicTieDowns      TINYINT DEFAULT 0,

    dir_phone           TINYINT DEFAULT FALSE,      #  Directory
    dir_email           TINYINT DEFAULT FALSE,
    dir_city            TINYINT DEFAULT FALSE,

    summary             VARCHAR(10000),
    paid                TINYINT DEFAULT FALSE,
    transactionCode     VARCHAR(255)
);



DROP TABLE IF EXISTS attendees;
CREATE TABLE attendees
(
    id                  INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    contact_id          INT(10) UNSIGNED NOT NULL
    firstName           VARCHAR(30),
    lastName            VARCHAR(30),
    peopleType          VARCHAR(15),

    welcomeDinner       VARCHAR(30),                #  Meal choice

    // Adults
    rembOuting          TINYINT DEFAULT FALSE,      #  Attending the remembrance outing?
    rembLunch           VARCHAR(30),                #  Meal choice. Name of meal
    chapterChairLunch   TINYINT DEFAULT FALSE,      #  Attending the luncheon?

    // Child
    age                 TINYINT,
    sibOuting           TINYINT DEFAULT FALSE,
    shirtSize           VARCHAR(30),                #  Sib outing shirt size

    // SOFT Child
    dateOfBirth         VARCHAR(15),                #  MM/DD/YY  format
    diagnosis           VARCHAR(20),                #  If "Other" then use "otherDiagnosis"
    otherDiagnosis      VARCHAR(30),
    eatsMeals           TINYINT DEFAULT FALSE,

    // Picnic
    picnic              TINYINT DEFAULT FALSE,      #  Needs transportation to the picnic?
    picnicTiedown       TINYINT DEFAULT FALSE
);



DROP TABLE IF EXISTS softangels;
CREATE TABLE softangels
(
    id                  INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    contact_id          INT(10) UNSIGNED NOT NULL
    firstName           VARCHAR(30),
    lastName            VARCHAR(30),

    dateOfBirth         VARCHAR(15),                #  MM/DD/YY  format
    dateOfDeath         VARCHAR(15),                #  SOFT angels only 
    diagnosis           VARCHAR(20),                #  If "Other" then use "otherDiagnosis"
    otherDiagnosis      VARCHAR(30)
);



DROP TABLE IF EXISTS clinics;
CREATE TABLE clinics
(
    id                  INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    contact_id          INT(10) UNSIGNED NOT NULL,
    order               TINYINT,
    title               VARCHAR(50)
);



DROP TABLE IF EXISTS workshops;
CREATE TABLE workshops
(
    id              INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    contact_id      INT(10) UNSIGNED NOT NULL,
    attendee_id     INT(10) UNSIGNED NOT NULL,
    session_id      VARCHAR(20),
    workshop_id     VARCHAR(20)                     #  Chosen workshop for session
);



DROP TABLE IF EXISTS childcare;
CREATE TABLE childcare
(
    id              INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    contact_id      INT(10) UNSIGNED NOT NULL,
    attendee_id     INT(10) UNSIGNED NOT NULL,
    session_id      VARCHAR(20),
    title           VARCHAR(30)
);



DROP TABLE IF EXISTS shirts;
CREATE TABLE shirts
(
    id              INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    contact_id      INT(10) UNSIGNED NOT NULL,
    shirt_id        VARCHAR(30),
    shirtSize       VARCHAR(30),
    quantity        TINYINT,
    cost            VARCHAR(10)                     #  "15.50", etc
);