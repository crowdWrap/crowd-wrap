import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import styles from '../assets/css_group/sidebar.module.css';

const SideBar = () => {
  return (
    <div className={styles['bm-burger-button']}>
        <Menu>
            <a className={styles['bm-item']} href="/">
                Home
            </a>
            <a className={styles['bm-item']} href="/salads">
                Salads
            </a>
            <a className={styles['bm-item']} href="/pizzas">
                Pizzas
            </a>
            <a className={styles['bm-item']} href="/desserts">
                Desserts
            </a>
        </Menu>
    </div>
    
  );
};

export default SideBar;

  