package Interface;

use strict;
use warnings;

use Exporter 'import';
our @EXPORT = qw(
    print_header
    print_footer
    print_navigation
    print_reg_menu
    print_report_menu
);


#------------------------------------------------
#  Print the standard header
#------------------------------------------------

sub print_header {
    my $head = shift || "";

    print "Content-type: text/html\n\n";
    print qq~
        <!DOCTYPE html>
        <meta http-equiv="Content-Language" content="en-us">
        <meta http-equiv="Content-type" content="text/html;charset=UTF-8">
        <html>
           <head>
              <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
              <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css">
              <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
              <script src="https://softconf.org/js/softreg.js"></script>
              <link rel="stylesheet" href="https://softconf.org/css/App.css" type="text/css" />

              $head
           </head>
           <body class="admin-body">
              <div class="body-boundary">
                 <div class="logo-header">
                    <div>
                       <img
                        src="/img/softlogo.png"
                        height="75px"
                        alt="Soft Logo"
                       />
                    </div>
                    <div>
                       <h1>2019 Conference Registration</h1>
                    </div>
                 </div>
                 <div class="page-boundary">
    ~;
}



#------------------------------------------------
#  Print the standard footer
#------------------------------------------------

sub print_footer {
    my $footer = shift || "";

    print qq~
                    $footer
                 </div>
              </div>
           </body>
        </html>
    ~;
}



#------------------------------------------------
#  Create our tabbed navigation panel
#------------------------------------------------

sub print_navigation {
  my $active = shift;

  my @tab_names = (
      registrations => "View Registrations",
      reports       => "View Reports",
      form          => "Edit Form Information",
  );

  print qq~
    <div id="admin-nav-bar">
  ~;

  while (@tab_names) {
      my $tab = shift @tab_names;
      my $tab_title = shift @tab_names;

      my $class = ($tab eq $active) ? "admin-btn-active" : "admin-btn";
      print qq~<a class="$class" href="/cgi-bin/admin.cgi?tab=$tab">$tab_title</a>~;      #  Don't turn into indented block -- the newline causes cursor flashing
  }
  print qq~
    </div>
  ~;
}



#------------------------------------------------
#  Drop-down menu for registrations
#------------------------------------------------

our @select_registrations = (
    all       => "All Registrations",
    full      => "Full Conference",
    workshops => "Workshops-only",
    picnic    => "Picnic-only",
    balloon   => "Balloon-only",    
    unpaid    => "Unpaid Registrations",
    disabled  => "─────────────────────────",
    abandoned => "Abandoned Registrations",
);


sub print_reg_menu {
  my $selected = shift;

  print qq~<select name="registration" id="registration" style="display: none;">~;
  print select_options_tmpl($selected, @select_registrations);
  print qq~</select>~;
}



#------------------------------------------------
#  Drop-down menu for reports
#------------------------------------------------

our @select_reports = (
    select_rep    => "Select Report...",
    welcome_rep   => "Welcome Dinner",
    workshop_rep  => "Workshop Attendance",
    picnic_rep    => "Picnic Attendance",
    sibshirts_rep => "Sibling Shirts",
    softwear_rep  => "SOFT Wear",    
    notes_rep     => "Special Notes",
    donation_rep  => "Donations",
);


sub print_report_menu {
  my $selected = shift;

  print qq~<select name="reports" id="reports" style="display: none;">~;
  print select_options_tmpl($selected, @select_reports);
  print qq~</select>~;
}



#------------------------------------------------------------------------------------
#  Take an array of "value => Display text" pairs with the values in the even array
#  positions and the display text in the corresponding odd positions. Returns
#  the HTML code with all the options for a <select> node with the default value
#  selected. This only creates the <option> tags -- it does not include the 
#  <select>..<select> tags.
#
#      my @states = (
#          "AK" => "Alaska",
#          "AL" => "Alabama",
#          ...,
#      );
#
#      my $options = select_options_tmpl("NY", @states);
#      print "<select ...>$options</select>";

sub select_options_tmpl {
    my $default = shift || "";
    my @options = @_;

    my $html = "";

    while (@options) {
        my $value = shift @options;
        my $display_text = shift @options;
        my $selected = ($default eq $value) ? 'selected="select"' : "";

        my $disabled = ($value eq "disabled") ? 'disabled' : "";

        $html .= qq{<option value="$value" $selected $disabled>$display_text</option>\n};
    }

    return $html;
}



#------------------------------------------------------------------------------------
#  Convert a simple array of strings to the array format that select_options_tmpl() 
#  expects to get. You would use this when the values and display text are identical:
#
#      my @fontnames = ( "Arial, "Bermuda", ..., "Zelda" );
#
#      $html = select_options_tmpl("Times New Roman", to_select_options(@fontnames));

sub to_select_options {
    return map { ($_, $_) } @_;
}


1;
