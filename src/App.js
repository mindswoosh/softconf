//
//  Soft Convention Registration
//
//  9/18/18 v0.1 Steve Maguire steve@stormdev.com
//
//  Robin Weirich's book, page 191
//  $ git add .
//  $ git commit -m "..."
//  $ git push heroku master
//  $ heroku open 


import React, { Component } from 'react';
import Select from 'react-select';
import './App.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleRight, faHandPointRight, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

library.add(faAngleDoubleRight);
library.add(faHandPointRight);
library.add(faQuestionCircle);

var nextID = 10000;

const pages = {
  START:        0,
  WELCOME:      1,
  CONTACT:      2,
  ATTENDEES:    3,
  CLINICS:      4,
  REMEMBRANCE:  5,
  YOUTH:        6,
  CHILDCARE:    7,
  DINNER:       8,
  WORKSHOPS:    9,
  PICNIC:       10,
  BALLOONS:     11,
  DIRECTORY:    12,
  PHOTOS:       13,
  SOFTWEAR:     14,
  SUMMARY:      15,
  CHECKOUT:     16,
  END:          17,
};

console.assert(Object.keys(pages).find( (name,i) => { return pages[name] !== i} ) === undefined, 'Page Enum is incorrect');

const countries = ['United States', 'Canada', 'Mexico', 'United Kingdom', '-----', 'Afghanistan', 'Åland Islands', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bangladesh', 'Barbados', 'Bahamas', 'Bahrain', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'British Indian Ocean Territory', 'British Virgin Islands', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Burma', 'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'Christmas Island', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Congo-Brazzaville', 'Congo-Kinshasa', 'Cook Islands', 'Costa Rica', 'Croatia', 'Curaçao', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'El Salvador', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Federated States of Micronesia', 'Fiji', 'Finland', 'France', 'French Guiana', 'French Polynesia', 'French Southern Lands', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Heard and McDonald Islands', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfolk Island', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn Islands', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Réunion', 'Romania', 'Russia', 'Rwanda', 'Saint Barthélemy', 'Saint Helena', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Martin', 'Saint Pierre and Miquelon', 'Saint Vincent', 'Samoa', 'San Marino', 'São Tomé and Príncipe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Sint Maarten', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Georgia', 'South Korea', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Svalbard and Jan Mayen', 'Sweden', 'Swaziland', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Vietnam', 'Venezuela', 'Wallis and Futuna', 'Western Sahara', 'Yemen', 'Zambia', 'Zimbabwe'];

const optionsCountries = countries.map(opt => ({ label: opt, value: opt }));

const customStyles = {
  option: (base, state) => ({
    ...base,
    // borderBottom: '1px dotted pink',
    // color: state.isFullscreen ? 'red' : 'green',
    padding: 5,
  }),
  control: (base, state) => ({        /* Select line with drop-down arrow */
    ...base,
    width: 336,
    padding: 0,
    marginTop: 5,
    borderRadius: 0,
    minHeight: 0,
    height: 30,
    fontSize: 14,
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
    height: 212,
    fontSize: 14,
    color: "#2e3a97",
  }),
  placeholder: (base, state) => ({
    ...base,
    color: "#999",
    fontSize: 12,
  }),
  container: (base, state) => ({
    ...base,
    width: 336,
  }),
}


const peopleTypes = {
  SOFTCHILD:    "S",
  CHILD:        "C",
  ADULT:        "A",
  PROFESSIONAL: "P",
};

const optionsPeopleTypes = [
  { label: "SOFT child",    value: peopleTypes.SOFTCHILD },
  { label: "Child",         value: peopleTypes.CHILD },  
  { label: "Adult",         value: peopleTypes.ADULT },
  { label: "Professional",  value: peopleTypes.PROFESSIONAL },
];


//  I should deep clone this from the previous style and change what's appropriate
const customStylesPeopleTypes = {
  option: (base, state) => ({
    ...base,
    // borderBottom: '1px dotted pink',
    // color: state.isFullscreen ? 'red' : 'green',
    padding: 5,
  }),
  control: (base, state) => ({
    ...base,
    width: 156,
    padding: 0,
    marginTop: 5,
    borderRadius: 0,
    minHeight: 0,
    height: 30,
    fontSize: 14,
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
    height: 110,
    fontSize: 14,
    color: "#2e3a97",
  }),
  placeholder: (base, state) => ({
    ...base,
    color: "#999",
    fontSize: 12,
  }),
  container: (base, state) => ({
    ...base,
    width: 156,
  }),
}


function attendee(firstName, lastName, peopleType) {
  return {
    id: nextID++,
    firstName,
    lastName,
    peopleType,
    rembOuting: 0,
    rembLunch:  '',
    chapterChair: '',
  };
}


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentPage: pages.WELCOME,
      pageHistory: [],                //  Keep a history of the pages visited for use by the Back button

      eventInfo: {
        eventTitle: '',
        remembranceMenu: {},
        dinnerMenu: [],
        kidsMenu: []
      },

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

      attendees: [
        // attendee("Steve", "Maguire",  peopleTypes.ADULT),
        // attendee("Beth",  "Mountjoy", peopleTypes.CHILD),
        // attendee("Terre", "Krotzer",  peopleTypes.PROFESSIONAL),
      ],

    };

    this.setEventInfo         = this.setEventInfo.bind(this);
    this.onChangeContactInfo  = this.onChangeContactInfo.bind(this);
    this.onChangeCountry      = this.onChangeCountry.bind(this);
    
    this.onAddAttendee        = this.onAddAttendee.bind(this);
    this.onRemoveAttendee     = this.onRemoveAttendee.bind(this);
    this.onChangeAttendeeList = this.onChangeAttendeeList.bind(this);
    this.onChangePeopleType   = this.onChangePeopleType.bind(this);

    this.onChangeRembOuting   = this.onChangeRembOuting.bind(this);
    this.onChangeRembLunch    = this.onChangeRembLunch.bind(this);

    this.onChangeChapterChair = this.onChangeChapterChair.bind(this);

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


  setEventInfo(result) {

    // Override result for testing purpose

  const eventInfo = {
      eventTitle: '2019 Conference Registration',
      remembranceMenu: {
          V: 'Vegetarian',
          C: 'Chicken',
          T: 'Tuna Salad',
          N: 'No meal'
        },
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
      // fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`)
      // .then(response => response.json())
      // .then(result => this.setEventInfo(result))
      // .catch(error => error);
      this.setEventInfo(12345);
  }


  componentDidMount() {
    const { searchTerm, page } = this.state;      // deconstructing
    this.fetchEventInfo(searchTerm, page);
  }


  render() {
    const { eventInfo, currentPage, contactInfo, attendees } = this.state;
    return (
      <div className="body-boundary">
        <SoftHeader eventInfo={eventInfo} />
        <div className="page-boundary">
          <PageBar pageNum={currentPage} />

          {
            {
              [pages.WELCOME]:
                  <Welcome />,

              [pages.CONTACT]:
                  <ContactInfo 
                      contact={contactInfo}
                      onChangeContactInfo={this.onChangeContactInfo}
                      onChangeCountry={this.onChangeCountry} 
                  />,

              [pages.ATTENDEES]:
                  <Attendees
                    attendees={attendees} 
                    onAdd={this.onAddAttendee}
                    onRemove={this.onRemoveAttendee}
                    onChange={this.onChangeAttendeeList}
                    onChangePeopleType={this.onChangePeopleType}
                  />,

              [pages.CLINICS]:
                  <Clinics />,

              [pages.REMEMBRANCE]:
                  <Remembrance
                    attendees={attendees}
                    onChange={this.onChangeRembOuting}
                    menuInfo={eventInfo.remembranceMenu}
                    onChangeLunch={this.onChangeRembLunch}
                  />,

              [pages.YOUTH]:
                  <Youth />,

              [pages.CHILDCARE]:
                  <Childcare />,

              [pages.DINNER]:
                  <Dinner />,

              [pages.WORKSHOPS]:
                  <Workshops />,

              [pages.PICNIC]:
                  <Picnic />,

              [pages.BALLOONS]:
                  <Balloons />,

              [pages.CHAPTERCHAIR]:
                  <ChapterChair
                    attendees={attendees}
                    onChange={this.onChangeChapterChair}
                    // menuInfo={eventInfo.remembranceMenu}
                    // onChangeLunch={this.onChangeRembLunch}
                  />,

              [pages.DIRECTORY]:
                  <Directory contact={contactInfo} />,

              [pages.PHOTOS]:
                  <Photos contact={contactInfo} />,

              [pages.SOFTWEAR]:
                  <Softwear />,

              [pages.SUMMARY]:
                  <Summary contact={contactInfo} />,

              [pages.CHECKOUT]:
                  <Checkout contact={contactInfo} />,

              // [pages.MERCHANDISE]:  <Merchancise merchandise={merchandise} />,
            }[currentPage]
          }
          <PrevNextButtons pageNum={currentPage} contact={contactInfo} onClickPrev={this.onPrevPage} onClickNext={this.onNextPage}/>
        </div>
      </div>
    );
  }



  // FIX -- pageHistory should be a state variable, not a global
  onPrevPage(event) {
    let { pageHistory } = this.state;

    //  The visitor can always to go a previous page.
    if (pageHistory.length > 0) {
      let newPage = pageHistory.pop();

      this.setState({
        pageHistory,
        currentPage: newPage,
      });
    }
  }


  onNextPage(event) {
    let { attendees, currentPage, pageHistory } = this.state;

    //  Don't let visitor go to next page unless there are no errors on
    //  the current page.

    switch (currentPage) {

      case pages.WELCOME:
          // let attendees = this.state.attendees;

          pageHistory.push(currentPage);

          this.setState({
            pageHistory,
            currentPage: pages.CONTACT,
          });

          break;

      case pages.CONTACT:
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
              phoneMobile: smartFixPhone(contactInfo.phoneMobile),
              phoneWork:   smartFixPhone(contactInfo.phoneWork),
              phoneHome:   smartFixPhone(contactInfo.phoneHome),
              email:       smartFixEmail(contactInfo.email),
            }

          //  Error check
          //  alert() if errors

          if (contact.firstName === ''  ||  contact.lastName === '') {
            alert("Oops! Please enter the name of the Contact Person.");
          }
          else {
            if (attendees.length === 0) {
                attendees.push( attendee(contact.firstName, contact.lastName, peopleTypes.ADULT) );
            }

            pageHistory.push(currentPage);

            this.setState({
              contactInfo: contact,
              pageHistory,
              currentPage: pages.ATTENDEES,
            });
          }

          break;

      case pages.ATTENDEES:
          // let attendees = this.state.attendees;

          //  Clean up entries
          attendees = attendees.map(a => { 
            a.firstName = a.firstName.trim();
            a.lastName  = a.lastName.trim();
            return a;
          });

          //  Remove totally empty rows
          attendees = attendees.filter(a => { return (a.firstName !== ''  ||  a.lastName !== '') });

          let $bad_attendee = attendees.find( a => { return (a.firstName ===''  ||  a.lastName === ''  ||  a.peopleType === '') });

          if ($bad_attendee !== undefined) {
            alert("Oops! Something is missing in the information for one or more of the people listed. Please fill in the missing information.");
          }
          else {
            pageHistory.push(currentPage);
            const newPage = attendees.length > 0 ? pages.CLINICS : pages.SOFTWEAR;

            this.setState({
              attendees,
              pageHistory,
              currentPage: newPage,
            });
          }
          break;

      case pages.CLINICS:
          // let attendees = this.state.attendees;

          pageHistory.push(currentPage);
          const newPage = pages.REMEMBRANCE;

          this.setState({
            pageHistory,
            currentPage: newPage,
          });

          break;

      case pages.REMEMBRANCE:
          // let attendees = this.state.attendees;

          //  Clean up entries
          attendees = attendees.map(a => {
            if (!a.rembOuting) {
              a.rembLunch = '';               //  No lunches for people not attending
            }
            return a;
          });

          let $missing_lunch = attendees.find( a => { return (a.rembOuting  &&  a.rembLunch === '' ) });
          if ($missing_lunch) {
            alert("Oops! Please select a lunch for each person attending.");
          }
          else {
            pageHistory.push(currentPage);
            const newPage = pages.YOUTH;

            this.setState({
              attendees,
              pageHistory,
              currentPage: newPage,
            });
          }

          break;

      case pages.YOUTH:
          // let attendees = this.state.attendees;

          pageHistory.push(currentPage);

          this.setState({
            pageHistory,
            currentPage: pages.CHILDCARE,
          });

          break;

      case pages.CHILDCARE:
          // let attendees = this.state.attendees;

          pageHistory.push(currentPage);

          this.setState({
            pageHistory,
            currentPage: pages.DINNER,
          });

          break;

      case pages.DINNER:
          // let attendees = this.state.attendees;

          pageHistory.push(currentPage);

          this.setState({
            pageHistory,
            currentPage: pages.WORKSHOPS,
          });

          break;

      case pages.WORKSHOPS:
          // let attendees = this.state.attendees;

          pageHistory.push(currentPage);

          this.setState({
            pageHistory,
            currentPage: pages.PICNIC,
          });

          break;

      case pages.PICNIC:
          // let attendees = this.state.attendees;

          pageHistory.push(currentPage);

          this.setState({
            pageHistory,
            currentPage: pages.BALLOONS,
          });

          break;

      case pages.BALLOONS:
          // let attendees = this.state.attendees;

          pageHistory.push(currentPage);

          this.setState({
            pageHistory,
            currentPage: pages.PHOTOS,
          });

          break;

      case pages.PHOTOS:
          // let attendees = this.state.attendees;

          pageHistory.push(currentPage);

          this.setState({
            pageHistory,
            currentPage: pages.DIRECTORY,
          });

          break;

      case pages.DIRECTORY:
          // let attendees = this.state.attendees;

          pageHistory.push(currentPage);

          this.setState({
            pageHistory,
            currentPage: pages.SOFTWEAR,
          });

          break;


      case pages.SOFTWEAR:
          // let attendees = this.state.attendees;

          pageHistory.push(currentPage);

          this.setState({
            pageHistory,
            currentPage: pages.SUMMARY,
          });

          break;

      case pages.SUMMARY:
          // let attendees = this.state.attendees;

          pageHistory.push(currentPage);

          this.setState({
            pageHistory,
            currentPage: pages.CHECKOUT,
          });

          break;

      case pages.CHECKOUT:
          // let attendees = this.state.attendees;

          // pageHistory.push(currentPage);

          // this.setState({
          //   pageHistory,
          //   currentPage: pages.END,
          // });

          break;

      default:
          console.log("Error in onNextPage")
    }
  }


  //-------------------------------------------------------------------------------------------
  //  Process Attendees page
  
  onAddAttendee(event) {
    let { attendees, contactInfo } = this.state;

    if (attendees.length === 0)
      attendees.push( attendee(contactInfo.firstName, contactInfo.lastName,  peopleTypes.ADULT) );
    else
      attendees.push( attendee('', '', '') );

    this.setState({
      attendees
    });
  }

  onRemoveAttendee(id) {
    let { attendees } = this.state;
    attendees = attendees.filter(attendee => attendee.id !== id);
    this.setState({
      attendees
    });
  }

  onChangeAttendeeList(event, id, field) {
    let { attendees } = this.state;
    let i = attendees.findIndex(a => a.id === id);
    console.assert(i !== -1, "Warning -- didn't find attendee in attendee list: id = " + id);
    attendees[i][field] = event.target.value;
    this.setState ({
      attendees
    });
  }

  onChangePeopleType(opt, id) {
    let { attendees } = this.state;
    let i = attendees.findIndex(a => a.id === id);
    console.assert(i !== -1, "Warning -- couldn't find attendee in attendee list: id = " + id);
    attendees[i].peopleType = opt.value;
    this.setState ({
      attendees
    });
  }



  //-------------------------------------------------------------------------------------------
  //  Process Remembrance page
  

  onChangeRembOuting(event, id) {
    let { attendees } = this.state;
    let i = attendees.findIndex(a => a.id === id);
    console.assert(i !== -1, "Warning -- couldn't find attendee in attendee list: id = " + id);

    //  Flip state of attendance and lunch option
    attendees[i].rembOuting = !attendees[i].rembOuting;
    if (!attendees[i].rembOuting) {
      attendees[i].rembLunch = '';
    }
    this.setState ({
      attendees
    });
  }

  onChangeRembLunch(opt, id) {
    let { attendees } = this.state;
    let i = attendees.findIndex(a => a.id === id);
    console.assert(i !== -1, "Warning -- couldn't find attendee in attendee list: id = " + id);
    attendees[i].rembLunch = opt.value;
    this.setState ({
      attendees
    });
  }



  //-------------------------------------------------------------------------------------------
  //  Chapter Chair page
  

  onChangeChapterChair(event, id) {
    let { attendees } = this.state;
    let i = attendees.findIndex(a => a.id === id);
    console.assert(i !== -1, "Warning -- couldn't find attendee in attendee list: id = " + id);
    attendees[i].chapterChair = !attendees[i].chapterChair;
    this.setState ({
      attendees
    });
  }
}



