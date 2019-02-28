import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
  Switch, 
  Route, 
  withRouter, 
  Redirect, 
} from 'react-router-dom';
import { hot } from 'react-hot-loader';

import Feed from './feed/feed';
import NotFound from './not_found';
import ErrorBoundary from './error_boundary';

import '../../style/styles.scss';
import '../../style/responsive.scss';

class App extends Component {

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    window.scrollTo(0, 0);
    
    let bodyClassName = "page";
    if (this.props.location.pathname) {
      let pathMatch = this.props.location.pathname.match(/[a-zA-Z/]+/g);
      if (pathMatch.length > 0) {
        bodyClassName = pathMatch[0].replace(/^\/|\/+$/g, '');
        bodyClassName = bodyClassName.replace('/','-');

        if (!bodyClassName)
          bodyClassName = 'home';

        bodyClassName = `page-${bodyClassName}`;
      }
    }
    document.body.className = bodyClassName;
  }

  render() {

    return (
      <div className="app">
        <div className="container">

          <main id="site-content">
            <ErrorBoundary>
              <Switch>
                <Route exact path="/" render={() => <Redirect to="/feed"/>}/>
                <Route exact path="/feed" component={Feed} />
                <Route component={NotFound} />
              </Switch>
            </ErrorBoundary>
          </main>

        </div>
      </div>
    )
  }

}

function mapStateToProps (state) {
  return {
  };
}

export default hot(module)(withRouter(connect(mapStateToProps, { })(App)));