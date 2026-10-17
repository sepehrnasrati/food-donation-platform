import styles from "./PreviousDonation.module.css";

function PreviousDonation({ profilePic, name, quantity, date, foodBank, onEdit }) {
  return (
    <div className={styles.previousDonationCard}>
      <img className={styles.foodBankLogo} src={profilePic} alt={name} />
      <div className={styles.donationDetails}>
        <div>
          <h1 className={styles.foodBankName}>{name}</h1>
          <h2 className={styles.quantity}>Quantity: {quantity} g</h2>
          <h2 className={styles.donationDate}>Date: {date}</h2>
          <h2 className={styles.foodBank}>FoodBank: {foodBank}</h2>
        </div>
        <button onClick={onEdit}>Edit</button>
      </div>
    </div>
  );
}

export default PreviousDonation;