//-------------------------------------------------------------------------------------------




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


const pageTabs = [ 'Welcome', 'Attendees', 'Schedules', 'Picnic', 'Directory', 'SOFT Wear', 'Checkout' ];

const PageBar = ({pageNum}) =>
  {
    let title = '';

    switch (pageNum) {
      case pages.WELCOME:
        title = 'Welcome';
        break;
      case pages.CONTACT:
      case pages.ATTENDEES:
        title = 'Attendees';
        break;
      case pages.CLINICS:
      case pages.REMEMBRANCE:
      case pages.YOUTH:
      case pages.CHILDCARE:
      case pages.DINNER:
      case pages.WORKSHOPS:
        title = 'Schedules';
        break;
      case pages.PICNIC:
      case pages.BALLOONS:
        title = 'Picnic';
        break;
      case pages.DIRECTORY:
      case pages.PHOTOS:
        title = 'Directory';
        break;
      case pages.SOFTWEAR:
        title = 'SOFT Wear';
        break;      
      case pages.SUMMARY:
      case pages.CHECKOUT:
        title = 'Checkout';
        break;
      default:
        console.log('Unfound title in PageBar');
    }

    return(
      <div className="pagebar">
        {pageTabs.map( (tab, i) => {
            const keyName = tab.replace(/ /g, "-");
            if (tab === title) {
              return <div key={keyName} className={"pagebar-selected"}><FontAwesomeIcon icon="angle-double-right" /> {tab}</div>;
            }
            else
              return <div key={keyName} className={"pagebar-unselected"}>{tab}</div>;
          }
        )}
      </div>
    );
}



