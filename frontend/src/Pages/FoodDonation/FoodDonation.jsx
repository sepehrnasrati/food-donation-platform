import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import "./DiscoverFoodBanks.css";
import PreviousDonation from "./PreviousDonation.jsx";
import Modal from "./Modal.jsx";
import EditModal from "./EditModal.jsx";

function FoodDonation({ token , currentUserID}) {
  const [donationHistory, setDonationHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch donations from the API on component mount using axios
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/donations/donor/${currentUserID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDonationHistory(response.data); // Update state with the fetched donations
        setLoading(false);
      } catch (error) {
        console.error("Failed to get donations list:", error);
        setError("Failed to load donations list");
        setLoading(false);
      }
    };

    if (currentUserID) {
      fetchDonations();
    }
  }, [token, currentUserID]);

  if (loading) return <div className="loading-message">Loading donations...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const handleAddNewDonation = async (newDonation) => {
    try {
      console.log("Adding donation with user ID:", currentUserID);
      
      const response = await axios.post(
        "http://localhost:8080/donations", 
        newDonation,
        {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          },
          params: currentUserID ? { donorId: currentUserID } : {}
        }
      );
      
      console.log("Donation response:", response.data);
      setDonationHistory((prev) => [...prev, response.data]);
      // You could also show a success message here
    } catch (error) {
      console.error("Error adding donation:", error);
      // Handle error
    }
  };

  const handleEditDonation = (donation) => {
    setSelectedDonation(donation); // Select the donation to edit
    setShowEditModal(true); // Show the EditModal
  };

  const handleSaveEditedDonation = (updatedDonation) => {
    setDonationHistory((prev) =>
      prev.map((donation) =>
        donation.donationID === updatedDonation.donationID
          ? updatedDonation
          : donation
      )
    );
  };

  return (
    <>
      <main>
        <div>
          <h1
            style={{
              fontWeight: "bold",
              fontSize: "25px",
              textAlign: "center",
              paddingBottom: "20px",
              paddingTop: "20px",
            }}
          >
            Discover Food Banks
          </h1>
          <button
            style={{
              display: "block",
              margin: "20px auto",
              padding: "10px 15px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => setShowModal(true)}
          >
            Add New Donation
          </button>
          <center>
            <div>
              {donationHistory.map((post, index) => (
                <PreviousDonation
                  key={index}
                  profilePic={post.image}
                  name={post.name}
                  quantity={post.amount}
                  date={post.expirationDate}
                  foodBank={post.foodBank.name}
                  onEdit={() => handleEditDonation(post)} // Pass edit handler here
                />
              ))}
            </div>
          </center>
        </div>
      </main>

      {/* Modal component for adding a new donation */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleAddNewDonation}
        currentUserID={currentUserID}
        token={token}
      />

      {/* Modal component for editing an existing donation */}
      <EditModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        donation={selectedDonation}
        onSave={handleSaveEditedDonation}
      />
    </>
  );
}

export default FoodDonation;