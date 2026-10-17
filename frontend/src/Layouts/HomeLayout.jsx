import { Outlet } from 'react-router-dom';
import LandingNav from '../Components/NavBar/LandingNav';

// Layout component for visitors / users not logged in
function HomeLayout() {
  return (
    <div>
      
      {/* Outlet from ReactRouter displays the child route content (LandingPage, LoginPage, SignupPage) */}
      <LandingNav />
      <Outlet />
      
    </div>
  );
}

export default HomeLayout