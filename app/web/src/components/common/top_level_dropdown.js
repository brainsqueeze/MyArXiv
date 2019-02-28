import React, { Component } from 'react';
import Select from 'react-select'
import PropTypes from "prop-types";

const topSuggestions = [
  { value: 'hep', label: 'High energy physics' },
  { value: 'cs', label: 'Computer Science' }
]

const subSuggestions = {
  hep: [
    { value: 'HEP-experiment', label: 'Experiment'},
    { value: 'HEP-phenomenology', label: 'Phenomenology'},
    { value: 'HEP-theory', label: 'Theory'}
  ],
  cs: [
    { value: 'artificial_intelligence', label: 'Artificial intelligence'},
    { value: 'computer_vision', label: 'Computer vision'},
    { value: 'machine_learning', label: 'Machine learning'},
    { value: 'natural_language_processing', label: 'Natural language processing'}
  ]
}

class TopCategory extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: "",
      refresh: false,
      selectedCategories: [],
      selectedSubCategories: [],
      select: {
        value: "",
        options: []
      },
      tags: this.props.suggestions || topSuggestions
    };
  }

  topChange = value => {
    this.setState({ 
      selectedCategories: value,
      select: {
        value: "",
        options: subSuggestions[value.value]
      }
    });
  }  

  subChange = value => {
    this.setState({ 
      selectedSubCategories: value,
      select: {
        value: value.label,
        options: this.state.select.options
      }
    });

    if(this.props.onChange) {
      this.props.onChange({
        field: this.state.selectedCategories.value,
        subField: value.value
      })
    }
  } 

  render() {
    let { select } = this.state;

    return (
      <div>
        <fieldset className="dropdown top-category">
          <label>Field</label>
          <Select 
            className="dropdown" 
            options={topSuggestions} 
            onChange={this.topChange}
          />
        </fieldset>

        <fieldset className="dropdown top-category">
          <label>Sub-field</label>
            <Select 
              className="dropdown" 
              value={{label: select.value}}
              options={select.options} 
              onChange={this.subChange}
            />
        </fieldset>
      </div>
    )
  }
}

TopCategory.defaultProps = {
  dataValueField: "value",
  dataTextField: "label",
  selectedCategories: [],
  selectedSubCategories: []
};
  
TopCategory.propTypes = {
  selectedCategories: PropTypes.array,
  selectedSubCategories: PropTypes.array,
  onChange: PropTypes.func,
};

export default TopCategory;