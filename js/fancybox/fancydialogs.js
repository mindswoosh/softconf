//------------------------------------------------------------------------------------------
//
//  Fancybox replacements for JavaScript's alert() and confirm() functions.
//
//  One significant difference between JavaScript's alert() and confirm() functions
//  is that they block script execution while they are displayed whereas these
//  replacements do not and that means you have to use them a bit differently.
//  They are not simple drop in replacements, but they are pretty close
//
//  Note: if you're calling these from inside an iframe, include this script in
//  both the iframe and all the parents -- the script will invoke the top-most
//  parent so the dialog will appear fullscreen and not just in the current frame.
//
//  Also, if you're calling these functions and they seem to be getting ignored, it's
//  almost certainly because you've forgotten to include this script.



//------------------------------------------------------------------------------------------
//  Use fancyRedirect(callback, title, message, buttonName, width) to display a
//  dialog which redirects to the specified callback/URL when the "OK" button is
//  clicked. This is a smart function and will take the values passed to it to create
//  consistently formatted dialog boxes.
//
//  Here are the dynamic formatting changes that are made:
//
//  TITLE TEXT: The first sentence of the title will be in green. Any additional 
//  text will be in black.
//
//  In the title field only, text surrounded by the "`" character will be 
//  displayed in black and surrounded with smart double-quotes for contrast. E.g.:
//
//      Delete Link `$link`? 
//
//  ...will display the `$link` part in smart double-quotes and in black even if
//  it is contained within the green part of the title.
//
//  MESSAGE TEXT: In the message, any text surrounded by "`" will be replaced with
//  smart double-quotes.
//
//  BOLDING: Message text surrounded with *'s will be made green and bold.
//
//  ALL TEXT: If the "`" character is found in the middle of word, it will be replaced 
//  with the single smart quote character. E.g., "don`t" becomes "don't"
//
//  OPTIONS:
//  The message, buttonName, and width parameters are optional. If no buttonName is 
//  supplied, the word "OK" is used. The width will be computed dynamically unless it
//  is explicitly passed in.
//
//  The "callback" function will be called only if the OK button is clicked. If
//  you don't want the OK button to do anything but close the dialog (ie, like an
//  alert), pass null or the empty string for the callback value.
//


//  NOTE: fancyRedirect does NOT invoke parent versions. It always executes in the
//  current frame. Use fancyConfirmCallback() for the parent-aware version.
//
//  FUTURE: If we ever want to support the Cancel button, we could pass in an
//  object as the first parameter and grab both the OK and Cancel information
//  from the object. This approach would allow backwards compatibility.

function fancyRedirect(callback, title, message, buttonName, width) {

    if (!message) message = '';

    if (!buttonName) buttonName = "OK";

    if (!width) {

        //  Find the longest line of the message to auto-compute width
        var lines = message.split("<br>");
        var longest_line = '';
        for (l of lines) {
   
            //  Remove <center>, <a>, and <font> tags since they show up a lot. We 
            //  should really remove all tags, but that would rarely be necessary 
            //  or meaningful
            l = l.replace(/<\/?center>/ig, '');    
            l = l.replace(/<\/?a[^>]*?>/ig, '');
            l = l.replace(/<\/?font[^>]*?>/ig, '');

            if (l.length > longest_line.length) {
                longest_line = l;
            }
        }

        //  width: min = 300, max <= 650
        var width = Math.max(300, Math.min(650, longest_line.length*9));

        //  Expand width if it looks like the title won't fit on one line
        width = Math.max(width, title.length*11 + 20);
    }


    //  Single apostrophes are pain to insert in Javascript embedded in Perl so allow
    //  the "`" character in place of an apostrophe between two letters.

    title   = title.replace(/(\w)`(\w)/g, "$1&rsquo;$2");
    message = message.replace(/(\w)`(\w)/g, "$1&rsquo;$2");

    //  Text surrounded with *'s is made green and bold
    message = message.replace(/(^|\W)\*(\S[^*]*?)\*/g, '$1<font color=green><b>$2</b></font>');

    //  Because using double quotes in HTML markup is a pain, we use the grave (`) symbol
    //  instead and do a replacement before displaying the dialog. This needs to work with
    //  cases like:  *word* , `*word*`  , and  *`word`*  ...

    message = message.replace(/(^|\W)`(\w|<)/g, '$1&ldquo;$2');
    message = message.replace(/(\S)`/g, '$1&rdquo;');

    //  Make sure there are two spaces between sentences to look better
    title = title.replace(/([!.?])\s+(\w)/, "$1&nbsp; $2");

    //  The first sentence in the title is displayed in green. the rest black
    title = title.replace(/(.*?([!.?]|$))(.*)/, '<font class="subheadg">$1</font><font class="subhead">$3</font>');

    //  Double-quote and blacken any text surrounded by "`"
    title = title.replace(/`(.+?)`/g, '<font class="subhead">&ldquo;$1&rdquo;</font>');

    //  Take the macro "FAQ(#, title)" and create a nicely formatted linkable FAQ
    message = message.replace(/FAQ\((\d+)\s*,\s*([^)]+?)\)/g, '<img src="/images/user/faqpage.gif"> &nbsp;<a href="/user/faqs.cgi?faq=$1" target="_blank">$2</a>');

    //  Take the macro "LINK(url, title)" and create an external link with a document icon 
    message = message.replace(/LINK\(\s*(\S+?)\s*,\s*([^)]+?)\)/g, '<img src="/images/user/faqpage.gif"> &nbsp;<a href="$1" target="_blank">$2</a>');

    //  Take the macro "TOOL(/url, title)" and create an inline link, typically to a menu item
    message = message.replace(/INLINE\(\s*(\S+?)\s*,\s*([^)]+?)\)/g, '<a href="$1" target="_blank">$2</a>');

    //  Take the macro "IMG(filename)" and create the <img> tag
    message = message.replace(/IMG\(\s*([^)]+?)\)/g, '<img src="//cdn.clickmagick.com/images/user/$1" style="vertical-align: baseline;">');

    var instance = Date.now();      //  Make dialogs nestable

    jQuery.fancybox({
        html:     true,
        topRatio: 0.25,
        smallBtn: "auto",
        content:  '<div style="width:' + width + 'px;">' +
                     '<div style="text-align: center;">' + title + '</div>' + 
                     ((message != '') ? ('<div style="text-align: left; padding: 20px 16px 6px 16px;">' + message + '</div>') : '') + 
                     '<div style="text-align: center; margin: 20px 0 10px 0;">' +
                        '<input id="fancyConfirm_ok' + instance + '" class="button button-rounded button-action button-small" type="button" value="' + buttonName + '">' + 
                     '</div>' + 
                  '</div>'
    });


    $('#fancyConfirm_ok' + instance).on('click', function() {
        if (callback) {
            callback();
        }
        jQuery.fancybox.close();
    });
}



