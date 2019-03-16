import { CONFIG } from '../config';

export const RATE_ACTIONS = {
  ENDPOINT: 'rate',
  BEGIN: 'RATE_BEGIN_ACTION',
  SUCCESS: 'RATE_SUCCESS_ACTION',
  FAIL: 'RATE_FAIL_ACTION'
}

function rateArticle (type, parameters, dispatch) {
  dispatch({
    type: type.BEGIN,
    payload: null
  });

  const request = fetch(`${CONFIG.API_BASE_URL}/${type.ENDPOINT}`, {
    method: 'POST',
    body: JSON.stringify(parameters)
  })
    .then((response) => response.json())
    .then((response) => {
      let results = response;
      dispatch({
        type: type.SUCCESS,
        payload: results
      });
    })
    .catch((err, data) => {
      console.error(err);
    })
};

export const applyRating = (criteria) => dispatch => {
  rateArticle(RATE_ACTIONS, criteria, dispatch);
};