//
//  Soft Convention Registration
//
//   9/18/18 v0.1 Steve Maguire steve@stormdev.com


import React, { Component } from 'react';
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

// const isSearched = searchTerm => item =>
//   item.title.toLowerCase().includes(searchTerm.toLowerCase());


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentPage: pages.CONTACT,

      eventInfo: null,

      contactInfo: {
        firstName:  '',
        lastName:   '',
        address1:   '',
        address2:   '',
        city:       '',
        region:     '',
        country:    '',
        postalCode: '' 
      },

      //balloonReleases: [],
      //attendees: [],

      // OLD
      result: null,
      searchTerm: DEFAULT_QUERY,
      page: 0,
    };

    this.setEventInfo         = this.setEventInfo.bind(this);
    this.onSearchChange       = this.onSearchChange.bind(this);
    this.onDismiss            = this.onDismiss.bind(this);
    this.onPrevPage           = this.onPrevPage.bind(this);
    this.onNextPage           = this.onNextPage.bind(this);
    this.fetchSearchResults   = this.fetchEventInfo.bind(this);
    this.onSearchSubmit       = this.onSearchSubmit.bind(this);
    this.componentDidMount    = this.componentDidMount.bind(this);
  }




  setEventInfo(result) {
    console.log(result);

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
    console.log('In set Info:');
    console.log(eventInfo);
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
    console.log("Got here...");
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
              [pages.CONTACT]:      <ContactInfo contact={contactInfo} />,
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


  onDismiss(id) {
    const { result } = this.state;

    const isNotId = item => item.objectID !== id;
    const updatedHits = result.hits.filter(isNotId);

    this.setState({ result: { hits: updatedHits } });

    console.log(`Got to onDismiss() ${id}`);
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

  renderOLD() {
    const { searchTerm, result, page } = this.state;

    if (!result) { 
      return null; 
    }

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        {result &&
          <Table
            list={result.hits}
            onDismiss={this.onDismiss}
          />
        }
        <div className="interactions">
          Page {page}:
          <Button className="button" onClick={this.onPrevPage}>Previous Page</Button>
          <Button className="button" onClick={this.onNextPage}>Next Page</Button>
        </div>
      </div>
    );
  }

}


const SoftHeader = ({eventInfo}) =>
  <div>
    <img 
      src="https://trisomy.wpengine.com/wp-content/uploads/2017/07/softlogo.png"
      height="75px"
      alt="Soft Logo"
    />
    {eventInfo && 
      eventInfo.eventTitle
    }
  </div>


const PageBar = ({pageNum}) =>
  <div><h1>{pageNum}</h1></div>


const ContactInfo = ({contact}) =>
  <div>
    <h2>Contact Information:</h2>
    <EditName>FIRST Name</EditName>
    <EditName>LAST Name</EditName>
    <EditAddress>Address</EditAddress>
    <div className="phones">
      <EditPhone>Mobile Phone</EditPhone>
      <EditPhone>Work Phone</EditPhone>
      <EditPhone>Home Phone</EditPhone>
    </div>
    <EditEmail>Best Email Address</EditEmail>
    <div className="clear"></div>
  </div>


const EditName = ({ value="", className="edit-name", children }) =>
  <div className={className}>
    <p>{children}</p>
    <input
      type="text"
      value={value}
    />
  </div>

// const EditFullName = ({value="", className="edit-fullname"}) =>
//   <div class={className}>
//     <EditName>FIRST Name</EditName>
//     <EditName>LAST Name</EditName>
//   </div>

const EditAddress = ({value="", className="edit-address", children}) =>
  <div className={className}>
    <p>{children}</p>
    <Address value="Address 1" />
    <Address value="Address 2" />
    <div>
      <City value="City" />
      <StateProv value="State/Prov/Region" />
      <Country value="Country"/>
    </div>
    <PostalCode value="Zip / Postal Code" />
  </div>


const Address = ({value=""}) =>
    <input
      type="text"
      value={value}
    />

const City = ({value="", className="edit-city"}) =>
    <input
      type="text"
      value={value}
      className={className}
    />

const StateProv = ({value="", className="edit-state-prov"}) =>
    <input
      type="text"
      value={value}
      className={className}
    />

const Country = ({value="", className="edit-country"}) =>
    <input
      type="text"
      value={value}
      className={className}
    />

const PostalCode = ({value="", className="edit-postal-code"}) =>
    <input
      type="text"
      value={value}
      className={className}
    />



const EditPhone = ({value="", className="edit-phone", children}) =>
  <div className={className}>
    <p>{children}</p>
    <input
      type="text"
      value={value}
    />
  </div>

const EditEmail = ({value="", className="edit-email", children}) =>
  <div className={className}>
    <p>{children}</p>
    <input
      type="text"
      value={value}
    />
  </div>

const PrevNextButtons = () =>
  <div className="button-bar">
    <Button className="button button-prev" onClick={this.onPrevPage}>BACK</Button>
    <Button className="button button-next" onClick={this.onNextPage}>NEXT</Button>
    <div className="clear"></div>
  </div>



// OLD ----------------------------------------------------------------------------

const Search = ({ value, onChange, onSubmit, children }) =>
  <form onSubmit={onSubmit}>
    {children} <input
      type="text"
      value={value}
      onChange={onChange}
    />
    <Button className="button" type="submit">
     Fetch!
    </Button>
  </form>


const widthWide   = { width: '40%' };
const widthMedium = { width: '20%' };
const widthSmall  = { width: '10%' };

const Table = ({ list, onDismiss }) =>
  <div className="table">
    {list.map(item =>
      <div key={item.objectID} className="table-row">
        <span style={widthWide}>
          <a target="_blank" href={item.url}>{item.title}</a>
        </span>
        <span style={widthMedium}>
          {item.author}
        </span>
        <span style={widthSmall}>
          {item.num_comments}
        </span>
        <span style={widthSmall}>
          {item.points}
        </span>
        <span style={widthSmall}>
          <Button
            onClick={() => onDismiss(item.objectID)}
            className="button-inline"
          >
            Dismiss
          </Button>
        </span>
      </div>
    )}
  </div>


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
