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
  youngerSibCost: 25,

  olderSibOutingBlurb: "The Older Sibling outing is for children 12 and up and will be at the Woodland Park Zoo where they can explore exhibits and get close to more than 1,100 animals and 300 species—including some of the world's most critically endangered. Lunch is included in the outing and every child will get a SOFT T-shirt.",
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
      'Wild Mushroom Ravioli',
      'Lemon Herb Chicken Breast',
      'Red Wine Marinated Grilled Top Sirloin'
    ],
  kidsMenu: [
      'Chicken Tenders',
      'Mac \'n Cheese',
      'Carrots',
      'Celery',
    ],

  remembranceBlurb: "There will be a Remembrance Outing for families who have lost a child. If you have lost a child and plan to attend, please put a checkmark next to each person who will be attending, and select the type of box lunch for each. Otherwise, simply click the Next button.",
  remembranceMenu: {
      V: 'Vegetarian',
      N: 'Non-vegetarian',
    },

  picnicBlurb: "The Annual Ryan Cantrell Memorial Picnic and Balloon release will be Saturday July 36th from 1–4pm at the East Fork Lake picnic area. Please let us know who is attending, number of bus seats/tie downs if needed. If you will are requesting a balloon release for your child we will gather that information on the next page.",

  shirtsBlurb: "Order your SOFT shirts ahead of time so they'll be ready and waiting for you when you sign in at the conference. Note that the shirts given to the children at the Sibling Outings are different than these shirts.",

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
};



function selectStyle(width, height) {
  return {
    option: (base, state) => ({
      ...base,
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
      height: height,                            // Intentionally create a half line so people know they can scroll
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
      width: width,
    }),
  };
}


const customStylesPeopleTypes = selectStyle(156, 110);

const customStyles = selectStyle(325, 135);

const customStylesNarrow = selectStyle(120, 110);

const customStylesDiagnosis = selectStyle(180, 122);


// const customStyles = {
//   option: (base, state) => ({
//     ...base,
//     // borderBottom: '1px dotted pink',
//     // color: state.isFullscreen ? 'red' : 'green',
//     padding: 5,
//   }),
//   control: (base, state) => ({        /* Select line with drop-down arrow */
//     ...base,
//     width: 325,
//     padding: 0,
//     marginTop: 10,
//     borderRadius: 0,
//     minHeight: 0,
//     height: 30,
//     fontSize: 14,
//     backgroundColor: "white",
//   }),
//   singleValue: (base, state) => {
//     const opacity = state.isDisabled ? 0.5 : 1;
//     const transition = 'opacity 300ms';

//     return {
//        ...base, 
//        opacity, 
//        transition,
//     };
//   },
//   menuList: (base, state) => ({
//     ...base,
//     height: 135,
//     fontSize: 14,
//     color: "#2e3a97",
//   }),
//   placeholder: (base, state) => ({
//     ...base,
//     color: "#999",
//     fontSize: 12,
//   }),
//   container: (base, state) => ({
//     ...base,
//     width: 325,
//   }),
// }



//  I should deep clone this from the previous style and change what's appropriate
// const customStylesPeopleTypes = {
//   option: (base, state) => ({
//     ...base,
//     padding: 5,
//   }),
//   control: (base, state) => ({
//     ...base,
//     width: 156,
//     padding: 0,
//     marginTop: 5,
//     borderRadius: 0,
//     minHeight: 0,
//     height: 30,
//     fontSize: 14,
//     backgroundColor: "white",
//   }),
//   singleValue: (base, state) => {
//     const opacity = state.isDisabled ? 0.5 : 1;
//     const transition = 'opacity 300ms';

//     return {
//        ...base, 
//        opacity, 
//        transition,
//     };
//   },
//   menuList: (base, state) => ({
//     ...base,
//     height: 110,
//     fontSize: 14,
//     color: "#2e3a97",
//   }),
//   placeholder: (base, state) => ({
//     ...base,
//     color: "#999",
//     fontSize: 12,
//   }),
//   container: (base, state) => ({
//     ...base,
//     width: 156,
//   }),
// }



