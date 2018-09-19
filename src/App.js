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
  MERCHANDISE: 3,
};

// const isSearched = searchTerm => item =>
//   item.title.toLowerCase().includes(searchTerm.toLowerCase());


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentPage: pages.CONTACT,
      result: null,
      searchTerm: DEFAULT_QUERY,
      page: 0,
    };

    this.setSearchTopStories  = this.setSearchTopStories.bind(this);
    this.onSearchChange       = this.onSearchChange.bind(this);
    this.onDismiss            = this.onDismiss.bind(this);
    this.onPrevPage           = this.onPrevPage.bind(this);
    this.onNextPage           = this.onNextPage.bind(this);
    this.fetchSearchResults   = this.fetchSearchTopStories.bind(this);
    this.onSearchSubmit       = this.onSearchSubmit.bind(this);
    this.componentDidMount    = this.componentDidMount.bind(this);
  }


  onSearchChange(event) {
    this.setState({
      searchTerm: event.target.value
    });
    console.log(event.target.value);
  }


  setSearchTopStories(result) {
    console.log(result);

    this.setState({
      result
    });
  }


  fetchSearchTopStories(searchTerm, page = 0) {
      fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }


  onSearchSubmit(event) {
    const { searchTerm, page } = this.state;
    this.fetchSearchTopStories(searchTerm, page);
    event.preventDefault();
    console.log("In onSubmit");

    console.log('es8'.padStart(6, 'woof'));
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
    this.fetchSearchTopStories(searchTerm, prevPage);
    this.setState({ page: prevPage });
  }


  onNextPage() {
    const { searchTerm, page } = this.state;
    let nextPage = page+1;
    this.fetchSearchTopStories(searchTerm, nextPage);
    this.setState({ page: nextPage });
  }


  componentDidMount() {
    const { searchTerm, page } = this.state;      // deconstructing
    this.fetchSearchTopStories(searchTerm, page);
    console.log("Got here...");
  }


  render() {
    const { searchTerm, result, page } = this.state;

    if (!result) { 
      return null; 
    }

    // return (
    //   <Header />

    //   {switch (this.state.currentPage) {
    //     case pages.CONTACT:
    //     break;
    //     case pages.ATTENDEES:
    //     break;
    //     case pages.MERCHANDISE:
    //     break;
    //     default:
    //       console.log("In default case");
    //     }
    //   }
    // );


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
          <a href={item.url}>{item.title}</a>
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
