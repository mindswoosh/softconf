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
import {RadioGroup, Radio} from 'react-radio-group';
import './App.css';

// import FloatingLabelInput from 'react-floating-label-input';
// import 'react-floating-label-input/dist/react-floating-label-input.css';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove,
} from 'react-sortable-hoc';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleRight, faHandPointRight, faQuestionCircle, faBars } from '@fortawesome/free-solid-svg-icons'


library.add(faAngleDoubleRight);
library.add(faHandPointRight);
library.add(faQuestionCircle);
library.add(faBars);

const DEBUG = false;  //  Set to false for production

var nextID = 10000;

var pageNum = 0;

const pages = {
  START:        pageNum++,
  WELCOME:      pageNum++,
  CONTACT:      pageNum++,
  ATTENDEES:    pageNum++,
  CLINICS:      pageNum++,
  DINNER:       pageNum++,
  WORKSHOPS:    pageNum++,
  YOUNGERSIB:   pageNum++,
  OLDERSIB:     pageNum++,
  CHILDCARE:    pageNum++,
  REMEMBRANCE:  pageNum++,
  PICNIC:       pageNum++,
  DIRECTORY:    pageNum++,
  PHOTOS:       pageNum++,
  SOFTWEAR:     pageNum++,
  SUMMARY:      pageNum++,
  CHECKOUT:     pageNum++,
  END:          pageNum++,
};

console.assert(Object.keys(pages).find( (name,i) => { return pages[name] !== i} ) === undefined, 'Page Enum is incorrect');

