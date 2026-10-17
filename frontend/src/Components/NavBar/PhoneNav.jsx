import styles from './PhoneNav.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser } from '@fortawesome/free-solid-svg-icons'

function PhoneNav({ showSidebar, showAccountInfo }) {
    
    return (
        <nav className={styles.userNav}>
            <button className={`${styles.userMenuButtons} ${styles.menuToggle}`} onClick={showSidebar}>
                <FontAwesomeIcon icon={faBars} />
            </button>

            <div className={styles.navLogo}>
                <img className={styles.navImgLogo} src="https://www.brunel.ac.uk/static-main/img/brunel-logo.png"></img>
                <h1>Group 25 Website</h1>
            </div>

            <button className={`${styles.userMenuButtons} ${styles.accountToggle}`} onClick={showAccountInfo}>
                <FontAwesomeIcon icon={faUser} />
            </button>
        </nav>
    )
}

export default PhoneNav