// const customStylesNarrow = {
//   option: (base, state) => ({
//     ...base,
//     padding: 5,
//   }),
//   control: (base, state) => ({
//     ...base,
//     width: 120,
//     padding: 0,
//     marginTop: 5,
//     borderRadius: 0,
//     minHeight: 0,
//     height: 30,
//     fontSize: 14,
//     backgroundColor: "white",
//   }),
//   singleValue: (base, state) => {
//     const opacity = state.isDisabled ? 0.5 : 1;
//     const transition = 'opacity 300ms';

//     return {
//        ...base, 
//        opacity, 
//        transition,
//     };
//   },
//   menuList: (base, state) => ({
//     ...base,
//     height: 110,
//     fontSize: 14,
//     color: "#2e3a97",
//   }),
//   placeholder: (base, state) => ({
//     ...base,
//     color: "#999",
//     fontSize: 12,
//   }),
//   container: (base, state) => ({
//     ...base,
//     width: 120,
//   }),
// }


// const customStylesDiagnosis = {
//   option: (base, state) => ({
//     ...base,
//     padding: 5,
//   }),
//   control: (base, state) => ({
//     ...base,
//     width: 180,
//     padding: 0,
//     marginTop: 5,
//     borderRadius: 0,
//     minHeight: 0,
//     height: 30,
//     fontSize: 14,
//     backgroundColor: "white",
//   }),
//   singleValue: (base, state) => {
//     const opacity = state.isDisabled ? 0.5 : 1;
//     const transition = 'opacity 300ms';

