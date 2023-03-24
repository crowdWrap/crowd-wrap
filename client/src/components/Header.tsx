import React from 'react';
import '../assets/header.css';
import {Link} from 'react-router-dom'
import logoPrint from '../assets/crowdwrap-print.svg';
const Header = () => (
  <div className="web-header">
    <Link to="/" className='header img'>
        <img src={logoPrint} alt="CrowdWrap-Title" />
    </Link>
    
  </div>
)
export default Header;