//----------------------------------------------------------------------------------------------------


const Welcome = () =>
  <div className="welcome">
    <h2>Welcome!</h2>
    <p>Welcome to the Soft Conference Registration form!</p>
    <p>The 2019 Soft Conference is going to be held from Thursday March 3rd to Saturday March 5th at the
       Volcano Hotel in Kiwaluea Hawaii.
    </p>
    <p>If you haven't read the 2019 Conference brochure yet, you'll want to do that first before going
       through this form so you know exactly what's going on. Having the brochure available as you fill
       out this registration form will be helpful.
    </p>
    <p>If you need a copy of the brochure, click this button:</p>
    <div className="welcome-button">
      <Button>Download Brochure</Button>
    </div>
    <p>To get started, click on the Next button.</p>
  </div>



//----------------------------------------------------------------------------------------------------



const ContactInfo = ({contact, onChangeContactInfo, onChangeCountry}) =>
  <div>
    <h2>Contact Information</h2>
    <p>Please enter the contact information for the person handling this registration. The contact person
       does not need to be attending the conference. Required information is starred "*".
    </p>
    <div style={{marginLeft: 20}}>
      <EditName value={contact.firstName} field="firstName" onChange={onChangeContactInfo}>FIRST Name *</EditName>
      <EditName value={contact.lastName} field="lastName"  onChange={onChangeContactInfo}>LAST Name * </EditName>
      <EditAddress contact={contact} onChange={onChangeContactInfo} onChangeCountry={onChangeCountry}>Address</EditAddress>
      <div className="phones">
        <EditPhone value={contact.phoneMobile} field="phoneMobile" onChange={onChangeContactInfo}>Mobile Phone</EditPhone>
        <EditPhone value={contact.phoneWork}   field="phoneWork"   onChange={onChangeContactInfo}>Work Phone</EditPhone>
        <EditPhone value={contact.phoneHome}   field="phoneHome"   onChange={onChangeContactInfo}>Home Phone</EditPhone>
      </div>
      <EditEmail value={contact.email} onChange={onChangeContactInfo}>Best Email Address *</EditEmail>
    </div>
  </div>



