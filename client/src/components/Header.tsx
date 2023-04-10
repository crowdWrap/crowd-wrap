import React from 'react';
import styles from '../assets/css_group/header.module.css';
import {Link} from 'react-router-dom'
import logoPrint from '../assets/image_group/crowdwrap-print.svg';
  
const Header = () => (
  <div className={styles["header"]}>
    <Link to="/">
        <img src={logoPrint} alt="CrowdWrap-Title" className={styles["img"]} />
    </Link>

    <div className={styles["sign-links"]}>
      <Link to="/login" className={styles["sign-links__link"]}> Sign In </Link>
      <Link to="/register" className={styles["sign-links__link"]}> Sign Up </Link>
    </div>
  </div>
)

export default Header;
