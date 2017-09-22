import React from 'react';
import BusinessCard from '../components/BusinessCard';
import Pager from '../components/Pager';
import Actions from './Actions';
import Auth from '../modules/Auth';
import Loader from '../components/Loader';

export default class HomePage extends React.Component {
  state = {
    businesses: [],
    highlighted_item: "",
    // search for something near somewhere
    term_text: "",
    location_text: "",
    // max rows from yelp
    limit: 3,
    current_page_no: 0,
    total_rows: 0,
    is_loading: false
  };
  componentWillMount = () => {
    const term = window.localStorage.getItem( "term_text");
    const location = window.localStorage.getItem( "location_text");
    console.log( term, location);
    if( term || location){
      this.setState( {term_text:term, location_text: location});
      this.fetchLocation( {term, location, page_no:0});
    }
  };
  getAuthUserEmail = () => {
    let user_email = "";
    if( Auth.isUserAuthenticated()){
      user_email = Auth.getEmail();
    }
    return user_email;
  };
  handlePageSelected = ( page_no) => {
    const {term_text,location_text} = this.state;
    this.fetchLocation( {term:term_text, location: location_text, page_no});
  };
  fetchLocation = ( search_query) => {
    this.setState( {is_loading:true});
    const {limit} = this.state;
    const {page_no} = search_query;
    const offset = page_no*limit;

    let pl = {limit, offset, user_email:this.getAuthUserEmail()};
    if( search_query.term.length) pl.term = search_query.term;
    if( search_query.location.length) pl.location = search_query.location;
    console.log( "yelp get query:", pl);
    Actions.yelpGet( pl)
    .then( (response) => {
      console.log( "yelp get response:", response);
      this.setState( { businesses: response.data, current_page_no: page_no,
        total_rows: response.total, is_loading:false});
    });
  };
  findBusiness = (bar_id) => {
    const bar = this.state.businesses.filter( b => b.id === bar_id);
    return bar[0];
  };
  onBusinessClick = ( bar_id) => {
    console.log( "business clicked:", bar_id);
    window.open( this.findBusiness(bar_id).url);
  };
  onListItemEnter = (e, bar_id) => {
    this.setState( {highlighted_item: bar_id})
  };
  onListItemLeave = () => {
    this.setState( { highlighted_item: false});
  };
  onGoingClick = (bar_id) => {
    console.log( "going clicked:", bar_id);
    if( Auth.isUserAuthenticated()){
      const user_email = Auth.getEmail();
      const bar = this.findBusiness(bar_id);
      if( bar.is_going){
        Actions.deleteGoing( {bar_id, user_email})
        .then( (response) => {
          console.log( "delete going response:", response);
          if( response.success){
            const nb = {...bar, going: bar.going-1, is_going: false};
            const bus = this.state.businesses.map( (b) => {
              if( b.id === bar_id){
                return nb;
              } else {
                return b;
              }
            });
            this.setState( {businesses: bus});
          } else {
            console.error( "delete going failed:", response);
          }
        });
      } else {
        Actions.postGoing( {bar_id, user_email})
        .then( (response) => {
          console.log( "bar [%s] post going response:", bar_id, response);
          if( response.success){
            const bars = this.state.businesses.map( (b) => {
              let nb = b;
              if( b.id === bar_id){
                console.log( "found bar going:", b.going);
                const going = b.going?b.going+1:1;
                nb = {...b, going, is_going: true};
              }
              return nb;
            });
            this.setState( {businesses: bars});
          } else {
            console.error( "post going failed:", response);
          }
        });
      }
    }
  };
  onTermTextChange = (e) => {
    this.setState( {term_text: e.target.value})
  };
  onLocationTextChange = (e) => {
    this.setState( {location_text: e.target.value});
  };
  onSearchClick = (e) => {
    console.log( "search clicked text:", this.state.term_text);
    const {term_text, location_text} = this.state;
    window.localStorage.setItem('term_text', term_text);
    window.localStorage.setItem('location_text', location_text);
    const user_email = this.getAuthUserEmail();
    this.fetchLocation( {term:term_text, location:location_text,
      user_email, page_no: 0});
  };
  render = () => {
    const listyle = {
      listStyle: "none",
      padding: "0.2em"
    };
    const business_cards = this.state.businesses.map( (b,i)=> {
      const lis = {...listyle,
        color: this.state.highlighted_item === b.id?"darkgrey":"black"
      };
      let desc = "";
      if( b.reviews){
        desc = b.reviews[0].text;
      }
      const going = b.going?b.going:0;
      const is_going = b.is_going?true:false;
      return (
        <BusinessCard key={i} style={lis} bar_id={b.id}  text={b.name}
            onItemClick={this.onBusinessClick}
            onMouseEnter={this.onListItemEnter}
            onMouseLeave={this.onListItemLeave}
            onGoingClick={this.onGoingClick}
            image_url={b.image_url} description={desc}
            going={going} is_going={is_going} />
      );
    });
    const card_style = {
      cursor: "pointer",
      width: "80%"
    };
    const mag = {
      transform: "rotate(-45deg)",
    };
    const search_style = { margin:"0"};
    const small_text = {fontSize:"0.8em"};
    const page_wrapper = {
      margin: "32px"
    };
    return (
      <div className="App">
        <h1>Who's Where?</h1>
        <div style={small_text}>
          Powered by <a href="https://www.yelp.com/developers/documentation/v3"
                        rel="noopener noreferrer" target="_blank">yelp</a>
        </div>
        <div>
          Find&nbsp;
          <input style={search_style} type="text" onChange={this.onTermTextChange}
            placeholder="Find pizza, cheap dinner, Max's" value={this.state.term_text} />
          &nbsp;Near&nbsp;
          <input style={search_style} type="text" placeholder="Near"
            onChange={this.onLocationTextChange} value={this.state.location_text}/>
          <button type="button" onClick={this.onSearchClick} >
            <div style={mag}>&#x26B2;</div>
          </button>
        </div>
        <div style={small_text}>
          A tomato coloured going button indicates you are going
        </div>
        <div style={page_wrapper}>
          { this.state.is_loading?
            <Loader />
            :
            this.state.total_rows?
              <Pager handlePageSelect={this.handlePageSelected} page_no={this.state.current_page_no}
                total_rows={this.state.total_rows} display_count={this.state.limit} />
              : null
          }
        </div>
        <div style={card_style}>
          {business_cards}
        </div>
        {this.state.total_rows?
          this.state.is_loading?
            <Loader />
            :
            <Pager handlePageSelect={this.handlePageSelected} page_no={this.state.current_page_no}
              total_rows={this.state.total_rows} display_count={this.state.limit} />
          :null
        }
      </div>
    );
  };
};
