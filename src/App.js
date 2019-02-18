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


//  Update Notes:
//  For event handlers, if we always pass the value and not the event|opt|whatever, then
//  a lot of the existing handlers could be cut to a much smaller number since they
//  would all simply take values and ids, and sometimes property names.


import React, { Component } from 'react';
import Select from 'react-select';
import {RadioGroup, Radio} from 'react-radio-group';
import ReactHtmlParser from 'react-html-parser';
import './App.css';

// import FloatingLabelInput from 'react-floating-label-input';
// import 'react-floating-label-input/dist/react-floating-label-input.css';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  SortableContainer,
  SortableElement,
  arrayMove,
} from 'react-sortable-hoc';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleLeft, faAngleDoubleRight, faHandPointRight, faQuestionCircle, faBars, faRibbon } from '@fortawesome/free-solid-svg-icons'


library.add(faAngleDoubleLeft);
library.add(faAngleDoubleRight);
library.add(faHandPointRight);
library.add(faQuestionCircle);
library.add(faBars);
library.add(faRibbon);

const DEBUG = true;  //  Set to false for production

var nextID = 10000;

var pageNum = 0;

const pages = {
  START:        pageNum++,
  WELCOME:      pageNum++,
  BASICS:       pageNum++,
  CONTACT:      pageNum++,
  SOFTANGELS:   pageNum++,
  ATTENDEES:    pageNum++,
  DINNER:       pageNum++,
  CLINICS:      pageNum++,
  WORKSHOPS:    pageNum++,
  YOUNGERSIB:   pageNum++,
  OLDERSIB:     pageNum++,
  CHILDCARE:    pageNum++,
  REMEMBRANCE:  pageNum++,
  PICNIC:       pageNum++,
  CHAPTERCHAIR: pageNum++,
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

  costAdult:            135,         // One free registration for board members
  costChild:             90,         // Children under 5? are free
  costSoftChild:          0,
  costProfessional:     135,
  costYoungerSibOuting:  35,
  costOlderSibOuting:    35,

  workshopSessions: [
      {
        id: 1,
        name:   "Session 1",
        workshops: [
          {
            id:           "1n",
            title:        "None",
            moderator:    "",
            description:  ""
          },
          {
            id:           "1a",
            title:        "Cardiac Surgery in T18, T13, and related disorders",
            moderator:    "Dr. James Hammel",
            description:  ""
          },
          {
            id:           "1b",
            title:        "Tapping to clear emotions",
            moderator:    "Rev. Robin Whitaker",
            description:  ""
          },
          // {
          //   id:           "1c",
          //   title:        "Digital Scrapbooking",
          //   moderator:    "Chelsea Dye, MAcc, JD",
          //   description:  "Learn how to create amazing professionally-bound photo books of your treasured family photos using your computer rather than boxes full of scissors, paper and glue."
          // },
          // {
          //   id:           "1d",
          //   title:        "Occupational Therapy/Floor Time - Part 1",
          //   moderator:    "Joyce Vipond OT",
          //   description:  "ntroduction to the floor time model of playful engagement for developing social & emotional development. Exploring its impact on cognition and the ability to be engaged in the world."
          // }
        ]
      },
      {
        id: 2,
        name:   "Session 2",
        workshops: [
          {
            id:           "2n",
            title:        "None",
            moderator:    "",
            description:  ""
          },
          {
            id:           "2a",
            title:        "",
            moderator:    "Dr. Steve Cantrell",
            description:  ""
          },
          {
            id:           "2b",
            title:        "Canvas Painting Party OR CARDMAKING Cost TBD",
            moderator:    "",
            description:  ""
          },
          {
            id:           "2c",
            title:        "Wheelchair and seating",
            moderator:    "Julie Hawkins, Mike Barner",
            description:  ""
          },
          // {
          //   id:           "2d",
          //   title:        "Transitioning Services ",
          //   moderator:    "Tami McGrath, Pierce Co, WA Coalition for Developmental Disabilities",
          //   description:  "When your child turns 18. Discuss how parents can find services and understand how to go through the transition process."
          // }
        ]
      },
      {
        id: 3,
        name:   "Session 3",
        workshops: [
          {
            id:           "3n",
            title:        "None",
            moderator:    "",
            description:  ""
          },
          {
            id:           "3a",
            title:        "Genetics",
            moderator:    "Dr. John Carey",
            description:  ""
          },
          {
            id:           "3b",
            title:        "TRIS",
            moderator:    "Debbie Bruns",
            description:  ""
          },
          // {
          //   id:           "3c",
          //   title:        "Vision, light sensitivity & seizures",
          //   moderator:    "Dr. Steve Cantrell, OD",
          //   description:  "New information on how indoor and outdoor light affects your child and seizures. Detailed handouts with information on how to correct this newly discovered photosensitive issue. Benefits for mom and dad too!"
          // },
        ]
      },
      {
        id: 4,
        name:   "Session 4",
        workshops: [
          {
            id:           "4n",
            title:        "None",
            moderator:    "",
            description:  ""
          },
          {
            id:           "4a",
            title:        "",
            moderator:    "Dr. Glenn Green, ENT?",
            description:  ""
          },
          {
            id:           "4b",
            title:        "CPR and First Aid",
            moderator:    "Allison Westman-Grigg RN-BSN",
            description:  ""
          },
        ]
      },
      {
        id: 5,
        name:   "Session 5",
        workshops: [
          {
            id:           "5n",
            title:        "None",
            moderator:    "",
            description:  ""
          },
          {
            id:           "5a",
            title:        "Moms Only - Sharing Workshop",
            moderator:    "",
            description:  ""
          },
          {
            id:           "5b",
            title:        "Dads Only - Sharing Workshop",
            moderator:    "",
            description:  ""
          },
        ]
      },
    ],

  clinicsBlurb: "This year’s Soft Clinics will be held at C.S. Mott Children’s Hospital on Friday July 19, 2019 from 1pm – 5pm. Please number your clinic preferences (up to 5). We will attempt to schedule each child into 3 of the 5 preferences.",
  clinics: [
      'Cardiology',
      'Neurology',
      'GI',
      'Pulmonology',
      'Vision',
      'Orthopedic',
      'Genetics',
    ],

  youngerSibOutingBlurb: "The Younger Sibling outing is for children ages 5 to 11 and will be at the Ann Arbor Children’s museum on _______.  Lunch is included as well as a goody bag and a SOFT Sibs T-shirt! Price for the outing is $35.",
  youngerSibCost: 35,

  olderSibOutingBlurb: "The Older Sibling outing is for children 12 and up and will be to the Detroit Zoo on July 18th. Lunch is included in the outing and every child will get a SOFT Sibs T-shirt. Price for the outing is $35.",
  olderSibCost: 35,

  childCareBlurb: "Childcare will be available during the Workshops and Clinics and is available for children up to age 11 and for SOFT children of any age. Please refer to the brochure for the times of the Workshops and Clinics you plan to attend in which you might need childcare.",
  childCareSessions: [
    {
      id: 'cc1',
      title: "Thursday 8am-Noon",
      pre5Only: true,
      boardOnly: false,
    },
    {
      id: 'cc2',
      title: "Thursday 1pm-5pm",
      pre5Only: true,
      boardOnly: false,
    },
    {
      id: 'cc3',
      title: "Friday 8am-Noon",
      pre5Only: false,
      boardOnly: true,
    },
    {
      id: 'cc4',
      title: "Friday 1pm-5pm",
      pre5Only: false,
      boardOnly: false,
    },
  ],

  welcomeDinnerBlurb: "Our annual welcome dinner will be held Thursday night from 6pm – 10pm.",
  adultMenu: [
      'Portabella Napolean',
      'Sliced Sirloin Medallions',
      'Chicken Cordon Bleu'
    ],
  kidsMenu: [
      'Chicken Tenders',
      'Mac \'n Cheese',
      'Carrots',
      'Celery',
    ],

  remembranceBlurb: "This year’s Remembrance Outing will be to Matthaei Botanical Gardens. This event is only for those who have lost a child. If you plan to attend, please put a checkmark next to each person who will be attending, and select the type of lunch for each. Otherwise, simply click the Next button.",
  remembranceMenu: {
      V: 'Vegetarian',
      N: 'Non-vegetarian',
    },

  picnicBlurb: "The Annual Ryan Cantrell Memorial Picnic and Balloon release will be at Dawn Farms on Saturday July 20th from 11:30–3pm.",

  shirtsBlurb: "Order your SOFT conference shirts ahead of time so they'll be ready and waiting for you when you check in at the conference. Note that the Sib shirts given to the kids at the Sibling Outings are different than these shirts.",

  shirtTypes: [
      {
        id: "shirt1",
        description: "Youth Short Sleeve T-shirt with Front & Back Logo. $12 each.",
        cost: 12,
        sizes: [
            'Small',
            'Medium',
            'Large',
            'Extra Large',
          ]
      },
      {
        id: "shirt2",
        description: "Unisex ADULT Short Sleeve T-shirt with Front & Back Logo. $15 each.",
        cost: 15,
        sizes: [
            'Small',
            'Medium',
            'Large',
            'Extra Large',
          ]
      },
      {
        id: "shirt3",
        description: "Unisex Pull-over hooded sweatshirt (ADULT ONLY) in Blue. $25 each.",
        cost: 25,
        sizes: [
            'Small',
            'Medium',
            'Large',
            'Extra Large',
          ]
      }
  ],

  directoryBlurb: "Each year we create a Conference Family directory. By including your contact information in the directory, families will be able keep in touch with each other after the conference. By default, we include your phone number, email address, and the city that you live in (the street address is NOT included).",
};



