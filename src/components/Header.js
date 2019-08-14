import React from 'react'
import {Link} from 'gatsby'
import logo from '../img/logo.svg'

const Header = class extends React.Component {
  render() {
    return (
        <header>
          <div className="branding">
            <div><img src={logo} alt="Kaldi"/></div>
            <div className="site-information">
              <span className="site-title"><Link to="/">Rosiconi</Link></span>
              <span className="site-description">Magazine inutile di sport</span>
            </div>
          </div>
        </header>
    )
  }
}

export default Header
