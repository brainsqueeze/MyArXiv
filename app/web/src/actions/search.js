import { CONFIG } from '../config';

export const SEARCH_ACTIONS = {
  ENDPOINT: 'search',
  BEGIN: 'SEARCH_BEGIN_ACTION',
  SUCCESS: 'SEARCH_SUCCESS_ACTION',
  FAIL: 'SEARCH_FAIL_ACTION'
}

export const FILTERS_ACTIONS = {
  UPDATE: 'UPDATE_FILTER_ACTION',
  CLEAR: 'CLEAR_FILTERS',
  APPLY: 'APPLY_ALL_FILTERS_ACTION'
}

function doSearch (type, parameters, dispatch) {
  dispatch({
    type: type.BEGIN,
    payload: null
  });

  const request = fetch(`${CONFIG.API_BASE_URL}/${type.ENDPOINT}`, {
    method: 'POST',
    // headers: {
    //   'Content-Type': 'application/json'
    // },
    body: JSON.stringify(parameters)
  })
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
    })
    .catch((err, data) => {
      console.error(err);
    })

}

export const getSearchResults = (criteria) => dispatch => {
  doSearch(SEARCH_ACTIONS, criteria, dispatch);
};

export const setFilter = (filterName, filterValue) => {
  return dispatch => {
    dispatch({
      type: FILTERS_ACTIONS.UPDATE,
      payload: { filter: filterName, value: filterValue }
    });
  };
}

export const applyAllFilters = criteria => dispatch => {
    dispatch({
      type: FILTERS_ACTIONS.APPLY,
      payload: {criteria: criteria}
    });
}

export const clearAllFilters = () => dispatch => {
  dispatch({
    type: FILTERS_ACTIONS.CLEAR
  });
}