import React, { Component } from 'react';
import { connect } from 'react-redux';

import Filters from './filters';

import { getSearchResults } from '../../actions/search';

class Feed extends Component {

  onSearchClick() {
    this.props.getSearchResults();
  }

  render() {

    return (
      <div>
        <Filters /> 
      </div>
      
    )  
  }
}

export default connect(null, { getSearchResults })(Feed);
