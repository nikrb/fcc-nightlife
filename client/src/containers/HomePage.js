import React from 'react';
import ListItem from '../components/ListItem';
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
      this.setState( { businesses: response.data.businesses});
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
    const bs = this.state.businesses.map( (b,i)=> {
      const lis = {...listyle,
        color: this.state.highlighted_item === b.name?"darkgrey":"black"
      };
      let desc = "";
      if( b.reviews){
        desc = b.reviews[0].text;
      }
      return (
        <ListItem key={i} style={lis} onItemClick={this.onBusinessClick} text={b.name}
            onMouseEnter={this.onListItemEnter} onMouseLeave={this.onListItemLeave}
            image_url={b.image_url} description={desc} />
      );
    });
    return (
      <div className="App">
        <h1>Who's Where?</h1>
        <ul>
          {bs}
        </ul>
      </div>
    );
  };
}