//------------------------------------------------------------------------------------------
//  Use fancyConfirmCallback() if you need to do something fancier than a simple
//  redirect to a URL.
//
//  The message, buttonName, and width parameters are all optional

function fancyConfirmCallback(callback, title, message, buttonName, width) {

	//  If we're in a frame, call the parent version to get full screen confirm
	if (window.frameElement != null) {
		parent.fancyConfirmCallback(callback, title, message, buttonName, width);
	} else {
		fancyRedirect(callback, title, message, buttonName, width);
	}

    return false;
}



//------------------------------------------------------------------------------------------
//  Use fancyConfirmURL(url, title, message, buttonName, width) to display a
//  dialog in the onclick handler of an anchor tag.
//  
//  You can use this version of confirm() in two ways with onclick handlers, one where
//  you grab the URL from the href value of the tag, or the other where you don't specify 
//  an href value and simply include the URL in the call itself:
//
//     href="http://..." onclick="return fancyConfirmURL(this.href, ...)"
//
//     onclick="return fancyConfirmURL('http://...', ...)"     
//
//  Because fancyConfirmURL() is asynchronous, it will alway immediately return
//  false and only redirect (later) when the user clicks on the OK button.
//
//  The message, buttonName, and width parameters are all optional


function fancyConfirmURL(url, title, message, buttonName, width) {

    function redirect() {
        window.location.href = url;
    }

    fancyConfirmCallback(redirect, title, message, buttonName, width);
    return false;
}



//------------------------------------------------------------------------------------------
//  fancyConfirmSubmit(id, title, message, buttonName, width) displays a
//  confirmation message and submits a form when the OK button is clicked.
//  
//  Pass in the jQuery selector of the form to be submitted. The most common
//  selector will simply be "this" since that indicates the current form.
//
//  Note: If the "name" or "id" of the form is "submit", that confuses jQuery
//  so make sure that neither the "name" nor "id" is "submit".
//
//  Also, when jQuery submit()s a form, the onsubmit handlers on the form
//  are not executed because it's assumed that the code calling submit() IS 
//  the handler. This means that if you use fancyConfirmSubmit() in the
//  onclick handler of a button, when fancyConfirmSubmit() does a submit(),
//  any onsubmit handler on the form itself will be ignored. In other words,
//  don't use fancyConfirmSubmit() in the onclick handler of a form element
//  if the form also has an onsubmit handler.
//
//  The message, buttonName, and width parameters are all optional

function fancyConfirmSubmit(selector, title, message, buttonName, width) {

    function submitCodeForm() {
    	//  Don't delete the "[0]"" below or you'll introduce a bug!
    	//  See https://stackoverflow.com/questions/22982741/form-submit-jquery-does-not-work/22982900
        $(selector)[0].submit();			
    }

	fancyConfirmCallback(submitCodeForm, title, message, buttonName, width);
    return false;
}



//------------------------------------------------------------------------------------------
//  fancyAlert(title, message, buttonName, width) displays an alert box that disappears
//  when either the close box or the OK button is clicked on.
//
//  The message, buttonName, and width parameters are all optional

function fancyAlert(title, message, buttonName, width) {

	fancyConfirmCallback(null, title, message, buttonName, width);
    return false;
}





