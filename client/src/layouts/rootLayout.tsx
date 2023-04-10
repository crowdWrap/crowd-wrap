// eslint-disable-next-line
import {NavLink, Outlet} from 'react-router-dom'

export default function RootLayout() {

    return (
        <div className='root-layout'>


        
                <Outlet />
           

        </div>
    )
}