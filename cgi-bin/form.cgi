#!/usr/bin/perl

use strict;
use warnings;

use Settings;
use Globals;
use Database;

use CGI;
use JSON::PP;

my $json = JSON::PP->new->ascii->pretty->allow_nonref;

my $q = CGI->new;
my $hash;

if ($q->param)            #  fetches the names of the params as a list
{
  my $data = $q->param('POSTDATA');

  my %post = (
    conference_id => CONFERENCE_ID,
    json => $data
  );

  %post = InsertPost(%post);

  $hash = $json->decode($data);

  my %msg = ( 
        message  => "data received just fine",
        length   => length($q->param('POSTDATA')),
        json     => $data,
        summary  => $hash->{summary},
        settings => 1,
        globals  => 1,
        database => 1,
        posthash => 1,
        post_id  => $post{id}
    );
  
  DeletePost(1);
  DeletePost(2);
  
  print "Content-type: text/html\n\n";
  print $json->encode(\%msg);
}
else {
    print "Content-type: text/html\n\n";
    print "No params...";
}

1;
