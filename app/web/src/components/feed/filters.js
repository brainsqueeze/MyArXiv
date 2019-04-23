import React, { Component } from 'react';
import { connect } from 'react-redux';

import CategoryFilterDropdown from './filter_category_dropdown';

import { getSearchResults, applyAllFilters } from '../../actions/search';
import { setFilter } from '../../actions/search';

class Filters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      criteria: this.props.search.criteria
    }
  }

  doSearch () {
    this.props.applyAllFilters(this.props.search.criteriaTemp);
    this.props.getSearchResults(this.props.search.criteriaTemp);
  }

  componentDidMount() {
    this.doSearch();
  }

  onSearchClick(event) {
    event.preventDefault();
    event.stopPropagation();

    this.doSearch();
  }

  render() {
    return (
      <section className={`filters-all ${this.props.showResponse ? 'show' : ''}`}>
        <form>
          <CategoryFilterDropdown 
            {...this.props.search} 
            setFilter={this.props.setFilter}
          />
          <div className="search-btn">
            <input type="submit" onClick={ event => this.onSearchClick(event) } value="Search" />
          </div>
        </form>
      </section>
    );
  }
}

function mapStateToProps (state) {
  return {
    search: state.search
  };
}

export default connect(mapStateToProps, { 
  getSearchResults: getSearchResults, 
  applyAllFilters, setFilter 
})(Filters);