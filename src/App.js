//
//  Soft Convention Registration
//
//   9/18/18 v0.1 Steve Maguire steve@stormdev.com


import React, { Component } from 'react';
import Select from 'react-select';
import './App.css';


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

    this.onSearchChange       = this.onSearchChange.bind(this);
    this.onPrevPage           = this.onPrevPage.bind(this);
    this.onNextPage           = this.onNextPage.bind(this);
    this.fetchSearchResults   = this.fetchEventInfo.bind(this);
    this.onSearchSubmit       = this.onSearchSubmit.bind(this);
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
    console.log("New event:", event.target.value, field);
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
              // [pages.ATTENDEES]:    <Attendess   balloonReleases={balloonReleases} />,
              // [pages.MERCHANDISE]:  <Merchancise merchandise={merchandise} />,
            }[currentPage]
          }
          <PrevNextButtons pageNum={currentPage} />
        </div>
      </div>
    );
  }



  // OLD

  onSearchChange(event) {
    this.setState({
      searchTerm: event.target.value
    });
    console.log(event.target.value);
  }
  
  onSearchSubmit(event) {
    const { searchTerm, page } = this.state;
    this.fetchEventInfo(searchTerm, page);
    event.preventDefault();
    console.log("In onSubmit");
  }


  onPrevPage() {
    const { searchTerm, page } = this.state;
    let prevPage = page && page-1;
    this.fetchEventInfo(searchTerm, prevPage);
    this.setState({ page: prevPage });
  }


  onNextPage() {
    const { searchTerm, page } = this.state;
    let nextPage = page+1;
    this.fetchEventInfo(searchTerm, nextPage);
    this.setState({ page: nextPage });
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


const PageBar = ({pageNum}) =>
  <div><h1>{pageNum}</h1></div>


const ContactInfo = ({contact, onChangeContactInfo, onChangeCountry}) =>
  <div>
    <h2>Contact Information:</h2>
    <EditName field="firstName" onChange={onChangeContactInfo}>FIRST Name</EditName>
    <EditName field="lastName"  onChange={onChangeContactInfo}>LAST Name</EditName>
    <EditAddress contact={contact} onChange={onChangeContactInfo} onChangeCountry={onChangeCountry}>Address</EditAddress>
    <div className="phones">
      <EditPhone field="phoneMobile" onChange={onChangeContactInfo}>Mobile Phone</EditPhone>
      <EditPhone field="phoneWork"   onChange={onChangeContactInfo}>Work Phone</EditPhone>
      <EditPhone field="phoneHome"   onChange={onChangeContactInfo}>Home Phone</EditPhone>
    </div>
    <EditEmail onChange={onChangeContactInfo}>Best Email Address</EditEmail>
    <ContactSummary contact={contact} />
  </div>


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


const EditName = ({ field, value="", onChange, className="edit-name", children }) =>
  <div className={className}>
    <p>{children}</p>
    <input
      type="text"
      onChange={(evt) => onChange(evt, field)}
    />
  </div>


const EditAddress = ({contact,  onChange, onChangeCountry, className="edit-address", children}) =>
  <div className={className}>
    <p>{children}</p>
    <Address field="address1" placeHolder="Address 1" onChange={onChange}/>
    <Address field="address2" placeHolder="Address 2" onChange={onChange}/>
    <div>
      <City onChange={onChange} />
      <StateProv onChange={onChange} />
      <PostalCode onChange={onChange}  />
    </div>
    <Country selectValue={contact.country} onChange={onChangeCountry}/>
  </div>


const Address = ({field, placeHolder="", onChange}) =>
    <input
      type="text"
      placeholder={placeHolder}
      onChange={(evt) => onChange(evt, field)}
    />

const City = ({value="", onChange, className="edit-city"}) =>
    <input
      type="text"
      className={className}
      placeholder="City"
      onChange={(evt) => onChange(evt, "city")}
    />

const StateProv = ({value,  onChange, className="edit-state-prov"}) =>
    <input
      type="text"
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
      // console.log("In Country Render");
      // return "<p>selectValue</p>";
    }
    


const PostalCode = ({value="", onChange, className="edit-postal-code"}) =>
    <input
      type="text"
      placeholder="   Zip/Postal Code..."
      onChange={(evt) => onChange(evt, "postalCode")}
      className={className}
    />


const EditPhone = ({field, onChange, className="edit-phone", children}) =>
  <div className={className}>
    <p>{children}</p>
    <input
      type="text"
      onChange={(evt) => onChange(evt, field)}
    />
  </div>

const EditEmail = ({value="", onChange, className="edit-email", children}) =>
  <div className={className}>
    <p>{children}</p>
    <input
      type="text"
      onChange={(evt) => onChange(evt, "email")}
    />
  </div>

const PrevNextButtons = ({pageNum}) =>
  <div className="button-bar">
    <Button className="button button-prev" onClick={this.onPrevPage}>BACK</Button>
    <Button className="button button-next" onClick={this.onNextPage}>NEXT</Button>
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


export default App;