function selectStyle(width, height) {
  return {
    option: (base, state) => ({
      ...base,
    // borderBottom: '1px dotted pink',
    // color: state.isFullscreen ? 'red' : 'green',
      padding: 5,
    }),
    control: (base, state) => ({
      ...base,
      width: width,
      padding: 0,
      marginTop: 5,
      borderRadius: 0,
      minHeight: 0,
      height: 30,
      top: 4,                                     //  Space above actual edit box
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
         top: 15,                                 //  Space above text in edit box
      };
    },
    menuList: (base, state) => ({
      ...base,
      height: height,                             // Intentionally create a half line so people know they can scroll
      fontSize: 14,
      color: "#2e3a97",
    }),
    placeholder: (base, state) => ({
      ...base,
      color: "#999",
      fontSize: 14,
      top: 15,                                    //  Space above text in edit box
    }),
    container: (base, state) => ({
      ...base,
      width: width,
    }),
  };
}


const customStylesPeopleTypes = selectStyle(156, 110);

const customStyles = selectStyle(325, 135);

const customStylesNarrow = selectStyle(120, 110);

const customStylesDiagnosis = selectStyle(180, 122);


function arrayToOptions(a) {
  let options = [];

  a.forEach( (item) => {
    options.push(
      { label: item, value: item }
    );
  });

  return options;
}


const optionsYesNo = [
  { label: "Yes", value: 1 },
  { label: "No",  value: 0 },  
];

