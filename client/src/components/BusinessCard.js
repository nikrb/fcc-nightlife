/**
usage:
  <ListItem style={lis} onItemClick={this.onPollClick} text={d.name}
        onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}
        description={d.desc} image_url:{d.image} />
**/
import React from 'react';
import PropTypes from 'prop-types';

export default class BusinessCard extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    onItemClick: PropTypes.func,
    text: PropTypes.string.isRequired,
    description: PropTypes.string,
    image_url: PropTypes.string,
    going: PropTypes.number,
    onGoingClick: PropTypes.func,
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
  onGoingClick = (e) => {
    e.stopPropagation();
    this.props.onGoingClick( e.target.name);
  };
  render = () => {
    const style = {...this.props.style,
      display: "flex",
      flexDirection: "row"
    };
    const detail_style ={
      marginLeft: "10px"
    };
    const desc_style = {
      fontSize: "0.8em",
      fontStyle: "italic",
      marginLeft: "10px"
    };
    const going_style = {
      fontSize:"0.8em",
    };
    let image_style = {
      width: "64px",
    };
    if( !this.props.image_url){
      image_style.backgroundColor = "lightgrey";
    }
    return (
      <div style={style} onClick={this.clicked}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}>
        <div style={image_style}>
          <img style={{width:"64px"}} src={this.props.image_url} alt='' />
        </div>
        <div style={detail_style}>
          <div>
            {this.props.text}
            <button type="button" style={going_style} name={this.props.text}
              onClick={this.onGoingClick}>
              ({this.props.going} going)
            </button>
          </div>
          <div style={desc_style}>{this.props.description}</div>
        </div>
      </div>
    );
  };
}
