import { SEARCH_ACTIONS, FILTERS_ACTIONS } from '../actions/search';
import _ from 'lodash';

const initalCriteria = { }
//Default initial state to use for the reducer
let initialState = {
  loading: true,
  criteria: _.cloneDeep(initalCriteria),
  criteriaTemp: _.cloneDeep(initalCriteria),
  results: {

  }
};

export default function(state = initialState, action) {
  let newState = {...state};
  
  // to avoid making search_criteria.js aware the entire criteria structure, I added this property
  // that gets set when clear filter is clicked and is removed
  if(newState.call_all_filters_action)
    delete newState.call_all_filters_action;

  switch(action.type) {

    case SEARCH_ACTIONS.BEGIN:
      //Set total counts while we reload data
      newState.results = { };
      
      return {
        ...newState,
        loading: true
      };

    case SEARCH_ACTIONS.SUCCESS:
      return {
        ...newState,
        loading: false,
        results: action.payload
      };
        
    case SEARCH_ACTIONS.FAIL:
      return {
        ...newState,
        loading: false
      };

    case FILTERS_ACTIONS.UPDATE:
      let criteriaTemp = {...newState.criteriaTemp};
      criteriaTemp[action.payload.filter] = action.payload.value;

      return {
        ...newState,
        criteriaTemp
      };
    case FILTERS_ACTIONS.APPLY:
      if (action.payload && action.payload.criteria) {
        let criteria = _.cloneDeep(action.payload.criteria)
        newState.criteria = criteria;
      }
      return newState
    case FILTERS_ACTIONS.CLEAR: 
      const criteriaCopy = _.cloneDeep(initalCriteria);
      const criteriaTempCopy = _.cloneDeep(initalCriteria);
      return {
        ...newState,
        criteria:criteriaCopy,
        criteriaTemp: criteriaTempCopy,
        // to avoid making search_criteria.js aware the entire criteria structure, I added this property
        // that gets set when clear filter is clicked and is removed
        call_all_filters_action: true 
      }

    default: 
      return newState;
  }
}