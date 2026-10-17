import axios from "axios";
import styles from "./IncomingDonations.module.css";
import { useState, useEffect } from "react";

function FoodBankCard({ foodBank, onUpdateStatus }) {
  const handleAccept = async () => {
    try {
      await onUpdateStatus(foodBank.donationID, "accepted");
      alert("Donation accepted successfully!");
    } catch (error) {
      console.error("Failed to accept donation:", error);
      alert("Failed to accept donation. Please try again.");
    }
  };

  const handleDecline = async () => {
    try {
      await onUpdateStatus(foodBank.donationID, "declined");
      alert("Donation declined.");
    } catch (error) {
      console.error("Failed to decline donation:", error);
      alert("Failed to decline donation. Please try again.");
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <h2 className={styles.foodBankName}>{foodBank.name}</h2>
        <p className={styles.description}>Amount: {foodBank.amount}kg</p>
        <p className={styles.description}>Expiry Date: {foodBank.expirationDate}</p>
        <div className={styles.buttonBox}>
          <button className={styles.donateButton1} onClick={handleAccept}>
            Accept
          </button>
          <button className={styles.donateButton2} onClick={handleDecline}>
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}

function FoodBankCard2({ foodBank }) {


  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <h2 className={styles.foodBankName}>{foodBank.name}</h2>
        <p className={styles.description}>Amount = {foodBank.amount}kg</p>
        <p className={styles.description}>Expiry Date = {foodBank.expirationDate}</p>
      </div>
    </div>
  );
}

function IncomingDonations({ token , currentUserID}) {
  const [donationReq, setDonationReq] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getDonationReq = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/donations/foodBank/${currentUserID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDonationReq(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to get donation requests list:", error);
        setError("Failed to load donation request list");
        setLoading(false);
      }
    };

    if (currentUserID) {
      getDonationReq();
    }
  }, [token, currentUserID]);


  // Update donation status
  const onUpdateStatus = async (donationID, status) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/donations/${donationID}/status`,
        null, // No request body needed
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            status: status, // Pass the new status as a query parameter
          },
        }
      );

      // Update the local state to reflect the change
      setDonationReq((prevDonations) =>
        prevDonations.map((donation) =>
          donation.donationID === donationID ? { ...donation, status: status } : donation
        )
      );
    } catch (error) {
      console.error("Failed to update donation status:", error);
      throw error;
    }
  };


  if (loading)
    return <div className={styles.errorContainer}>Loading donation requests...</div>;
  if (error) 
    return <div className={styles.errorContainer}>{error}</div>;
  

  // Filter donations by status
  const acceptedDonations = donationReq.filter((donation) => donation.status === "accepted");
  const waitingDonations = donationReq.filter((donation) => donation.status === "pending");
  
  return (
    <main className={styles.container}>
      <section className={styles.header}>
        <h1 className={styles.title}>Donation Requests</h1>
        <div className={styles.text}>
          {waitingDonations.length > 0 ? (
            waitingDonations.map((donation) => (
              <FoodBankCard key={donation.donationID} foodBank={donation} onUpdateStatus={onUpdateStatus}/>
            ))
          ) : (
            <p className={styles.emptyMessage}>No donation requests yet.</p>
          )}
        </div>
      </section>

      <section className={styles.header}>
        <h1 className={styles.title}>Approved Requests</h1>
        {acceptedDonations.length > 0 ? (
          acceptedDonations.map((donation) => (
            <FoodBankCard2 key={donation.donationID} foodBank={donation} />
          ))
        ) : (
          <p className={styles.emptyMessage}>No accepted donations found.</p>
        )}
      </section>
    </main>
  );
}

export default IncomingDonations;
