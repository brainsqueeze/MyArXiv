import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { Router } from 'react-router-dom';
import thunk from 'redux-thunk';
import history from './middleware/history';
import { CONFIG, ENVIRONMENT as env } from './config';


import App from './components/app';
import reducers from './reducers';

// enable redux dev tool state if dev tools detected in browser
const devTool = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
let composeEnhancers = compose;
if (env.name === 'LOCAL' && devTool)
  composeEnhancers = devTool;

const withEnhancers = composeEnhancers(applyMiddleware(thunk))
const createStoreWithMiddleware = withEnhancers(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>
  , document.querySelector('#root')
);
