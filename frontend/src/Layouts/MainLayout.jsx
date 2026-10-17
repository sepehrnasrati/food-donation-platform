import NavBar from '../Components/NavBar/PhoneNav';
import Sidebar from '../Components/Sidebar/Sidebar';
import AccountInfo from '../Components/AccountInfo/AccountInfo';

import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// Layout component for visitors / users not logged in
function MainLayout({ user, setTestUser, setToken }) {
    const [sidebarShowing, setsidebarShowing] = useState(window.innerWidth >= 760);
    const [accountInfoShowing, setaccountInfoShowing] = useState(window.innerWidth >= 760);

    const showSidebar = () => {
        setsidebarShowing(true);
    };

    const closeSidebar = () => {
        setsidebarShowing(false);
    };

    const showAccountInfo = () => {
        setaccountInfoShowing(true);
    }

    const closeAccountInfo = () => {
        setaccountInfoShowing(false);
    }

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1080) {
                setsidebarShowing(false);
                setaccountInfoShowing(false);
            } else {
                setsidebarShowing(true);
                setaccountInfoShowing(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <NavBar showSidebar={showSidebar} showAccountInfo={showAccountInfo} />
            <div className="content-layout">
                {sidebarShowing && <Sidebar accountType={user.accountType} closeSidebar={closeSidebar} />}
                {/* Outlet from ReactRouter displays the child route content (LandingPage, LoginPage, SignupPage) */}
                <Outlet />
                {accountInfoShowing && <AccountInfo user={user} setTestUser={setTestUser} setToken={setToken} closeAccountInfo={closeAccountInfo} />}
            </div>
        </>
    );
}

export default MainLayout