//----------------------------------------------------------------------------------------------------



const Attendees = ({attendees, onRemove, onAdd, onChange, onChangePeopleType}) =>
  <div>
    <h2>Conference Attendees</h2>
    <p>Please list everybody in your party who will be attending any part of the Conference. If no one
       will be attending, simply click on the Next button.
    </p>
    {attendees.length > 0  &&
      <div>
        <p className="row-num">1.</p>
        <Input value={attendees[0].firstName} placeHolder="First Name" onChange={event => onChange(event, attendees[0].id, "firstName")}>FIRST Name</Input>
        <Input value={attendees[0].lastName} placeHolder="Last Name" onChange={event => onChange(event, attendees[0].id, "lastName")}>LAST Name</Input>
        <PeopleType value={attendees[0].peopleType} onChange={(opt) => onChangePeopleType(opt, attendees[0].id)}/>
        <Button onClick={() => onRemove(attendees[0].id)}>Remove</Button>
        {attendees.length > 1 ?
          attendees.slice(1).map( (a, i) =>
            <div key={a.id}>
              <p className="row-num">{i+2}.</p>
              <Input value={a.firstName} placeHolder="First Name" onChange={event => onChange(event, a.id, "firstName")} />
              <Input value={a.lastName} placeHolder="Last Name"  onChange={event => onChange(event, a.id, "lastName")} />
              <PeopleType value={a.peopleType} onChange={(opt) => onChangePeopleType(opt, a.id)}/>
              <Button onClick={() => onRemove(a.id)}>Remove</Button>
            </div>
          )
          : null
        }
      </div>
    }
    <br />
    {attendees.length === 0 ?
        <Button onClick={onAdd}>Add a Person</Button>
      :
        <Button onClick={onAdd}>Add Another Person</Button>
    }
  </div>


