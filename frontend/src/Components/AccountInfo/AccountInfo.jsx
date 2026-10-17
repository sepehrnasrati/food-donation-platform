import styles from './AccountInfo.module.css'
import PreviousDonation from './PreviousDonation.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

function AccountInfo({ user, setTestUser, setToken, closeAccountInfo }) {

    // This array contains example posts
    const donationHistoryExample = [
        {
            profilePic: 'https://www.hilbre.wirral.sch.uk/_site/data/files/images/auto_upload/7C40E4A3187A5634D746D8D3942BB261.png',
            name: 'The Trussel Trust',
            quantity: "320g",
            date: '1 Jan 2025',
        },
        {
            profilePic: 'https://thefelixproject.org/uploads/branding/Felix-Signature.png',
            name: 'The Felix Project',
            quantity: "250g",
            date: '31 Dec 2024',
        },
        {
            profilePic: 'https://images.squarespace-cdn.com/content/v1/5c5c4471d86cc957ecc9094d/1552993279130-42YSJ14J1KXA9AS89MAZ/FREE-Foodcycle-Meals-Throughout-The-UK-Gratisfaction-UK-Freebies.jpg',
            name: 'Food Cycle',
            quantity: "400g",
            date: '30 Dec 2024',
        },
        {
            profilePic: 'https://media.licdn.com/dms/image/v2/D4E0BAQGA_82vhKKQrw/company-logo_200_200/company-logo_200_200/0/1698853690865/fareshare_north_east_logo?e=2147483647&v=beta&t=whH0jWAULNWTjxndOiQu250MmLAHFne3rsv5iLHoddU',
            name: 'FareShare',
            quantity: "350g",
            date: '29 Dec 2024',
        },
        {
            profilePic: 'https://www.hilbre.wirral.sch.uk/_site/data/files/images/auto_upload/7C40E4A3187A5634D746D8D3942BB261.png',
            name: 'The Trussel Trust',
            quantity: "100g",
            date: '28 Dec 2024',
        },
        {
            profilePic: 'https://thefelixproject.org/uploads/branding/Felix-Signature.png',
            name: 'The Felix Project',
            quantity: "320g",
            date: '27 Dec 20245',
        },
        {
            profilePic: 'https://images.squarespace-cdn.com/content/v1/5c5c4471d86cc957ecc9094d/1552993279130-42YSJ14J1KXA9AS89MAZ/FREE-Foodcycle-Meals-Throughout-The-UK-Gratisfaction-UK-Freebies.jpg',
            name: 'Food Cycle',
            quantity: "250g",
            date: '26 Dec 2024',
        }
    ];

    let accountTag = null;
    //let accountTag = <div className="tag individual-tag">Individual Account</div>;
    if (user.accountType === "INDIVIDUAL") {
        accountTag = <div className={`${styles.tag} ${styles.individualTag}`}>Individual Account</div>;
    } else if (user.accountType === "BUSINESS") {
        accountTag = <div className={`${styles.tag} ${styles.businessTag}`}>Business Account</div>;
    } else if (user.accountType === "FOOD_BANK") {
        accountTag = <div className={`${styles.tag} ${styles.foodbankTag}`}>Food Bank Account</div>;
    }
    return (
        <aside className={styles.accountInfo}>
            <button className={styles.closeButton1} onClick={closeAccountInfo}>
                <FontAwesomeIcon icon={faClose} />
            </button>
            <div className={styles.accountContainer}>

                {accountTag}

                <div className={styles.gradientBorder}><img className={styles.profilePicture} src={user.profilePic}></img></div>
                <h1 className={styles.name}>{user.name}</h1>
                <h2 className={styles.email}>{user.email}</h2>

                <button className={styles.editProfileButton}>Edit profile</button>

                <button onClick={() => { setTestUser(null); setToken(null); }} className={styles.logOutButton}>Log out</button>

                {/* Render the donation history only if account type is not 'FOOD_BANK' */}
                {user.accountType !== "FOOD_BANK" && (
                    <>
                        <div className={styles.infoContainer}>
                            <div className={styles.totalContributionsContainer}>
                                <h1>15</h1>
                                <h2>Total<br />contributions</h2>
                            </div>
                            <div className={styles.infoDivider}></div>
                            <div className={styles.kgDonatedContainer}>
                                <h1>80</h1>
                                <h2>kg<br />donated</h2>
                            </div>
                        </div>

                        <h2 className={styles.donationHistoryText}>Donation history:</h2>

                        {donationHistoryExample.map((donation, index) => (
                            <PreviousDonation
                                key={index}
                                profilePic={donation.profilePic}
                                name={donation.name}
                                quantity={donation.quantity}
                                date={donation.date}
                            />
                        ))}
                    </>
                )}

            </div>
        </aside>
    )
}

export default AccountInfo