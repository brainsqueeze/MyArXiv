import React, { Component } from 'react';
import { connect } from 'react-redux';

import Filters from './filters';
import Articles from './articles';

import { getSearchResults } from '../../actions/search';

class Feed extends Component {

  onSearchClick() {
    this.props.getSearchResults();
  }

  render() {

    return (
      <div>
        <Filters /> 
        <Articles 
          loading={this.props.search.loading}
          data={this.props.search.results}
        />
      </div>
    )  
  }
}

function mapStateToProps (state) {
  return {
    search: state.search,
    results: state.search.results
  };
}

// export default connect(null, { getSearchResults })(Feed);
export default connect(mapStateToProps, { getSearchResults })(Feed);
