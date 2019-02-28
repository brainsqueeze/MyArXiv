import React, { Component } from 'react';

import TopCategory from '../common/top_level_dropdown';

class CategoryFilterDropdown extends Component {

  constructor(props) {
    super(props);
 
    this.state = {
      responsiveShowState: false
    };
  }

  render () {
    const  criteriaTemp = this.props.criteriaTemp || {};

    return (
      <div className="filters-col">
        <TopCategory onChange={ (value) => this.props.setFilter('payload', value)}/>
      </div>
    )
  }
}

export default CategoryFilterDropdown;