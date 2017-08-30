import React from 'react';
import BusinessCard from '../components/BusinessCard';
import Actions from './Actions';

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
      this.setState( {term_text:term, location_text: location});
      this.fetchLocation( {term, location});
    }
  };
  fetchLocation = ( search_query) => {
    let pl = {};
    if( search_query.term.length) pl.term = search_query.term;
    if( search_query.location.length) pl.location = search_query.location;
    Actions.yelpGet( pl)
    .then( (response) => {
      console.log( "yelp get response:", response);
      this.setState( { businesses: response.data});
    });
  };
  onBusinessClick = ( name) => {
    console.log( "business clicked:", name);
    const bus = this.state.businesses.filter( b => b.name === name);
    window.open( bus[0].url);
  };
  onListItemEnter = (e, name) => {
    this.setState( {highlighted_item: name})
  };
  onListItemLeave = () => {
    this.setState( { highlighted_item: false});
  };
  onGoingClick = (name) => {
    console.log( "going clicked:", name);
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
    this.fetchLocation( {term:term_text, location:location_text});
  };
  render = () => {
    const listyle = {
      listStyle: "none",
      padding: "0.2em"
    };
    const bs = this.state.businesses.map( (b,i)=> {
      const lis = {...listyle,
        color: this.state.highlighted_item === b.name?"darkgrey":"black"
      };
      let desc = "";
      if( b.reviews){
        desc = b.reviews[0].text;
      }
      b.going = 0;
      return (
        <BusinessCard key={i} style={lis} onItemClick={this.onBusinessClick} text={b.name}
            onMouseEnter={this.onListItemEnter} onMouseLeave={this.onListItemLeave}
            image_url={b.image_url} description={desc}
            going={b.going} onGoingClick={this.onGoingClick} >
        </BusinessCard>
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
        <div style={style}>
          {bs}
        </div>
      </div>
    );
  };
};