const countries = ['United States', 'Canada', 'Mexico', 'United Kingdom', '-----', 'Afghanistan', 'Åland Islands', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bangladesh', 'Barbados', 'Bahamas', 'Bahrain', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'British Indian Ocean Territory', 'British Virgin Islands', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Burma', 'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'Christmas Island', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Congo-Brazzaville', 'Congo-Kinshasa', 'Cook Islands', 'Costa Rica', 'Croatia', 'Curaçao', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'El Salvador', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Federated States of Micronesia', 'Fiji', 'Finland', 'France', 'French Guiana', 'French Polynesia', 'French Southern Lands', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Heard and McDonald Islands', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfolk Island', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn Islands', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Réunion', 'Romania', 'Russia', 'Rwanda', 'Saint Barthélemy', 'Saint Helena', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Martin', 'Saint Pierre and Miquelon', 'Saint Vincent', 'Samoa', 'San Marino', 'São Tomé and Príncipe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Sint Maarten', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Georgia', 'South Korea', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Svalbard and Jan Mayen', 'Sweden', 'Swaziland', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Vietnam', 'Venezuela', 'Wallis and Futuna', 'Western Sahara', 'Yemen', 'Zambia', 'Zimbabwe'];

const optionsCountries = countries.map(opt => ({ label: opt, value: opt }));

const eventInfoDefault = {
  eventTitle: '2019 Conference Registration',
  workshopSessions: [
      {
        id: 1,
        name:   "Session 1",
        workshops: [
          {
            id:           "1a",
            title:        "None",
            moderator:    "",
            description:  ""
          },
          {
            id:           "1b",
            title:        "Guardianship & Trust",
            moderator:    "Attorney Nancy Lee, WA State Bar",
            description:  "When your child turns 18 - An attorney will discuss how to apply for Guardianship and understand why it's necessary. She will also discuss how a Trust can be helpful."
          },
          {
            id:           "1c",
            title:        "TRIS Project",
            moderator:    "Deborah A. Bruns, Ph.D",
            description:  "This session will provide an overview of activities of the Tracking Rare Incidence Syndromes (TRIS) project during the past 12 months highlighting areas of data analyses and results and recently published articles."
          },
          {
            id:           "1d",
            title:        "Digital Scrapbooking",
            moderator:    "Chelsea Dye, MAcc, JD",
            description:  "Learn how to create amazing professionally-bound photo books of your treasured family photos using your computer rather than boxes full of scissors, paper and glue."
          },
          {
            id:           "1e",
            title:        "Occupational Therapy/Floor Time - Part 1",
            moderator:    "Joyce Vipond OT",
            description:  "ntroduction to the floor time model of playful engagement for developing social & emotional development. Exploring its impact on cognition and the ability to be engaged in the world."
          }
        ]
      },
      {
        id: 2,
        name:   "Session 2",
        workshops: [
          {
            id:           "2a",
            title:        "None",
            moderator:    "",
            description:  ""
          },
          {
            id:           "2b",
            title:        "Occupational Therapy/Floor Time - Part 2",
            moderator:    "Joyce Vipond OT",
            description:  "Continuation from Part 1...Live treatment demonstrations, videos and practical ideas for engaging your children."
          },
          {
            id:           "2c",
            title:        "Genetics",
            moderator:    "John Carey, M.D., MPH",
            description:  "The goals of the workshop are to describe the syndrome patterns of Trisomy 13 & 18 and address the questions of the attendees."
          },
          {
            id:           "2d",
            title:        "'Tell Your Story'",
            moderator:    "Sheryl Crosier, MA, MBA (Simon's Law)",
            description:  "Create a Remembrance Sash and photo button for the Remembrance Outing and Picnic. For our Angel parents."
          },
          {
            id:           "2e",
            title:        "Transitioning Services ",
            moderator:    "Tami McGrath, Pierce Co, WA Coalition for Developmental Disabilities",
            description:  "When your child turns 18. Discuss how parents can find services and understand how to go through the transition process."
          }
        ]
      },
      {
        id: 3,
        name:   "Session 3",
        workshops: [
          {
            id:           "3a",
            title:        "None",
            moderator:    "",
            description:  ""
          },
          {
            id:           "3b",
            title:        "Bridging - Experiencing Loss & Going Forward",
            moderator:    "Heather J. Neal, LICSW, CT",
            description:  "Professional Counselor from Mary Bridge Children's Hospital who works with families and their loss."
          },
          {
            id:           "3c",
            title:        "I.E.P - Individualized Education Program",
            moderator:    "Candice Webster - Exec. Dir. for Special Services & Intervention, Orting SD, WA",
            description:  "When your child needs an I.E.P for school. Understanding how it works and communicating and advocating for your child's needs while in school."
          },
          {
            id:           "3d",
            title:        "Vision, light sensitivity & seizures",
            moderator:    "Dr. Steve Cantrell, OD",
            description:  "New information on how indoor and outdoor light affects your child and seizures. Detailed handouts with information on how to correct this newly discovered photosensitive issue. Benefits for mom and dad too!"
          },
        ]
      },
      {
        id: 4,
        name:   "Session 4",
        workshops: [
          {
            id:           "4a",
            title:        "None",
            moderator:    "",
            description:  ""
          },
          {
            id:           "4b",
            title:        "Dad's Only - Sharing Workshop",
            moderator:    "Moderated by Eric Marohn, SOFT Board of Directors",
            description:  ""
          },
          {
            id:           "4c",
            title:        "Mom's Only - Sharing Workshop",
            moderator:    "Moderated by Cindy Cook, LCSW, SOFT Board of Directors",
            description:  ""
          },
        ]
      },
    ],
  clinicsBlurb: "This year’s Soft Clinics will be held at Sonny's Children’s Hospital on Thursday July 35th. Please number your clinic preferences (up to 5). We will attempt to schedule each child into 3 of the 5 preferences.",
  clinics: [
      'Cardiology',
      'Neurology',
      'GI',
      'Pulmonology',
      'Vision',
      'Orthopedic',
      'Genetics',
    ],
  youngerSibOutingBlurb: "The Younger Sibling outing is for children ages 5 to 11 and will be at the Wild Waves water park where there are number of rides and attractions especially for younger kids, from the Enchanted Railway to the Kiddie Boats. Everyone will have plenty of fun! Lunch is included and so is a SOFT T-shirt!",
  olderSibOutingBlurb: "The Older Sibling outing is for children 12 and up and will be at the Woodland Park Zoo where they can explore exhibits and get close to more than 1,100 animals and 300 species—including some of the world's most critically endangered. Lunch is included in the outing and every child will get a SOFT T-shirt.",
  
  remembranceBlurb: "There will be a Remembrance Outing for families who have lost a child. If you have lost a child and plan to attend, please put a checkmark next to each person who will be attending, and select the type of box lunch for each. Otherwise, simply click the Next button.",
  remembranceMenu: {
      V: 'Vegetarian',
      N: 'Non-vegetarian',
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



const customStyles = {
  option: (base, state) => ({
    ...base,
    // borderBottom: '1px dotted pink',
    // color: state.isFullscreen ? 'red' : 'green',
    padding: 5,
  }),
  control: (base, state) => ({        /* Select line with drop-down arrow */
    ...base,
    width: 325,
    padding: 0,
    marginTop: 10,
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
    height: 135,
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
    width: 325,
  }),
}



//  I should deep clone this from the previous style and change what's appropriate
const customStylesPeopleTypes = {
  option: (base, state) => ({
    ...base,
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


const optionsAges = [
  { label: "< 6 months", value: 0 },
  { label: "1 year old", value: 1 },  
  { label: "2",          value: 2 },
  { label: "3",          value: 3 },
  { label: "4",          value: 4 },
  { label: "5",          value: 5 },
  { label: "6",          value: 6 },
  { label: "7",          value: 7 },
  { label: "8",          value: 8 },
  { label: "9",          value: 9 },
  { label: "10",         value: 10 },
  { label: "11",         value: 11 },
  { label: "12",         value: 12 },
  { label: "13",         value: 13 },
  { label: "14",         value: 14 },
  { label: "15",         value: 15 },
  { label: "16",         value: 16 },
  { label: "17",         value: 17 },
];


const optionsDiagnoses = [
  { label: "Trisomy 18",  value: "Trisomy 18" },
  { label: "Trisomy 13",  value: "Trisomy 13" },
  { label: "Trisomy 9 Mosaic",  value: "Trisomy 9 Mosaic" },
  { label: "Trisomy 18 Mosaic",  value: "Trisomy 18 Mosaic" },
  { label: "Trisomy 13 Mosaic",  value: "Trisomy 13 Mosaic" },
  { label: "Other", value: "Other"},
];


const optionsShirtSizes = [
  { label: "Youth - S",    value: "ys"   },
  { label: "Youth - M",    value: "ym"   },  
  { label: "Youth - L",    value: "yl"   },
  { label: "Youth - XL",   value: "yxl"  },
  { label: "Adult - S",    value: "s"    },
  { label: "Adult - M",    value: "m"    },
  { label: "Adult - L",    value: "l"    },
  { label: "Adult - XL",   value: "xl"   },
  { label: "Adult - XXL",  value: "xxl"  },
  { label: "Adult - XXXL", value: "xxxl" },
];


function attendee(firstName, lastName, peopleType, age, sessions) {

  let attendee = {
    id: nextID++,
    firstName,
    lastName,
    peopleType,

    // Adults
    rembOuting: 0,
    rembLunch:  '',
    chapterChair: '',
    workshops: {},

    // Child
    age:         age,
    sibOuting:   false,
    shirtSize:   '',

    // SOFT Child
    dateOfBirth: null,
    diagnosis:   null,
    eatsMeals:   true,

    // Professional
  };

  sessions.forEach( (sess) => {
    attendee.workshops[sess.id] = sess.workshops[0].id
  });

  return attendee;
}


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentPage: pages.WELCOME,
      pageHistory: [],                //  Keep a history of the pages visited for use by the Back button

      eventInfo: {
        eventTitle: '',
        workshopSessions: [],
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

      attendees: [],

      workshopAttendee: 0,
    };

    this.setEventInfo         = this.setEventInfo.bind(this);
    this.onChangeContactInfo  = this.onChangeContactInfo.bind(this);
    this.onChangeCountry      = this.onChangeCountry.bind(this);
    
    this.onAddAttendee        = this.onAddAttendee.bind(this);
    this.onRemoveAttendee     = this.onRemoveAttendee.bind(this);
    this.onChangeAttendeeList = this.onChangeAttendeeList.bind(this);
    this.onChangeSelection    = this.onChangeSelection.bind(this);
    this.onChangeMeals        = this.onChangeMeals.bind(this);
    this.onChangeDate         = this.onChangeDate.bind(this);

    this.onChangeRembOuting   = this.onChangeRembOuting.bind(this);
    this.onChangeRembLunch    = this.onChangeRembLunch.bind(this);

    this.onChangeWorkshops    = this.onChangeWorkshops.bind(this);

    this.onChangeSibOuting    = this.onChangeSibOuting.bind(this);
    this.onChangeShirtSize    = this.onChangeShirtSize.bind(this);

    this.nextAdultPro         = this.nextAdultPro.bind(this);
    this.nextYoungerSib       = this.nextYoungerSib.bind(this);
    this.nextOlderSib         = this.nextOlderSib.bind(this);
    this.nextChildCare        = this.nextChildCare.bind(this);

    this.onClinicSortEnd      = this.onClinicSortEnd.bind(this);

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

    const eventInfo = eventInfoDefault;    // Eventually, this will be pulled from the DB

    let attendees = [];

    if (DEBUG) {
      attendees = [
        attendee("Steve", "Maguire",   peopleTypes.ADULT,        -1, eventInfoDefault.workshopSessions),
        attendee("Beth",  "Mountjoy",  peopleTypes.CHILD,         5, eventInfoDefault.workshopSessions),
        attendee("Terre", "Krotzer",   peopleTypes.PROFESSIONAL, -1, eventInfoDefault.workshopSessions),
        attendee("Jane",  "Mountjoy",  peopleTypes.CHILD,        11, eventInfoDefault.workshopSessions),
        attendee("Helen", "Mountjoy",  peopleTypes.CHILD,        12, eventInfoDefault.workshopSessions),
        attendee("Cliff", "Mountjoy",  peopleTypes.CHILD,        17, eventInfoDefault.workshopSessions),
        attendee("Baby",  "Mountjoy",  peopleTypes.CHILD,         3, eventInfoDefault.workshopSessions),
      ];
    }

    this.setState({
      eventInfo,
      attendees
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
                    onChangeSelection={this.onChangeSelection}
                    onChangeMeals={this.onChangeMeals}
                    onChangeDate={this.onChangeDate}
                  />,

              [pages.CLINICS]:
                  <Clinics
                    clinics={eventInfo.clinics}
                    onSortEnd={this.onClinicSortEnd}
                    blurb={eventInfo.clinicsBlurb}
                  />,

              [pages.REMEMBRANCE]:
                  <Remembrance
                    attendees={attendees}
                    onChange={this.onChangeRembOuting}
                    menuInfo={eventInfo.remembranceMenu}
                    blurb={eventInfo.remembranceBlurb}
                    onChangeLunch={this.onChangeRembLunch}
                  />,

              [pages.CHILDCARE]:
                  <Childcare />,

              [pages.DINNER]:
                  <Dinner />,

              [pages.WORKSHOPS]:
                  <Workshops 
                    attendee={attendees[this.state.workshopAttendee]} 
                    sessions={eventInfo.workshopSessions}
                    onChange={this.onChangeWorkshops}
                  />,

              [pages.YOUNGERSIB]:
                  <YoungerSib attendees={attendees} onChange={this.onChangeSibOuting} onChangeShirtSize={this.onChangeShirtSize} blurb={eventInfo.youngerSibOutingBlurb} />,

              [pages.OLDERSIB]:
                  <OlderSib attendees={attendees} onChange={this.onChangeSibOuting} onChangeShirtSize={this.onChangeShirtSize} blurb={eventInfo.olderSibOutingBlurb} />,

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


  //  Pass in -1 if you want to find the first adult or professional
  nextAdultPro(currentAdult) {
    let { attendees } = this.state;

    for (let i = currentAdult+1; i < attendees.length; i++) {
      if (attendees[i].peopleType === peopleTypes.ADULT  ||  attendees[i].peopleType === peopleTypes.PROFESSIONAL) {
        return i;
      }
    }
    
    return -1;
  } 


  //  Pass in -1 if you want to find the first young child
  nextYoungerSib(currentSib) {
    let { attendees } = this.state;

    for (let i = currentSib+1; i < attendees.length; i++) {
      if (attendees[i].peopleType === peopleTypes.CHILD  &&  attendees[i].age >= 5  &&  attendees[i].age < 12) {
        return i;
      }
    }

    return -1;
  }

  //  Pass in -1 if you want to find the first older child
  nextOlderSib(currentSib) {
    let { attendees } = this.state;

    for (let i = currentSib+1; i < attendees.length; i++) {
      if (attendees[i].peopleType === peopleTypes.CHILD  &&  attendees[i].age >= 12) {
        return i;
      }
    }
    
    return -1;
  } 

  //  Pass in -1 if you want to find the first child that qualifies for child care
  nextChildCare(currentSib) {
    let { attendees } = this.state;

    for (let i = currentSib+1; i < attendees.length; i++) {
      if (attendees[i].peopleType === peopleTypes.CHILD  &&  attendees[i].age <= 11) {
        return i;
      }
    }
    
    return -1;
  } 


  //  For draggable clinics lists
  onClinicSortEnd = ({oldIndex, newIndex}) => {
    const {eventInfo} = this.state;

    eventInfo.clinics = arrayMove(eventInfo.clinics, oldIndex, newIndex)
    this.setState({
      eventInfo,
    });
  };


  // FIX -- pageHistory should be a state variable, not a global
  onPrevPage(event) {
    let { currentPage, pageHistory } = this.state;

    if (currentPage === pages.WORKSHOPS) {

      for (let i=this.state.workshopAttendee-1; i >= 0; i--) {
        let peopleType = this.state.attendees[i].peopleType;

        if (peopleType === peopleTypes.ADULT  ||  peopleType === peopleTypes.PROFESSIONAL) {
          this.setState({
            workshopAttendee: i,
          });

          return;
        }
      }
    }

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

          if (!DEBUG  &&  (contact.firstName === ''  ||  contact.lastName === '')) {
            alert("Oops! Please enter the name of the Contact Person.");
          }
          else {
            if (attendees.length === 0) {
                attendees.push( attendee(contact.firstName, contact.lastName, peopleTypes.ADULT, -1, this.state.eventInfo.workshopSessions) );
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
            a.firstName = smartFixName(a.firstName.trim());
            a.lastName  = smartFixName(a.lastName.trim());
            return a;
          });

          //  Remove totally empty rows
          attendees = attendees.filter(a => { return (a.firstName !== ''  ||  a.lastName !== '') });

          let bad_attendee = attendees.find( a => { 
            return (  a.firstName === ''  ||  a.lastName === ''  ||  a.peopleType === ''  ||  (a.peopleType === peopleTypes.CHILD  &&  a.age === null) ||
                      (a.peopleType === peopleTypes.SOFTCHILD  &&  (a.dateOfBirth === null  ||  a.diagnosis === null) )
                   ) 
          });


          if (bad_attendee !== undefined) {
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


      case pages.DINNER:
          // let attendees = this.state.attendees;

          pageHistory.push(currentPage);

          this.setState({
            pageHistory,
            currentPage: pages.WORKSHOPS,       //  This assumes that there will always be one adult
          });

          break;

      case pages.CLINICS:
          // let attendees = this.state.attendees;

          pageHistory.push(currentPage);
          const newPage = pages.WORKSHOPS;

          this.setState({
            pageHistory,
            currentPage: newPage,
          });

          break;

      case pages.WORKSHOPS:

          let nextAdult = this.nextAdultPro(this.state.workshopAttendee);

          if (nextAdult !== -1) {               //  Stay on this page, just change attendees
            this.setState({
              workshopAttendee: nextAdult,
            });
          }
          else {                                //  Move on to next page...
            pageHistory.push(currentPage);

            let nextSib;

            if ((nextSib = this.nextYoungerSib(-1)) !== -1) {        //  Skip younger sibling page if none
                this.setState({
                  pageHistory,
                  youngerSib: nextSib,
                  currentPage: pages.YOUNGERSIB,
                });
            }
            else if ((nextSib = this.nextOlderSib(-1)) !== -1) {     //  Skip older sibling page if none
                this.setState({
                  pageHistory,
                  currentPage: pages.OLDERSIB,
                });
            }
            else if ((nextSib = this.nextChildCare(-1)) !== -1) {     //  Skip child care page if none
                this.setState({
                  pageHistory,
                  currentPage: pages.CHILDCARE,
                });
            } else {
              this.setState({
                pageHistory,
                currentPage: pages.REMEMBRANCE,
              });
            }
          }

          break;


      case pages.YOUNGERSIB:
          {
            attendees = attendees.map(a => {
              if (!a.sibOuting) {
                a.shirtSize = '';                        //  No shirts for people not attending
              }
              return a;
            });

            let $missing_shirt = attendees.find( a => { return (a.peopleType === peopleTypes.CHILD  &&  a.age >= 5  &&  a.age < 12  &&  a.sibOuting  &&  a.shirtSize === '' ) });
            if ($missing_shirt) {
              alert("Oops! Please select a shirt for each person attending the outing.");
            }
            else {
              let nextSib = this.nextOlderSib(-1);

              pageHistory.push(currentPage);
              if (nextSib !== -1) {                         //  Skip older sibling page if none
                  this.setState({
                    pageHistory,
                    attendees,
                    currentPage: pages.OLDERSIB,
                  });
              }
              else if ((nextSib = this.nextChildCare(-1)) !== -1) {     //  Skip child care page if none
                  this.setState({
                    pageHistory,
                    attendees,
                    currentPage: pages.CHILDCARE,
                  });
              } 
              else {
                  this.setState({
                    pageHistory,
                    attendees,
                    currentPage: pages.REMEMBRANCE,
                  });
              }
            }
          }
          break;

      case pages.OLDERSIB:
          {
            attendees = attendees.map(a => {
              if (!a.sibOuting) {
                a.shirtSize = '';                        //  No shirts for people not attending
              }
              return a;
            });

            let $missing_shirt = attendees.find( a => { return (a.peopleType === peopleTypes.CHILD  &&  a.age >= 12  &&  a.sibOuting  &&  a.shirtSize === '') });
            if ($missing_shirt) {
              alert("Oops! Please select a shirt for each person attending the outing.");
            }
            else {
              pageHistory.push(currentPage);

              if (this.nextChildCare(-1) !== -1) {     //  Skip child care page if none
                this.setState({
                  pageHistory,
                  attendees,
                  currentPage: pages.CHILDCARE,
                });
              } 
              else {
                this.setState({
                  attendees,
                  pageHistory,
                  currentPage: pages.REMEMBRANCE,
                });
              }
            }
          }
          break;

      case pages.CHILDCARE:
          // let attendees = this.state.attendees;

          pageHistory.push(currentPage);

          this.setState({
            pageHistory,
            currentPage: pages.REMEMBRANCE,
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
            const newPage = pages.PICNIC;

            this.setState({
              attendees,
              pageHistory,
              currentPage: newPage,
            });
          }

          break;

      case pages.PICNIC:
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
      attendees.push( attendee(contactInfo.firstName, contactInfo.lastName,  peopleTypes.ADULT, -1, this.state.eventInfo.workshopSessions) );
    else
      attendees.push( attendee('', '', '', -1, this.state.eventInfo.workshopSessions) );

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


  onChangeSelection(opt, id, field) {
    let { attendees } = this.state;
    let i = attendees.findIndex(a => a.id === id);
    console.assert(i !== -1, "Warning -- couldn't find attendee in attendee list: id = " + id);
    attendees[i][field] = opt.value;
    this.setState ({
      attendees
    });
  }

  onChangeMeals(opt, id) {
    let { attendees } = this.state;
    let i = attendees.findIndex(a => a.id === id);
    console.assert(i !== -1, "Warning -- couldn't find attendee in attendee list: id = " + id);
    attendees[i].eatsMeals = !attendees[i].eatsMeals;
    this.setState ({
      attendees
    });
  }

  onChangeDate(date, id) {
    let { attendees } = this.state;
    let i = attendees.findIndex(a => a.id === id);
    console.assert(i !== -1, "Warning -- couldn't find attendee in attendee list: id = " + id);
    attendees[i].dateOfBirth = date;
    this.setState({
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
  //  Workshop pages
  

  onChangeWorkshops(value, attendeeID, sessionID) {
    let { attendees } = this.state;

    let i = attendees.findIndex( (a) => { return (a.id === attendeeID) } );
    attendees[i].workshops[sessionID] = value;

    this.setState ({
      attendees
    });
  }



  //-------------------------------------------------------------------------------------------
  //  Process Sibling Outing pages
  

  onChangeSibOuting(event, id) {
    let { attendees } = this.state;
    let i = attendees.findIndex(a => a.id === id);
    console.assert(i !== -1, "Warning -- couldn't find attendee in attendee list: id = " + id);

    //  Flip state of attendance and lunch option
    attendees[i].sibOuting = !attendees[i].sibOuting;
    if (!attendees[i].sibOuting) {
      attendees[i].shirtSize = '';
    }
    this.setState ({
      attendees
    });
  }

  onChangeShirtSize(opt, id) {
    let { attendees } = this.state;
    let i = attendees.findIndex(a => a.id === id);
    console.assert(i !== -1, "Warning -- couldn't find attendee in attendee list: id = " + id);
    attendees[i].shirtSize = opt.value;
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
//  Implement draggable items

const DragHandle = SortableHandle(() => <span className="drag-thumb"><FontAwesomeIcon icon="bars" /></span>);   // This can be any component you want

const SortableItem = SortableElement(({value, index, i}) => {     //  TO-DO: Why is "index" undefined? Should be the same as "i"

  let choice;
  switch (i) {
    case 0:
      choice = 'Top Choice';
      break;
    case 1:
      choice = '2nd Choice';
      break;
    case 2:
      choice = '3rd Choice';
      break;
    default:
      choice = '';
  }

  return (
    <li className="drag-item">
      <DragHandle />
      <span className="clinic-name">{value}</span><span className="clinic-choice">{choice}</span>
    </li>
  );
});

const SortableList = SortableContainer(({items, i}) => {
  return (
    <ul className="sortable-container">
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} i={index} value={value} />
      ))}
    </ul>
  );
});



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


const pageTabs = [ 'Welcome', 'Attendees', 'Schedules', 'In Memory', 'Directory', 'SOFT Wear', 'Summary', 'Checkout' ];

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
      case pages.DINNER:
      case pages.WORKSHOPS:
      case pages.YOUNGERSIB:
      case pages.OLDERSIB:
      case pages.CHILDCARE:
        title = 'Schedules';
        break;
      case pages.REMEMBRANCE:
      case pages.PICNIC:
        title = 'In Memory';
        break;
      case pages.DIRECTORY:
      case pages.PHOTOS:
        title = 'Directory';
        break;
      case pages.SOFTWEAR:
        title = 'SOFT Wear';
        break;      
      case pages.SUMMARY:
        title = 'Summary';
        break;
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
    <p style={{marginBottom: 8}}>Please enter the contact information for the person handling this registration. The contact person
       does not need to be attending the conference.
    </p>
    <div style={{marginLeft: 35}}>
      <div>
        <Input label="FIRST name" value={contact.firstName} field="firstName" id="contact-firstname" onChange={onChangeContactInfo} />
        <Input label="LAST name"  value={contact.lastName}  field="lastName"  id="contact-lastname" onChange={onChangeContactInfo} />
      </div>
      <div>
        <div>
        <Input label="Address 1" value={contact.address1} field="address1" id="contact-address1" onChange={onChangeContactInfo} className="edit-input-2col" />
        </div>
        <Input label="Address 2" value={contact.address2} field="address2" id="contact-address2" onChange={onChangeContactInfo} className="edit-input-2col" />
        <div>
          <Input label="City" value={contact.city} field="city" id="contact-city" onChange={onChangeContactInfo} />
          <Input label="State/Prov/Region" value={contact.stateProv} field="stateProv" id="contact-stateProv" onChange={onChangeContactInfo} />
          <Input label="ZIP Code" value={contact.postalCode} field="postalCode" id="contact-postalCode" onChange={onChangeContactInfo} />
        </div>
        <Country value={contact.country} onChange={onChangeCountry}/>
      </div>
      <div className="phones">
        <Input label="Mobile Phone" value={contact.phoneMobile} field="phoneMobile" id="contact-mobile" onChange={onChangeContactInfo} />
        <Input label="Work Phone"   value={contact.phoneWork}   field="phoneWork"   id="contact-work"   onChange={onChangeContactInfo} />
        <Input label="Home Phone"   value={contact.phoneHome}   field="phoneHome"   id="contact-home"   onChange={onChangeContactInfo} />
      </div>
      <Input label="Best Email Address"  value={contact.email}  field="email" id="contact-email" onChange={onChangeContactInfo} className="edit-input-2col" />
    </div>
  </div>



//----------------------------------------------------------------------------------------------------



const Attendees = ({attendees, onRemove, onAdd, onChange, onChangeSelection, onChangeMeals, onChangeDate}) =>
  <div>
    <h2>Conference Attendees</h2>
    <p>Please list everybody in your party who will be attending any part of the Conference. If no one
       will be attending, simply click on the Next button.
    </p>
    {attendees.length > 0  &&
      <div>
        <p className="row-num">1.</p>
        <Input label="FIRST Name" value={attendees[0].firstName} id={"contact-firstname-" + attendees[0].id} onChange={event => onChange(event, attendees[0].id, "firstName")} />
        <Input label="LAST Name"  value={attendees[0].lastName}  id={"contact-lastname-" + attendees[0].id}  onChange={event => onChange(event, attendees[0].id, "lastName")} />
        <PeopleType value={attendees[0].peopleType} onChange={(opt) => onChangeSelection(opt, attendees[0].id, "peopleType")}/>
        <div className="edit-age"></div><Button onClick={() => onRemove(attendees[0].id)}>Remove</Button>
        {attendees.length > 1  &&
          attendees.slice(1).map( (a, i) =>
            <div className="attendee-row" key={a.id}>
              <p className="row-num">{i+2}.</p>
              <Input label="FIRST Name" value={a.firstName} id={"contact-firstname-" + a.id} onChange={event => onChange(event, a.id, "firstName")} />
              <Input label="LAST Name"  value={a.lastName}  id={"contact-lsstname-" + a.id}  onChange={event => onChange(event, a.id, "lastName")} />
              <PeopleType value={a.peopleType} onChange={(opt) => onChangeSelection(opt, a.id, "peopleType")}/>
              {a.peopleType !== peopleTypes.CHILD  &&
                <div className="edit-age"></div>
              }
              {a.peopleType === peopleTypes.CHILD  &&
                <Age label="Age" value={a.age}  id={"contact-age-" + a.id}  onChange={opt => onChangeSelection(opt, a.id, "age")} />
              }
              <Button onClick={() => onRemove(a.id)}>Remove</Button>
              {a.peopleType === peopleTypes.SOFTCHILD  &&
                <div>
                  <p className="row-num"></p>
                  Diagnosis: <Diagnosis label="Diagnosis" value={a.diagnosis} id={"contact-diagnosis-" + a.id}  onChange={opt => onChangeSelection(opt, a.id, "diagnosis")} /><span className="small-gap"></span>
                  Birthdate: <DatePicker
                    selected={a.dateOfBirth}
                    onChange={date => onChangeDate(date, a.id)}
                  /><span className="small-gap"></span>
                  <Checkbox defaultChecked={a.eatsMeals} onChange={opt => onChangeMeals(opt, a.id)} /> Eats meals?
                </div>
              }
            </div>
          )
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


const Workshops = ({attendee, sessions, onChange}) =>
  <div>
    <h2>Workshops</h2>
    <p>Please choose which workshops that <strong>{attendee.firstName} {attendee.lastName}</strong> will be attending. Refer to the brochure for 
       specific times that each workshop will be held.
    </p>
    <p className="indent"><strong>{attendee.firstName} {attendee.lastName} plans to attend:</strong></p>
    {
      sessions.map( (sess,i) =>
          <div key={sess.name} className="indent">
            <strong>{sess.name}</strong>
            <RadioGroup selectedValue={attendee.workshops[sess.id]} onChange={(val) => onChange(val, attendee.id, sess.id)}>
            {
              sess.workshops.map( (ws,i) =>
                <div key={ws.id} className="indent"><Radio value={ws.id} /> {ws.title}</div>
              )
            }
            </RadioGroup><br />
          </div>
        )
    }
  </div>


//----------------------------------------------------------------------------------------------------


const YoungerSib = ({attendees, onChange, onChangeShirtSize, blurb}) =>
  <div>
    <h2>Younger Sibling Outing</h2>
    <p>{blurb}</p>
    <p>Check each child who will be attending the outing and choose a shirt size.</p>
    <div className="remembrance">
      {attendees.map( (a,i) => 
        {return a.peopleType === peopleTypes.CHILD  &&  a.age >= 5  &&  a.age < 12  &&
          <div key={a.id} className="indent">
            <Checkbox defaultChecked={a.sibOuting} onChange={event => onChange(event, a.id)} />
            <span className="remb-name">{a.firstName} {a.lastName}</span>
            <ShirtSize value={a.shirtSize} isDisabled={!a.sibOuting} onChange={(opt) => onChangeShirtSize(opt, a.id)} />
          </div>
        })
      }
      <p></p>
    </div>
  </div>


const OlderSib = ({attendees, onChange, onChangeShirtSize, blurb}) => 
  <div>
    <h2>Older Sibling Outing</h2>
    <p>{blurb}</p>
    <p>Check each child who will be attending the outing and choose a shirt size.</p>
    <div className="remembrance">
      {attendees.map( (a,i) => 
        { return a.peopleType === peopleTypes.CHILD  &&  a.age >= 12  &&
          <div key={a.id} className="indent">
            <Checkbox defaultChecked={a.sibOuting} onChange={event => onChange(event, a.id)} />
            <span className="remb-name">{a.firstName} {a.lastName}</span>
            <ShirtSize value={a.shirtSize} isDisabled={!a.sibOuting} onChange={(opt) => onChangeShirtSize(opt, a.id)} />
          </div>
        })
      }
      <p></p>
    </div>
  </div>


//----------------------------------------------------------------------------------------------------


const Clinics = ({clinics, onSortEnd, blurb}) => 
  <div>
    <h2>Clinics</h2>
    <p>{blurb}</p>
    <p>Rearrange the names of the clinics below from Most Interested to Least Interested by simultaneously clicking and dragging on the <span className="thumb-color"><FontAwesomeIcon icon="bars" /></span> character and moving
    the name of the clinic up or down.</p>
    <p>Move <strong>MOST Interested</strong> Clinic to the top:</p>
    <SortableList items={clinics} onSortEnd={onSortEnd} useDragHandle={true} />
    <p>Move the <strong>LEAST Interested</strong> Clinic to the bottom.</p>
    <p>Again, you must click and drag <i>simultaneously</i> on the <span className="thumb-color"><FontAwesomeIcon icon="bars" /></span> character to move the clinic name up or down.</p>
  </div>


//----------------------------------------------------------------------------------------------------



const Remembrance = ({ attendees, blurb, menuInfo, onChange, onChangeLunch }) =>
  <div>
    <h2>Remembrance Outing</h2>
    <p>{blurb}</p>
    <div className="remembrance">
      {attendees.map( (a,i) => 
        {return (a.peopleType === peopleTypes.ADULT)  && 
          <div key={a.id} className="indent">
            <Checkbox defaultChecked={a.rembOuting} onChange={event => onChange(event, a.id)} />
            <span className="remb-name">{a.firstName} {a.lastName}</span>
            <RembLunch value={a.rembLunch} menuInfo={menuInfo} isDisabled={!a.rembOuting} onChange={(opt) => onChangeLunch(opt, a.id)} />
          </div>
        })
      }
    </div>
  </div>



//----------------------------------------------------------------------------------------------------


const Childcare = ({contact}) =>
  <div>
    <h2>Childcare</h2>
    <p>Day care is available for kids ages infant to ? during the following hours..
    </p>
    <b>
    <p>INFO TO GATHER:</p>
      <p>
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


const Input = ( {label, value, id, field="", onChange, className="edit-input-1col"}) =>
  <div className={className}>
    <input
      type="text"
      id={id}
      value={value}
      placeholder={label}
      className={className}
      onChange={(evt) => onChange(evt, field)}
    />
  </div>

// const Input = ( {label, value, id, field="", onChange, className="edit-input-1col"}) =>
//   <div className={className}>
//     <FloatingLabelInput
//       id={id}
//       value={value}
//       label={label}
//       shrink={50}
//       onChange={(evt) => onChange(evt, field)}
//     />
//   </div>



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



const Age = ({value, onChange, className="edit-age"}) => {
      const defaultOpt = optionsAges.find(opt => (opt.value === value));
        return (
          <div className={className}>
            <Select
              options={optionsAges}
              defaultValue={defaultOpt}
              placeholder={"Age"}
              onChange={onChange}
              styles={customStylesPeopleTypes}
            />
          </div>
        );
    }


const Diagnosis = ({value, onChange, className="edit-diagnosis"}) => {
      const defaultOpt = optionsDiagnoses.find(opt => (opt.value === value));
        return (
          <div className={className}>
            <Select
              options={optionsDiagnoses}
              defaultValue={defaultOpt}
              placeholder={"Diagnosis"}
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


const ShirtSize = ({value, isDisabled, onChange, className="edit-shirt-size"}) => {
      const defaultOpt = optionsShirtSizes.find(opt => (opt.value === value));
      return (
        <div className={className}>
          <Select
            options={optionsShirtSizes}
            defaultValue={defaultOpt}
            placeholder={"Select..."}
            isDisabled={isDisabled}
            onChange={onChange}
            styles={customStylesPeopleTypes}
          />
        </div>
      );
    }


const PrevNextButtons = ({pageNum, contact, onClickPrev, onClickNext}) =>
  <div className="button-bar">
    {pageNum > pages.START+1  &&
      <Button className="button button-prev" onClick={onClickPrev}>BACK</Button>
    }
    {pageNum < pages.END-1  &&
      <Button className="button button-next" onClick={onClickNext}>NEXT</Button>
    }
  </div>



const Checkbox = ({ name, defaultChecked, onChange, className }) =>
  <input
    type="checkbox"
    name={name}
    onChange={onChange}
    className={className}
    defaultChecked={defaultChecked}
  />


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
