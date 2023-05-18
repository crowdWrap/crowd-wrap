import React from 'react'
import styles from '../assets/css_group/dashboard.module.css'
import Header from '../components/Header'
import SideBar from '../components/sidebar'
//className={styles['dashboardstyles']}
export default function Dashboard() {
    return(
        <div>
            <Header/>
            <SideBar/>
        </div>
    )
}