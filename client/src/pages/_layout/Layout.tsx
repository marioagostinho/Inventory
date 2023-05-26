import React from 'react'
import { Outlet} from 'react-router-dom';

//Custom Components
import SideNavBar from '../../components/SideBar/SideBar';

export default function Layout() {
    return (
        <>
            <SideNavBar></SideNavBar>
            <div className="app-content">
                <div className="app-centralized-content">
                    <Outlet />
                </div>
            </div>
        </>
    );
}