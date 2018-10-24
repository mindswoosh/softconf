//
//  Soft Convention Registration
//
//   9/18/18 v0.1 Steve Maguire steve@stormdev.com


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
  REMEMBRANCE:  4,
  SCHEDULES:    5,
  BALLOONS:     6, 
  CHAPTERCHAIR: 7,
  DIRECTORY:    8,
  SOFTWEAR:     9,
  SUMMARY:      10,
  CHECKOUT:     11,
  END:          12,
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
  { label: "SOFT child",   value: peopleTypes.SOFTCHILD },
  { label: "Child",        value: peopleTypes.CHILD },  
  { label: "Adult",        value: peopleTypes.ADULT },
  { label: "Professional", value: peopleTypes.PROFESSIONAL },
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
        attendee("Steve", "Maguire", peopleTypes.ADULT),
        attendee("Beth", "Mountjoy", peopleTypes.CHILD),
        attendee("Terre", "Krotzer", peopleTypes.PROFESSIONAL),
        // { id: 5, firstName: "Steve", lastName: "Maguire", peopleType: peopleTypes.ADULT, rembOuting: 0, rembLunch: '', chapterChair: '' },
        // { id: 21, firstName: "Beth", lastName: "Mountjoy", peopleType: peopleTypes.CHILD, rembOuting: 0, rembLunch: '', chapterChair: '' },
        // { id: 37, firstName: "Terre", lastName: "Krotzer", peopleType: peopleTypes.PROFESSIONAL, rembOuting: 0, rembLunch: '', chapterChair: '' },
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
          T: 'Tuna Salad'
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

              [pages.REMEMBRANCE]:
                  <Remembrance
                    attendees={attendees}
                    onChange={this.onChangeRembOuting}
                    menuInfo={eventInfo.remembranceMenu}
                    onChangeLunch={this.onChangeRembLunch}
                  />,

              [pages.SCHEDULES]:
                  <Schedules contact={contactInfo} />,

              [pages.CHAPTERCHAIR]:
                  <ChapterChair
                    attendees={attendees}
                    onChange={this.onChangeChapterChair}
                    // menuInfo={eventInfo.remembranceMenu}
                    // onChangeLunch={this.onChangeRembLunch}
                  />,

              [pages.DIRECTORY]:
                  <Directory contact={contactInfo} />,

              [pages.SOFTWEAR]:
                  <SoftWear />,

              [pages.SUMMARY]:
                  <ContactSummary contact={contactInfo} />,

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

          //  Error check
          //  alert() if errors

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

          pageHistory.push(currentPage);

          this.setState({
            contactInfo: contact,
            pageHistory,
            currentPage: pages.ATTENDEES,
          });

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
            const newPage = attendees.length > 0 ? pages.REMEMBRANCE : pages.SOFTWEAR;

            this.setState({
              attendees,
              pageHistory,
              currentPage: newPage,
            });
          }
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
            const newPage = pages.SCHEDULES;

            this.setState({
              attendees,
              pageHistory,
              currentPage: newPage,
            });
          }

          break;

      case pages.SCHEDULES:
          // let attendees = this.state.attendees;

          pageHistory.push(currentPage);
          const newPage = pages.CHAPTERCHAIR;

          this.setState({
            pageHistory,
            currentPage: newPage,
          });

          break;

      case pages.CHAPTERCHAIR:
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

      default:
          console.log("Error in onNextPage")
    }
  }


  //-------------------------------------------------------------------------------------------
  //  Process Attendees page
  
  onAddAttendee(event) {
    let { attendees, contactInfo } = this.state;
    if (attendees.length === 0)
      attendees.push(
        {
          id: nextID++,
          firstName:  contactInfo.firstName,
          lastName:   contactInfo.lastName,
          peopleType: peopleTypes.ADULT,
          rembOuting: 0,
          rembLunch:  '',
        }
      );

    else
      attendees.push(
        {
          id: nextID++,
          firstName:  '',
          lastName:   '',
          peopleType: '',
          rembOuting: 0,
          rembLunch:  '', 
        }
      );
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


const pageTabs = [ 'Welcome', 'Contact', 'Attendees', 'Schedules', 'Balloons', 'Summary', 'Checkout' ];

const PageBar = ({pageNum}) =>
  {
    let title = '';

    switch (pageNum) {
      case pages.WELCOME:
        title = 'Welcome';
        break;
      case pages.CONTACT:
        title = 'Contact';
        break;
      case pages.ATTENDEES:
        title = 'Attendees';
        break;
      case pages.REMEMBRANCE:
      case pages.SCHEDULES:
      case pages.CHAPTERCHAIR:
        title = 'Schedules';
        break;
      case pages.SOFTWEAR:
        title = 'SOFT Wear';
        break;
      case pages.BALLOONS:
        title = 'Balloons';
        break;
      case pages.SUMMARY:
      case pages.CHECKOUT:
        title = 'Summary';
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
    <p>If you haven't read the 2019 Conference Pamphlet yet, you'll want to do that first before going
       through this form so you know exactly what's going on. Having the pamphlet available as you fill
       out this registration form will be helpful.
    </p>
    <p>If you need a copy of the pamphlet, click this button:</p>
    <div className="welcome-button">
      <Button>Download Pamphlet</Button>
    </div>
    <p>To get started, click on the Next button.</p>
  </div>



//----------------------------------------------------------------------------------------------------



const ContactInfo = ({contact, onChangeContactInfo, onChangeCountry}) =>
  <div>
    <h2>Contact Information</h2>
    <p>Please enter the contact information for the person handling this registration. The contact person
       does not need to be attending the conference.
    </p>
    <div style={{marginLeft: 20}}>
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
  </div>



//----------------------------------------------------------------------------------------------------



const Attendees = ({attendees, onRemove, onAdd, onChange, onChangePeopleType}) =>
  <div>
    <h2>Conference Attendees</h2>
    <p>Please list everybody in your party who will be attending any part of the Conference. If no one
       will be attending, simply click on the Next button.
    </p>
    <p><FontAwesomeIcon icon="hand-point-right" /> Remember to include the contact person if that person will be attending.</p>
    {attendees.length  ?
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
      : null
    }
    <br />
    {attendees.length === 0 ?
        <Button onClick={onAdd}>Add a Person</Button>
      :
        <Button onClick={onAdd}>Add Another Person</Button>
    }
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
    </div>
  </div>


//----------------------------------------------------------------------------------------------------


const Schedules = ({contact}) =>
  <div>
    <h2>Schedules</h2>
    <p>Next we need to know what events each person will be attending. If you have any questions
       as you go down this list, please refer back to the schedule of events listed in the
       conference pamphlet. That pamphlet gives a complete description of each event and when
       it is being held.
    </p>
    <p>COMING SOON!</p>
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



const Directory = ({contact}) =>
  <div>
    <h2>Directory of Attendees</h2>
    <p>SOFT creates a Directory of Conference Attendees to be given to the attendees. It contains
       names, addresses, phone numbers, email addresses, and photos if you submit them.
    </p>
    <p>Check everything that you would like included in the Directory. By default, everything is
       included. Uncheck those items that you would like to have excluded from the Directory:
    </p>
    <p><FontAwesomeIcon icon="hand-point-right" /> If you don't want to be included in the Directory at all, uncheck every item.</p>
    <div className="chapter-chair">
      <div className="chair-row">
        <Checkbox defaultChecked={true} /> SOFT Child's name and Contact Person
      </div>
      <div className="chair-row">
        <Checkbox defaultChecked={true} /> Any photos that have been submitted
      </div>
      <div className="chair-row">
        <Checkbox defaultChecked={true} /> Contact person's email address
      </div>
      <div className="chair-row">
        <Checkbox defaultChecked={true} /> Contact person's mobile phone number
      </div>
    </div>
  </div>


//----------------------------------------------------------------------------------------------------



const SoftWear = ({contact}) =>
  <div>
    <h2>SOFT Wear</h2>
    <p>Get your shirts here!</p>
  </div>



//----------------------------------------------------------------------------------------------------



const ContactSummary = ({contact}) =>
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


function smartFixEmail(email) {
    email = email.trim().replace(/\s+/g, "");
    //  Correct misspellings of gmail.com, etc
    return email.toLowerCase();
}


export default App;
