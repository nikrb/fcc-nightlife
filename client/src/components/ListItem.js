/**
usage:
  <ListItem style={lis} onItemClick={this.onPollClick} text={d.name}
        onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} />
**/
import React from 'react';
import PropTypes from 'prop-types';

export default class ListItem extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    onItemClick: PropTypes.func,
    text: PropTypes.string.isRequired,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func
  };
  clicked = () => {
    this.props.onItemClick( this.props.text);
  };
  onMouseEnter = (e) => {
    if( this.props.onMouseEnter){
      this.props.onMouseEnter( e, this.props.text);
    }
  };
  render = () => {
    return (
      <li style={this.props.style} onClick={this.clicked}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}>
        {this.props.text}
      </li>
    );
  };
}