//     return {
//        ...base, 
//        opacity, 
//        transition,
//     };
//   },
//   menuList: (base, state) => ({
//     ...base,
//     height: 122,                            // Intentionally create a half line so people know they can scroll
//     fontSize: 14,
//     color: "#2e3a97",
//   }),
//   placeholder: (base, state) => ({
//     ...base,
//     color: "#999",
//     fontSize: 12,
//   }),
//   container: (base, state) => ({
//     ...base,
//     width: 180,
//   }),
// }





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
  SOFTCHILD:    "S",
  CHILD:        "C",
  ADULT:        "A",
  PROFESSIONAL: "P",
  SOFTANGEL:    "D",
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
  "Mother",
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

      attendance:         "full",     //  "full", "picnic" (only), "balloon" release - not attending 
      reception:          false,
      sundayBreakfast:    false,
      boardMember:        false, 

      attendees: [],
      softAngels: [],

      directory: {
        name:             false,
        age:              false,
        diagnosis:        false,
        photos:           false,
        contactInfo:      false,
        phone:            false,
        email:            false,
        fullAddress:      false,
        partialAddress:   false,
      },

      shirtsOrdered: [],

      workshopAttendee: 0,
      shirtDropdowns: {},
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
        attendee("Baby",  "Mountjoy",  peopleTypes.CHILD,         3, eventInfoDefault),
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
                    attendance={this.state.attendance}
                    reception={this.state.reception}
                    sundayBreakfast={this.state.sundayBreakfast}
                    boardMember={this.state.boardMember}
                    handleRadioGroup={this.onChangeFieldValue}
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
                  <Summary contact={contactInfo} />,

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
          // let attendees = this.state.attendees;

          pageHistory.push(currentPage);

          this.setState({
            pageHistory,
            currentPage: pages.CONTACT,
          });

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
          // let attendees = this.state.attendees;

          pageHistory.push(currentPage);

          this.setState({
            pageHistory,
            currentPage: pages.ATTENDEES,
          });

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


          if (bad_attendee !== undefined) {
            alert("Oops! Something is missing in the information for one or more of the people listed. Please fill in the missing information.");
          }
          else {
            pageHistory.push(currentPage);

            let newPage = pages.SOFTWEAR;     //  Assume no attendees case

            if (attendees.length > 0) {
              newPage = pages.DINNER;
            }

            this.setState({
              attendees,
              pageHistory,
              currentPage: newPage,     //  Can't call newPage(pages.CLINICS) because attendees isn't in state yet
            });
          }
          break;


      case pages.DINNER:
          pageHistory.push(currentPage);

          this.setState({
            pageHistory,
            currentPage: this.nextPage(pages.CLINICS),       //  This assumes that there will always be one adult
          });

          break;


      case pages.CLINICS:
          pageHistory.push(currentPage);

          this.setState({
            pageHistory,
            currentPage: this.nextPage(pages.WORKSHOPS),
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
            currentPage: pages.CHAPTERCHAIR,
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
            currentPage: pages.CHECKOUT,
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

  onChangeFieldValue(field, value) {
    this.setState({
      [field]: value
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
    console.log("id = " + i, "Field = " + field);
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

  onChangeDirectory(opt, field) {
    let { directory } = this.state;
    directory[field] = !directory[field];

    if (field === "contactInfo") {
      directory.phone = false;
      directory.email = false;
      directory.fullAddress = false;
      directory.partialAddress = false;
    }

    //  fullAddress and partialAddress can't both be checked simultaneously
    if (field === "fullAddress"  &&  directory.fullAddress) {
      directory.partialAddress = false;
    }

    if (field === "partialAddress"  &&  directory.partialAddress) {
      directory.fullAddress = false;
    }

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



const Basics = ({attendance, reception, sundayBreakfast, boardMember, handleRadioGroup}) =>
  <div>
    <h2>Getting Started</h2>
    <p>Welcome to the Soft Conference Registration form!</p>
    <p>In the next few pages, you'll be asked a series of questions so that we can tailor this year's
       SOFT convention specifically for you and your family. If you're only requesting a balloon
       in memory of a SOFT Angel, you will only be asked about that. To get started, please 
       answer the following questions:
    </p>
    <div className="indent">
      <p><b>How much, if any, of the conference are you planning to attend?</b></p>

      <div className="indent-twice">
        <RadioGroup name="attendance" selectedValue={attendance} onChange={(val) => handleRadioGroup("attendance", val)}>
          <Radio value="full" /> Full Conference<br />
          <Radio value="picnic" /> Only attending the picnic<br />
          <Radio value="balloon" /> Requesting a Balloon (not attending the conference)
        </RadioGroup>
      </div>
      <div className="v-indent">
        <span className="bold">Are you planning to attend the welcome reception on Wednesday evening?</span>
        <div className="inline">
          <RadioGroup name="reception" selectedValue={reception} onChange={(val) => handleRadioGroup("reception", val)}>
            <span className="radio-yes"><Radio value={true} /> Yes</span>
            <Radio value={false} /> No
          </RadioGroup>
        </div>
      </div>
      <div className="v-indent">
        <span className="bold">Are you planning to attend the final breakfast on Sunday morning?</span>
        <div className="inline">
          <RadioGroup name="sundayBreakfast" selectedValue={sundayBreakfast} onChange={(val) => handleRadioGroup("sundayBreakfast", val)}>
            <span className="radio-yes"><Radio value={true} /> Yes</span>
            <Radio value={false} /> No
          </RadioGroup>
        </div>
      <div className="v-indent">
        <span className="bold">Is anybody in your group a board member?</span>
        <div className="inline">
          <RadioGroup name="boardMember" selectedValue={boardMember} onChange={(val) => handleRadioGroup("boardMember", val)}>
            <span className="radio-yes"><Radio value={true} /> Yes</span>
            <Radio value={false} /> No
          </RadioGroup>
        </div>
      </div>
      </div>
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
    <p>Please list everybody in your party who will be attending any part of the Conference. If no one
       will be attending, simply click on the Next button.
    </p>
    {attendees.length > 0  &&
      <div>
        {attendees.map( (a, i) =>
          <div className="attendee-row" key={a.id}>
            <p className="row-num">{i+1}.</p>
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
                <Checkbox defaultChecked={a.eatsMeals} onChange={opt => onChangeMeals(opt, a.id)} /> Eats conference meals?
                {a.diagnosis === "Other" &&
                  <div>
                    <p className="row-num"></p>
                    Enter other Diagnosis: <Input value={a.otherDiagnosis} id={"contact-diag-" + a.id} className="other-diag" onChange={event => onChange(event, a.id, "otherDiagnosis")} />
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



const SoftAngels = ({softAngels, onRemove, onAdd, onChange, onChangeDiagnosis, onChangeDate}) =>
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
            <Input label="FIRST Name" value={a.firstName} id={"contact-firstname-" + a.id} onChange={event => onChange(event, a.id, "firstName")} />
            <Input label="LAST Name"  value={a.lastName}  id={"contact-lsstname-" + a.id}  onChange={event => onChange(event, a.id, "lastName")} />
            <Diagnosis label="Diagnosis" value={a.diagnosis} id={"contact-diagnosis-" + a.id}  onChange={opt => onChangeDiagnosis(opt, a.id, "diagnosis")} />
            <br />
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
                <div key={ws.id} className="indent"><Radio value={ws.id} /> {ws.title}</div>
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
        {return a.peopleType === peopleTypes.CHILD  &&  a.age >= 5  &&  a.age < 12  &&
          <div key={a.id} className="indent">
            <Checkbox defaultChecked={a.sibOuting} onChange={event => onChange(event, a.id)} />
            <span className="remb-name">{a.firstName} {a.lastName}{a.sibOuting ? " - $" + cost : ""}</span>
            <ShirtSize value={a.shirtSize} isDisabled={!a.sibOuting} onChange={(opt) => onChangeShirtSize(opt, a.id)} />
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
    <SortableList items={clinics} onSortEnd={onSortEnd} />
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
        <div key={a.id} className="indent select-height">
          <Checkbox defaultChecked={a.picnic} onChange={event => onChange(event, a.id)} />
          <span className="remb-name">{a.firstName} {a.lastName}</span>
          {a.picnic  &&  a.peopleType === peopleTypes.SOFTCHILD  ?
            <span>Needs tie-downs? <SelectYesNo value={a.picnicTiedown} isDisabled={!a.picnic} onChange={(opt) => onChangeTiedown(opt, a.id)} /></span>
            : null
          }
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
    <p><i>(If you don't know what a Chapter Chair is, this doesn't apply to you. Pleas click NEXT.)</i></p>
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
            <span className="remb-name">{a.firstName} {a.lastName}</span>
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

      // {attendees.map( (a,i) => 
      //   {return (a.peopleType === peopleTypes.ADULT)  && 
      //     <div key={a.id} className="indent">
      //       <span className="remb-name">{a.firstName} {a.lastName}</span>
      //       Choose Dinner:
      //     </div>
      //   })
      // }

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


const Directory = ({directory, onChange}) =>
  <div>
    <h2>Directory</h2>
    <p>Each year we create a conference directory of all the SOFT children. If you would like your child to be
       included in the directory, please place a checkmark next to the information you would like to share
       with other families:
    </p>
    <div className="indent">
      <p><Checkbox defaultChecked={directory.name}           onChange={event => onChange(event, "name")} /> Child's Name</p>
      <p><Checkbox defaultChecked={directory.age}            onChange={event => onChange(event, "age")} /> Age</p>
      <p><Checkbox defaultChecked={directory.diagnosis}      onChange={event => onChange(event, "diagnosis")} /> Diagnosis</p>
      <p><Checkbox defaultChecked={directory.photos}         onChange={event => onChange(event, "photos")} /> Allow photos</p>
      <p><Checkbox defaultChecked={directory.contactInfo}    onChange={event => onChange(event, "contactInfo")} /> Include Parent's contact information</p>
      {directory.contactInfo &&
        <div className="indent-twice">
          <p><Checkbox defaultChecked={directory.phone}          onChange={event => onChange(event, "phone")} /> Include phone number</p>
          <p><Checkbox defaultChecked={directory.email}          onChange={event => onChange(event, "email")} /> Include email address</p>
          <p><Checkbox defaultChecked={directory.fullAddress}    onChange={event => onChange(event, "fullAddress")} /> Include full mailing address</p>
          <p><Checkbox defaultChecked={directory.partialAddress} onChange={event => onChange(event, "partialAddress")} /> Include only City and Country</p>
        </div>
      }
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



const Summary = ({contact}) =>
  <div>
    <h2>Summary</h2>
    <br /><br />
  </div>



//----------------------------------------------------------------------------------------------------

function setJSON(thisState) {

  var userData = {
    contactInfo:   thisState.contactInfo,
    attendees:     thisState.attendees,
    directory:     thisState.directory,
    shirtsOrdered: thisState.shirtsOrdered,
  }

  return JSON.stringify(userData);
}


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
      <input id="json-data" type="hidden" name="data" value={setJSON(thisState)}/>
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

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


export default App;
