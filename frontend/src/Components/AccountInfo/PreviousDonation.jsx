import styles from './PreviousDonation.module.css'

function PreviousDonation({ profilePic, name, quantity, date }) {
    return (
        <>
            <div className={styles.prevDonationContainer}>
                <img className={styles.foodBankLogo} src={profilePic}/>

                <div>
                    <h1 className={styles.foodBankName}>{name}</h1>
                    <h2 className={styles.quantity}>Quantity: {quantity}</h2>
                    <h2 className={styles.donationDate}>Date: {date}</h2>
                </div>

            </div>
        </>
    )
}

export default PreviousDonation