//
//  Soft Convention Registration
//
//   9/18/18 v0.1 Steve Maguire steve@stormdev.com


import React, { Component } from 'react';
import Select from 'react-select';
import './App.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'

library.add(faAngleDoubleRight)



const DEFAULT_QUERY = 'Steve Jobs';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE   = 'page=';


const pages = {
  CONTACT:     1,
  ATTENDEES:   2,
  SCHEDULES:   3,
  MERCHANDISE: 4,
};

const countries = ['United States', 'Canada', 'Mexico', 'United Kingdom', '-----', 'Afghanistan', 'Åland Islands', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bangladesh', 'Barbados', 'Bahamas', 'Bahrain', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'British Indian Ocean Territory', 'British Virgin Islands', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Burma', 'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'Christmas Island', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Congo-Brazzaville', 'Congo-Kinshasa', 'Cook Islands', 'Costa Rica', 'Croatia', 'Curaçao', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'El Salvador', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Federated States of Micronesia', 'Fiji', 'Finland', 'France', 'French Guiana', 'French Polynesia', 'French Southern Lands', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Heard and McDonald Islands', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfolk Island', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn Islands', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Réunion', 'Romania', 'Russia', 'Rwanda', 'Saint Barthélemy', 'Saint Helena', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Martin', 'Saint Pierre and Miquelon', 'Saint Vincent', 'Samoa', 'San Marino', 'São Tomé and Príncipe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Sint Maarten', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Georgia', 'South Korea', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Svalbard and Jan Mayen', 'Sweden', 'Swaziland', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Vietnam', 'Venezuela', 'Wallis and Futuna', 'Western Sahara', 'Yemen', 'Zambia', 'Zimbabwe'];

const optionsCountries = countries.map(opt => ({ label: opt, value: opt }));

const customStyles = {
  option: (base, state) => ({
    ...base,
    // borderBottom: '1px dotted pink',
    // color: state.isFullscreen ? 'red' : 'green',
    padding: 5,
  }),
  control: (base, state) => ({
    ...base,
    width: 336,
    padding: 0,
    marginTop: 5,
    borderRadius: 0,
    minHeight: 0,
    height: "2em",
    backgroundColor: "white",
  }),
  singleValue: (base, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';

    return {
       ...base, 
       opacity, 
       transition,
    };
  },
  menuList: (base, state) => ({
    ...base,
    height: 200,
    color: "#2e3a97",
  }),
  placeholder: (base, state) => ({
    ...base,
    color: "#999",
    fontSize: 12,
  }),
}



class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentPage: pages.CONTACT,

      eventInfo: null,

      contactInfo: {
        firstName:   '',
        lastName:    '',
        address1:    '',
        address2:    '',
        city:        '',
        stateProv:   '',
        country:     '',
        postalCode:  '',
        phoneMobile: '',
        phoneWork:   '',
        phoneHome:   '',
        email:       '',
      },

      //balloonReleases: [],
      //attendees: [],

      // OLD
      result: null,
      searchTerm: DEFAULT_QUERY,
      page: 0,
    };

    this.setEventInfo         = this.setEventInfo.bind(this);
    this.onChangeContactInfo  = this.onChangeContactInfo.bind(this);
    this.onChangeCountry      = this.onChangeCountry.bind(this);
    this.smartFixContactInfo  = this.smartFixContactInfo.bind(this);

    this.onPrevPage           = this.onPrevPage.bind(this);
    this.onNextPage           = this.onNextPage.bind(this);
    this.fetchEventInfo       = this.fetchEventInfo.bind(this);
    this.componentDidMount    = this.componentDidMount.bind(this);
  }


  onChangeCountry(opt) {
    if (opt.value === "-----")
        opt.value = "";

    this.setState ({
      contactInfo: { ...this.state.contactInfo, country: opt.value }
    });
  }

  onChangeContactInfo(event, field) {
    this.setState ({
      contactInfo: { ...this.state.contactInfo, [field]: event.target.value }
    });
  }

  smartFixContactInfo() {
    const contactInfo = this.state.contactInfo;
    const contact = {
        ...contactInfo,
        firstName:   smartFixName(contactInfo.firstName),
        lastName:    smartFixName(contactInfo.lastName),
        address1:    smartFixAddress(contactInfo.address1),
        address2:    smartFixAddress(contactInfo.address2),
        city:        smartFixName(contactInfo.city),
        stateProv:   smartFixStateProv(contactInfo.stateProv),
        // country:     '',
        postalCode:  smartFixPostalCode(contactInfo.postalCode),
        // phoneMobile: '',
        // phoneWork:   '',
        // phoneHome:   '',
        email:       smartFixEmail(contactInfo.email),
      }

    this.setState({
      contactInfo: contact,
    });
  }


  setEventInfo(result) {

    // Override result for testing purpose

    const eventInfo = {
      eventTitle: '2019 Conference Registration',
      dinnerMenu: [
          'Wild Mushroom Ravioli',
          'Lemon Herb Chicken Breast',
          'Red Wine Marinated Grilled Top Sirloin'
        ],
      kidsMenu: [
          'Chicken Tenders',
          'Mac \'n Cheese',
          'Carrots',
          'Celery',
        ]
    };

    this.setState({
      eventInfo
    });
  }


  fetchEventInfo(searchTerm, page = 0) {
      fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`)
      .then(response => response.json())
      .then(result => this.setEventInfo(result))
      .catch(error => error);
  }


  componentDidMount() {
    const { searchTerm, page } = this.state;      // deconstructing
    this.fetchEventInfo(searchTerm, page);
  }


  render() {
    const { eventInfo, currentPage, contactInfo } = this.state;

    return (
      <div className="body-boundary">
        <SoftHeader eventInfo={eventInfo} />
        <div className="page-boundary">
          <PageBar pageNum={currentPage} />

          {
            {
              [pages.CONTACT]:
                  <ContactInfo 
                      contact={contactInfo}
                      onChangeContactInfo={this.onChangeContactInfo}
                      onChangeCountry={this.onChangeCountry} 
                  />,
              [pages.ATTENDEES]:
                  <ContactSummary contact={contactInfo} />,
              // [pages.MERCHANDISE]:  <Merchancise merchandise={merchandise} />,
            }[currentPage]
          }
          <PrevNextButtons pageNum={currentPage} contact={contactInfo} onClickPrev={this.onPrevPage} onClickNext={this.onNextPage}/>
        </div>
      </div>
    );
  }



  onPrevPage() {
    let { currentPage } = this.state;
    let prevPage = currentPage-1;
    this.setState({
      currentPage: prevPage,
    });
  }


  onNextPage() {
    let { currentPage } = this.state;
    this.smartFixContactInfo();
    let nextPage = currentPage+1;
    this.setState({
      currentPage: nextPage,
    });
  }

}


const SoftHeader = ({eventInfo}) =>
  <div className="logo-header">
    <div>
      <img 
        src="https://trisomy.wpengine.com/wp-content/uploads/2017/07/softlogo.png"
        height="75px"
        alt="Soft Logo"
      />
    </div>
    <div>
      <h1>{eventInfo && eventInfo.eventTitle}</h1>
    </div>
  </div>


const pageTitles = ['Welcome', "Contact", "Attendees", "Schedules", "Merchandise", "Checkout"];

const PageBar = ({pageNum}) =>
  <div className="pagebar">
    {pageTitles.map( (title, i) => {
        const keyName = title.replace(/ /g, "-");
        if (pageNum === (i+1)) {
          return <div key={keyName} className={"pagebar-selected"}><FontAwesomeIcon icon="angle-double-right" /> {title}</div>;
        }
        else
          return <div key={keyName} className={"pagebar-unselected"}>{title}</div>;
      }
    )}
  </div>


const ContactInfo = ({contact, onChangeContactInfo, onChangeCountry}) =>
  <div>
    <h2>Contact Information:</h2>
    <EditName value={contact.firstName} field="firstName" onChange={onChangeContactInfo}>FIRST Name</EditName>
    <EditName value={contact.lastName} field="lastName"  onChange={onChangeContactInfo}>LAST Name</EditName>
    <EditAddress contact={contact} onChange={onChangeContactInfo} onChangeCountry={onChangeCountry}>Address</EditAddress>
    <div className="phones">
      <EditPhone value={contact.phoneMobile} field="phoneMobile" onChange={onChangeContactInfo}>Mobile Phone</EditPhone>
      <EditPhone value={contact.phoneWork}   field="phoneWork"   onChange={onChangeContactInfo}>Work Phone</EditPhone>
      <EditPhone value={contact.phoneHome}   field="phoneHome"   onChange={onChangeContactInfo}>Home Phone</EditPhone>
    </div>
    <EditEmail value={contact.email} onChange={onChangeContactInfo}>Best Email Address</EditEmail>
  </div>
   

//     <ContactSummary contact={contact} />
// const ContactSummary = ({contact}) =>
//   <div>
//     <br />
//     First name: {smartFixName(contact.firstName)}<br />
//     Last name: {smartFixName(contact.lastName)}<br />
//     Address 1: {smartFixAddress(contact.address1)}<br />
//     Address 2: {smartFixAddress(contact.address2)}<br />
//     City: {smartFixName(contact.city)}<br />
//     State: {smartFixStateProv(contact.stateProv)}<br />
//     Zip: {smartFixPostalCode(contact.postalCode)}<br />
//     Country: {contact.country}<br />
//     Mobile Phone: {contact.phoneMobile}<br />
//     Work Phone: {contact.phoneWork}<br />
//     Home Phone: {contact.phoneHome}<br />
//     Email: {smartFixEmail(contact.email)}<br />
//   </div>

const ContactSummary = ({contact}) =>
  <div>
    <br />
    First name: {contact.firstName}<br />
    Last name: {contact.lastName}<br />
    Address 1: {contact.address1}<br />
    Address 2: {contact.address2}<br />
    City: {contact.city}<br />
    State: {contact.stateProv}<br />
    Zip: {contact.postalCode}<br />
    Country: {contact.country}<br />
    Mobile Phone: {contact.phoneMobile}<br />
    Work Phone: {contact.phoneWork}<br />
    Home Phone: {contact.phoneHome}<br />
    Email: {contact.email}<br />
  </div>



const EditName = ({ field, value, onChange, className="edit-name", children }) =>
  <div className={className}>
    <p>{children}</p>
    <input
      value={value}
      type="text"
      onChange={(evt) => onChange(evt, field)}
    />
  </div>


const EditAddress = ({contact,  onChange, onChangeCountry, className="edit-address", children}) =>
  <div className={className}>
    <p>{children}</p>
    <Address value={contact.address1} field="address1" placeHolder="Address 1" onChange={onChange}/>
    <Address value={contact.address2} field="address2" placeHolder="Address 2" onChange={onChange}/>
    <div>
      <City       value={contact.city}       onChange={onChange} />
      <StateProv  value={contact.stateProv}  onChange={onChange} />
      <PostalCode value={contact.postalCode} onChange={onChange}  />
    </div>
    <Country selectValue={contact.country} onChange={onChangeCountry}/>
  </div>


const Address = ({value="", field, placeHolder="", onChange}) =>
    <input
      type="text"
      value={value}
      placeholder={placeHolder}
      onChange={(evt) => onChange(evt, field)}
    />

const City = ({value="", onChange, className="edit-city"}) =>
    <input
      type="text"
      value={value}
      className={className}
      placeholder="City"
      onChange={(evt) => onChange(evt, "city")}
    />

const StateProv = ({value="",  onChange, className="edit-state-prov"}) =>
    <input
      type="text"
      value={value}
      className={className}
      placeholder="State/Prov/Region"
      onChange={(evt) => onChange(evt, "stateProv")}
    />

const Country = ({selectValue, onChange, className="edit-country"}) => {
      const defaultOpt = optionsCountries.find(opt => (opt.value === selectValue));
      // if (selectValue !== null) {
        return (
          <div>
            <Select
              options={optionsCountries}
              defaultValue={defaultOpt}
              placeholder={"Select Country..."}
              onChange={onChange}
              styles={customStyles}
            />
          </div>
        );
      // }
    }
    


const PostalCode = ({value="", onChange, className="edit-postal-code"}) =>
    <input
      type="text"
      value={value}
      placeholder="   Zip/Postal Code..."
      onChange={(evt) => onChange(evt, "postalCode")}
      className={className}
    />


const EditPhone = ({value="", field, onChange, className="edit-phone", children}) =>
  <div className={className}>
    <p>{children}</p>
    <input
      type="text"
      value={value}
      onChange={(evt) => onChange(evt, field)}
    />
  </div>

const EditEmail = ({value="", onChange, className="edit-email", children}) =>
  <div className={className}>
    <p>{children}</p>
    <input
      value={value}
      type="text"
      onChange={(evt) => onChange(evt, "email")}
    />
  </div>

const PrevNextButtons = ({pageNum, contact, onClickPrev, onClickNext}) =>
  <div className="button-bar">
    <Button className="button button-prev" onClick={onClickPrev}>BACK</Button>
    <Button className="button button-next" onClick={onClickNext}>NEXT</Button>
  </div>



// OLD ----------------------------------------------------------------------------


const Button = ({ onClick = null, onSubmit = null, className = '', children, type = 'button' }) =>
  <button
    onClick={onClick}
    onSubmit={onSubmit}
    className={className}
    type={type}
  >
    {children}
  </button>


function ucFirst(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function smartFixName(text) {

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

    function replaceUpcase2nd(str, match1, match2, offset) {
      return (match1+ucFirst(match2));
    }

    //  Upcase the first letter of each name in the full name
    text = ucFirst(text);
    text = text.replace(/([\s-]+)(.)/g, replaceUpcase2nd);

    text = text.replace(/(Mc)(.)/g,   replaceUpcase2nd);      // McNames
    text = text.replace(/(Mac)(.)/g,  replaceUpcase2nd);      // MacNames
    text = text.replace(/(O')(.)/g,   replaceUpcase2nd);      // O'Names
    text = text.replace(/(Le)(.eu)/g, replaceUpcase2nd);      // LeFeuvre, LeBeuf, etc.

    text = text.replace(/\bi\b/ig,   "I");
    text = text.replace(/\bii\b/ig,  "II");
    text = text.replace(/\biii\b/ig, "III");
    text = text.replace(/\biv\b/ig,  "IV");

    //  What about names like:
    //  DeWitt, DeWalt, DeVries, DeVoss, DeGeneris, AuCoin, DaVinci, etc.?
    //  Consider Davis - not DaVis, etc...

    return(text);
}

function smartFixAddress(address) {

    address = smartFixName(address);

    //  No need for double spaces in addresses
    address = address.replace(/\s+/ig, ' ');

    //  The substitions, below, are made even if the
    //  address is entered in mixed case.

    address = address.replace(/\bp[.]?o[.]? /ig, "P.O. ");          // po, PO ==> P.O.
    address = address.replace(/\bbox\b/ig, "Box");                  // Box

    //  Handle some place abbreviations
    address = address.replace(/\bst\b/ig, "St");                    // St.
    address = address.replace(/\bstreet\b/ig, "St.");               // St.
    address = address.replace(/\bave\b/ig, "Ave");                  // Ave
    address = address.replace(/\bavenue\b/ig, "Ave.");              // Ave
    address = address.replace(/\brd\b/ig, "Rd");                    // Rd
    address = address.replace(/\broad\b/ig, "Rd.");                 // Rd.
    address = address.replace(/\bblvd\b/ig, "Blvd");                // Blvd
    address = address.replace(/\bpl\b/ig, "Pl");                    // Pl
    address = address.replace(/\bct\b/ig, "Ct");                    // Ct
    address = address.replace(/\bln\b/ig, "Ln");                    // Ln
    address = address.replace(/\bcir\b/ig, "Cir");                  // Cir
    address = address.replace(/\bway\b/ig, "Way");                  // Way

    address = address.replace(/\bapt\b/ig, "Apt");                  // Apt
    address = address.replace(/\bunit\b/ig, "Unit");                // Unit
    address = address.replace(/\bbldg\b/ig, "Bldg");                // Bldg

    //  Handle digits followed by "st", "nd", "rd", or "th"
    address = address.replace(/\b(\d+)st\b/ig, "$1st");             // 1st, 21st, 31st
    address = address.replace(/\b(\d+)nd\b/ig, "$1nd");             // 2nd, 22nd, etc.
    address = address.replace(/\b(\d+)rd\b/ig, "$1rd");             // 3rd
    address = address.replace(/\b(\d+)th\b/ig, "$1th");             // 4th

    //  Handle some directional abbreviations
    address = address.replace(/\bn\b/ig,  "N");
    address = address.replace(/\be\b/ig,  "E");
    address = address.replace(/\bs\b/ig,  "S");
    address = address.replace(/\bso\b/ig, "S");
    address = address.replace(/\bw\b/ig,  "W");
    address = address.replace(/\bn\s*e\b/ig, "NE");
    address = address.replace(/\bn\s*w\b/ig, "NW");
    address = address.replace(/\bs\s*e\b/ig, "SE");
    address = address.replace(/\bs\s*w\b/ig, "SW");
    address = address.replace(/\bnorth\b/ig, "North");
    address = address.replace(/\beast\b/ig,  "East");
    address = address.replace(/\bsouth\b/ig, "South");
    address = address.replace(/\bwest\b/ig,  "West");

    return(address);
}



function smartFixStateProv(stateProv) {

    if (stateProv.length <= 2) {
      stateProv = stateProv.toUpperCase();
    }
    else {
      stateProv = smartFixName(stateProv);
    }
    return stateProv;
}


function smartFixPostalCode(postalCode) {
    return postalCode.toUpperCase();
}


function smartFixEmail(email) {
    email = email.replace(/\s+/g, "");
    return email.toLowerCase();
}


export default App;
