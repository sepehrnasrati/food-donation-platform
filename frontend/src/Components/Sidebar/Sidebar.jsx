import styles from "./Sidebar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faHouse,
  faMagnifyingGlass,
  faCalendar,
  faTrophy,
  faWandMagicSparkles,
  faBell,
  faCommentDots,
  faBowlFood,
  faComments
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import brunelLogo from "/src/assets/brunel-logo.png";

function Sidebar({ accountType, closeSidebar }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.logo}>
          <img className={styles.imgLogo} src={brunelLogo}></img>
          <h1>Group 25 Website</h1>
        </div>
        <button className={styles.closeButton} onClick={closeSidebar}>
          <FontAwesomeIcon icon={faClose} />
        </button>
      </div>

      <ul className={styles.sidebarNav}>
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? styles.active : styles.navLink
            }
          >
            <FontAwesomeIcon icon={faHouse} /> Home
          </NavLink>
        </li>

        {accountType === "FOOD_BANK" && (
          <li>
            <NavLink
              to="/incoming-donations"
              className={({ isActive }) =>
                isActive ? styles.active : styles.navLink
              }
            >
              <FontAwesomeIcon icon={faBell} /> Incoming Donations
            </NavLink>
          </li>
        )}

        {(accountType === "INDIVIDUAL" || accountType === "BUSINESS") && (
          <li>
            <NavLink
              to="/food-banks"
              className={({ isActive }) =>
                isActive ? styles.active : styles.navLink
              }
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} /> Food Banks
            </NavLink>
          </li>
        )}

        {(accountType === "INDIVIDUAL" || accountType === "BUSINESS") && (
          <li>
            <NavLink
              to="/food-donation"
              className={({ isActive }) =>
                isActive ? styles.active : styles.navLink
              }
            >
              <FontAwesomeIcon icon={faBowlFood} /> Food Donation
            </NavLink>
          </li>
        )}

        {(accountType === "INDIVIDUAL" || accountType === "BUSINESS") && (
          <li>
            <NavLink
              to="/expiries"
              className={({ isActive }) =>
                isActive ? styles.active : styles.navLink
              }
            >
              <FontAwesomeIcon icon={faCalendar} /> Expiry Dates
            </NavLink>
          </li>
        )}

        <li>
          <NavLink
            to="/leaderboard"
            className={({ isActive }) =>
              isActive ? styles.active : styles.navLink
            }
          >
            <FontAwesomeIcon icon={faTrophy} /> Leaderboard
          </NavLink>
        </li>

        {(accountType === "INDIVIDUAL" || accountType === "BUSINESS") && (
          <li>
            <NavLink
              to="/recipes"
              className={({ isActive }) =>
                isActive ? styles.active : styles.navLink
              }
            >
              <FontAwesomeIcon icon={faWandMagicSparkles} /> Generate Recipes
            </NavLink>
          </li>
        )}

        <li>
          <NavLink
            to="/community"
            className={({ isActive }) =>
              isActive ? styles.active : styles.navLink
            }
          >
            <FontAwesomeIcon icon={faCommentDots} /> Community Forum
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/chat"
            className={({ isActive }) =>
              isActive ? styles.active : styles.navLink
            }
          >
            <FontAwesomeIcon icon={faComments} /> Chat
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
