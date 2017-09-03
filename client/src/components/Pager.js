import React from 'react';
import PropTypes from 'prop-types';

export default class Pager extends React.Component {
  static propTypes = {
    page_no: PropTypes.number.isRequired,
    total_rows: PropTypes.number,
    display_count: PropTypes.number,
    handlePageSelect: PropTypes.func
  };
  MAX_BUTTONS = 10;
  getTotalPages = () => {
    return Math.ceil( this.props.total_rows / this.props.display_count);
  };
  handleClick = ( e) => {
    let new_page_no = this.props.page_no;
    switch( e.target.value){
      case 'first_page':
        new_page_no = 0;
        break;
      case 'prev_page':
        new_page_no -= 1;
        break;
      case 'next_page':
        new_page_no += 1;
        break;
      case 'last_page':
        new_page_no = this.getTotalPages()-1;
        break;
      default:
        new_page_no = parseInt( e.target.value, 10);
        break;
    }
    this.props.handlePageSelect( new_page_no);
  };
  render = () => {
    const wrapper = {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap"
    };
    const btn = {
      margin: "0px 5px",
      padding: "0px 5px",
      fontSize: "1em",
      backgroundColor: "rgba( 64,64,192,0.5)",
      borderRadius: "10px"
    };
    // console.log( `pager current_page_no [${this.props.page_no}]`);
    const total_pages = this.getTotalPages();
    let start_page = 1;
    let end_page = total_pages;

    if( end_page > this.MAX_BUTTONS-1){
      if( this.props.page_no -2 > 1){
        start_page = this.props.page_no -2;
      }
      end_page = start_page + this.MAX_BUTTONS-1;
      if( end_page > total_pages){
        end_page = total_pages;
        start_page = end_page - this.MAX_BUTTONS + 1;
        if( start_page < 1) start_page = 1;
      }
    }
    let numbered_page_buttons = [];
    for( let i=start_page; i <= end_page; i++){
      numbered_page_buttons.push(
          <button key={i} type="button" style={btn} onClick={this.handleClick}
            disabled={this.props.page_no === i-1}  value={i-1} >
            {i}
          </button>
      );
    }
    // const numbered_page_buttons = Array.from({length: total_pages>10?10:total_pages}, (v, i) => {
    //   return (
    //     <button key={i} type="button" style={btn} onClick={this.handleClick}
    //       disabled={this.props.page_no === i}  value={i} >
    //       {i+1}
    //     </button>
    //   );
    // });
    const left_arrow = String.fromCharCode( 9664);
    const right_arrow = String.fromCharCode( 9654);
    return (
      <div style={wrapper}>
        <button type="button" style={btn} onClick={this.handleClick}
          value='first_page' disabled={this.props.page_no === 0} >
            {left_arrow+left_arrow}
        </button>
        <button type="button" style={btn} onClick={this.handleClick}
          value='prev_page' disabled={this.props.page_no === 0} >
            {left_arrow}
        </button>
        {numbered_page_buttons}
        <button type="button" style={btn} onClick={this.handleClick}
          value='next_page' disabled={this.props.page_no === total_pages-1} >
            {right_arrow}
        </button>
        <button type="button" style={btn} onClick={this.handleClick}
          value='last_page' disabled={this.props.page_no === total_pages-1} >
            {right_arrow}{right_arrow}
        </button>
      </div>
    );
  };
}
