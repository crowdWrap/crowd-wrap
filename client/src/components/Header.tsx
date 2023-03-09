/*import React from 'react';
import {NavLink, Link} from 'react-router-dom'
import '../assets/header.css';
const Header = () => {
    return(
        <nav>
            <div className='div-header'>
                <div>
                    <NavLink to='/'>
                        <h1 className='logo'>CrowdWrap</h1>
                    </NavLink> 
                </div>
            </div>
        </nav>
    )
}

export default Header*/ 

import React from 'react';
import '../assets/header.css';
import logoPrint from '../assets/crowdwrap-print.svg';
const Header = () => (
  <div className="web-header">
    <img src={logoPrint} alt="CrowdWrap-Title" />
  </div>
)
export default Header;