//----------------------------------------------------------------------------------------------------


const Clinics = ({contact}) =>
  <div>
    <h2>Clinics</h2>
    <p>This year’s Soft Clinics will be held at Sonny's Children’s Hospital on Thursday July 35th. Please
       number your clinic preferences (up to 5). We will attempt to schedule each child into 3 of the 5 preferences.
    </p>
    <b>
      <p>INFO TO GATHER:</p>
      <p>Info needed from participants:<br />
         Clinic preferences (up to 5 choices)<br />
         <br />
         Number attending adults? Kids? Soft kids?  Needed for bus<br />
         Bus seats needed? Tie downs needed?<br />
      </p>
    </b>

  </div>


//----------------------------------------------------------------------------------------------------



const Remembrance = ({ attendees, menuInfo, onChange, onChangeLunch }) =>
  <div>
    <h2>Remembrance Outing</h2>
    <p>There will be a Remembrance Outing for families who have lost a child. If you have lost
       a child and plan to attend, please put a checkmark next to each person who will be
       attending, and select the type of box lunch for each. Otherwise, simply click the Next button.
    </p>
    <div className="remembrance">
      {attendees.map( (a,i) => 
          <div key={a.id} className="remb-row">
            <Checkbox defaultChecked={a.rembOuting} onChange={event => onChange(event, a.id)} />
            <span className="remb-name">{a.firstName} {a.lastName}</span>
            <RembLunch value={a.rembLunch} menuInfo={menuInfo} isDisabled={!a.rembOuting} onChange={(opt) => onChangeLunch(opt, a.id)} />
          </div>
        )
      }
      <p><b><br />What other Info? Bus seats needed? Tie-downs?</b></p>
    </div>
  </div>