const peopleTypes = {
  SOFTCHILD:    "SOFT Child",
  CHILD:        "Child",
  ADULT:        "Adult",
  PROFESSIONAL: "Professional",
  SOFTANGEL:    "SOFT Angel",
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


const Diagnoses = [
  "Full Trisomy 18",
  "Full Trisomy 13",
  "Trisomy 9 Mosaic",
  "Trisomy 13 Mosaic",
  "Trisomy 18 Mosaic",
  "Partial Trisomy 13",
  "Partial Trisomy 18",
  "Other",
];

const optionsDiagnoses = arrayToOptions(Diagnoses);

const optionsShirtQuantity = arrayToOptions([1, 2, 3, 4, 5, 6, 7, 8, 9]);

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

const shirtDisplay = {
  ys:   "Youth - S",
  ym:   "Youth - M",
  yl:   "Youth - L",
  yxl:  "Youth - XL",
  s:    "Adult - S",
  m:    "Adult - M",
  l:    "Adult - L",
  xl:   "Adult - XL",
  xxl:  "Adult - XXL",
  xxxl: "Adult - XXXL",
}




function attendee(firstName, lastName, peopleType, age, eventInfo) {

  let attendee = {
    id: nextID++,
    firstName,
    lastName,
    peopleType,

    welcomeDinner: '',

    // Adults
    rembOuting: 0,
    rembLunch:  '',
    chapterChair: '',
    workshops: {},
    childCareSessions: {},

    // Child
    age:         age,
    sibOuting:   false,
    shirtSize:   '',

    // SOFT Child / Angel
    softAngel:   false,
    dateOfBirth: null,
    dateOfDeath: null,
    diagnosis:   null,
    otherDiagnosis: "",
    eatsMeals:   false,

    // Picnic
    picnic: 0,
    picnicTiedown: 0,

    // Professional
  };

  eventInfo.workshopSessions.forEach( (sess) => {
    attendee.workshops[sess.id] = sess.workshops[0].id
  });

  eventInfo.childCareSessions.forEach( (sess) => {
    attendee.childCareSessions[sess.id] = false;
  });

  return attendee;
}


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentPage: pages.WELCOME,
      pageHistory: [],                //  Keep a history of the pages visited for use by the Back button
      workshopAttendee: 0,
      shirtDropdowns: {},

      eventInfo: {
        eventTitle: '',
        workshopSessions: [],
        remembranceMenu: {},
        dinnerMenu: [],
        kidsMenu: []
      },


      //  Attendance information
      //  If you change anything below here, be sure to update the setJSON() function

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

      photoWaiver:        false, 
      attendance:         "full",     //  "full", "picnic" (only), "balloon" release - not attending 
      reception:          false,
      sundayBreakfast:    false,
      boardMember:        false,
      chapterChair:       false,
      joeyWatson:         false,

      attendees: [],
      softAngels: [],

      directory: {
        phone:  true,
        email:  true,
        city:   true,
      },

      //  Clinic list?
      clinicTieDowns: '',

      shirtsOrdered: [],
    };


    this.onChangeStateCheckbox = this.onChangeStateCheckbox.bind(this);
    this.setEventInfo         = this.setEventInfo.bind(this);
    this.onChangeContactInfo  = this.onChangeContactInfo.bind(this);
    this.onChangeCountry      = this.onChangeCountry.bind(this);
    
    this.onAddAttendee        = this.onAddAttendee.bind(this);
    this.onRemoveAttendee     = this.onRemoveAttendee.bind(this);
    this.onChangeAttendeeList = this.onChangeAttendeeList.bind(this);
    this.onChangeSelection    = this.onChangeSelection.bind(this);
    this.onChangeMeals        = this.onChangeMeals.bind(this);
    this.onChangeDate         = this.onChangeDate.bind(this);
    this.onChangeFieldValue   = this.onChangeFieldValue.bind(this);

    this.onAddSoftAngel       = this.onAddSoftAngel.bind(this);
    this.onRemoveSoftAngel    = this.onRemoveSoftAngel.bind(this);
    this.onChangeSoftAngelList = this.onChangeSoftAngelList.bind(this);
    this.onChangeSoftAngelDiagnosis = this.onChangeSoftAngelDiagnosis.bind(this);
    this.onChangeSoftAngelDate = this.onChangeSoftAngelDate.bind(this);

    this.onChangeRembOuting   = this.onChangeRembOuting.bind(this);
    this.onChangeRembLunch    = this.onChangeRembLunch.bind(this);

    this.onChangeWorkshops    = this.onChangeWorkshops.bind(this);

    this.onChangeSibOuting    = this.onChangeSibOuting.bind(this);
    this.onChangeShirtSize    = this.onChangeShirtSize.bind(this);

    this.nextAdultPro         = this.nextAdultPro.bind(this);
    this.nextYoungerSib       = this.nextYoungerSib.bind(this);
    this.nextOlderSib         = this.nextOlderSib.bind(this);
    this.nextChildCare        = this.nextChildCare.bind(this);
    this.nextPage             = this.nextPage.bind(this);

    this.onClinicSortEnd      = this.onClinicSortEnd.bind(this);

    this.onChangeChildCare    = this.onChangeChildCare.bind(this);

    this.onChangePicnic       = this.onChangePicnic.bind(this);
    this.onChangePicnicTiedown = this.onChangePicnicTiedown.bind(this);

    this.onChangeDirectory    = this.onChangeDirectory.bind(this);

    this.onRemoveShirt        = this.onRemoveShirt.bind(this);
    this.onShirtDropdown      = this.onShirtDropdown.bind(this);
    this.onAddShirt           = this.onAddShirt.bind(this);

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
    let softAngels = [];

    if (DEBUG) {
      attendees = [
        attendee("Steve", "Maguire",   peopleTypes.ADULT,        -1, eventInfoDefault),
        attendee("Beth",  "Mountjoy",  peopleTypes.CHILD,         5, eventInfoDefault),
        attendee("Terre", "Krotzer",   peopleTypes.PROFESSIONAL, -1, eventInfoDefault),
        attendee("Jane",  "Mountjoy",  peopleTypes.CHILD,        11, eventInfoDefault),
        attendee("Helen", "Mountjoy",  peopleTypes.CHILD,        12, eventInfoDefault),
        attendee("Cliff", "Mountjoy",  peopleTypes.CHILD,        17, eventInfoDefault),
        attendee("Jamie", "Jones",     peopleTypes.SOFTCHILD,     3, eventInfoDefault),
      ];
    }

    // let shirtDropdowns = eventInfo.shirtTypes.map( (shirt) => {
    //   console.log(shirt);
    //   return {
    //     [shirt.id]: {
    //       size:     "",
    //       quantity: 0,
    //     }
    //   }
    // });
    // console.log("shirtDropdowns");
    // console.log(shirtDropdowns);

    let shirtDropdowns = {};

    eventInfo.shirtTypes.forEach( (shirt) => {
      shirtDropdowns[shirt.id] = {};
      shirtDropdowns[shirt.id].size = "";
      shirtDropdowns[shirt.id].quantity = 0;
    });

    this.setState({
      eventInfo,
      attendees,
      softAngels,
      shirtDropdowns
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

              [pages.BASICS]:
                  <Basics 
                    photoWaiver={this.state.photoWaiver}
                    attendance={this.state.attendance}
                    reception={this.state.reception}
                    sundayBreakfast={this.state.sundayBreakfast}
                    boardMember={this.state.boardMember}
                    chapterChair={this.state.chapterChair}
                    handleRadioGroup={this.onChangeFieldValue}
                    handleCheckbox={this.onChangeStateCheckbox}
                  />,

              [pages.CONTACT]:
                  <ContactInfo 
                      contact={contactInfo}
                      onChangeContactInfo={this.onChangeContactInfo}
                      onChangeCountry={this.onChangeCountry} 
                  />,

              [pages.SOFTANGELS]:
                  <SoftAngels
                    softAngels={this.state.softAngels} 
                    onAdd={this.onAddSoftAngel}
                    onRemove={this.onRemoveSoftAngel}
                    onChange={this.onChangeSoftAngelList}
                    onChangeDiagnosis={this.onChangeSoftAngelDiagnosis}
                    onChangeDate={this.onChangeSoftAngelDate}
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
                    attendees={attendees}
                    clinics={eventInfo.clinics}
                    onSortEnd={this.onClinicSortEnd}
                    blurb={eventInfo.clinicsBlurb}
                    numTieDowns={this.state.clinicTieDowns}
                    onChangeSelection={this.onChangeFieldValue}
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
                  <Childcare 
                    attendees={attendees} 
                    childCareSessions={eventInfo.childCareSessions}
                    boardMember={this.state.boardMember}
                    blurb={eventInfo.childCareBlurb} 
                    onChange={this.onChangeChildCare}
                  />,

              [pages.DINNER]:
                  <Dinner
                    attendees={attendees}
                    blurb={eventInfo.welcomeDinnerBlurb}
                    adultMenu={eventInfo.adultMenu}
                    kidsMenu={eventInfo.kidsMenu}
                    onChangeDinner={this.onChangeSelection}
                  />,

              [pages.WORKSHOPS]:
                  <Workshops 
                    attendee={attendees[this.state.workshopAttendee]} 
                    sessions={eventInfo.workshopSessions}
                    onChange={this.onChangeWorkshops}
                  />,

              [pages.YOUNGERSIB]:
                  <YoungerSib attendees={attendees} onChange={this.onChangeSibOuting} onChangeShirtSize={this.onChangeShirtSize} cost={eventInfo.youngerSibCost} blurb={eventInfo.youngerSibOutingBlurb} />,

              [pages.OLDERSIB]:
                  <OlderSib attendees={attendees} onChange={this.onChangeSibOuting} onChangeShirtSize={this.onChangeShirtSize} cost={eventInfo.olderSibCost} blurb={eventInfo.olderSibOutingBlurb} />,

              [pages.PICNIC]:
                  <Picnic
                    blurb={eventInfo.picnicBlurb}
                    attendees={attendees}
                    onChange={this.onChangePicnic}
                    onChangeTiedown={this.onChangePicnicTiedown}
                  />,

              [pages.BALLOONS]:
                  <Balloons />,

              [pages.CHAPTERCHAIR]:
                  <ChapterChair
                    attendees={attendees}
                    onChange={this.onChangeChapterChair}
                    menuInfo={eventInfo.remembranceMenu}
                  />,

              [pages.DIRECTORY]:
                  <Directory
                    blurb={eventInfo.directoryBlurb}
                    directory={this.state.directory}
                    onChange={this.onChangeDirectory}
                  />,

              [pages.PHOTOS]:
                  <Photos contact={contactInfo} />,

              [pages.SOFTWEAR]:
                  <SoftWear
                    blurb={eventInfo.shirtsBlurb}
                    shirtTypes={eventInfo.shirtTypes}
                    shirtsOrdered={this.state.shirtsOrdered}
                    onRemove={this.onRemoveShirt}
                    onDropdown={this.onShirtDropdown}
                    onAdd={this.onAddShirt}
                  />,

              [pages.SUMMARY]:
                  <Summary thisState={this.state} />,

              [pages.CHECKOUT]:
                  <Checkout thisState={this.state} />,

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



  // See if we should skip "curPage" and move on to the page after that, and
  // then check THAT page too...

  nextPage(curPage) {

    let checkNext = true;

    let i = 0;

    do {

      if (i++ > 20) {       // Should never get into an endless loop, but just in case...
        break;
      }

      switch (curPage) {

        case pages.ATTENDEES:
          if (this.state.attendance === 'balloon') {
            curPage = pages.SUMMARY;
            checkNext = false;
          }
          break;

        case pages.CLINICS:
          checkNext = !this.state.attendees.find( a => { 
            return (a.peopleType === peopleTypes.SOFTCHILD);
          });

          if (checkNext) {
            curPage = pages.WORKSHOPS;
          }
          break;

        case pages.WORKSHOPS:
          checkNext = (this.nextAdultPro(-1) === -1);     // Skip workshops if no adults
          if (checkNext) {
            curPage = pages.YOUNGERSIB;
          }
          break;

        case pages.YOUNGERSIB:
          checkNext = (this.nextYoungerSib(-1) === -1);   // Skip younger sibs if none
          if (checkNext) {
            curPage = pages.OLDERSIB;
          }
          break;

        case pages.OLDERSIB:
          checkNext = (this.nextOlderSib(-1) === -1);     // Skip older sibs if none
          if (checkNext) {
            curPage = pages.CHILDCARE;
          }
          break;

        case pages.CHILDCARE:
          checkNext = (this.nextChildCare(-1) === -1);    // Skip childcare if none appropriate
          if (checkNext) {
            curPage = pages.CHAPTERCHAIR;
          }
          break;

        case pages.CHAPTERCHAIR:
          checkNext = !this.state.chapterChair;           // No one is a Chapter Chair?
          if (checkNext) {
            curPage = pages.REMEMBRANCE;
          }
          break;

        case pages.REMEMBRANCE:
          checkNext = (this.state.softAngels.length === 0);          // Skip Remembrance if no SOFT Angels
          if (checkNext) {
            curPage = pages.PICNIC;
          }
          break;

        default:                        // Go to current page
          checkNext = false;
      }

    } while (checkNext);

    return (curPage);
  }


  onNextPage(event) {
    let { attendees, contactInfo, currentPage, pageHistory} = this.state;

    //  Don't let visitor go to next page unless there are no errors on
    //  the current page.

    switch (currentPage) {

      case pages.WELCOME:

          if (DEBUG  &&  contactInfo.firstName === '') {
            contactInfo.firstName   = "Steve";
            contactInfo.lastName    = "Maguire";
            contactInfo.address1    = "123 E. Main St.";
            contactInfo.city        = "Phoenix";
            contactInfo.stateProv   = "AZ";
            contactInfo.postalCode  = "98354";
            contactInfo.country     = "United States";
            contactInfo.phoneMobile = "(206) 528-1962";
            contactInfo.email       = "steve@bestcoolproducts.com";
          }

          pageHistory.push(currentPage);

          this.setState({
            pageHistory,
            contactInfo,
            currentPage: pages.BASICS,
          });

          break;


      case pages.BASICS:
          if (this.state.attendance !== 'balloon'  &&  !this.state.photoWaiver) {
            alert('To register for the conference, you must agree to the photo and video waiver. Please check the box to agree.');
          }
          else {
            pageHistory.push(currentPage);

            this.setState({
              pageHistory,
              currentPage: pages.CONTACT,
            });
          }

          break;


      case pages.CONTACT:

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

          //  If they filled in Address2 but not Address1, swap.
          if (contact.address1 === '') {
            contact.address1 = contact.address2;
            contact.address2 = '';
          }

          //  Error check
          if (contact.firstName === ''  ||  contact.lastName === '') {
            alert("Oops! Please enter the name of the Contact Person.");
          }
          else if (contact.address1 === '') {
            alert("Oops! Please enter your street address.");
          }
          else if (contact.city === ''  ||  contact.stateProv === ''  ||  contact.postalCode === '') {
            alert("Oops! The City, Region, or Postal Code is missing.");
          }
          else if (contact.country === '') {
            alert("Oops! Please select a country.");
          }
          else if (contact.phoneMobile === ''  &&  contact.phoneWork === ''  &&  contact.phoneHome === '') {
            alert("Oops! Please enter at least one valid phone number.");
          }
          else if (contact.email === ''  ||  !validateEmail(contact.email)) {
            alert("Oops! Please enter a valid email address.");
          }
          else {
            if (attendees.length === 0) {
                attendees.push( attendee(contact.firstName, contact.lastName, peopleTypes.ADULT, -1, this.state.eventInfo) );
            }

            pageHistory.push(currentPage);

            this.setState({
              contactInfo: contact,
              pageHistory,
              currentPage: pages.SOFTANGELS,
            });
          }

          break;

      case pages.SOFTANGELS:
          let softAngels = this.state.softAngels;

          softAngels = softAngels.map(a => { 
            a.firstName = smartFixName(a.firstName.trim());
            a.lastName  = smartFixName(a.lastName.trim());
            a.otherDiagnosis = a.otherDiagnosis.trim();
            return a;
          });

          softAngels = softAngels.filter(a => { return (a.firstName !== ''  ||  a.lastName !== '') });


          let bad_softAngel = softAngels.find( a => { 
            return (  a.firstName === ''  ||  a.lastName === ''  ||  a.peopleType === '' ||
                      a.dateOfBirth === null  ||  a.dateOfDeath === null  ||  a.diagnosis === null  ||  
                      (a.diagnosis === 'Other'  &&  a.otherDiagnosis === '')
                   )
          });


          if (this.state.attendance === 'balloon'  &&  softAngels.length === 0) {
            alert('Please enter a SOFT Angel to continue.');
          }
          else if (bad_softAngel) {
            alert('Oops! Some information is missing. Please double-check your entry.')
          }
          else {
            pageHistory.push(currentPage);

            this.setState({
              softAngels,
              pageHistory,
              currentPage: this.nextPage(pages.ATTENDEES),
            });
          }

          break;


      case pages.ATTENDEES:
          // let attendees = this.state.attendees;

          //  Clean up entries
          attendees = attendees.map(a => { 
            a.firstName = smartFixName(a.firstName.trim());
            a.lastName  = smartFixName(a.lastName.trim());
            a.otherDiagnosis = a.otherDiagnosis.trim();
            return a;
          });

          //  Remove totally empty rows
          attendees = attendees.filter(a => { return (a.firstName !== ''  ||  a.lastName !== '') });

          let bad_attendee = attendees.find( a => { 
            return (  a.firstName === ''  ||  a.lastName === ''  ||  a.peopleType === ''  ||  (a.peopleType === peopleTypes.CHILD  &&  a.age === null) ||
                      (a.peopleType === peopleTypes.SOFTCHILD  &&  (a.dateOfBirth === null  ||  a.diagnosis === null  ||  (a.diagnosis === "Other" && a.otherDiagnosis === "")) )
                   ) 
          });

          let softchildren = attendees.filter(a => { return (a.peopleType === peopleTypes.SOFTCHILD) });

          let clinicTieDowns = this.state.clinicTieDowns;

          if (clinicTieDowns !== ''  &&  clinicTieDowns > softchildren.length) {
            clinicTieDowns = softchildren.length;
          }


          if (attendees.length === 0) {
            alert("Oops! You must list at least one person. Will the Contact Person be attending?");
          }
          else if (bad_attendee !== undefined) {
            alert("Oops! Something is missing in the information for one or more of the people listed. Please fill in the missing information.");
          }
          else {
            pageHistory.push(currentPage);

            let newPage = pages.DIRECTORY;     //  "Picnic-only" case -- go straight to wrap up

            if (this.state.attendance !== 'picnic') {
              newPage = pages.DINNER;
            }

            this.setState({
              attendees,
              clinicTieDowns,
              pageHistory,
              currentPage: newPage,     //  Can't call newPage(pages.CLINICS) because attendees isn't in state yet
            });
          }
          break;


      case pages.DINNER:

          attendees = attendees.map(a => { 
            if (a.peopleType === peopleTypes.SOFTCHILD  &&  !a.eatsMeals) {
              a.welcomeDinner = '';
            }
            return a;
          });

          let missing_meals = attendees.find( a => { 
            return (a.welcomeDinner === ''  &&  (a.peopleType !== peopleTypes.SOFTCHILD  ||  a.eatsMeals));
          });

          if (!DEBUG  &&  missing_meals !== undefined) {
            alert("Oops! Please choose a meal for each person.");
          }
          else {
            pageHistory.push(currentPage);

            this.setState({
              attendees,
              pageHistory,
              currentPage: this.nextPage(pages.CLINICS),       //  This assumes that there will always be one adult
            });
          }

          break;


      case pages.CLINICS:

          if (this.state.clinicTieDowns === '') {
            alert("Please select the number of tie-downs you'll need.");
          }
          else {

            pageHistory.push(currentPage);

            this.setState({
              pageHistory,
              currentPage: this.nextPage(pages.WORKSHOPS),
            });
          }

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

            this.setState({
              pageHistory,
              currentPage: this.nextPage(pages.YOUNGERSIB),
            });
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
              pageHistory.push(currentPage);

              this.setState({
                pageHistory,
                attendees,
                currentPage: this.nextPage(pages.OLDERSIB),
              });
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

              this.setState({
                pageHistory,
                attendees,
                currentPage: this.nextPage(pages.CHILDCARE),
              });
            }
          }
          break;


      case pages.CHILDCARE:
          pageHistory.push(currentPage);

          this.setState({
            pageHistory,
            currentPage: this.nextPage(pages.CHAPTERCHAIR),
          });

          break;


      case pages.CHAPTERCHAIR:
          pageHistory.push(currentPage);

          this.setState({
            pageHistory,
            currentPage: this.nextPage(pages.REMEMBRANCE),
          });

          break;


      case pages.REMEMBRANCE:

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

            this.setState({
              attendees,
              pageHistory,
              currentPage: pages.PICNIC,
            });
          }

          break;


      case pages.PICNIC:
          pageHistory.push(currentPage);

          this.setState({
            pageHistory,
            currentPage: pages.DIRECTORY,
          });

          break;


      // case pages.PHOTOS:
      //     // let attendees = this.state.attendees;

      //     pageHistory.push(currentPage);

      //     this.setState({
      //       pageHistory,
      //       currentPage: pages.DIRECTORY,
      //     });

      //     break;


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
  //  Generic handlers

  onChangeStateCheckbox(event, field) {
    this.setState ({
      [field]: event.target.checked,
    });
  }

  onChangeFieldValue(field, value) {
    this.setState({
      [field]: value
    });
  }



  //-------------------------------------------------------------------------------------------
  //  Process Attendees page
  
  onAddAttendee(event) {
    let { attendees, contactInfo } = this.state;

    if (attendees.length === 0)
      attendees.push( attendee(contactInfo.firstName, contactInfo.lastName,  peopleTypes.ADULT, -1, this.state.eventInfo) );
    else
      attendees.push( attendee('', '', '', -1, this.state.eventInfo) );

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
    if (field === "diagnosis"  &&  opt.value !== "Other") {
      attendees[i].otherDiagnosis = "";
    }
    if (field === "age") {
      attendees[i].childCareSessions = {};
    }
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
  //  Process Soft Angels page
  
  onAddSoftAngel(event) {
    let { softAngels } = this.state;

    softAngels.push( attendee('', '', peopleTypes.SOFTANGEL, -1, this.state.eventInfo) );

    this.setState({
      softAngels
    });
  }

  onRemoveSoftAngel(id) {
    let { softAngels } = this.state;
    softAngels = softAngels.filter(softAngel => softAngel.id !== id);
    this.setState({
      softAngels
    });
  }

  onChangeSoftAngelList(event, id, field) {
    let { softAngels } = this.state;
    let i = softAngels.findIndex(a => a.id === id);
    console.assert(i !== -1, "Warning -- didn't find SOFT Angel in softAngels list: id = " + id);
    softAngels[i][field] = event.target.value;
    this.setState ({
      softAngels
    });
  }


  onChangeSoftAngelDiagnosis(opt, id, field) {
    let { softAngels } = this.state;
    let i = softAngels.findIndex(a => a.id === id);
    console.assert(i !== -1, "Warning -- didn't find SOFT Angel in softAngels list: id = " + id);
    softAngels[i][field] = opt.value;
    this.setState ({
      softAngels
    });
  }


  onChangeSoftAngelDate(date, id, field) {
    let { softAngels } = this.state;
    let i = softAngels.findIndex(a => a.id === id);
    console.assert(i !== -1, "Warning -- didn't find SOFT Angel in softAngels list: id = " + id);
    softAngels[i][field] = date;
    this.setState({
      softAngels
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
  //  Welcome dinner


  onChangeDinner(opt, id) {
    let { attendees } = this.state;
    let i = attendees.findIndex(a => a.id === id);
    console.assert(i !== -1, "Warning -- couldn't find attendee in attendee list: id = " + id);
    attendees[i].welcomeDinner = opt.value;
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

    attendees[i].sibOuting = !attendees[i].sibOuting;
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
  //  Childcare pages
  

  onChangeChildCare(event, attendeeID, sessionID) {
    let { attendees } = this.state;
    let i = attendees.findIndex( (a) => { return (a.id === attendeeID) } );
    attendees[i].childCareSessions[sessionID] = !attendees[i].childCareSessions[sessionID];

    this.setState ({
      attendees
    });
  }


  //-------------------------------------------------------------------------------------------
  //  Process Remembrance page
  

  onChangePicnic(event, id) {
    let { attendees } = this.state;
    let i = attendees.findIndex(a => a.id === id);
    console.assert(i !== -1, "Warning -- couldn't find attendee in attendee list: id = " + id);

    //  Flip state of attendance and lunch option
    attendees[i].picnic = !attendees[i].picnic;
    if (!attendees[i].picnic) {
      attendees[i].picnicTiedown = 0;
    }
    this.setState ({
      attendees
    });
  }

  onChangePicnicTiedown(opt, id) {
    let { attendees } = this.state;
    let i = attendees.findIndex(a => a.id === id);
    console.assert(i !== -1, "Warning -- couldn't find attendee in attendee list: id = " + id);
    attendees[i].picnicTiedown = opt.value;
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


  //-------------------------------------------------------------------------------------------
  //  Directory page

  onChangeDirectory(value, field) {
    let { directory } = this.state;
    directory[field] = value;

    this.setState ({
      directory
    });
  }


  //-------------------------------------------------------------------------------------------
  //  SOFT Wear page

  onRemoveShirt(id) {
    let { shirtsOrdered } = this.state;
    shirtsOrdered = shirtsOrdered.filter(shirt => shirt.id !== id);
    this.setState({
      shirtsOrdered
    });
  }

  onShirtDropdown(opt, id, field) {
    let { shirtDropdowns } = this.state;
    shirtDropdowns[id][field] = opt.value;
    this.setState({
      shirtDropdowns
    });
  }

  onAddShirt(id) {
    let { shirtsOrdered } = this.state;
    let choices = this.state.shirtDropdowns[id];

    if (choices.size === ''  ||  choices.quantity === 0) {
      alert('Please select both a quantity and size');
    }
    else {
      let newOrder = {
        id:       nextID++,
        shirtID:  id,
        size:     choices.size,
        quantity: choices.quantity
      }

      shirtsOrdered.push(newOrder);

      this.setState({
        shirtsOrdered
      });
    }
  }

}


//-------------------------------------------------------------------------------------------
//  Implement draggable items

// const DragHandle = SortableHandle(() => <span className="drag-thumb"><FontAwesomeIcon icon="bars" /></span>);   // This can be any component you want

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
    case 3:
      choice = '4th Choice';
      break;
    case 4:
      choice = '5th Choice';
      break;
    default:
      choice = '';
  }

  return (
    <li className="drag-item">
      <span className="drag-thumb"><FontAwesomeIcon icon="bars" /></span><span className="clinic-name">{value}</span><span className="clinic-choice">{choice}</span>
    </li>
  );
});

const SortableList = SortableContainer(({items, i}) => {
  return (
    <ul className="sortable-container">
      {items.map((value, index) => (
        <SortableItem key={"item-"+index} index={index} i={index} value={value} />
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
      case pages.BASICS:
        title = 'Welcome';
        break;
      case pages.CONTACT:
      case pages.ATTENDEES:
      case pages.SOFTANGELS:
        title = 'Attendees';
        break;
      case pages.CLINICS:
      case pages.DINNER:
      case pages.WORKSHOPS:
      case pages.YOUNGERSIB:
      case pages.OLDERSIB:
      case pages.CHILDCARE:
      case pages.CHAPTERCHAIR:
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
              return <div key={keyName} className={"pagebar-selected"}><FontAwesomeIcon icon="ribbon" /> {tab}</div>;
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
    <p>The 2019 Soft Conference is going to be held at the _____ Hotel in Ann Arbor, MI, July 17-21, 2019.
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



const Basics = ({attendance, reception, photoWaiver, sundayBreakfast, boardMember, chapterChair, handleRadioGroup, handleCheckbox}) =>
  <div>
    <h2>Getting Started</h2>
    <p>Welcome to the Soft Conference Registration form!</p>
    <p>In the next few pages, you'll be asked a series of questions so that we can tailor this year's
       SOFT convention specifically for you and your family. If you're only requesting a balloon
       in memory of a SOFT Angel, you will only be asked about that. To get started, please 
       answer the following questions:
    </p>
    <div className="indent">
      How much, if any, of the conference are you planning to attend?

      <div className="v-indent indent">
        <RadioGroup name="attendance" selectedValue={attendance} onChange={(val) => handleRadioGroup("attendance", val)}>
          <Radio value="full" /> Full Conference<br />
          <Radio value="picnic" /> Only attending the picnic<br />
          <Radio value="balloon" /> Requesting a Balloon (not attending the conference)
        </RadioGroup>
      </div>
      {attendance !== 'balloon' &&
        <div>
          <div className="v-indent">
            <table>
              <tbody>
                <tr>
                  <td valign="top"><Checkbox defaultChecked={photoWaiver} onChange={event => handleCheckbox(event, "photoWaiver")} /> </td>
                  <td>
                    <span>I hereby give permission for images of my child, captured during the SOFT Conference through video, photo and digital camera, to be used solely for the purposes of SOFT promotional material and publications, and waive any rights of compensation or ownership thereto.</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {photoWaiver  &&  attendance === 'full'  && 
            <div>
              <div className="v-indent">
                Are you planning to attend the welcome reception on Wednesday evening?
                <div className="inline">
                  <RadioGroup name="reception" selectedValue={reception} onChange={(val) => handleRadioGroup("reception", val)}>
                    <span className="radio-yes"><Radio value={true} /> Yes</span>
                    <Radio value={false} /> No
                  </RadioGroup>
                </div>
              </div>

              <div className="v-indent">
                Are you planning to attend the final breakfast on Sunday morning?
                <div className="inline">
                  <RadioGroup name="sundayBreakfast" selectedValue={sundayBreakfast} onChange={(val) => handleRadioGroup("sundayBreakfast", val)}>
                    <span className="radio-yes"><Radio value={true} /> Yes</span>
                    <Radio value={false} /> No
                  </RadioGroup>
                </div>
              </div>

              <div className="v-indent">
                Is anybody in your group a board member?
                <div className="inline">
                  <RadioGroup name="boardMember" selectedValue={boardMember} onChange={(val) => handleRadioGroup("boardMember", val)}>
                    <span className="radio-yes"><Radio value={true} /> Yes</span>
                    <Radio value={false} /> No
                  </RadioGroup>
                </div>
              </div>

              <div className="v-indent">
                Is anybody in your group a Chapter Chair?
                <div className="inline">
                  <RadioGroup name="chapterChair" selectedValue={chapterChair} onChange={(val) => handleRadioGroup("chapterChair", val)}>
                    <span className="radio-yes"><Radio value={true} /> Yes</span>
                    <Radio value={false} /> No
                  </RadioGroup>
                </div>
              </div>

            </div>
          }
        </div>
      }
    </div>
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
    <p>Please list everybody in your party who will be attending any part of the Conference. Be sure to include
       the Contact Person here if he or she will be attending.
    </p>
    {attendees.length > 0  &&
      <div>
        {attendees.map( (a, i) =>
          <div className="attendee-row" key={a.id}>
            <p className="row-num"><span className="bold">{i+1}.</span></p>
            <Input label="FIRST Name" value={a.firstName} id={"attendee-firstname-" + a.id} onChange={event => onChange(event, a.id, "firstName")} />
            <Input label="LAST Name"  value={a.lastName}  id={"attendee-lastname-" + a.id}  onChange={event => onChange(event, a.id, "lastName")} />
            <PeopleType value={a.peopleType} onChange={(opt) => onChangeSelection(opt, a.id, "peopleType")}/>
            {a.peopleType !== peopleTypes.CHILD  &&
              <div className="edit-age"></div>
            }
            {a.peopleType === peopleTypes.CHILD  &&
              <Age label="Age" value={a.age}  id={"attendee-age-" + a.id}  onChange={opt => onChangeSelection(opt, a.id, "age")} />
            }
            <Button onClick={() => onRemove(a.id)}>Remove</Button>
            {a.peopleType === peopleTypes.SOFTCHILD  &&
              <div>
                <p className="row-num"></p>
                Diagnosis: <Diagnosis label="Diagnosis" value={a.diagnosis} id={"attendee-diagnosis-" + a.id}  onChange={opt => onChangeSelection(opt, a.id, "diagnosis")} /><span className="small-gap"></span>
                Birthdate: <DatePicker
                  selected={a.dateOfBirth}
                  onChange={date => onChangeDate(date, a.id)}
                /><span className="small-gap"></span>
                <Checkbox defaultChecked={a.eatsMeals} onChange={opt => onChangeMeals(opt, a.id)} /> Eats conference meals?
                {a.diagnosis === "Other" &&
                  <div>
                    <p className="row-num"></p>
                    Enter other Diagnosis: <Input value={a.otherDiagnosis} id={"attendee-diag-" + a.id} className="other-diag" onChange={event => onChange(event, a.id, "otherDiagnosis")} />
                  </div>
                }
              </div>
            }
          </div>
        )}
      </div>
    }
    <div className="add-person-btn">
      {attendees.length === 0 ?
          <Button onClick={onAdd}>Add a Person</Button>
        :
          <Button onClick={onAdd}>Add Another Person</Button>
      }
    </div>
  </div>


//----------------------------------------------------------------------------------------------------



const SoftAngels = ({softAngels, onRemove, onAdd, onChange, onChangeDiagnosis, onChangeOther, onChangeDate}) =>
  <div>
    <h2>SOFT Angels</h2>
    <p>Every year at the convention, we have a balloon release for SOFT children who have passed away.
       If you would like to have a balloon released for any SOFT Angels in your family, please give us
       their names and information here. Otherwise, click on the NEXT button below.
    </p>
    {softAngels.length > 0  &&
      <div>
        {softAngels.map( (a, i) =>
          <div className="attendee-row" key={a.id}>
            <p className="row-num">{i+1}.</p>
            <Input label="FIRST Name" value={a.firstName} id={"softangel-firstname-" + a.id} onChange={event => onChange(event, a.id, "firstName")} />
            <Input label="LAST Name"  value={a.lastName}  id={"softangel-lastname-" + a.id}  onChange={event => onChange(event, a.id, "lastName")} />
            <Diagnosis label="Diagnosis" value={a.diagnosis} id={"softangel-diagnosis-" + a.id}  onChange={opt => onChangeDiagnosis(opt, a.id, "diagnosis")} />
            <br />
            {a.diagnosis === "Other" &&
              <div>
                <p className="row-num"></p>
                Enter Diagnosis: <Input value={a.otherDiagnosis} id={"softangel-diag-" + a.id} className="other-diag" onChange={event => onChange(event, a.id, "otherDiagnosis")} />
              </div>
            }
            <p className="row-num"></p>
            <div className="soft-angel-date">
              Date of Birth: <DatePicker
                selected={a.dateOfBirth}
                onChange={date => onChangeDate(date, a.id, "dateOfBirth")}
              />
            </div>
            <span className="small-gap"></span>
            <div className="soft-angel-date">
              Date of Death: <DatePicker
                selected={a.dateOfDeath}
                onChange={date => onChangeDate(date, a.id, "dateOfDeath")}
              />
            </div>
            <span className="small-gap"></span>
            <Button onClick={() => onRemove(a.id)}>Remove</Button>
          </div>
        )}
      </div>
    }
    <div className="add-person-btn">
      {softAngels.length === 0 ?
          <Button onClick={onAdd}>Add a SOFT Angel</Button>
        :
          <Button onClick={onAdd}>Add Another SOFT Angel</Button>
      }
    </div>
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
                <div key={ws.id} className="indent"><Radio value={ws.id} /> {ws.title}{ws.moderator === '' ? '' : " — " + ws.moderator}</div>
              )
            }
            </RadioGroup><br />
          </div>
        )
    }
  </div>


//----------------------------------------------------------------------------------------------------


const YoungerSib = ({attendees, onChange, onChangeShirtSize, cost, blurb}) =>
  <div>
    <h2>Younger Sibling Outing</h2>
    <p>{blurb}</p>
    <p>Check each child who will be attending the outing and choose a shirt size.</p>
    <div className="remembrance">
      {attendees.map( (a,i) => 
        {return a.peopleType === peopleTypes.CHILD  &&  a.age >= 5  &&  a.age <= 11  &&
          <div key={a.id} className="indent">
            <Checkbox defaultChecked={a.sibOuting} onChange={event => onChange(event, a.id)} />
            <span className="remb-name">{a.firstName} {a.lastName}{a.sibOuting ? " - $" + cost : ""}</span>
            <div className={a.sibOuting? "inline" : "inline invisible"}>
              <ShirtSize value={a.shirtSize} onChange={(opt) => onChangeShirtSize(opt, a.id)} />
            </div>
          </div>
        })
      }
      <p></p>
    </div>
  </div>


const OlderSib = ({attendees, onChange, onChangeShirtSize, cost, blurb}) => 
  <div>
    <h2>Older Sibling Outing</h2>
    <p>{blurb}</p>
    <p>Check each child who will be attending the outing and choose a shirt size.</p>
    <div className="remembrance">
      {attendees.map( (a,i) => 
        { return a.peopleType === peopleTypes.CHILD  &&  a.age >= 12  &&
          <div key={a.id} className="indent">
            <Checkbox defaultChecked={a.sibOuting} onChange={event => onChange(event, a.id)} />
            <span className="remb-name">{a.firstName} {a.lastName}{a.sibOuting ? " - $" + cost : ""}</span>
            <div className={a.sibOuting? "inline" : "inline invisible"}>
              <ShirtSize value={a.shirtSize} onChange={(opt) => onChangeShirtSize(opt, a.id)} />
            </div>
          </div>
        })
      }
      <p></p>
    </div>
  </div>


//----------------------------------------------------------------------------------------------------


const Clinics = ({attendees, clinics, numTieDowns, onSortEnd, blurb, onChangeSelection}) => {

  attendees = attendees.filter(a => { return (a.peopleType === peopleTypes.SOFTCHILD) });

  let optionsTieDowns = [];
  for (let i = 0; i <= attendees.length; i++) {
    optionsTieDowns.push( { label: i, value: i } );
  }

  if (numTieDowns !== '') {
    numTieDowns = { label: numTieDowns, value: numTieDowns };
  }

  return (
    <div>
      <h2>Clinics</h2>
      <p className="v-indent-below">{blurb}</p>
      <span><FontAwesomeIcon icon="hand-point-right" /> &nbsp;How many (if any) tie-downs will you need for transportation?</span>&nbsp;&nbsp;
      <div className="inline">
        <Select
          defaultValue={ numTieDowns }
          options={optionsTieDowns}
          placeholder={"Number of tie-downs?..."}
          onChange={(opt) => onChangeSelection("clinicTieDowns", opt.value)}
          styles={selectStyle(200, 110)}
        /> 
      </div>
      <p className="v-indent">Rearrange the names of the clinics below from Most Interested to Least Interested by simultaneously clicking and dragging on the <span className="thumb-color"><FontAwesomeIcon icon="bars" /></span> character and moving
      the name of the clinic up or down.</p>
      <p>Move <strong>MOST Interested</strong> Clinic to the top, and the <strong>LEAST Interested</strong> Clinic to the bottom:</p>
      <SortableList items={clinics} onSortEnd={onSortEnd} />
    </div>
  );
}


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
            <div className={a.rembOuting ? "inline" : "inline invisible"}>
              <RembLunch value={a.rembLunch} menuInfo={menuInfo} isDisabled={!a.rembOuting} onChange={(opt) => onChangeLunch(opt, a.id)} />
            </div>
          </div>
        })
      }
    </div>
  </div>



//----------------------------------------------------------------------------------------------------


const Childcare = ({attendees, childCareSessions, boardMember, onChange, blurb}) =>
  <div>
    <h2>Childcare</h2>
    <p>{blurb}</p>
    <p>Please put a checkmark next to each timeslot where you will need childcare.</p>
    <div className="remembrance">
      {attendees.map( (a,i) => 
        {return (a.peopleType === peopleTypes.SOFTCHILD  ||  (a.peopleType === peopleTypes.CHILD  &&  a.age < 12))  &&
          <div key={a.id} className="indent">
            <span className="remb-name"><strong>{a.firstName} {a.lastName}</strong></span>
            {childCareSessions.map( (ccs,i) =>
              { return ((!ccs.pre5Only || a.age < 5) && (!ccs.boardOnly || boardMember) ?
                  <div key={a.id + "-" + ccs.id} className="indent" >
                    <Checkbox defaultChecked={a.childCareSessions[ccs.id]} onChange={event => onChange(event, a.id, ccs.id)} />
                    {ccs.title}
                  </div>
                :
                  null
              )}
            )}
            <br />
          </div>
        })
      }
    </div>
  </div>


//----------------------------------------------------------------------------------------------------


const Picnic = ({attendees, onChange, onChangeTiedown, blurb}) =>
  <div>
    <h2>Picnic</h2>
    <p>{blurb}</p>
    <p>Please place a checkmark next to each person who will need bus transportation. If wheelchair tie-downs are
       needed for the bus, choose that too.
    </p>
    <div className="remembrance">
      {attendees.map( (a,i) => 
        <div key={a.id} className="indent">
          <Checkbox defaultChecked={a.picnic} onChange={event => onChange(event, a.id)} />
          <span className="remb-name">{a.firstName} {a.lastName}</span>
          <div className={(a.picnic && a.peopleType === peopleTypes.SOFTCHILD) ? "inline" : "inline invisible"}>
            <span>Needs tie-downs? <SelectYesNo value={a.picnicTiedown} isDisabled={!a.picnic} onChange={(opt) => onChangeTiedown(opt, a.id)} /></span>
          </div>
        </div>
      )}
    </div>
  </div>



//----------------------------------------------------------------------------------------------------


const ChapterChair = ({ attendees, menuInfo, onChange, onChangeLunch }) =>
  <div>
    <h2>Chapter Chair Luncheon</h2>
    <p>Is anyone in your party a registered or prospective Chapter Chair? If so, please check everyone
       who will be attending the Chapter Chair Lunch; otherwise, simply click the Next buttton.
    </p>
    <p><i>(If you don't know what a Chapter Chair is, this doesn't apply to you. Please click NEXT.)</i></p>
    <div className="chapter-chair">
      {attendees.map( (a,i) =>
        {return a.peopleType === peopleTypes.ADULT ? 
          <div key={a.id} className="chair-row">
            <Checkbox defaultChecked={a.chapterChair} onChange={event => onChange(event, a.id)} />
            <span className="remb-name">{a.firstName} {a.lastName}</span>
          </div>
          : null
        }
      )}
    </div>
  </div>


//----------------------------------------------------------------------------------------------------


const Dinner = ({attendees, adultMenu, kidsMenu, blurb, onChangeDinner}) =>
  <div>
    <h2>Welcome Dinner</h2>
    <p>{blurb}</p>
    <div className="remembrance">
      {attendees.map( (a,i) =>
        {return <div key={a.id} className="indent">
            <span className="bold">{i+1}.</span> <span className="remb-name"> {a.firstName} {a.lastName}</span>
            <div className="inline">
              {a.peopleType === peopleTypes.ADULT  ||  a.peopleType === peopleTypes.PROFESSIONAL ?
                  <Select
                    defaultValue={ a.welcomeDinner !== '' ? { label: a.welcomeDinner, value: a.welcomeDinner } : null }
                    options={arrayToOptions(adultMenu)}
                    placeholder={"Select dinner..."}
                    onChange={(opt) => onChangeDinner(opt, a.id, "welcomeDinner")}
                    styles={selectStyle(300, 110)}
                  />
                : 
                  <div className={(a.peopleType !== peopleTypes.SOFTCHILD || a.eatsMeals) ? "inline" : "inline invisible"}>
                    <Select
                      defaultValue={ a.welcomeDinner !== '' ? { label: a.welcomeDinner, value: a.welcomeDinner } : null }
                      options={arrayToOptions(kidsMenu)}
                      placeholder={"Select dinner..."}
                      onChange={(opt) => onChangeDinner(opt, a.id, "welcomeDinner")}
                      styles={selectStyle(300, 110)}
                    />
                  </div>
              }
            </div>
          </div>
        }
      )}
    </div>
  </div>



//----------------------------------------------------------------------------------------------------


const Balloons = ({contact}) =>
  <div>
    <h2>Balloon Release</h2>
    <p>You are invited to honor your Soft Angel during our Memorial Balloon Release. It is not necessary to attend
       the conference to request a balloon for your child.
    </p>
    <b>
      <p></p>
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
      <p></p>
    </b>
  </div>



//----------------------------------------------------------------------------------------------------


const Directory = ({blurb, directory, onChange}) =>
  <div>
    <h2>Directory</h2>
    <p>{blurb}
    </p>
    <p>Please uncheck any contact information that you don't want included in the directory:</p>
    <div className="indent">
      <p><Checkbox defaultChecked={directory.phone} onChange={event => onChange(event.target.checked, "phone")} /> Include phone number</p>
      <p><Checkbox defaultChecked={directory.email} onChange={event => onChange(event.target.checked, "email")} /> Include email address</p>
      <p><Checkbox defaultChecked={directory.city}  onChange={event => onChange(event.target.checked, "city")}  /> Include the City and Country</p>
    </div>
  </div>


//----------------------------------------------------------------------------------------------------


const SoftWear = ({blurb, shirtTypes, shirtsOrdered, onChange, onRemove, onDropdown, onAdd}) =>
  <div>
    <h2>SOFT Wear</h2>
    <p>{blurb}</p>
    {shirtTypes.map( (shirtType, i) =>
      <div key={shirtType.id}>
        <p className="indent"><b>{i+1}. {shirtType.description}</b></p>
        {shirtsOrdered.map( (shirt) => {
            if (shirt.shirtID === shirtType.id) {
              return <div key={shirt.id} className="indent-twice">
                  <div className="shirt-ordered">Ordered:</div>{shirt.quantity}<div className="shirt-size">{shirtDisplay[shirt.size]}</div><div className="shirt-total">${shirt.quantity*shirtType.cost}</div>
                  <Button onClick={() => onRemove(shirt.id)}>Remove</Button>
                </div>
            }
            return null;
          }
        )}
        <div className="indent-twice">
          Select Size:
          <div className="shirt-select">
            <Select
              options={optionsShirtSizes}
              placeholder={"Select..."}
              onChange={(opt) => onDropdown(opt, shirtType.id, "size")}
              styles={customStylesNarrow}
            />
          </div>
          Quantity:
          <div className="shirt-select">
            <Select
              options={optionsShirtQuantity}
              defaultValue={0}
              onChange={(opt) => onDropdown(opt, shirtType.id, "quantity")}
              styles={customStylesNarrow}
            />
          </div>
          <Button onClick={() => onAdd(shirtType.id)}>Add to Order</Button>
        </div>
        <br />
      </div>
    )}
  </div>




//----------------------------------------------------------------------------------------------------


var userData = {};
var userDataJSON = '';

function add_line(indent, str) {
  return ' '.repeat(indent*3) + str + '\n';
}

const Summary = ({thisState}) => {

  let t = new Date().getTime();

  let contactID = thisState.contactInfo.firstName.toLowerCase().replace(/[^A-Za-z]/g, '')+t;

  userData = {
    contactID:        contactID,
    contactInfo:      thisState.contactInfo,
    attendees:        thisState.attendees,
    softAngels:       thisState.softAngels,
    directory:        thisState.directory,
    shirtsOrdered:    thisState.shirtsOrdered,
    photoWaiver:      thisState.photoWaiver, 
    attendance:       thisState.attendance,
    reception:        thisState.reception,
    sundayBreakfast:  thisState.sundayBreakfast,
    boardMember:      thisState.boardMember,
    chapterChair:     thisState.chapterChair,
    clinicTieDowns:   thisState.clinicTieDowns,
    joeyWatson:       thisState.joeWatson,
  }

  userDataJSON = JSON.stringify(userData);

  let output = '';

  let reg = '';
  switch (userData.attendance) {
    case 'full':    reg = 'Attending the full conference'; break;
    case 'picnic':  reg = 'Only attending the picnic'; break;
    case 'balloon': reg = 'Requesting a balloon (not attending)'; break;
    default: console.log('Problem with the type of attendance');
  }
  output += add_line(0, '\nRegistration: ' + reg);
  output += '\n';

  output += add_line(0, '\nContact Information:');
  output += '\n';
  
  output += add_line(1, userData.contactInfo.firstName + ' ' + userData.contactInfo.lastName);
  output += add_line(1, userData.contactInfo.address1);
  if (userData.contactInfo.address2 !== '') {
    output += add_line(1, userData.contactInfo.address2);
  }
  output += add_line(1, userData.contactInfo.city + ' ' + userData.contactInfo.stateProv + ' ' + userData.contactInfo.postalCode);
  output += add_line(1, userData.contactInfo.country);
  output += '\n';

  output += add_line(1, 'Mobile phone: ' + userData.contactInfo.phoneMobile);
  output += add_line(1, 'Home phone:   ' + userData.contactInfo.phoneHome);
  output += add_line(1, 'Work phone:   ' + userData.contactInfo.phoneWork);
  output += '\n';

  output += add_line(1, 'Email: ' + userData.contactInfo.email);
  output += '\n';

  //----

  output += add_line(0, '\nSOFT Angel' +  (userData.softAngels.length === 1 ? '' : 's')  + ':');
  output += '\n';
  if (userData.softAngels.length === 0) {
    output += add_line(1, 'There are no SOFT angels.');
  }
  else {
    for (var softAngel of userData.softAngels) {
      output += add_line(1, softAngel.firstName + ' ' + softAngel.lastName);
      output += add_line(1, 'Date of birth: ' + softAngel.dateOfBirth.toDateString());
      output += add_line(1, 'Date of death: ' + softAngel.dateOfDeath.toDateString());
      output += add_line(1, 'Diagnosis: ' + (softAngel.diagnosis === "Other" ? softAngel.otherDiagnosis : softAngel.diagnosis));
      output += '\n';
    }
  }

  //  If 'baloon'-only, then we're done summarizing
  if (userData.attendance !== 'balloon') {

    output += add_line(0, '\nAttendees:');
    output += '\n';
    if (userData.attendees.length === 0) {
      output += add_line(1, 'There are no Attendees listed.');
    }
    else {
      for (var attendee of userData.attendees) {
        output += add_line(1, attendee.firstName + ' ' + attendee.lastName);

        if (attendee.peopleType === peopleTypes.CHILD) {
          output += add_line(1, 'Child, age: ' + attendee.age);
          if (!attendee.sibOuting) {
            output += add_line(1, 'Sibling outing: Not attending');
          }
          else {
            if (attendee.age < 5) console.log('Attendee too young for a sibling outing');
            output += add_line(1, 'Sibling outing: ' + (attendee.age >= 12 ? "Attending older-sibling outing" : 'Attending younger-sibling outing'));
            output += add_line(1, 'Shirt size: ' + shirtDisplay[attendee.shirtSize]);
          }
        }
        else if (attendee.peopleType === peopleTypes.SOFTCHILD) {
          output += add_line(1, attendee.peopleType);
          output += add_line(1, 'Date of birth: ' + attendee.dateOfBirth.toDateString());
          output += add_line(1, 'Diagnosis: ' + (attendee.diagnosis === "Other" ? attendee.otherDiagnosis : attendee.diagnosis));
          output += add_line(1, 'Eats meals: ' + (attendee.eatsMeals ? 'Yes' : 'No'));
        }
        else {
          output += add_line(1, attendee.peopleType);
        }
        output += '\n';
      }
    }

  }

  let html = output.replace(/\n/g, "<br />");
  html = html.replace(/\s{3}/g,'<span class="indent"></span>')

  return (
    <div>
      <h2>Summary</h2>
      <p>That's it! You have completely filled out the registration. Next, please double-check the information
         below and confirm that everything looks correct.
      </p>
      <p>If you find something that needs correcting, click on the BACK button below, otherwise click NEXT</p>
      <div>{ ReactHtmlParser(html) }</div>
    </div>
  );
}



//----------------------------------------------------------------------------------------------------


// Using fetch() to send data
// https://developers.google.com/web/updates/2015/03/introduction-to-fetch

// fetch('./api/some.json')
//   .then(
//     function(response) {
//       if (response.status !== 200) {
//         console.log('Looks like there was a problem. Status Code: ' +
//           response.status);
//         return;
//       }

//       // Examine the text in the response
//       response.json().then(function(data) {
//         console.log(data);
//       });
//     }
//   )
//   .catch(function(err) {
//     console.log('Fetch Error :-S', err);
//   });

  

const Checkout = ({thisState}) =>
  <div>
    <h2>Checkout</h2>
    <p>
    Enter some more data:
    </p>
    <form method="post" action="http://softconf.org/index.pl">
      <input id="json-data" type="hidden" name="data" value={userDataJSON}/>
      <button type="submit">Send Data</button>
    </form>
  </div>


//----------------------------------------------------------------------------------------------------



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
            styles={customStylesDiagnosis}
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


const SelectYesNo = ({value, isDisabled, onChange, className="edit-remb-lunch"}) => {
      const defaultOpt = optionsYesNo.find(opt => (opt.value === value));
      return (
        <div className={className}>
          <Select
            options={optionsYesNo}
            defaultValue={defaultOpt}
            placeholder={"Select..."}
            isDisabled={isDisabled}
            onChange={onChange}
            styles={selectStyle(90, 60)}
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
      let defaultOpt = optionsShirtSizes.find(opt => (opt.value === value));
      return (
        <div className={className}>
          <Select
            options={optionsShirtSizes}
            defaultValue={defaultOpt}
            placeholder={"Select shirt..."}
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
      <Button className="button button-prev" onClick={onClickPrev}><FontAwesomeIcon icon="angle-double-left" /> BACK</Button>
    }
    {pageNum < pages.END-1  &&
      <Button className="button button-next" onClick={onClickNext}>NEXT <FontAwesomeIcon icon="angle-double-right" /></Button>
    }
  </div>



const Checkbox = ({ name, defaultChecked, onChange, className }) =>
  <input
    type="checkbox"
    name={name}
    onChange={onChange}
    className={className}
    checked={defaultChecked}
  />


// OLD ----------------------------------------------------------------------------


const Button = ({ onClick = null, onSubmit = null, className = 'btn', children, type = 'button' }) =>
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
    text = text.replace(/\s+/g, ' ');

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
    address = address.replace(/\s+/g, ' ');

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
    email = email.trim().replace(/\s+/g, '');
    //  Correct misspellings of gmail.com, etc
    return email.toLowerCase();
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


export default App;
