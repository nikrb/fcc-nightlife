/**
usage:
  <ListItem style={lis} onItemClick={this.onPollClick} text={d.name}
        onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}
        description={d.desc} image_url:{d.image} />
**/
import React from 'react';
import PropTypes from 'prop-types';

export default class ListItem extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    onItemClick: PropTypes.func,
    text: PropTypes.string.isRequired,
    description: PropTypes.string,
    image_url: PropTypes.string,
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
    const style = {...this.props.style,
      display: "flex",
      flexDirection: "row"
    };
    const detail_style ={
      marginLeft: "10px"
    };
    const title_style ={
      display: "flex",
      flexDirection: "row",
      alignItem: "flex-end"
    };
    const desc_style = {
      fontSize: "0.8em",
      fontStyle: "italic",
      marginLeft: "10px"
    };
    return (
      <div style={style} onClick={this.clicked}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}>
        <div>
          <img style={{width:"64px"}} src={this.props.image_url} alt='img' />
        </div>
        <div style={detail_style}>
          <div>
            {this.props.text} {this.props.children}
          </div>
          <div style={desc_style}>{this.props.description}</div>
        </div>
      </div>
    );
  };
}
