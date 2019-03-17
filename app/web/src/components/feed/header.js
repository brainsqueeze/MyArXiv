import React, { Component } from 'react';
import NavigationLink from '../common/navigation_link';

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
        <h1 id="site-logo"><a href="/">MyArXiv</a></h1>
        {/* <a id="mobile-menu-toggle" 
          className={this.state.responsiveShowState?'show':''} 
          onClick={() => this.setState({ responsiveShowState: !this.state.responsiveShowState })}>
          <i className="fa fa-bars"></i><i className="fa fa-times"></i>
        </a> */}

        <nav id="site-nav">
          <ul>
            <NavigationLink external={true} to="https://arxiv.org/" text="arXiv" />
            <NavigationLink external={false} to="/about" text="About" />
          </ul>
        </nav>
      </header>
    )
  }

}

export default Header;