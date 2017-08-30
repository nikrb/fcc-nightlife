import React from 'react';
import BusinessCard from '../components/BusinessCard';
import Actions from './Actions';

export default class HomePage extends React.Component {
  state = {
    businesses: [],
    highlighted_item: ""
  };
  componentWillMount = () => {
    Actions.yelpGet({})
    .then( (response) => {
      console.log( "yelp get response:", response);
      this.setState( { businesses: response.data});
    });
  };
  onBusinessClick = ( name) => {

  };
  onListItemEnter = (e, name) => {
    this.setState( {highlighted_item: name})
  };
  onListItemLeave = () => {
    this.setState( { highlighted_item: false});
  };
  render = () => {
    const listyle = {
      listStyle: "none",
      padding: "0.2em"
    };
    const going_style = {
      fontSize:"0.8em",

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
            image_url={b.image_url} description={desc} >
          <button type="button" style={going_style}>
            ({b.going} going)
          </button>
        </BusinessCard>
      );
    });
    const style = {
      cursor: "pointer",
      width: "80%"
    };
    return (
      <div className="App">
        <h1>Who's Where?</h1>
        <div style={style}>
          {bs}
        </div>
      </div>
    );
  };
}
