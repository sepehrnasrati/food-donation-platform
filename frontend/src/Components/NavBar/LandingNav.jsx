import './LandingNav.css'
import { NavLink } from "react-router-dom"

function LandingNav() {
    
    return (
        <nav>
            <ul className="landing-nav">
                <li>
                    <NavLink to='/' end>
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink to='/login'>
                        Log in
                    </NavLink>
                </li>
                <li>
                    <NavLink to='/signup'>
                        Sign up
                    </NavLink>
                </li>
            </ul>
        </nav>
    )
}

export default LandingNav