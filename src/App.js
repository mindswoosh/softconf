//
//  SOFT Conference Registration
//
//  9/18/18 v0.1 Steve Maguire steve@stormdev.com
//
//  Robin Weirich's book, page 191
//  $ git add .
//  $ git commit -m "..."
//  $ git push heroku master
//  $ heroku open 


//  Update Notes:
//  * For event handlers, if we always pass the value and not the event|opt|whatever, then
//    a lot of the existing handlers could be cut to a much smaller number since they
//    would all simply take values and ids, and sometimes property names.
//
//  * Use optFromOptions() instead of "find"ing it hardcoded each time on the fly
//  * Add flag whether workshops get dinner or not
//  * Put check address in eventInfo
//  * Or, put entire Thank You page and outgoing emails in eventInfo
//  * If they enter the same shirt size a second time, confirm()
//  * Add history to browser's back button
//  * Redirect http: and non-www. version to https://www....


import React, { Component } from 'react';
import Select from 'react-select';
import {RadioGroup, Radio} from 'react-radio-group';
import ReactHtmlParser from 'react-html-parser';
import PaypalExpressBtn from 'react-paypal-express-checkout';
import Textarea from 'react-textarea-autosize';
import logo from './softlogo.png';                      //  Must be in directory as the App.js that uses it
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

var sprintf = require('sprintf-js').sprintf;

const DEBUG = false;  //  Set to false for production

const JSONversion = '1.0';

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
  SPECIALNEEDS: pageNum++,
  SUMMARY:      pageNum++,
  CHECKOUT:     pageNum++,
  THANKYOU:     pageNum++,
  END:          pageNum++,
};

console.assert(Object.keys(pages).find( (name,i) => { return pages[name] !== i} ) === undefined, 'Page Enum is incorrect');

const countries = ['United States', 'Canada', 'Mexico', 'United Kingdom', '-----', 'Afghanistan', 'Åland Islands', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bangladesh', 'Barbados', 'Bahamas', 'Bahrain', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'British Indian Ocean Territory', 'British Virgin Islands', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Burma', 'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'Christmas Island', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Congo-Brazzaville', 'Congo-Kinshasa', 'Cook Islands', 'Costa Rica', 'Croatia', 'Curaçao', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'El Salvador', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Federated States of Micronesia', 'Fiji', 'Finland', 'France', 'French Guiana', 'French Polynesia', 'French Southern Lands', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Heard and McDonald Islands', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfolk Island', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn Islands', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Réunion', 'Romania', 'Russia', 'Rwanda', 'Saint Barthélemy', 'Saint Helena', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Martin', 'Saint Pierre and Miquelon', 'Saint Vincent', 'Samoa', 'San Marino', 'São Tomé and Príncipe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Sint Maarten', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Georgia', 'South Korea', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Svalbard and Jan Mayen', 'Sweden', 'Swaziland', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Vietnam', 'Venezuela', 'Wallis and Futuna', 'Western Sahara', 'Yemen', 'Zambia', 'Zimbabwe'];

const optionsCountries = countries.map(opt => ({ label: opt, value: opt }));



const eventInfoDefault = {

  conferenceID:         'JUL2019',
  eventTitle:           '2019 Conference Registration',
  brochureURL:          'https://trisomy.org/conference-brochure-ann-arbor-2019/',

  costAdult:            145,         // One free registration for board members
  costChild:             95,         // Children under 2 are free
  costSoftChild:          0,
  costProfessional:     135,
  costWorkshopsOnly:     45,
  costRembOuting:        25,
  costAdultPicnic:       35,
  costChildPicnic:       20,          // child <= 11
  minChildAgePaying:      5,

  workshopBlurb: "Workshops will be held on Thursday July 18 from 9am–4pm.",
  workshopSessions: [
      {
        id: 1,
        name:   "Session 1: 9am-10am",
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
            title:        "Self Care",
            moderator:    "",
            description:  ""
          },
          {
            id:           "1c",
            title:        "Wheelchair and seating",
            moderator:    "Julie Hawkins, Mike Barner",
            description:  ""
          },
          {
            id:           "1d",
            title:        "Simon's law",
            moderator:    "Sheryl Crosier",
            description:  ""
          },

        ]
      },
      {
        id: 2,
        name:   "Session 2: 10:10am-11:10am",
        workshops: [
          {
            id:           "2n",
            title:        "None",
            moderator:    "",
            description:  ""
          },
          {
            id:           "2a",
            title:        "The TRIS Project",
            moderator:    "Debbie Bruns",
            description:  ""
          },
          {
            id:           "2b",
            title:        "Art Party",
            moderator:    "Denise Ferber",
            description:  ""
          },
          {
            id:           "2c",
            title:        "Wheelchair and seating",
            moderator:    "Julie Hawkins, Mike Barner",
            description:  ""
          },
          {
            id:           "2d",
            title:        '"I am": The Journey',
            moderator:    "Martiana Biagi",
            description:  ""
          },
        ]
      },
      {
        id: 3,
        name:   "Session 3: 11:20am-12:20pm",
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
            title:        "Trisomy 18, 13. Preventing Seizures, Light Sensitivity and Headaches",
            moderator:    "Dr. Steve Cantrell",
            description:  ""
          },
          {
            id:           "3c",
            title:        "Wheelchair and seating",
            moderator:    "Julie Hawkins, Mike Barner",
            description:  ""
          },
          {
            id:           "3d",
            title:        "Crafting Your Story",
            moderator:    "Terre Krotzer",
            description:  ""
          },
        ]
      },
      {
        id: 4,
        name:   "Session 4: 1:40pm-3:25pm",
        workshops: [
          {
            id:           "4n",
            title:        "None",
            moderator:    "",
            description:  ""
          },
          {
            id:           "4a",
            title:        "Moms Only - Sharing Workshop",
            moderator:    "",
            description:  ""
          },
          {
            id:           "4b",
            title:        "Dads Only - Sharing Workshop",
            moderator:    "",
            description:  ""
          },
        ]
      },
    ],


  clinicsBlurb: "This year’s SOFT Medical Clinics will be held at C.S. Mott Children’s Hospital on Friday July 19, 2019 from 1pm–5pm. Please number your clinic preferences (up to 5). We will attempt to schedule each child into 3 of the 5 preferences.",
  clinics: [
      'Otolaryngology',
      'Infectious Disease',
      'Immuno-Hematology',
      'Genetics',
      'GI',
      'Orthopedic',
      'Pulmonology',
    ],

  youngerSibOutingBlurb: "This year the Younger Sibling outing will be combined with the Older Sib Outing. They will be going to the Detroit Zoo on Thursday, July 18th from 9am–2pm. Lunch is included as well as a SOFT Sibs T-shirt! Price for the outing is $42.",
  youngerSibCost: 42,

  olderSibOutingBlurb: "This year the Older Sibling outing will be combined with the Younger Sib Outing. They will be going to the Detroit Zoo on Thursday, July 18th from 9am–2pm. Lunch is included as well as a SOFT Sibs T-shirt! Price for the outing is $42.",
  olderSibCost: 42,

  sibShirtSizes: [
      'Youth - S',  
      'Youth - M',
      'Youth - L',
      'Adult - S',
      'Adult - M',
      'Adult - L',
      'Adult - XL',
      'Adult - XXL',
      'Adult - 3XL',
      'Adult - 4XL',
      'Adult - 5XL',
    ],

  childCareBlurb: "Childcare will be available during the Workshops and Clinics and is available for children 11 and under and for SOFT children of any age. Please refer to the brochure for the times of the Workshops and Clinics you plan to attend in which you might need childcare.",
  childCareSessions: [
    {
      id: 'cc1',
      title: "Wednesday 8am-5:30pm",
      pre5Only: false,
      boardOnly: true,
    },
    {
      id: 'cc2',
      title: "Thursday 8am-2pm",
      pre5Only: false,
      boardOnly: false,
    },
    {
      id: 'cc3',
      title: "Thursday 2pm-4:30pm",
      pre5Only: false,
      boardOnly: false,
    },
    {
      id: 'cc4',
      title: "Friday 11:45am-5pm",
      pre5Only: false,
      boardOnly: false,
    },
  ],

  welcomeDinnerBlurb: "Our annual welcome dinner will be held Thursday night from 6pm–11pm. Please make your meal choices below.",
  adultMenu: [
      'Portabella Napolean',
      'Sliced Sirloin Medallions',
      'Chicken Cordon Bleu'
    ],
  kidsMenu: [
      'Chicken Tenders',
      'No Meal Needed',
    ],

  chapterChairBlurb: "The Chapter Chair Luncheon will be held on Thursday July 18th from 12:25–1:25. Please indicate below which adults in your party will attend.",

  remembranceBlurb: "This year’s Remembrance Outing will be at the Matthaei Botanical Gardens. This event is for those who have lost a child. Fee is $25 per person and includes lunch. If you plan to attend, please put a checkmark next to each person who will be attending, and select the type of lunch for each. Otherwise, simply click the Next button.",
  remembranceMenu: [
      'Vegetarian',
      'Non-vegetarian',
    ],

  picnicBlurb: "The Annual Ryan Cantrell Memorial Picnic and Balloon Celebration will be at Dawn Farms on Saturday July 20th from 11:30–3pm.",

  shirtsBlurb: "Order your SOFT Conference shirts ahead of time so they'll be ready and waiting for you when you check in at the Conference. Note that the Sib shirts given to the kids at the Sibling Outings are different than these shirts.",

  shirtTypes: [
      {
        id: "shirt1",
        description: "Basic Unisex Tee. $20 each.",
        cost: 20,
        sizes: [
            'Youth - S',  
            'Youth - M',
            'Youth - L',
            'Adult - S',
            'Adult - M',
            'Adult - L',
            'Adult - XL',
            'Adult - XXL',
            'Adult - 3XL',
            'Adult - 4XL',
            'Adult - 5XL',
          ]
      },
      {
        id: "shirt2",
        description: "Hoodies in Adult sizes only. $35 each.",
        cost: 35,
        sizes: [
            'Adult - S',
            'Adult - M',
            'Adult - L',
            'Adult - XL',
            'Adult - XXL',
            'Adult - 3XL',
            'Adult - 4XL',
            'Adult - 5XL',
          ]
      },
  ],

  directoryBlurb: "Each year we create a Conference Family directory. By including your contact information in the directory, families will be able keep in touch with each other after the Conference. By default, we include your phone number, email address, and the city that you live in (the street address is NOT included).",
  specialNeedsBlurb: "Are there any special needs that you need to tell us about in planning the Conference? For instance, are there any allergies, unique dietary needs, or transportation issues for conference events such as tie down's for attendees other than SOFT children that haven't already been covered in the registration that we would need to be aware of on our end? (Note: SOFT does not provide transportation between airport and hotel.)",
};


//  Take a match array that's either null, or the first element is "A#", 
//  "T#", or "C#", and it returns the number.
function numPeopleFromJWCODE(ma) {
  if (!ma) return 0;
  return Number(ma[0].substr(1));
} 


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

const customStylesNarrow = selectStyle(130, 110);

const customStylesDiagnosis = selectStyle(180, 122);


function arrayToOptions(a) {
  let options = [];

  if (a) {
    a.forEach( (item) => {
      options.push(
        { label: item, value: item }
      );
    });
  }

  return options;
}

function optFromOptions(options, value) {
  return options.find(opt => (opt.value === value));
}


const peopleTypes = {
  SOFTCHILD:    "SOFT Child",
  CHILD:        "Child",
  TEEN:         "Teen",
  ADULT:        "Adult",
  PROFESSIONAL: "Professional",
  SOFTANGEL:    "SOFT Angel",
};

const optionsPeopleTypes = [
  { label: "SOFT child",        value: peopleTypes.SOFTCHILD },
  { label: "Child (under 12)",  value: peopleTypes.CHILD },
  { label: "Teen (12-17)",      value: peopleTypes.TEEN },
  { label: "Adult",             value: peopleTypes.ADULT },
  { label: "Professional",      value: peopleTypes.PROFESSIONAL },
];


const optionsChildAges = [
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
];

const optionsTeenAges = arrayToOptions([12, 13, 14, 15, 16, 17]);


//  SOFT children and angels

let otherDiagnosisTitle = 'Other Diagnosis';    //  Used in several tests in the code

