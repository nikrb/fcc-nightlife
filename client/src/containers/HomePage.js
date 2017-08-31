import React from 'react';
import BusinessCard from '../components/BusinessCard';
import Actions from './Actions';
import Auth from '../modules/Auth';

export default class HomePage extends React.Component {
  state = {
    businesses: [],
    highlighted_item: "",
    // search for something near somewhere
    term_text: "",
    location_text: "",
  };
  componentWillMount = () => {
    const term = window.localStorage.getItem( "term_text");
    const location = window.localStorage.getItem( "location_text");
    console.log( term, location);
    if( term || location){
      const user_email = this.getAuthUserEmail();
      this.setState( {term_text:term, location_text: location});
      this.fetchLocation( {term, location, user_email});
    }
  };
  getAuthUserEmail = () => {
    let user_email = 0;
    if( Auth.isUserAuthenticated()){
      user_email = Auth.getEmail();
    }
    return user_email;
  };
  fetchLocation = ( search_query) => {
    let pl = {};
    if( search_query.term.length) pl.term = search_query.term;
    if( search_query.location.length) pl.location = search_query.location;
    if( search_query.user_email) pl.user_email = search_query.user_email;
    Actions.yelpGet( pl)
    .then( (response) => {
      console.log( "yelp get response:", response);
      this.setState( { businesses: response.data});
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
            const going = bar.going.filter( b => b.id !== bar_id);
            const nb = {...bar, going};
            const bus = this.state.businesses.map( (b) => {
              if( b.id === bar_id){
                return nb;
              } else {
                return b;
              }
            });
            this.setState( {businesses: bus});
          }
        });
      } else {
        Actions.postGoing( {bar_id, user_email})
        .then( (response) => {
          console.log( "post going response:", response);
          const bars = this.state.businesses.map( (b) => {
            let nb = b;
            if( b.id === bar_id){
              const g = b.going || [];
              const going = g.concat( {email: user_email});
              nb = {...b, going};
            }
            return nb;
          });
          this.setState( {businesses: bars});
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
    this.fetchLocation( {term:term_text, location:location_text, user_email});
  };
  render = () => {
    const listyle = {
      listStyle: "none",
      padding: "0.2em"
    };
    const bs = this.state.businesses.map( (b,i)=> {
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
    const style = {
      cursor: "pointer",
      width: "80%"
    };
    const mag = {
      transform: "rotate(-45deg)",
    };
    const search_style = { margin:"0"};
    return (
      <div className="App">
        <h1>Who's Where?</h1>
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
        <div style={{fontSize:"0.8em"}}>
          A tomato coloured going button indicates you are going
        </div>
        <div style={style}>
          {bs}
        </div>
      </div>
    );
  };
};