//----------------------------------------------------------------------------------------------------


const Youth = ({contact}) =>
  <div>
    <h2>Youth Outing</h2>
    <p>Omaha’s famed "Henry Doorly Zoo and Aquarium" will be the focus of the Children’s Activities on 
       Thursday – see the schedule for times and pick-up location. The cost for children aged 12+ is $35 
       and for 5-11 the cost is $30. The outing includes transportation, a T-shirt and lunch as well as 
       admission to the Zoo activities.
    </p>
    <b>
      <p>Normally these are separate events for children 11 and under, and 12 and older<br /><br />
         Info to gather:  Age of each child, shirt size, what else?<br /><br />
         It's assumed one bus seat per child. Any exceptions?<br />
      </p>
    </b>
  </div>


//----------------------------------------------------------------------------------------------------


const Childcare = ({contact}) =>
  <div>
    <h2>Childcare</h2>
    <p>Day care is available for kids ages infant to ? during the following hours..
    </p>
    <b>
    <p>INFO TO GATHER:</p>
      <p>How to schedule this? For each child attending present a list of checkboxes of time slots? E.g.:<br /><br />
          Todd Brown:<br />Thursday Morning, Thursday Afternnon, Friday Morning, Friday Afternnon<br /><br />
          Wendy Brown:<br />Thursday Morning, Thursday Afternnon, Friday Morning, Friday Afternnon<br /><br />
         <br />
         Will that work for how childcare is provided?<br />
      </p>
    </b>
  </div>



//----------------------------------------------------------------------------------------------------


const Dinner = ({contact}) =>
  <div>
    <h2>Welcome Dinner</h2>
    <p>Our annual welcome dinner will be held Thursday night from 6pm – 10pm.
    </p>
    <b>
      <p>Exactly like for the Remember Outing page, but with different meal choices?<br /><br />
         Any transportation info needed for this?
      </p>
    </b>
  </div>


//----------------------------------------------------------------------------------------------------