const AngelDiagnoses = [
  "Full Trisomy 18",
  "Full Trisomy 13",
  "Trisomy 9 Mosaic",
  "Trisomy 13 Mosaic",
  "Trisomy 18 Mosaic",
  "Partial Trisomy 13",
  "Partial Trisomy 18",
  otherDiagnosisTitle,
  "Other Loved One",
];

const optionsAngelsDiagnoses = arrayToOptions(AngelDiagnoses);


const Diagnoses = [
  "Full Trisomy 18",
  "Full Trisomy 13",
  "Trisomy 9 Mosaic",
  "Trisomy 13 Mosaic",
  "Trisomy 18 Mosaic",
  "Partial Trisomy 13",
  "Partial Trisomy 18",
  otherDiagnosisTitle,
];

const optionsDiagnoses = arrayToOptions(Diagnoses);



const optionsShirtQuantity = arrayToOptions([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);


function attendee(firstName, lastName, peopleType, age, eventInfo) {

  let attendee = {
    id: nextID++,
    firstName,
    lastName,
    peopleType,

    welcomeDinner: '',              //  Meal choice

    // Adults
    rembOuting: false,              //  Attending the Remembrance Outing?
    rembLunch:  '',                 //  Meal choice
    chapterChairLunch: false,       //  Attending the luncheon?
    workshops: {},                  //  { sessID1: choice, sessID1: choice, ... }   E.g., {  "1": "1n", "2": "2a", "3": "3c" }
    childCareSessions: {},          //  { ccID1: bool, ccID2: bool, ccID3:bool, ... }

    // Child
    age:            age,
    sibOuting:      false,
    sibShirtSize:   '',

    // SOFT Child / Angel
    dateOfBirth:    null,           //  Unspecified dates must be null or we crash (This is a Date object)
    birthDate:      '',             //  Textual version
    dateOfDeath:    null,           //  SOFT angels only
    deathDate:      '',
    diagnosis:      '',
    otherDiagnosis: '',
    eatsMeals:      false,

    // Picnic
    picnicTrans:    false,                //  Needs transportation to the picnic?
    picnicTiedown:  false,

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


function slashDateFormat(date) {
  return sprintf("%02d/%02d/%04d", date.getMonth()+1, date.getDate(), date.getFullYear());
}


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentPage: pages.WELCOME,
      pageHistory: [],                //  Keep a history of the pages visited for use by the Back button
      formID: '',
      workshopAttendee: 0,
      userDataSaved: false,
      shirtDropdowns: {},             //  { id1: { size, quantity }, id2: {...} }

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

      photoWaiver:      false, 
      attendance:       'full',     //  "full", "workshops" (only), picnic" (only), "balloon" celebration - not attending 
      reception:        false,
      sundayBreakfast:  false,
      softMember:       false,
      boardMember:      false,
      chapterChair:     false,
      joeyWatson:       false,
      joeyWatsonCode:   '',
      softDonation:     0,
      fundDonation:     0,

      attendees:  [],
      softAngels: [],

      directory: {
        phone:  true,
        email:  true,
        city:   true,
      },

      //  Clinic list?
      attendingClinics:  true,
      needsClinicsTrans: true,
      clinicBusSeats:    '',
      clinicTieDowns:    '',
      numClinicMeals:    '',

      needsRembTrans: false,

      specialNeeds: '',

      shirtsOrdered: [],              //  { shirtID, quantity, size, cost }
    };


    //  This set of change handlers could probably be drastically reduced by using
    //  generic handlers that take values, not events or opts as arguments

    this.setUserData          = this.setUserData.bind(this);
    this.setEventInfo         = this.setEventInfo.bind(this);
    this.onChangeContactInfo  = this.onChangeContactInfo.bind(this);
    this.onChangeCountry      = this.onChangeCountry.bind(this);
    
    this.onChangeAttendee     = this.onChangeAttendee.bind(this);
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

    // this.onChangePicnic       = this.onChangePicnic.bind(this);
    // this.onChangePicnicTiedown = this.onChangePicnicTiedown.bind(this);

    this.onChangeDirectory    = this.onChangeDirectory.bind(this);

    this.onRemoveShirt        = this.onRemoveShirt.bind(this);
    this.onShirtDropdown      = this.onShirtDropdown.bind(this);
    this.onAddShirt           = this.onAddShirt.bind(this);

    this.onChangechapterChairLunch = this.onChangechapterChairLunch.bind(this);

    this.onPrevPage           = this.onPrevPage.bind(this);
    this.onNextPage           = this.onNextPage.bind(this);
    this.onClickByCheck       = this.onClickByCheck.bind(this);
    this.fetchEventInfo       = this.fetchEventInfo.bind(this);
    this.componentDidMount    = this.componentDidMount.bind(this);

    this.onPaymentSuccess     = this.onPaymentSuccess.bind(this);
    this.onPaymentFailure     = this.onPaymentFailure.bind(this);
  }




  setEventInfo(result) {

    const eventInfo = eventInfoDefault;    // Eventually, this will be pulled from the DB

    let attendees = [];
    let softAngels = [];

    if (DEBUG) {
      attendees = [
        attendee("Steve", "Maguire",   peopleTypes.ADULT,        '', eventInfoDefault),
        attendee("Beth",  "Mountjoy",  peopleTypes.CHILD,         5, eventInfoDefault),
        attendee("Terre", "Krotzer",   peopleTypes.PROFESSIONAL, '', eventInfoDefault),
        attendee("Jane",  "Mountjoy",  peopleTypes.CHILD,        11, eventInfoDefault),
        attendee("Helen", "Mountjoy",  peopleTypes.TEEN,         12, eventInfoDefault),
        attendee("Cliff", "Mountjoy",  peopleTypes.TEEN,         17, eventInfoDefault),
        attendee("Jamie", "Jones",     peopleTypes.SOFTCHILD,     3, eventInfoDefault),
      ];

      let softchild = attendees.find( a => { return (a.lastName === 'Jones' ) });
      softchild.dateOfBirth = new Date();
      softchild.birthDate = slashDateFormat(softchild.dateOfBirth);
      softchild.diagnosis = 'Full Trisomy 18';
    }

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
                  <Welcome
                    brochureURL={eventInfo.brochureURL}
                  />,

              [pages.BASICS]:
                  <Basics 
                    photoWaiver={this.state.photoWaiver}
                    attendance={this.state.attendance}
                    reception={this.state.reception}
                    sundayBreakfast={this.state.sundayBreakfast}
                    softMember={this.state.softMember}
                    boardMember={this.state.boardMember}
                    chapterChair={this.state.chapterChair}
                    joeyWatson={this.state.joeyWatson}
                    joeyWatsonCode={this.state.joeyWatsonCode}
                    onChangeField={this.onChangeFieldValue}
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
                    eventInfo={this.state.eventInfo}
                    attendance={this.state.attendance}
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
                    attendingClinics={this.state.attendingClinics}
                    needsClinicsTrans={this.state.needsClinicsTrans}
                    clinicBusSeats={this.state.clinicBusSeats}
                    clinicTieDowns={this.state.clinicTieDowns}
                    numClinicMeals={this.state.numClinicMeals}
                    onChangeField={this.onChangeFieldValue}
                    onChangeSelection={this.onChangeFieldValue}
                  />,

              [pages.REMEMBRANCE]:
                  <Remembrance
                    attendees={attendees}
                    needsRembTrans={this.state.needsRembTrans}
                    onChange={this.onChangeRembOuting}
                    onChangeField={this.onChangeFieldValue}
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
                    blurb={eventInfo.workshopBlurb}
                    attendee={attendees[this.state.workshopAttendee]} 
                    sessions={eventInfo.workshopSessions}
                    onChange={this.onChangeWorkshops}
                  />,

              [pages.YOUNGERSIB]:
                  <YoungerSib
                    attendees={attendees}
                    onChange={this.onChangeSibOuting}
                    optionsShirtSizes={arrayToOptions(eventInfo.sibShirtSizes)}
                    onChangeShirtSize={this.onChangeShirtSize} 
                    cost={eventInfo.youngerSibCost} 
                    blurb={eventInfo.youngerSibOutingBlurb}
                  />,

              [pages.OLDERSIB]:
                  <OlderSib 
                    attendees={attendees}
                    onChange={this.onChangeSibOuting}
                    optionsShirtSizes={arrayToOptions(eventInfo.sibShirtSizes)}
                    onChangeShirtSize={this.onChangeShirtSize}
                    cost={eventInfo.olderSibCost}
                    blurb={eventInfo.olderSibOutingBlurb}
                  />,

              [pages.PICNIC]:
                  <Picnic
                    blurb={eventInfo.picnicBlurb}
                    attendees={attendees}
                    onChangeAttendee={this.onChangeAttendee}
                  />,

              [pages.BALLOONS]:
                  <Balloons />,

              [pages.CHAPTERCHAIR]:
                  <ChapterChair
                    blurb={eventInfo.chapterChairBlurb}
                    attendees={attendees}
                    onChange={this.onChangechapterChairLunch}
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
                    shirtDropdowns={this.state.shirtDropdowns}
                    onRemove={this.onRemoveShirt}
                    onDropdown={this.onShirtDropdown}
                    onAdd={this.onAddShirt}
                  />,

              [pages.SUMMARY]:
                  <Summary
                    thisState={this.state}
                  />,

              [pages.SPECIALNEEDS]:
                  <SpecialNeeds 
                    blurb={eventInfo.specialNeedsBlurb}
                    specialNeeds={this.state.specialNeeds}
                    onChange={this.onChangeFieldValue}
                  />,

              [pages.CHECKOUT]:
                  <Checkout
                    thisState={this.state}
                    // setUserData={this.setUserData}
                    softDonation={this.state.softDonation}
                    fundDonation={this.state.fundDonation}
                    onChange={this.onChangeFieldValue}
                    onClickByCheck={this.onClickByCheck}
                    onPaymentSuccess={this.onPaymentSuccess}
                    onPaymentFailure={this.onPaymentFailure}
                  />,

              [pages.THANKYOU]:
                  <ThankYou
                    thisState={this.state}
                    setUserData={this.setUserData}
                  />,

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
      if (attendees[i].peopleType === peopleTypes.CHILD  &&  attendees[i].age >= 5) {
        return i;
      }
    }

    return -1;
  }

  //  Pass in -1 if you want to find the first older child
  nextOlderSib(currentSib) {
    let { attendees } = this.state;

    for (let i = currentSib+1; i < attendees.length; i++) {
      if (attendees[i].peopleType === peopleTypes.TEEN) {
        return i;
      }
    }
    
    return -1;
  } 

  //  Pass in -1 if you want to find the first child that qualifies for child care
  nextChildCare(currentSib) {
    let { attendees } = this.state;

    for (let i = currentSib+1; i < attendees.length; i++) {
      if (attendees[i].peopleType === peopleTypes.CHILD  ||  attendees[i].peopleType === peopleTypes.SOFTCHILD) {
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

        case pages.SOFTANGELS:
          checkNext = (this.state.attendance === 'workshops');
          if (checkNext) {
            curPage = pages.ATTENDEES;
          }
          break;

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
          checkNext = (this.nextAdultPro(-1) === -1);                 // Skip workshops if no adults
          if (checkNext) {
            curPage = pages.YOUNGERSIB;
          }
          break;

        case pages.YOUNGERSIB:
          checkNext = (this.nextYoungerSib(-1) === -1);               // Skip younger sibs if none
          if (checkNext) {
            curPage = pages.OLDERSIB;
          }
          break;

        case pages.OLDERSIB:
          checkNext = (this.nextOlderSib(-1) === -1);                 // Skip older sibs if none
          if (checkNext) {
            curPage = pages.CHILDCARE;
          }
          break;

        case pages.CHILDCARE:
          checkNext = (this.nextChildCare(-1) === -1);                // Skip childcare if none appropriate
          if (checkNext) {
            curPage = pages.CHAPTERCHAIR;
          }
          break;

        case pages.CHAPTERCHAIR:
          checkNext = !this.state.chapterChair;                       // No one is a Chapter Chair?
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

        case pages.SPECIALNEEDS:                                    //  Don't ask about special needs unless attending the full conference
          checkNext = (this.state.attendance !== 'full');
          if (checkNext) {
            curPage = pages.SUMMARY;
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
            contactInfo.email       = "stormdevelopment@gmail.com";
          }

          pageHistory.push(currentPage);

          this.setState({
            pageHistory,
            contactInfo,
            currentPage: pages.BASICS,
          });

          break;


      case pages.BASICS:

          //  Joey Watson code:  JW + A# + T# + C#. E.g, JWA2C1.  The A, T, and Cs can be in any order. All are optional, but there must be at least one of them.
          let jwcode = this.state.joeyWatsonCode.trim().replace(/\s+/g, '').toUpperCase();

          let validJWCode = jwcode.match(/^JW([ATC]\d)+$/)  &&  !jwcode.match(/([ATC]).+\1/);       //  Make sure there are no dups:  JWA2A1...

          if (this.state.attendance !== 'balloon'  &&  !this.state.photoWaiver) {
            alert('To register for the Conference, you must agree to the photo and video waiver. Please check the box to agree.');
          }
          else if (this.state.attendance === 'full'  &&  this.state.joeyWatson  &&  !validJWCode) {
            alert('Oops! the Joey Watson confirmation code is incorrect. Enter the correct code, or choose "No" for the Joey Watson fund.');
          }
          else {

            if (!this.state.chapterChair) {           //  If they reset Chapter Chair from Y to N, reset lunch attendance to false
              attendees = attendees.map(a => { 
                a.chapterChairLunch = false;
                return a;
              });
            }

            let defaultDirSettings = (this.state.attendance === 'full'  ||  this.state.attendance === 'picnic');
            let directory = {
              phone: defaultDirSettings,
              email: defaultDirSettings,
              city:  defaultDirSettings,  
            }

            pageHistory.push(currentPage);

            this.setState({
              joeyWatsonCode: jwcode,
              attendees,
              directory,
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
                attendees.push( attendee(contact.firstName, contact.lastName, peopleTypes.ADULT, '', this.state.eventInfo) );
            }

            pageHistory.push(currentPage);

            this.setState({
              contactInfo: contact,
              pageHistory,
              currentPage: this.nextPage(pages.SOFTANGELS),
            });
          }

          break;

      case pages.SOFTANGELS:
          let softAngels = this.state.softAngels;

          softAngels = softAngels.map(a => { 
            a.firstName = smartFixName(a.firstName.trim());
            a.lastName  = smartFixName(a.lastName.trim());
            a.otherDiagnosis = a.otherDiagnosis.trim();
            if (a.dateOfBirth) a.birthDate = slashDateFormat(a.dateOfBirth);
            if (a.dateOfDeath) a.deathDate = slashDateFormat(a.dateOfDeath);
            return a;
          });

          softAngels = softAngels.filter(a => { return (a.firstName !== ''  ||  a.lastName !== '') });


          let bad_softAngel = softAngels.find( a => { 
            return (  a.firstName === ''  ||  a.lastName === ''  ||  a.peopleType === '' ||
                      a.dateOfBirth === null  ||  a.dateOfDeath === null  ||  a.diagnosis === null  ||  
                      (a.diagnosis === otherDiagnosisTitle  &&  a.otherDiagnosis === '')
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
            if (a.dateOfBirth) {
              a.birthDate = slashDateFormat(a.dateOfBirth);
            }
            if (a.peopleType !== peopleTypes.SOFTCHILD) {
              a.diagnosis = '';
              a.otherDiagnosis = '';
              a.dateOfBirth = null;
            }
            if (a.peopleType !== peopleTypes.CHILD  &&  a.peopleType !== peopleTypes.TEEN) {
              a.age = '';
            }
            return a;
          });

          //  Remove totally empty rows
          attendees = attendees.filter(a => { return (a.firstName !== ''  ||  a.lastName !== '') });

          let bad_attendee = attendees.find( a => { 
            return (  a.firstName === ''  ||  a.lastName === ''  ||  a.peopleType === ''  || 
                     (a.peopleType === peopleTypes.CHILD  &&  (a.age === null || a.age === '' || a.age > 11)) ||
                     (a.peopleType === peopleTypes.TEEN   &&  (a.age === null || a.age === '' || a.age < 12)) ||
                     (a.peopleType === peopleTypes.SOFTCHILD  &&  (a.dateOfBirth === null  ||  a.diagnosis === null  ||  (a.diagnosis === otherDiagnosisTitle && a.otherDiagnosis === "")) )
                   ) 
          });

          if (attendees.length === 0) {
            alert("Oops! You must list at least one person. Will the Contact Person be attending?");
          }
          else if (bad_attendee !== undefined) {
            alert("Oops! Something is incorrect in the information for one or more of the people listed. Please double-check the information.");
          }
          else {

            //  Double-check Joey Watson code for obvious mistakes
            let badJoeyWatsonCode = false;

            if (this.state.joeyWatson) {
              let adults = numPeopleFromJWCODE(this.state.joeyWatsonCode.match(/A\d/i));
              let teens  = numPeopleFromJWCODE(this.state.joeyWatsonCode.match(/T\d/i));
              let children = numPeopleFromJWCODE(this.state.joeyWatsonCode.match(/C\d/i));

              let numAdultProAttendees = attendees.filter(a => a.peopleType  === peopleTypes.ADULT  ||  a.peopleType === peopleTypes.PROFESSIONAL).length;
              let numTeenAttendees     = attendees.filter(a => a.peopleType  === peopleTypes.TEEN).length;
              let numChildAttendees    = attendees.filter(a => (a.peopleType === peopleTypes.CHILD && a.age >= this.state.eventInfo.minChildAgePaying)).length;

              badJoeyWatsonCode = (adults > numAdultProAttendees  ||  teens > numTeenAttendees  ||  children > numChildAttendees);
            }

            if (badJoeyWatsonCode) {
              alert('It looks like you have entered an invalid Joey Watson Code. Please double-check your attendee information, or use the "<<BACK" button at the bottom of the page to go back and correct or remove the Joey Watson code.');
            }
            else {
              let attendingClinics  = this.state.attendingClinics;
              let needsClinicsTrans = this.state.needsClinicsTrans;
              let numClinicMeals    = this.state.numClinicMeals;
              let clinicBusSeats    = this.state.clinicBusSeats;
              let clinicTieDowns    = this.state.clinicTieDowns;

              let anySoftChildren = attendees.find(a =>  a.peopleType === peopleTypes.SOFTCHILD);
              if (!anySoftChildren) {
                attendingClinics  = false;
                needsClinicsTrans = false;
                clinicBusSeats    = '';
                clinicTieDowns    = '';
                numClinicMeals    = '';
              }

              pageHistory.push(currentPage);

              let newPage = pages.DINNER;

              if (this.state.attendance === 'picnic') {
                newPage = pages.DIRECTORY;
              }
              else if (this.state.attendance === 'workshops') {
                newPage = pages.WORKSHOPS;
              }

              this.setState({
                attendingClinics,
                needsClinicsTrans,
                clinicBusSeats,
                clinicTieDowns,
                numClinicMeals,
                attendees,
                pageHistory,
                currentPage: newPage,     //  Can't call newPage(pages.DINNER) because attendees isn't in state yet
              });
            }
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

          let attendingClinics  = this.state.attendingClinics;
          let needsClinicsTrans = this.state.needsClinicsTrans;
          let numClinicMeals    = this.state.numClinicMeals;
          let clinicBusSeats    = '';
          let clinicTieDowns    = '';

          let numSoftChildren = attendees.filter(a => a.peopleType === peopleTypes.SOFTCHILD).length;
          let numNonEaters    = attendees.filter(a => a.peopleType === peopleTypes.SOFTCHILD  &&  !a.eatsMeals).length;
          let numAttendees    = attendees.length;

          //  Clean up data
          if (attendingClinics) {
            if (needsClinicsTrans) {
              clinicBusSeats = this.state.clinicBusSeats.trim();
              clinicTieDowns = this.state.clinicTieDowns.trim();
              numClinicMeals = ((Number(clinicBusSeats) + Number(clinicTieDowns)) - numNonEaters).toString();     //  Assume all SOFT children are going
            } else {
              numClinicMeals = this.state.numClinicMeals.trim();
            }
          }
          else {
            needsClinicsTrans = false;
            clinicBusSeats = '';
            clinicTieDowns = '';
            numClinicMeals = '';
          }

          if (needsClinicsTrans  &&  (clinicBusSeats.match(/(^$)|\D/)  ||  clinicTieDowns.match(/(^$)|\D/)  ||  (Number(clinicBusSeats) + Number(clinicTieDowns)) === 0)) {
            alert("Please enter valid numbers for the number of bus seats and tie-downs needed.");
          }
          else if (needsClinicsTrans  &&  Number(clinicTieDowns) > numSoftChildren) {
            alert("You've chosen too many tie-downs. Enter only one tie-down per SOFT Child needing one.");
          }
          else if (needsClinicsTrans  &&  (Number(clinicBusSeats) + Number(clinicTieDowns)) > numAttendees) {
            alert("You've got too many bus seats and tie-downs. Choose one or the other for each person.");
          }
          else if (attendingClinics  &&  !needsClinicsTrans  &&  (numClinicMeals.match(/(^$)|\D/) ||  Number(numClinicMeals) === 0) ) {
            alert("Please enter the number of lunches your family will need at the Clinics.");
          }
          else if (attendingClinics  &&  !needsClinicsTrans  &&  Number(numClinicMeals) > (numAttendees - numNonEaters)) {
            alert("It looks like you've chosen too many meals. Choose only one meal per person attending. (Don't include meals for SOFT children who don't eat meals.)");
          }
          else {
            pageHistory.push(currentPage);

            this.setState({
              needsClinicsTrans,
              clinicBusSeats,
              clinicTieDowns,
              numClinicMeals,
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

            let nextPage = (this.state.attendance === 'workshops') ? pages.SUMMARY : this.nextPage(pages.YOUNGERSIB);

            this.setState({
              pageHistory,
              currentPage: nextPage,
            });
          }

          break;


      case pages.YOUNGERSIB:
          {
            attendees = attendees.map(a => {
              if (!a.sibOuting) {
                a.sibShirtSize = '';                        //  No shirts for people not attending
              }
              return a;
            });

            let $missing_shirt = attendees.find( a => { return (a.peopleType === peopleTypes.CHILD  &&  a.age >= 5  &&  a.sibOuting  &&  a.sibShirtSize === '' ) });
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
                a.sibShirtSize = '';                        //  No shirts for people not attending
              }
              return a;
            });

            let missing_shirt = attendees.find( a => { return (a.peopleType === peopleTypes.TEEN  &&  a.sibOuting  &&  a.sibShirtSize === '') });
            if (missing_shirt) {
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

          attendees = attendees.map(a => {
            if (a.peopleType === peopleTypes.CHILD  ||  a.peopleType === peopleTypes.SOFTCHILD) {
              for (let sess of this.state.eventInfo.childCareSessions) {
                if (!qualifiesChildCare(a.age, sess, this.state.boardMember)) {
                  a.childCareSessions[sess.id] = false;                               //  Make sure non-board members always have false for board-only settings
                }
              }
            }
            return a;
          });

          pageHistory.push(currentPage);

          this.setState({
            attendees,
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

          let anyRembGoers = attendees.find(a => a.rembOuting);
          let missing_lunch = attendees.find( a => { return (a.rembOuting  &&  a.rembLunch === '' ) });

          if (this.state.needsRembTrans  &&  !anyRembGoers) {
            alert("Oops! You've said you need transportation, but you haven't selected anybody to go. Please put a checkmark next to everyone attending.");
          }
          else if (missing_lunch) {
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
          let shirtDropdowns = this.state.shirtDropdowns;

          let keys = Object.keys(shirtDropdowns);

          let badDropdown = false;
          for (let key of keys) {
            if (shirtDropdowns[key].quantity !== 0) {
              badDropdown = true;
            }
          }

          if (badDropdown) {
            alert('Oops! You have selected a number of shirts but have not clicked the "Add Shirts to Order" button. Either click the button to add the order, or set all shirt quantities to "0" in the "Quantity" selections.');
          }
          else {
            pageHistory.push(currentPage);

            this.setState({
              pageHistory,
              currentPage: this.nextPage(pages.SPECIALNEEDS),
            });
          }

          break;

      case pages.SPECIALNEEDS:
          let specialNeeds = this.state.specialNeeds.trim();

          pageHistory.push(currentPage);

          this.setState({
            specialNeeds,
            pageHistory,
            currentPage: this.nextPage(pages.SUMMARY),
          });

          break;

      case pages.SUMMARY:
          // let attendees = this.state.attendees;

          pageHistory.push(currentPage);

          this.setState({
            userDataSaved: false,
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

      case pages.THANKYOU:
          break;

      default:
          console.log("Error in onNextPage")
    }
  }


  onClickByCheck(e) {
    e.preventDefault();
    this.setState ({
      currentPage: pages.THANKYOU,
    });
  }

  setUserData(saved) {
    this.setState ({
      userDataSaved: saved,
    });
  }


  //-------------------------------------------------------------------------------------------
  //  Generic handlers
  //
  //  A lot of the additional handlers could be changed to use these
  //
  //  REVIEW: If we change all the handlers to accept VALUES and not events or opts, then
  //  all of the speific event handlers over the next few pages can be reduced to just a
  //  few: one that changes top-level state variables, and a handler apiece to handle each
  //  top-level property that is an array or another object.


  onChangeFieldValue(field, value) {
    
    if (field === "softDonation" || field === "fundDonation") {
        value = value.replace(/\D/g, '');                         //  Only allow digits in donations
        value = value.replace(/^0(\d)/g, '$1');                   //  Strip leading zeros
    }

    this.setState({
      [field]: value
    });
  }
  
  onChangeAttendee(id, field, value) {
    let { attendees } = this.state;
    let i = attendees.findIndex(a => a.id === id);
    console.assert(i !== -1, "Warning -- couldn't find attendee in attendee list: id = " + id);
    attendees[i][field] = value;
    this.setState ({
      attendees
    });
  }



  //-------------------------------------------------------------------------------------------
  //  All of the handlers from here down should be reviewed to use the more general
  //  above...


  //-------------------------------------------------------------------------------------------
  //  Process Contact Info page


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


  //-------------------------------------------------------------------------------------------
  //  Process Attendees page
  
  onAddAttendee(event) {
    let { attendees, contactInfo } = this.state;

    if (attendees.length === 0)
      attendees.push( attendee(contactInfo.firstName, contactInfo.lastName,  peopleTypes.ADULT, '', this.state.eventInfo) );
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
    if (field === "diagnosis"  &&  opt.value !== otherDiagnosisTitle) {
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
    attendees[i].birthDate = slashDateFormat(date);
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

    if (field === 'dateOfBirth') {                            //  This feels like a total hack...
      softAngels[i].birthDate = slashDateFormat(date);
    }
    else {
      softAngels[i].deathDate = slashDateFormat(date);
    }

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
    attendees[i].sibShirtSize = opt.value;
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
  //  Chapter Chair page
  

  onChangechapterChairLunch(event, id) {
    let { attendees } = this.state;
    let i = attendees.findIndex(a => a.id === id);
    console.assert(i !== -1, "Warning -- couldn't find attendee in attendee list: id = " + id);
    attendees[i].chapterChairLunch = !attendees[i].chapterChairLunch;
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
    let { shirtsOrdered, shirtDropdowns } = this.state;
    let choices = shirtDropdowns[id];

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

      choices.size = null;
      choices.quantity = 0;

      this.setState({
        shirtsOrdered,
        shirtDropdowns
      });
    }
  }


  //-------------------------------------------------------------------------------------------
  //  SOFT Wear page

  onPaymentSuccess(payment) {
    // Congratulation, it came here means everything's fine!
    console.log("The payment was successful!");
    userData.paid = true;
    userData.payerID = payment.payerID;
    userData.paymentID = payment.paymentID;
    userData.paymentToken = payment.paymentToken;

    this.setState ({
      currentPage: pages.THANKYOU,
    });
  }

  onPaymentFailure(payment) {
    // Congratulation, it came here means everything's fine!
    console.log("The payment failed..", payment);
    userData.paid = false;
    this.setState ({
      currentPage: pages.THANKYOU,
    });
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
        src={logo}
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
      case pages.SPECIALNEEDS:
      case pages.SUMMARY:
        title = 'Summary';
        break;
      case pages.CHECKOUT:
        title = 'Checkout';
        break;
      case pages.THANKYOU:
        title = '';
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



const Welcome = ({brochureURL}) =>
  <div className="welcome">
    <h2>Welcome!</h2>
    <p>Welcome to the SOFT Conference Registration form!</p>
    <p>The 2019 SOFT Conference is going to be held on July 17-21, 2019 in Ann Arbor Michigan at the Marriott Ypsilanti at Eagle Creek, 1275 South Huron St., Ypsilanti, MI, 48197.
    </p>
    <p>If you haven't read the 2019 Conference Brochure yet, you'll want to do that first before going
       through this form so you know exactly what's going on. Having the brochure open in another window as you fill
       out this registration form will be helpful.
    </p>
    <p>If you need to review the brochure, click this button:</p>
    <div className="welcome-button-pos">
      <a className="welcome-button" href={brochureURL} target="_blank">View Online Brochure</a>
    </div>
    <p>If you need any help filling out the form, send an email to <b>help@softconf.org</b>.</p>
    <p>To get started, click on the NEXT button.</p>
  </div>


//----------------------------------------------------------------------------------------------------



const Basics = ({attendance, reception, photoWaiver, softMember, sundayBreakfast, boardMember, chapterChair, joeyWatson, joeyWatsonCode, onChangeField}) =>
  <div>
    <h2>Getting Started</h2>
    <p>In the next few pages, you'll be asked a series of questions so that we can tailor this year's
       SOFT Conference specifically for you and your family. If you're only requesting a balloon
       in memory of a SOFT Angel, you will only be asked about that. To get started, please 
       answer the following questions:
    </p>
    <div className="indent">
      <div className="v-indent">
        Are you a SOFT member?
        <div className="inline">
          <RadioGroup name="softMember" selectedValue={softMember} onChange={(val) => onChangeField("softMember", val)}>
            <span className="radio-yes"><Radio value={true} /> Yes</span>
            <Radio value={false} /> No
          </RadioGroup>
        </div>
      </div>

      <div className="v-indent">
        How much, if any, of the Conference are you planning to attend?
        <div className="v-indent indent">
          <RadioGroup name="attendance" selectedValue={attendance} onChange={(val) => onChangeField("attendance", val)}>
            <Radio value="full" /> Full Conference<br />
            <Radio value="workshops" /> Only attending the workshops (for Professionals)<br />
            <Radio value="picnic" /> Only attending the picnic<br />
            <Radio value="balloon" /> Requesting a Balloon (not attending the Conference)
          </RadioGroup>
        </div>
      </div>

      {attendance !== 'balloon' &&
        <div>
          <div className="v-indent">
            <b>Photography Waiver</b><br />
            <div className="inline photo-waiver-blurb">Photos and videos will be taken throughout the Conference. Click the waiver acceptance box to indicate that you agree to this:</div>
            <table>
              <tbody>
                <tr>
                  <td valign="top"><Checkbox defaultChecked={photoWaiver} onChange={event => onChangeField("photoWaiver", event.target.checked)} /> </td>
                  <td>
                    <span>I agree that my registration means I accept that random photos and videos will be taken at Conference which may appear on social media or the SOFT website.</span>
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
                  <RadioGroup name="reception" selectedValue={reception} onChange={(val) => onChangeField("reception", val)}>
                    <span className="radio-yes"><Radio value={true} /> Yes</span>
                    <Radio value={false} /> No
                  </RadioGroup>
                </div>
              </div>

              <div className="v-indent">
                Are you planning to attend the final breakfast on Sunday morning?
                <div className="inline">
                  <RadioGroup name="sundayBreakfast" selectedValue={sundayBreakfast} onChange={(val) => onChangeField("sundayBreakfast", val)}>
                    <span className="radio-yes"><Radio value={true} /> Yes</span>
                    <Radio value={false} /> No
                  </RadioGroup>
                </div>
              </div>

              <div className="v-indent">
                Is anybody in your group a board member?
                <div className="inline">
                  <RadioGroup name="boardMember" selectedValue={boardMember} onChange={(val) => onChangeField("boardMember", val)}>
                    <span className="radio-yes"><Radio value={true} /> Yes</span>
                    <Radio value={false} /> No
                  </RadioGroup>
                </div>
              </div>

              <div className="v-indent">
                Is anybody in your group a Chapter Chair?
                <div className="inline">
                  <RadioGroup name="chapterChair" selectedValue={chapterChair} onChange={(val) => onChangeField("chapterChair", val)}>
                    <span className="radio-yes"><Radio value={true} /> Yes</span>
                    <Radio value={false} /> No
                  </RadioGroup>
                </div>
              </div>
              <div className="v-indent">
                Has anyone in your group been approved for the Joey Watson fund?
                <div className="inline">
                  <RadioGroup name="joeyWatson" selectedValue={joeyWatson} onChange={(val) => onChangeField("joeyWatson", val)}>
                    <span className="radio-yes"><Radio value={true} /> Yes</span>
                    <Radio value={false} /> No
                  </RadioGroup>
                </div>
                {joeyWatson &&
                  <div>
                  Please enter the Joey Watson confirmation code: <Input value={joeyWatsonCode} field="joeyWatsonCode" id="joeyWatsonCode" onChange={(evt) => onChangeField("joeyWatsonCode", evt.target.value)} />
                  </div>
                }
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
       does not need to be attending the Conference.
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



const Attendees = ({eventInfo, attendance, attendees, onRemove, onAdd, onChange, onChangeSelection, onChangeMeals, onChangeDate}) =>
  <div>
    <h2>Conference Attendees</h2>
    <p>Please list everybody in your party who will be attending any part of the Conference. Be sure to include
       the Contact Person here if he or she will be attending.</p>
    {attendance === 'full'  &&
     <div>
       <p>
         Full Conference rates:<br />
         Adults: ${eventInfo.costAdult}  (Ages 12 and above are charged as adults)<br />
         Children: ${eventInfo.costChild} (Ages 11 and under)
       </p>
     </div>
    }
    {attendance === 'workshops'  &&
     <div>
       <p>
        All workshop conference rates: ${eventInfo.costWorkshopsOnly}
       </p>
     </div>
    }
    {attendance === 'picnic'  &&
     <div>
       <p>
         Picnic-only rates:<br />
         Adults: ${eventInfo.costAdultPicnic}  (Ages 12 and above are charged as adults)<br />
         Children: ${eventInfo.costChildPicnic} (Ages 11 and under)
       </p>
     </div>
    }

    {attendees.length > 0  &&
      <div>
        {attendees.map( (a, i) =>
          <div className="attendee-row" key={a.id}>
            <p className="row-num"><span className="bold">{i+1}.</span></p>
            <Input label="FIRST Name" value={a.firstName} id={"attendee-firstname-" + a.id} onChange={event => onChange(event, a.id, "firstName")} />
            <Input label="LAST Name"  value={a.lastName}  id={"attendee-lastname-" + a.id}  onChange={event => onChange(event, a.id, "lastName")} />
            <PeopleType value={a.peopleType} onChange={(opt) => onChangeSelection(opt, a.id, "peopleType")}/>
            {(a.peopleType === peopleTypes.CHILD  ||  a.peopleType === peopleTypes.TEEN)  ?
                <Age label="Age" value={a.age}  id={"attendee-age-" + a.id}  onChange={opt => onChangeSelection(opt, a.id, "age")} optionsAges={a.peopleType === peopleTypes.CHILD ? optionsChildAges : optionsTeenAges} />
              :
                <div className="edit-age"></div>
            }
            <Button onClick={() => onRemove(a.id)}>Remove</Button>
            {a.peopleType === peopleTypes.SOFTCHILD  &&
              <div>
                <p className="row-num"></p>
                Diagnosis: <Diagnosis label="Diagnosis" value={a.diagnosis} options={optionsDiagnoses} id={"attendee-diagnosis-" + a.id}  onChange={opt => onChangeSelection(opt, a.id, "diagnosis")} /><span className="small-gap"></span>
                Birthdate (M/D/Y): <DatePicker
                  selected={a.dateOfBirth}
                  onChange={date => onChangeDate(date, a.id)}
                /><span className="small-gap"></span>
                <Checkbox defaultChecked={a.eatsMeals} onChange={opt => onChangeMeals(opt, a.id)} /> Eats meals?
                {a.diagnosis === otherDiagnosisTitle  &&
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
    <p>Every year at the Conference, we have a balloon release for SOFT children who have passed away.
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
            <Diagnosis label="Diagnosis" value={a.diagnosis} options={optionsAngelsDiagnoses} id={"softangel-diagnosis-" + a.id}  onChange={opt => onChangeDiagnosis(opt, a.id, "diagnosis")} />
            <br />
            {a.diagnosis === otherDiagnosisTitle  &&
              <div>
                <p className="row-num"></p>
                Enter Diagnosis: <Input value={a.otherDiagnosis} id={"softangel-diag-" + a.id} className="other-diag" onChange={event => onChange(event, a.id, "otherDiagnosis")} />
              </div>
            }
            <p className="row-num"></p>
            <div className="soft-angel-date">
              Date of Birth (M/D/Y): <DatePicker
                selected={a.dateOfBirth}
                onChange={date => onChangeDate(date, a.id, "dateOfBirth")}
              />
            </div>
            <span className="small-gap"></span>
            <div className="soft-angel-date">
              Date of Death (M/D/Y): <DatePicker
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


const Workshops = ({attendee, sessions, blurb, onChange}) =>
  <div>
    <h2>Workshops</h2>
    <p>{blurb} Please choose which workshops that <strong>{attendee.firstName} {attendee.lastName}</strong> will be attending. Refer to the brochure for 
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
                <div key={ws.id} className="indent"><Radio value={ws.id} /> {ws.title}{ws.moderator === '' ? '' : " - " + ws.moderator}</div>
              )
            }
            </RadioGroup><br />
          </div>
        )
    }
  </div>


//----------------------------------------------------------------------------------------------------


const YoungerSib = ({attendees, optionsShirtSizes, onChange, onChangeShirtSize, cost, blurb}) =>
  <div>
    <h2>Younger Sibling Outing</h2>
    <p>{blurb}</p>
    <p>Check each child who will be attending the outing and choose a shirt size.</p>
    <div className="remembrance">
      {attendees.map( (a,i) => 
        {return a.peopleType === peopleTypes.CHILD  &&  a.age >= 5  &&
          <div key={a.id} className="indent">
            <Checkbox defaultChecked={a.sibOuting} onChange={event => onChange(event, a.id)} />
            <span className="remb-name">{a.firstName} {a.lastName}{a.sibOuting ? " - $" + cost : ""}</span>
            <div className={a.sibOuting? "inline" : "inline invisible"}>
              <ShirtSize value={a.sibShirtSize} optionsShirtSizes={optionsShirtSizes} onChange={(opt) => onChangeShirtSize(opt, a.id)} />
            </div>
          </div>
        })
      }
      <p></p>
    </div>
  </div>


const OlderSib = ({attendees, optionsShirtSizes, onChange, onChangeShirtSize, cost, blurb}) => 
  <div>
    <h2>Older Sibling Outing</h2>
    <p>{blurb}</p>
    <p>Check each child who will be attending the outing and choose a shirt size.</p>
    <div className="remembrance">
      {attendees.map( (a,i) => 
        { return a.peopleType === peopleTypes.TEEN  &&
          <div key={a.id} className="indent">
            <Checkbox defaultChecked={a.sibOuting} onChange={event => onChange(event, a.id)} />
            <span className="remb-name">{a.firstName} {a.lastName}{a.sibOuting ? " - $" + cost : ""}</span>
            <div className={a.sibOuting? "inline" : "inline invisible"}>
              <ShirtSize value={a.sibShirtSize} optionsShirtSizes={optionsShirtSizes} onChange={(opt) => onChangeShirtSize(opt, a.id)} />
            </div>
          </div>
        })
      }
      <p></p>
    </div>
  </div>


//----------------------------------------------------------------------------------------------------


const Clinics = ({attendees, clinics, attendingClinics, needsClinicsTrans, clinicBusSeats, clinicTieDowns, numClinicMeals, onSortEnd, blurb, onChangeField, onChangeSelection}) => {

  return (
    <div>
      <h2>Clinics</h2>
      <p className="v-indent-below">{blurb}</p>

      <div className="v-indent">
        Do you want to attend the clinics?
        <div className="inline">
          <RadioGroup name="attendingClinics" selectedValue={attendingClinics} onChange={(val) => onChangeField("attendingClinics", val)}>
            <span className="radio-yes"><Radio value={true} /> Yes</span>
            <Radio value={false} /> No
          </RadioGroup>
        </div>
      </div>

      {attendingClinics  && 
        <div>
          <div className="v-indent">
            Will you need transportation to the Clinics?
            <div className="inline">
              <RadioGroup name="needsClinicsTrans" selectedValue={needsClinicsTrans} onChange={(val) => onChangeField("needsClinicsTrans", val)}>
                <span className="radio-yes"><Radio value={true} /> Yes</span>
                <Radio value={false} /> No
              </RadioGroup>
            </div>
          </div>
          {needsClinicsTrans  &&
            <div className="indent">
              <div className="inline v-indent">(Don't include people in the bus seat count if you're reserving a tie-down for them.)</div><br />
              How many tie-downs will you need? <Input value={clinicTieDowns} className="donation-box" onChange={event => onChangeField("clinicTieDowns", event.target.value)} />
              <span className="inline-info">How many bus seats will you need? <Input value={clinicBusSeats} className="donation-box" onChange={event => onChangeField("clinicBusSeats", event.target.value)} /></span>
            </div>
          }
          {!needsClinicsTrans  &&
            <div>
              How many people will need lunch meals while at the clinics? <Input value={numClinicMeals} className="donation-box" onChange={event => onChangeField("numClinicMeals", event.target.value)} />
            </div>
          }
          <p className="v-indent">Rearrange the names of the clinics below from Most Interested to Least Interested by simultaneously clicking and dragging on the <span className="thumb-color"><FontAwesomeIcon icon="bars" /></span> character and moving
          the name of the clinic up or down. <i>(If you're planning to attend only one or two clinics, please mention that in the Notes section later in the form.)</i></p>
          <p>Move <strong>MOST Interested</strong> Clinic to the top, and the <strong>LEAST Interested</strong> Clinic to the bottom:</p>
          <SortableList items={clinics} onSortEnd={onSortEnd} />
        </div>
      }
    </div>
  );
}


//----------------------------------------------------------------------------------------------------



const Remembrance = ({ attendees, needsRembTrans, blurb, menuInfo, onChange, onChangeField, onChangeLunch }) =>
  <div>
    <h2>Remembrance Outing</h2>
    <p>{blurb}</p>
    <div className="remembrance">
      <div className="v-indent">
        Will you need transportation to the Remembrance Outing?
        <div className="inline">
          <RadioGroup name="needsRembTrans" selectedValue={needsRembTrans} onChange={(val) => onChangeField("needsRembTrans", val)}>
            <span className="radio-yes"><Radio value={true} /> Yes</span>
            <Radio value={false} /> No
          </RadioGroup>
        </div>
      </div>
      {attendees.map( (a,i) => 
        {return (a.peopleType === peopleTypes.ADULT  ||  a.peopleType === peopleTypes.PROFESSIONAL)  && 
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


function qualifiesChildCare(age, session, isBoardMember) {
  return (!session.pre5Only || age < 5) && (!session.boardOnly || isBoardMember);
}


const Childcare = ({attendees, childCareSessions, boardMember, onChange, blurb}) =>
  <div>
    <h2>Childcare</h2>
    <p>{blurb}</p>
    <p>Please put a checkmark next to each timeslot where you will need childcare.</p>
    <div className="remembrance">
      {attendees.map( (a,i) => 
        {return (a.peopleType === peopleTypes.SOFTCHILD  ||  a.peopleType === peopleTypes.CHILD)  &&
          <div key={a.id} className="indent">
            <span className="remb-name"><strong>{a.firstName} {a.lastName}</strong></span>
            {childCareSessions.map( (ccs,i) =>
              { return (qualifiesChildCare(a.age, ccs, boardMember) ?
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

const Picnic = ({attendees, onChangeAttendee, blurb}) =>
  <div>
    <h2>Picnic</h2>
    <p>{blurb}</p>
    <p>Please place a checkmark next to each person who will need bus transportation. If wheelchair tie-downs are
       needed for the bus, choose that too. If you have your own transportation, then just click NEXT.
    </p>
    <div className="remembrance">
      {attendees.map( (a,i) => 
        <div key={a.id} className="picnic-row">
          <Checkbox defaultChecked={a.picnicTrans} onChange={event => onChangeAttendee(a.id, "picnicTrans", event.target.checked)} />
          <span className="remb-name">{a.firstName} {a.lastName}</span>
          <div className={(a.picnicTrans  &&  a.peopleType === peopleTypes.SOFTCHILD) ? "inline" : "inline invisible"}>
            Needs tie-downs?
            <div className="inline">
              <RadioGroup name={"picnicTiedown" + a.id} selectedValue={a.picnicTiedown} onChange={(val) => onChangeAttendee(a.id, "picnicTiedown", val)}>
                <span className="radio-yes"><Radio value={true} /> Yes</span>
                <Radio value={false} /> No
              </RadioGroup>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>



//----------------------------------------------------------------------------------------------------


const ChapterChair = ({ blurb, attendees, onChange, onChangeLunch }) =>
  <div>
    <h2>Chapter Chair Luncheon</h2>
    <p>{blurb}</p>
    <p><i>(If you don't know what a Chapter Chair is, this doesn't apply to you. Please click NEXT.)</i></p>
    <div className="chapter-chair">
      {attendees.map( (a,i) =>
        {return (a.peopleType === peopleTypes.ADULT  ||  a.peopleType === peopleTypes.PROFESSIONAL)? 
          <div key={a.id} className="chair-row">
            <Checkbox defaultChecked={a.chapterChairLunch} onChange={event => onChange(event, a.id)} />
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
    <p>
      Adult meal options are: {adultMenu.join(', ')}<br />
      Child meal options are: {kidsMenu.join(', ')}
    </p>
    <div className="remembrance">
      {attendees.map( (a,i) =>
        {return <div key={a.id} className="indent">
            <span className="bold">{i+1}.</span> <span className="remb-name"> {a.firstName} {a.lastName}</span>
            <div className="inline">
              {a.peopleType === peopleTypes.ADULT  ||  a.peopleType === peopleTypes.PROFESSIONAL  ||  a.peopleType === peopleTypes.TEEN ?
                  <Select
                    defaultValue={ a.welcomeDinner !== '' ? { label: a.welcomeDinner, value: a.welcomeDinner } : null }
                    options={arrayToOptions(adultMenu)}
                    placeholder={"Select dinner..."}
                    onChange={(opt) => onChangeDinner(opt, a.id, "welcomeDinner")}
                    styles={selectStyle(300, 110)}
                  />
                : 
                  <div className={(a.peopleType !== peopleTypes.SOFTCHILD  ||  a.eatsMeals)  ?  "inline" : "inline invisible"}>
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
    <p>You are invited to honor your SOFT Angel during our Memorial Balloon Celebration. It is not necessary to attend
       the Conference to request a balloon for your child.
    </p>
    <b>
      <p></p>
    </b>
  </div>



//----------------------------------------------------------------------------------------------------


const Photos = ({contact}) =>
  <div>
    <h2>Photos</h2>
    <p>We invite you to share a family photo and a photo of your SOFT Child. Photos may be used for 
       display during the Conference and/or included in the SOFT Family Directory.
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


const SoftWear = ({blurb, shirtTypes, shirtsOrdered, shirtDropdowns, onChange, onRemove, onDropdown, onAdd}) =>
  <div>
    <h2>SOFT Wear</h2>
    <p>{blurb}</p>
    <p>To order shirts, select the size and quantity and click the "Add Shirt Size and Quantity to Order" button for each shirt size that you want.</p>
    <p><FontAwesomeIcon icon="hand-point-right" /> <b>If you want more than one size of the same shirt, simply make another choice and click the "Add Shirt Size and Quantity to Order" button a second or third time to add the different sizes.</b></p><br />
    {shirtTypes.map( (shirtType, i) =>
      <div key={shirtType.id}>
        <p className="indent">{i+1}. {shirtType.description}</p>
        {shirtsOrdered.map( (shirt) => {
            if (shirt.shirtID === shirtType.id) {
              return <div key={shirt.id} className="indent-twice">
                  <div className="shirt-ordered">Ordered:</div>{shirt.quantity}<div className="shirt-size">{shirt.size}</div><div className="shirt-total">${shirt.quantity*shirtType.cost}</div>
                  <Button onClick={() => onRemove(shirt.id)}>Remove from Order</Button>
                </div>
            }
            return null;
          }
        )}
        <div className="indent-twice">
          Select Size:
          <div className="shirt-select">
            <Select
              options={arrayToOptions(shirtType.sizes)}
              value={ optFromOptions(arrayToOptions(shirtType.sizes), shirtDropdowns[shirtType.id].size) }
              placeholder={"Select..."}
              onChange={(opt) => onDropdown(opt, shirtType.id, "size")}
              styles={customStylesNarrow}
            />
          </div>
          Quantity:
          <div className="shirt-select">
            <Select
              options={optionsShirtQuantity}
              value={ optFromOptions(optionsShirtQuantity, shirtDropdowns[shirtType.id].quantity) }
              onChange={(opt) => onDropdown(opt, shirtType.id, "quantity")}
              styles={customStylesNarrow}
            />
          </div>
          <div className="v-indent">
            <Button onClick={() => onAdd(shirtType.id)}>Add Shirt Size and Quantity to Order</Button>
          </div>
        </div>
        <br />
      </div>
    )}
  </div>


//----------------------------------------------------------------------------------------------------


const SpecialNeeds = ({ blurb, specialNeeds, onChange }) =>
  <div>
    <h2>Special Needs</h2>
    <p>{blurb}</p>
    <p>If you don't have any special notes, please click NEXT.</p>
    <div>
      <Textarea autoFocus minRows={4} className="special-needs-box" defaultValue={specialNeeds} onChange={e => onChange("specialNeeds", e.target.value)}/>
    </div>
  </div>


//----------------------------------------------------------------------------------------------------


function boolToYN(f) {
  if (f) return "Yes";
  return "No";
}

var userData = {};

function add_line(indent, str) {
  return ' '.repeat(indent*3) + str + '\n';
}

const Summary = ({thisState}) => {

  userData = {
    version:              JSONversion,
    conferenceID:         thisState.eventInfo.conferenceID,
    formID:               thisState.formID,
    contactInfo:          thisState.contactInfo,
    attendees:            thisState.attendees,
    softAngels:           thisState.softAngels,
    directory:            thisState.directory,
    shirtsOrdered:        thisState.shirtsOrdered,
    photoWaiver:          thisState.photoWaiver, 
    attendance:           thisState.attendance,
    reception:            thisState.reception,
    sundayBreakfast:      thisState.sundayBreakfast,
    softMember:           thisState.softMember,
    boardMember:          thisState.boardMember,
    chapterChair:         thisState.chapterChair,
    joeyWatson:           thisState.joeyWatson,
    joeyWatsonCode:       thisState.joeyWatsonCode,
    attendingClinics:     thisState.attendingClinics,
    needsClinicsTrans:    thisState.needsClinicsTrans,
    clinicBusSeats:       thisState.clinicBusSeats,
    clinicTieDowns:       thisState.clinicTieDowns,
    numClinicMeals:       thisState.numClinicMeals,
    clinics:              thisState.eventInfo.clinics,
    workshops:            thisState.workshops,
    childCareSessions:    thisState.childCareSessions,
    needsRembTrans:       thisState.needsRembTrans,
    numRembTrans:         0,
    specialNeeds:         thisState.specialNeeds,
    conferenceTotal:      0,
    softDonation:         0,
    fundDonation:         0,
    grandTotal:           0,
    paid:                 0,
    payerID:              '',
    paymentID:            '',
    paymentToken:         '',

    summary:              '',
  }

  let output = '';

  let reg = '';
  switch (userData.attendance) {
    case 'full':        reg = 'Attending the full Conference'; break;
    case 'workshops':   reg = 'Attending only the workshops (for Professionals only)'; break;
    case 'picnic':      reg = 'Only attending the picnic'; break;
    case 'balloon':     reg = 'Requesting a balloon (not attending)'; break;
    default: console.log('Problem with the type of attendance');
  }
  output += add_line(0, '\nRegistration: ' + reg);
  output += '\n';



  //  General questions

  if (userData.attendance === 'full') {
    output += add_line(0, sprintf("%-32s%s", 'Attending Wednesday reception: ', boolToYN(userData.reception))); 
    output += add_line(0, sprintf("%-32s%s", 'Attending Sunday breakfast: ', boolToYN(userData.sundayBreakfast)));
    output += '\n';

    output += add_line(0, sprintf("%-19s%s", 'Board member:', boolToYN(userData.boardMember)));
    output += add_line(0, sprintf("%-19s%s", 'Chapter Chair:', boolToYN(userData.chapterChair)));
    output += add_line(0, sprintf("%-19s%s", 'Joey Watson Fund:', boolToYN(userData.joeyWatson)));
    if (userData.joeyWatson) {
      output += add_line(0, sprintf("%-19s%s",'Joey Watson Code: ', userData.joeyWatsonCode));
    }
  }

  output += add_line(0, sprintf("%-19s%s", 'SOFT member:', boolToYN(userData.softMember)));
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

  output += add_line(1, sprintf("%-15s%s", 'Mobile phone:', userData.contactInfo.phoneMobile));
  output += add_line(1, sprintf("%-15s%s", 'Home phone:',   userData.contactInfo.phoneHome));
  output += add_line(1, sprintf("%-15s%s", 'Work phone:',   userData.contactInfo.phoneWork));
  output += '\n';

  output += add_line(1, 'Email: ' + userData.contactInfo.email);
  output += '\n';

  //----

  if (userData.attendance !== 'workshops') {

    output += add_line(0, '\nSOFT Angel' +  (userData.softAngels.length === 1 ? '' : 's')  + ':');
    output += '\n';
    if (userData.softAngels.length === 0) {
      output += add_line(1, 'There are no SOFT angels.');
      output += '\n';
    }
    else {
      for (let softAngel of userData.softAngels) {
        output += add_line(1, softAngel.firstName + ' ' + softAngel.lastName);
        output += add_line(1, 'Date of birth: ' + softAngel.birthDate);
        output += add_line(1, 'Date of death: ' + softAngel.deathDate);
        output += add_line(1, 'Diagnosis: ' + (softAngel.diagnosis === otherDiagnosisTitle ? softAngel.otherDiagnosis : softAngel.diagnosis));
        output += '\n';
      }
    }
  }

  //  If 'balloon'-only, then we're done summarizing

  if (userData.attendance !== 'balloon') {        //  if (full|workshops|picnic)

    output += add_line(0, '\nAttendees:');
    output += '\n';
    if (userData.attendees.length === 0) {
      output += add_line(1, 'There are no Attendees listed.');
    }
    else {
      for (var attendee of userData.attendees) {

        output += add_line(1, attendee.firstName + ' ' + attendee.lastName);

        switch (attendee.peopleType) {

          case peopleTypes.CHILD: 

            output += add_line(2, 'Child, age: ' + attendee.age);

            if (attendee.sibOuting) {
              if (attendee.age < 5) console.log('Attendee too young for a sibling outing');
              output += add_line(2, "Attending younger-sibling outing");
              output += add_line(2, "Shirt size: " + attendee.sibShirtSize);
            }
            else {
              if (userData.attendance === 'full')
                output += add_line(2, 'Attending Sibling outing:  No');
            }
            break;


          case peopleTypes.TEEN:

            output += add_line(2, 'Teen, age: ' + attendee.age);

            if (attendee.sibOuting) {
              output += add_line(2, "Attending older-sibling outing");
              output += add_line(2, "Shirt size: " + attendee.sibShirtSize);
            }
            else if (userData.attendance === 'full') {
                output += add_line(2, 'Attending Sibling outing:  No');
            }
            break;     


          case peopleTypes.SOFTCHILD:

            output += add_line(2, attendee.peopleType);
            output += add_line(2, 'Date of birth: ' + attendee.birthDate);
            output += add_line(2, 'Diagnosis: ' + (attendee.diagnosis === otherDiagnosisTitle ? attendee.otherDiagnosis : attendee.diagnosis));
            output += add_line(2, 'Eats meals: ' + boolToYN(attendee.eatsMeals));
            break;


          default:
            output += add_line(2, attendee.peopleType);         //  Adult and Professional
            break;
        }

        if (userData.attendance === 'full'  &&  (attendee.peopleType !== peopleTypes.SOFTCHILD  ||  attendee.eatsMeals)) {
          output += add_line(2, 'Welcome dinner meal: ' + (attendee.welcomeDinner !== '' ? attendee.welcomeDinner : 'N/A'));
        }
        output += '\n';
      }
    }


    //----

    if (userData.attendance === 'full') {

          let anySoftChildren = userData.attendees.find( a => { 
            return (a.peopleType === peopleTypes.SOFTCHILD);
          });

          if (anySoftChildren) {

              if (userData.attendingClinics) {
                output += add_line(0, '\nClinics:');
                output += '\n';
                if (userData.needsClinicsTrans) {
                  output += add_line(1, 'Transportation tie-downs needed:  ' + userData.clinicTieDowns);
                  output += add_line(1, 'Transportation bus seats needed:  ' + userData.clinicBusSeats);
                }
                else {
                  output += add_line(1, 'Needs transportation to clinics:  No');
                }
                output += '\n';

                let clinicOrder = 1;
                for (let clinic of userData.clinics) {
                  let suffix = 'th';
                  if (clinicOrder === 1)  suffix = 'st';
                  if (clinicOrder === 2)  suffix = 'nd';
                  if (clinicOrder === 3)  suffix = 'rd';
                  output += add_line(1, clinicOrder + suffix + ' Choice: ' + clinic);
                  clinicOrder++;
                }
              }
              else {
                output += add_line(0, '\nAttending clinics:  No');
              }

              output += '\n';
          }

    }


    //----


    //  Consider using this format: if (userData.attendance.match(/full|workshops/i)) { 
    if (userData.attendance === 'full'  ||  userData.attendance === 'workshops') { 

          let adults = userData.attendees.filter( a => { 
            return (a.peopleType === peopleTypes.ADULT  ||  a.peopleType === peopleTypes.PROFESSIONAL);
          });

          if (adults.length > 0) {

              output += add_line(0, '\nWorkshops:');
              output += '\n';

              for (let adult of adults) {

                output += add_line(1, adult.firstName + ' ' + adult.lastName + ':');

                for (let sess of thisState.eventInfo.workshopSessions) {
                  let workshop = sess.workshops.find( ws => ws.id === adult.workshops[sess.id]);
                  let wholeTitle = workshop.title + (workshop.moderator !== '' ? ' - ' + workshop.moderator : '')
                  if (wholeTitle.length > 90) {
                    wholeTitle = wholeTitle.substring(0, 90) + "...";
                  }
                  output += add_line(2, sess.name + ': ');
                  output += add_line(2, wholeTitle);
                  output += '\n';
                  // output += add_line(2, sess.name + ': ' + workshop.title + (workshop.moderator !== '' ? ' - ' + workshop.moderator : ''));
                }
                output += '\n';
              }
          }
    }


    //----

    if (userData.attendance !== 'workshops') {

          if (userData.attendance !== 'picnic') {

                //  Include Childcare section?
                let children = userData.attendees.filter( a => { 
                  return (a.peopleType === peopleTypes.CHILD  ||  a.peopleType === peopleTypes.SOFTCHILD);
                });

                if (children.length > 0) {

                    output += add_line(0, '\nChildcare:');
                    output += '\n';

                    for (let child of children) {

                      output += add_line(1, child.firstName + ' ' + child.lastName + ':');

                      let numSessions = 0;
                      for (let sess of thisState.eventInfo.childCareSessions) {
                        // child.childCareSessions:  { ccID1: bool, ccID2: bool, ccID3:bool... }
                        if (child.childCareSessions.hasOwnProperty(sess.id) && qualifiesChildCare(child.age, sess, thisState.boardMember)) {
                          output += add_line(2, sprintf("%-25s%s", sess.title + ': ', boolToYN(child.childCareSessions[sess.id])));
                          numSessions++;
                        }
                      }
                      if (numSessions === 0) output += add_line(2, "None");

                      output += '\n';
                    }
                }


                //----


                //  Include Chapter Chair section?
                if (userData.chapterChair) {
                  output += add_line(0, '\nAttending Chapter Chair Luncheon:');
                  output += '\n';

                  for (let attendee of userData.attendees) {
                    if (attendee.peopleType === peopleTypes.ADULT  ||  attendee.peopleType === peopleTypes.PROFESSIONAL) {
                      output += add_line(1, sprintf("%-28s%s", attendee.firstName + ' ' + attendee.lastName + ": ", boolToYN(attendee.chapterChairLunch)));
                    }
                    else {
                      attendee.chapterChairLunch = false;           //  Enforce proper state for non-adults
                    }
                  }

                  output += '\n';
                }


                //----


                //  Include Remembrance Outing section?
                if (userData.softAngels.length !== 0) {
                  output += add_line(0, '\nAttending Remembrance Outing:');
                  output += '\n';

                  let numAttending = userData.attendees.filter(a => (a.peopleType === peopleTypes.ADULT  ||  a.peopleType === peopleTypes.PROFESSIONAL)  &&  a.rembOuting);

                  if (numAttending.length) {
                    output += add_line(1, sprintf("%-28s%s", 'Needs transportation: ', boolToYN(userData.needsRembTrans)));
                    output += '\n';
                    output += add_line(1, 'People Attending:');
                    output += '\n';

                    userData.numRembTrans = 0;

                    for (let attendee of userData.attendees) {
                      if (attendee.peopleType === peopleTypes.ADULT  ||  attendee.peopleType === peopleTypes.PROFESSIONAL) {
                        output += add_line(1, sprintf("%-28s%-4s%s",attendee.firstName + ' ' + attendee.lastName + ": ", boolToYN(attendee.rembOuting), (attendee.rembOuting ? ' - meal: ' + attendee.rembLunch : '')));
                        if (attendee.rembOuting) {
                          userData.numRembTrans++;
                        }
                      }
                    }
                  }
                  else {
                    output += add_line(1, 'No one is attending');
                  }
                  output += '\n';
                }


                //----


                output += add_line(0, '\nNeeds transportation to the picnic:');
                output += '\n';

                for (let attendee of userData.attendees) {
                  if (attendee.peopleType === peopleTypes.SOFTCHILD) {
                    output += add_line(1, sprintf("%-28s%-5s%s", attendee.firstName + ' ' + attendee.lastName + ": ", boolToYN(attendee.picnicTrans), (attendee.picnicTrans ? ' - Needs tie-down: ' + boolToYN(attendee.picnicTiedown) : '')));
                  }
                  else {
                    output += add_line(1, sprintf("%-28s%s", attendee.firstName + ' ' + attendee.lastName + ": ", boolToYN(attendee.picnicTrans)));
                  }
                }
                output += '\n';


                //----


                if (userData.specialNeeds !== '') {
                  output += add_line(0, '\nSpecial Needs:');
                  output += '\n';
                  output += userData.specialNeeds.replace(/^/mg, "   ");                  //  Indent this data
                  output += '\n\n';
                }

          }

          //----


          output += add_line(0, '\nSOFT Wear Shirts:');
          output += '\n';

          for (let shirtType of thisState.eventInfo.shirtTypes) {

            output += add_line(1, shirtType.description);

            let totalShirts = 0;
            for (let shirt of userData.shirtsOrdered) {
              if (shirt.shirtID === shirtType.id) {
                output += add_line(2, 'Ordered: ' + shirt.quantity + ' x ' + shirt.size + ', $' + shirt.quantity*shirtType.cost);
                totalShirts++;
              }
            }

            if (totalShirts === 0) {
              output += add_line(2, 'None ordered');
            }

            output += '\n';
          }
    }

  }


  //----

  if (userData.attendance === 'full'  ||  userData.attendance === 'picnic') {

    output += add_line(0, '\nFamily Directory:');
    output += '\n';
    output += add_line(1, sprintf("%-16s%s", 'Include phone: ', boolToYN(userData.directory.phone)));
    output += add_line(1, sprintf("%-16s%s", 'Include email: ', boolToYN(userData.directory.email)));
    output += add_line(1, sprintf("%-16s%s", 'Include city: ', boolToYN(userData.directory.city)));
    output += '\n';

}


  //----

  userData.summary = output;

  let html = output.replace(/ /g,'&nbsp;');
  html = html.replace(/\n/g, "<br />");
  // html = html.replace(/\s{3}/g,'<span class="indent"></span>')

  return (
    <div>
      <h2>Summary</h2>
      <p>That's it! You have completely filled out the registration. Next, please double-check the information
         below and confirm that everything looks correct.
      </p>
      <p>If you find something that needs correcting, click on the BACK button below, otherwise click NEXT</p>
      <div className="summary">{ ReactHtmlParser(html) }</div>
    </div>
  );

}



//----------------------------------------------------------------------------------------------------


function pluralize(n) {
  return n !== 1 ? 's' : '';
}

const Checkout = ({thisState, softDonation, fundDonation, onChange, onClickByCheck, onPaymentSuccess, onPaymentFailure}) => {

    let costPerAdult = 0;
    let costPerChild = 0;
    // let costPerSoftChild = 0;
    let costYoungSib = 0;
    let costOlderSib = 0;
    let costRembOuting = 0;
    let output = '';
    let conferenceTotal = 0;
    let grandTotal = 0;

if (!onPaymentSuccess) console.log("onPaymentSuccess is not set");

    let reg = '';
    switch (userData.attendance) {
      case 'full':
        reg = 'Attending the full conference';
        costPerAdult = thisState.eventInfo.costAdult;
        costPerChild = thisState.eventInfo.costChild;
        costYoungSib = thisState.eventInfo.youngerSibCost;
        costOlderSib = thisState.eventInfo.olderSibCost;
        costRembOuting = thisState.eventInfo.costRembOuting;
        break;
      case 'workshops':
        reg = 'Attending only the workshops (for Professionals only)';
        costPerAdult = thisState.eventInfo.costWorkshopsOnly;
        break;
      case 'picnic':
        reg = 'Only attending the picnic';
        costPerAdult = thisState.eventInfo.costAdultPicnic;
        costPerChild = thisState.eventInfo.costChildPicnic;
        break;
      case 'balloon':
        reg = 'Requesting a balloon (not attending)';
        break;
      default:
        console.log('Problem with the type of attendance');
    }

    output += add_line(0, '\nRegistration: ' + reg);
    output += '\n';

    let regCost = 0;
    for (let attendee of userData.attendees) {

      let costThisPerson = 0;
      if (attendee.peopleType === peopleTypes.ADULT  ||  attendee.peopleType === peopleTypes.PROFESSIONAL  ||  attendee.peopleType === peopleTypes.TEEN) {
        costThisPerson = costPerAdult;
      }
      else if (attendee.peopleType === peopleTypes.CHILD  &&  attendee.age >= thisState.eventInfo.minChildAgePaying) {
        costThisPerson = costPerChild;
      }

      output += add_line(1, sprintf("%-30s$%8.2f", attendee.firstName + ' ' + attendee.lastName, costThisPerson));
      regCost += costThisPerson;
    }
    output += '\n';
    output += add_line(1, sprintf("%30s$%8.2f", "Sub-total:  ", regCost));
    // output += '\n';

    conferenceTotal += regCost;



    if (userData.attendance === 'full') {

      //  Any Sibling Outings?
      if (userData.attendees.find(a => ((a.peopleType === peopleTypes.CHILD ||  a.peopleType === peopleTypes.TEEN) &&  a.sibOuting))) {

        output += add_line(0, '\nSibling Outings:');
        output += '\n';

        let sibCost = 0;

        for (let attendee of userData.attendees) {

          if ((attendee.peopleType === peopleTypes.CHILD  ||  attendee.peopleType === peopleTypes.TEEN)  &&  attendee.sibOuting) {

            let costThisPerson = (attendee.peopleType === peopleTypes.TEEN) ? costOlderSib : costYoungSib;
            output += add_line(1, sprintf("%-30s$%8.2f", attendee.firstName + ' ' + attendee.lastName, costThisPerson));
            sibCost += costThisPerson;
          }
        }

        output += '\n';
        output += add_line(1, sprintf("%30s$%8.2f", "Sub-total:  ", sibCost));
        // output += '\n';

        conferenceTotal += sibCost;
      }


      //  Anybody attending the Remembrance Outing?

      if (userData.attendees.find(a => ((a.peopleType === peopleTypes.ADULT  ||  a.peopleType === peopleTypes.PROFESSIONAL)  &&  a.rembOuting))) {

        output += add_line(0, '\nRemembrance Outing:');
        output += '\n';

        let rembCost = 0;

        for (let attendee of userData.attendees) {
          if ((attendee.peopleType === peopleTypes.ADULT  ||  attendee.peopleType === peopleTypes.PROFESSIONAL)  &&  attendee.rembOuting) {
            output += add_line(1, sprintf("%-30s$%8.2f", attendee.firstName + ' ' + attendee.lastName, costRembOuting));
            rembCost += costRembOuting;
          }
        }
        output += '\n';
        output += add_line(1, sprintf("%30s$%8.2f", "Sub-total:  ", rembCost));
        // output += '\n';

        conferenceTotal += rembCost;
      }

    }



    if ((userData.attendance === 'full'  ||  userData.attendance === 'picnic')  &&  userData.shirtsOrdered.length) {

        output += add_line(0, '\nShirts ordered:');
        output += '\n';

        let shirtCost = 0;

        userData.shirtsOrdered.sort((a,b) => a.shirtID.localeCompare(b.shirtID));      //  Group all orders by shirtID

        for (let shirt of userData.shirtsOrdered) {
          // shirt.id, shirt.size, shirt.quantity

          let shirtType = thisState.eventInfo.shirtTypes.find(s => s.id === shirt.shirtID);
          let type = thisState.eventInfo.shirtTypes.findIndex(st => st.id === shirtType.id) + 1;

          if (!shirtType) console.log("Unfound shirtType...");

          let cost = shirt.quantity*shirtType.cost;
          output += add_line(1, sprintf("%-30s$%8.2f", "Type " + type + " => " + shirt.quantity + " x " + shirt.size, cost));
          shirtCost += cost;
        }

        output += '\n';
        output += add_line(1, sprintf("%30s$%8.2f", "Sub-total:  ", shirtCost));
        // output += '\n';

        conferenceTotal += shirtCost;
    }


    if (userData.attendance === 'full') {
      let adjCost = 0;
      if (userData.joeyWatson  ||  userData.boardMember) {
        output += add_line(0, '\nAdjustments: ');
        output += '\n';
        
        if (userData.boardMember) {
          output += add_line(1, sprintf("%-30s$%8.2f", "Board member discount", -costPerAdult));
          adjCost -= costPerAdult;
        }
        
        if (userData.joeyWatson) {
          output += add_line(1, "Joey Watson discount: " + userData.joeyWatsonCode);
          let adult = numPeopleFromJWCODE(userData.joeyWatsonCode.match(/A\d/i));
          let teen  = numPeopleFromJWCODE(userData.joeyWatsonCode.match(/T\d/i));
          let child = numPeopleFromJWCODE(userData.joeyWatsonCode.match(/C\d/i));

          if (adult) {
            output += add_line(1, sprintf("%-30s$%8.2f", adult + " Adult" + pluralize(adult), -(adult * costPerAdult)));
            adjCost -= (adult * costPerAdult);
          }
          if (teen) {
            output += add_line(1, sprintf("%-30s$%8.2f", teen + " Teen" + pluralize(teen), -(teen * costPerAdult)));
            adjCost -= (teen * costPerAdult);
          }
          if (child) {
            output += add_line(1, sprintf("%-30s$%8.2f", child + (child === 1 ? " Child" : " Children"), -(child * costPerChild)));
            adjCost -= (child * costPerChild);
          }
        }
        output += '\n';
        output += add_line(1, sprintf("%30s$%8.2f", "Sub-total:  ", adjCost));
        output += '\n';

        conferenceTotal += adjCost;
      }
    }
    output += add_line(0, '\nTotal:');
    output += add_line(1, sprintf("%30s$%8.2f", " Conference total:  ", conferenceTotal));
    output += '\n';

    grandTotal = sprintf("%8.2f", conferenceTotal + Number(softDonation) + Number(fundDonation));

    userData.conferenceTotal = conferenceTotal;
    userData.softDonation = softDonation;
    userData.fundDonation = fundDonation;
    userData.grandTotal = grandTotal;


    //  Add donations to email invoice
    userData.invoice = output;

    let donationTotal = Number(softDonation) + Number(fundDonation);

    if (donationTotal > 0) {
      userData.invoice += add_line(0, '\nDonations:\n');
      if (softDonation)  userData.invoice += add_line(1, sprintf("%-30s$%8.2f", "SOFT Conference:", Number(softDonation)));
      if (fundDonation)  userData.invoice += add_line(1, sprintf("%-30s$%8.2f", "General Fund:", Number(fundDonation)));
      userData.invoice += '\n';
      userData.invoice += add_line(1, sprintf("%30s$%8.2f", "Sub-total:  ", donationTotal));
      userData.invoice += '\n';
      userData.invoice += add_line(1, sprintf("%30s$%8.2f", "Grand Total:  ", conferenceTotal + donationTotal));
      userData.invoice += '\n';
    }

    let html = output;
    html = html.replace(/^( +)([^:]+?)(\s+\$\s+)([\d.-]+)/mg,'<span class="indent"></span><span class="cost-descr">$2</span>&#36;<span class="cost">$4</span>');     //  In first capture, don't use \s -- it sucks up '\n's
    html = html.replace(/^( +)(.+?)(\s+\$\s+)([\d.-]+)/mg,'<span class="indent"></span><div class="cost-descr-right">$2</div>&#36;<span class="cost">$4</span>');    //  In first capture, don't use \s -- it sucks up '\n's
    html = html.replace(/\n/g, "<br>");



    //  Finally, display everything...


    const onCancel = (data) => {
        // User pressed "cancel" or close Paypal's popup!
        console.log('The payment was cancelled!', data);
        // You can bind the "data" object's value to your state or props or whatever here, please see below for sample returned data
    }

    // const onError = (err) => {
    //     // The main Paypal's script cannot be loaded or somethings block the loading of that script!
    //     console.log("Error!", err);
    //     // Because the Paypal's main script is loaded asynchronously from "https://www.paypalobjects.com/api/checkout.js"
    //     // => sometimes it may take about 0.5 second for everything to get set, or for the button to appear
    // }


    let total = Math.max(0, Number(grandTotal));
    let currency = 'USD'; // or you can set this value from your props or state
    let env = 'production'; // you can set here to 'production' for production, or 'sandbox' for the sandbox

    const client = {
        // sandbox:    'AfxDPuLCwqEXQXi-J-TmoqC9IEIl4UA9d6L84_Sp-xKuebeDaRyanklLx23mUeoVskOvKNGyfpHcWS9U',
        // sandbox:    'AXtGSZ2ooq-9eHmPsThjFwah94wWEeRqy3IzPROc5PwpJsaFsavJAYXyrPhd8vVuCQroMd44oeNHCX-P',
        sandbox:    'YOUR-SANDBOX-APP-ID',
        production: 'ARCgszhyt3vhExezgwyU6gY7aJTSe6dkF9xX7wEsMz69szcZGZabN6Q_O9crRR-upB9zsa942pH4PJtr',
    }

    return (
      <div>
        <h2>Checkout</h2>
        <p>Please double-check the registration fees below and then click either the "Pay By Check" button
           or the PayPal button. The PayPal option will let you pay by credit card.</p>

        <div>{ ReactHtmlParser(html) }</div>

        {userData.attendance !== 'workshops'  &&
          <div>

            <p className="v-indent">Would you like to contribute to the SOFT Conference or General Fund?</p>
            <div className="indent">
              <span className="cost-descr">SOFT Conference:</span>$ <Input value={softDonation} className="donation-box" onChange={event => onChange("softDonation", event.target.value)} />
            </div>
            <div className="indent">
              <span className="cost-descr">General Fund:</span>$ <Input value={fundDonation} className="donation-box" onChange={event => onChange("fundDonation", event.target.value)} />
            </div>
          </div>
        }
        <br />
        <p className="v-indent">Conference and Donations:</p> 
        <div className="v-indent">
          <span className="indent"></span><div className="cost-descr-right">Grand Total:</div>$<span className="cost">{grandTotal}</span>
        </div>
        <div className="indent">
          {total === 0 ?
                <div className="checkout-btn">
                <a className="welcome-button" onClick={onClickByCheck}>Submit Registration</a>
                </div>
            :
              <div className="checkout-btn v-indent">
                <PaypalExpressBtn env={env} client={client} currency={currency} total={total} onError={onPaymentFailure} onSuccess={onPaymentSuccess} onCancel={onCancel} />
                <br />
                <span className="pay-by-check">(or... <a href="" onClick={onClickByCheck}>Pay by Check</a>)</span>
              </div>
          }
        </div>
      </div>
    );
  }



//----------------------------------------------------------------------------------------------------


const ThankYou = ({thisState, setUserData}) => {

  //  Save everything in the database...

  // Create a unique "invoice" ID
  userData.formID =  userData.contactInfo.lastName.replace(/[^A-Za-z]/g, '').toUpperCase().substring(0,3) + (new Date().getTime())%1000000;

  // See documentation for fetch here: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  // let targetUrl = 'http://greatday.biz/cgi-bin/form.cgi';
  let targetUrl = 'https://softconf.org/cgi-bin/form.cgi';
  // let proxyUrl  = 'https://cors-anywhere.herokuapp.com/' + targetUrl;

  if (!thisState.userDataSaved) {
    // fetch(proxyUrl + targetUrl, {
    fetch(targetUrl, {
      method: 'POST',
      //mode: 'no-cors',
      // headers: {
      //   'Accept': 'application/json',
      //   'Content-Type': 'application/json',
      // },
      body: JSON.stringify(userData),
    })
    .then(response => {
      //console.log(response);
      return response.json();
    })
    .then(data => {
        console.log(data.message);
        setUserData(true);
        return data;
    })
    .catch(e => {
      console.log('Data store failed');
      console.log(e); 
      return e;
    });
  }


  return (
    <div>
      <h2>Thank You!</h2>
      <p>Thank you for registering for the Conference. You should be receiving an email message with a summary
         page and invoice. If you don't see the email, please check your <b>Junk</b> or <b>Spam</b> folder.
      </p>
      {(!userData.paid  &&  Number(userData.grandTotal) > 0)  &&
          <div>
            <p>To finish your registration, send your check for ${Number(userData.grandTotal)} to:</p>
            <div className="indent">
              Support Organization for Trisomy<br />
              2982 South Union St.<br />
              Rochester, NY  14624<br />
              <br />
              Please include your invoice number with the check:<br />
              <div className="indent v-indent"><code>{userData.formID}</code></div>
            </div>
          </div>
      }
      <p className="v-indent">Here are a few more suggestions to help you get ready for the conference...</p>
      {!userData.softMember  &&
        <div>
          <p>&#9679; <b>Please consider becoming a SOFT member.</b> Registration is free. For more information, click on this link:</p>
          <div className="indent">
            <a target="_blank" rel="noopener noreferrer" href="https://trisomy.org/soft-membership-information/">Become a Member of SOFT</a>
          </div>
        </div>
      }
      <p className="v-indent">&#9679; <b>Submit family and “SOFT” child photos.</b> We invite you to share a family photo and a photo of your SOFT Child for the conference directory or to be displayed during the conference.
Submit photos by July 1st to:</p>
      <div className="indent">
        <a href="mailto:trisomyawareness@gmail.com">trisomyawareness@gmail.com</a>
      </div>
      <br />
      <p>&#9679; <b>Submit your photos or short video for the Annual “SOFT Friends” Video.</b> Choose your favorite photo of your SOFT Child and submit for the Annual “SOFT Friends” video created in memory of Kari Holladay. Photos can be submitted up to June 1st here:</p>
      <div className="indent">
        <a href="https://trisomy.org/kris-holladay-soft-video/" target="_blank" rel="noopener noreferrer">Submit to "SOFT Friends"</a>
      </div>      
      <br />
      {(userData.attendance === 'full'  ||  userData.attendance === 'workshops')  &&
        <div>
          <p>&#9679; <b>Reserve your hotel room at the conference hotel:</b></p>
          <div className="indent">
            Ann Arbor Marriott Ypsilanti at Eagle Creek<br />
            1275 South Huron St.<br />
            Ypsilanti, MI, 48197<br />
            Phone:  734-487-2000
          </div>
          <p>The room rate is $140 per night.  Click here to book a room using the special SOFT rate:</p>
          <div className="indent">
            <a target="_blank" rel="noopener noreferrer" href="https://www.marriott.com/meeting-event-hotels/group-corporate-travel/groupCorp.mi?resLinkData=Support%20Organization%20for%20Trisomy%5Edtwys%60sotsota%7Csotsotd%60140.00%60USD%60false%604%607/16/19%607/21/19%606/24/19&app=resvlink&stop_mobi=yes">Book Hotel Room</a>
          </div>
          <p>Our rate code is “SOFT”.</p>
        </div>
      }
      <p className="v-indent-twice">&#9679; <b>Donate items for the auction.</b> SOFT’s Annual Auction will be held Saturday. There will be both a silent and live auction. Your auction donation items can be sent to:</p>
      <div className="indent">
        Kayse Whitaker<br />
        619 William St.<br />
        Kalamazoo, MI 49007
      </div>
      <p className="v-indent-twice">&#9679; <b>Set up your fund-raising page for the Stroll for Hope:</b></p>
      <div className="indent">
        <a href="http://www.firstgiving.com/softstrollforhope/2019-SOFT-Stroll-for-Hope" target="_blank" rel="noopener noreferrer">Stroll for Hope</a>
      </div>
      <p className="v-indent-twice">&#9679; <b>Consider sponsoring an event/item for the conference:</b></p>
      <div className="indent">
        <a href="https://trisomy.org/conference-wish-list-2019-ann-arbor-2/" target="_blank" rel="noopener noreferrer">Sponsor an Event/Item</a>
      </div>
      <br />
      <p className="v-indent">Thanks again!</p>
      <div className="footer-balloons"></div>
      {!thisState.userDataSaved &&
        <Loading />
      }
    </div>
  );
}


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



const Age = ({value, optionsAges, onChange, className="edit-age"}) => {
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


const Diagnosis = ({value, options, onChange, className="edit-diagnosis"}) => {
      const defaultOpt = options.find(opt => (opt.value === value));
      return (
        <div className={className}>
          <Select
            options={options}
            defaultValue={defaultOpt}
            placeholder={"Diagnosis"}
            onChange={onChange}
            styles={customStylesDiagnosis}
          />
        </div>
      );
    }


const RembLunch = ({value, menuInfo, isDisabled, onChange, className="edit-remb-lunch"}) => {
      const optionsRembLunch = arrayToOptions(menuInfo)
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


const ShirtSize = ({value, isDisabled, optionsShirtSizes, onChange, className="edit-shirt-size"}) => {
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
    {pageNum > pages.START+1  &&  pageNum < pages.THANKYOU  &&
      <Button className="button button-prev" onClick={onClickPrev}><FontAwesomeIcon icon="angle-double-left" /> BACK</Button>
    }
    {pageNum < pages.CHECKOUT  &&
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


const Loading = () =>
  <div className="greyed-background">
    <div className="loading"></div>
  </div>

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

//  Fix this on the reporting side so we can see what they've entered and correct it in the reports. Just
//  a bit safer until we know the kinds of things people actually enter.
// function smartFixDiagnosis(diagnosis) {
//   diagnosis = diagnosis.replace(/\bf\s*t\s*/i, 'Full Trisomy ');
//   diagnosis = diagnosis.replace(/\bp\s*t\s*/i, 'Partial Trisomy ');
//   diagnosis = diagnosis.replace(/\bt\s*p\s*/i, 'Partial Trisomy ');
//   diagnosis = diagnosis.replace(/\bt\s*(\d+)/i, 'Trisomy $1');
//   diagnosis = diagnosis.replace(/\bp\s*(\d+)/i, 'Partial Trisomy $1');
//   diagnosis = diagnosis.replace(/\bt\s*m\s*(\d+)/i, 'Trisomy $1 Mosaic');
//   diagnosis = diagnosis.replace(/(\d+)\s*m\b/i, '$1 Mosaic');
//   diagnosis = diagnosis.replace(/trisomy/i, 'Trisomy');
//   diagnosis = diagnosis.replace(/mosaic/i, 'Mosaic');
//   diagnosis = diagnosis.replace(/partial/i, 'Partial');
//   diagnosis = diagnosis.replace(/trisomy partial/i, 'Partial Trisomy');
//   diagnosis = diagnosis.replace(/\bm\s*(\d+)/i, '$1 Mosaic');

//   // if (!diagnosis.match(/trisomy/i)) {      //  Might not make sense for complex "other"-cases to simpy tack this on the front
//   //   diagnosis = 'Trisomy ' + diagnosis;
//   // }

//   return diagnosis.replace(/\s+/g, ' ');
// }


function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


export default App;
