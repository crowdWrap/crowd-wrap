import React from 'react';
import '../assets/css_group/header.scss';
import {Link} from 'react-router-dom'
import logoPrint from '../assets/image_group/crowdwrap-print.svg';
const Header = () => (
  <div className="web-header">
    <Link to="/" className='header img'>
        <img src={logoPrint} alt="CrowdWrap-Title" />
    </Link>

    <div className='header-buttons'>
      <Link to="/login">
        Sign In
      </Link>

      <Link to="/register">
        Sign Up
      </Link>
    </div>
  </div>
)
export default Header;