const Workshops = ({contact}) =>
  <div>
    <h2>Workshops</h2>
    <p>Workshops will be held on Thursday July 35th from 9am–4pm. Please indicate workshops you would like to attend and number attending.
    </p>
    <b>
    <p>Present a list of Workshop names with a dropdown next to each one with number to attend? (Dropdown menu 
       will range from 0 to the number of attendees in their party)</p>
    </b>
  </div>



//----------------------------------------------------------------------------------------------------


const Picnic = ({contact}) =>
  <div>
    <h2>Picnic</h2>
    <p>The Annual Ryan Cantrell Memorial Picnic and Balloon release will be Saturday July 36th from 1–4pm at
       the East Fork Lake picnic area. Please let us know who is attending, number of bus seats/tie downs if needed.
       If you will are requesting a balloon release for your child we will gather that information on the next page.
    </p>
    <b>
    <p>Just like Remembrance Outing. Present list of people to check (w/o a meal choice) and whether a tie down
       is needed.<br /><br />
       Is it assumed that everybody needs a bus seat or a tie down? In other words is "no transportation
       needed" a possibility?</p>
    </b>
  </div>


//----------------------------------------------------------------------------------------------------


const Balloons = ({contact}) =>
  <div>
    <h2>Balloon Release</h2>
    <p>You are invited to honor your Soft Angel during our Memorial Balloon Release. It is not necessary to attend
       the conference to request a balloon for your child.
    </p>
    <b>
      <p>Info to Collect:<br /><br />
        Child's name<br />
        Date of birth<br />
        Date of death<br />
        Diagnosis<br />
        Parents' names<br /><br />
        Anything else?
      </p>
    </b>
  </div>



//----------------------------------------------------------------------------------------------------


const Photos = ({contact}) =>
  <div>
    <h2>Photos</h2>
    <p>We invite you to share a family photo and a photo of your Soft Child. Photos may be used for 
       display during the conference and/or included in the Soft Family Directory.
    </p>
    <b>
      <p>Optional photos to ask for:<br /><br />
        Child's photo<br />
        Family photo<br /><br />
        One each? Or do you want the ability to upload multiples of each?
      </p>
    </b>
  </div>



//----------------------------------------------------------------------------------------------------


const Directory = ({contact}) =>
  <div>
    <h2>Directory</h2>
    <p>Each year we create a conference directory with Name, address, email, phone numbers, Soft Child info 
       and photos. Please check the items you would like included in your listing:
    </p>
    <b>
      <p>Info to Collect:<br /><br />
        Name<br />
        Address<br />
        Email address<br />
        Cell phone<br />
        Home phone<br />
        Soft child info (name, diagnosis, dates)<br />
        Family photo<br /><br />
        Anything else?<br />
        Can we assume that this is the same info gathered for the contact person? If so, we can
        just have them checkmark the information they're okay with providing. (We gathered the soft
        child's info elsewhere.) In other words, this page could be really complex if we re-gather
        the information, or instead it could be really simple if it's just a list of checkboxes.
      </p>
    </b>
  </div>



//----------------------------------------------------------------------------------------------------


const Softwear = ({contact}) =>
  <div>
    <h2>SOFT Wear</h2>
    <p>Get your SOFT Wear shirts here
    </p>
    <p>Present shirt options: sizes and quantity.</p>
  </div>






//----------------------------------------------------------------------------------------------------


const ChapterChair = ({ attendees, menuInfo, onChange, onChangeLunch }) =>
  <div>
    <h2>Chapter Chair Luncheon</h2>
    <p>Is anyone in your party a registered or prospective Chapter Chair? If so, please check everyone
       who will be attending the Chapter Chair Lunch; otherwise, simply click the Next buttton.
    </p>
    <p><FontAwesomeIcon icon="question-circle" /> If you don't know what a Chapter Chair is, this doesn't apply to you. Click Next.</p>
    <div className="chapter-chair">
      {attendees.map( (a,i) => 
          <div key={a.id} className="chair-row">
            <Checkbox defaultChecked={a.chapterChair} onChange={event => onChange(event, a.id)} />
            <span className="remb-name">{a.firstName} {a.lastName}</span>
          </div>
        )
      }
    </div>
  </div>



//----------------------------------------------------------------------------------------------------



