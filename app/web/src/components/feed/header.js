import React, { Component } from 'react';
import NavigationLink from '../common/navigation_link';

import Filters from './filters';

class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      responsiveShowState: false
    };
  }

  render() {
    return (
      <header id="site-header">
        <a id="mobile-menu-toggle" 
          className={this.state.responsiveShowState ? 'show' : ''} 
          onClick={() => this.setState({ responsiveShowState: !this.state.responsiveShowState })}>
          <i className="fa fa-bars"></i>
        </a>
        <h1 id="site-logo"><a href="/">MyArXiv</a></h1>

        <nav id="site-nav">
          <ul>
            <NavigationLink external={true} to="https://arxiv.org/" text="arXiv" />
            <NavigationLink external={false} to="/about" text="About" />
          </ul>
        </nav>

        <Filters showResponse={this.state.responsiveShowState}/> 
      </header>
    )
  }

}

export default Header;