// const DirectoryOLD = ({contact}) =>
//   <div>
//     <h2>Directory of Attendees</h2>
//     <p>SOFT creates a Directory of Conference Attendees to be given to the attendees. It contains
//        names, addresses, phone numbers, email addresses, and photos if you submit them.
//     </p>
//     <p>Check everything that you would like included in the Directory. By default, everything is
//        included. Uncheck those items that you would like to have excluded from the Directory:
//     </p>
//     <p><FontAwesomeIcon icon="hand-point-right" /> If you don't want to be included in the Directory at all, uncheck every item.</p>
//     <div className="chapter-chair">
//       <div className="chair-row">
//         <Checkbox defaultChecked={true} /> SOFT Child's name and Contact Person
//       </div>
//       <div className="chair-row">
//         <Checkbox defaultChecked={true} /> Any photos that have been submitted
//       </div>
//       <div className="chair-row">
//         <Checkbox defaultChecked={true} /> Contact person's email address
//       </div>
//       <div className="chair-row">
//         <Checkbox defaultChecked={true} /> Contact person's mobile phone number
//       </div>
//     </div>
//   </div>



//----------------------------------------------------------------------------------------------------



const Summary = ({contact}) =>
  <div>
    <h2>Summary</h2>
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



//----------------------------------------------------------------------------------------------------


const Checkout = ({contact}) =>
  <div>
    <h2>Checkout</h2>
    <p>Blurb
    </p>
    <p>COMING SOON!</p>
  </div>




//----------------------------------------------------------------------------------------------------
//
//  Support components
//
//

const Input = ({ field, value, placeHolder="", onChange, className="edit-input", children="" }) =>
  <div className={className}>
    {children &&
      <p>{children}</p>
    }
    <input
      value={value}
      type="text"
      placeholder={placeHolder}
      onChange={(evt) => onChange(evt, field)}
    />
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


// const EditAge = ({ field, value, onChange, className="edit-age", children }) =>
//   <div className={className}>
//     <p>{children}</p>
//     <input
//       value={value}
//       type="text"
//       onChange={(evt) => onChange(evt, field)}
//     />
//   </div>


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
    <Country value={contact.country} onChange={onChangeCountry}/>
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

const PeopleType = ({value, onChange, className="edit-people"}) => {
      const defaultOpt = optionsPeopleTypes.find(opt => (opt.value === value));
        return (
          <div className={className}>
            <Select
              options={optionsPeopleTypes}
              defaultValue={defaultOpt}
              placeholder={"Select..."}
              onChange={onChange}
              styles={customStylesPeopleTypes}
            />
          </div>
        );
    }

const RembLunch = ({value, menuInfo, isDisabled, onChange, className="edit-remb-lunch"}) => {
      const optionsRembLunch = Object.keys(menuInfo).map(k => { return { label: menuInfo[k], value: k } });
      const defaultOpt = optionsRembLunch.find(opt => (opt.value === value));
      return (
        <div className={className}>
          <Select
            options={optionsRembLunch}
            defaultValue={defaultOpt}
            placeholder={"Select..."}
            isDisabled={isDisabled}
            onChange={onChange}
            styles={customStylesPeopleTypes}
          />
        </div>
      );
    }

const Country = ({value, onChange, className="edit-country"}) => {
    const defaultOpt = optionsCountries.find(opt => (opt.value === value));
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
    {pageNum > pages.START+1  &&
      <Button className="button button-prev" onClick={onClickPrev}>BACK</Button>
    }
    {pageNum < pages.END-1  &&
      <Button className="button button-next" onClick={onClickNext}>NEXT</Button>
    }
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

const Checkbox = ({ name, defaultChecked, onChange, className='edit-checkbox' }) =>
  <input
    type="checkbox"
    name={name}
    onChange={onChange}
    className={className}
    defaultChecked={defaultChecked}
  />


function ucFirst(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function smartFixName(text) {

    text = text.trim();

    // Don't do anything if the text has BOTH upper and lowercase letters
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
    stateProv = stateProv.trim();
    return (stateProv.length <= 2) ? stateProv.toUpperCase() : smartFixName(stateProv);
}


function smartFixPostalCode(postalCode) {
    return postalCode.toUpperCase();
}


function smartFixPhone(phone) {
    phone = phone.replace(/\D/g, '');
    if (phone.length > 10) {
      phone = phone.replace(/^(\d+)(\d{3})(\d{3})(\d{4})$/, "+$1 ($2) $3-$4");
    } else if (phone.length === 10) {
      phone = phone.replace(/^(\d{3})(\d{3})(\d{4})$/, "($1) $2-$3");
    }
    return (phone);
}


function smartFixEmail(email) {
    email = email.trim().replace(/\s+/g, "");
    //  Correct misspellings of gmail.com, etc
    return email.toLowerCase();
}


export default App;
