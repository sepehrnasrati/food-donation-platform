import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for API requests
import "./Modal.css";

function Modal({currentUserID, show, onClose, onSave }) {
  const [formData, setFormData] = useState({
    profilePic: "",
    name: "",
    quantity: "",
    date: "",
    foodBank: "",
  });

  const [foodBanks, setFoodBanks] = useState([]); // State to store food banks
  const [errors, setErrors] = useState({}); // State to store validation errors
  const [loading, setLoading] = useState(false); // State to handle loading


  // Fetch food banks when the component mounts
  useEffect(() => {
    const fetchFoodBanks = async () => {
      try {
        const response = await axios.get("http://localhost:8080/users/foodbanks", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setFoodBanks(response.data); // Set the list of food banks
      } catch (error) {
        console.error("Failed to fetch food banks:", error);
      }
    };
  
    if (show) {
      fetchFoodBanks();
    }
  }, [show]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Name is required.";
    if (
      !formData.quantity ||
      isNaN(formData.quantity) ||
      formData.quantity <= 0
    ) {
      newErrors.quantity = "Please enter a valid amount greater than 0.";
    }
    if (!formData.date) newErrors.date = "Expiration date is required.";

    if (!formData.foodBank) newErrors.foodBank = "Please select a foodbank";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Only submit if validation passes

    setLoading(true); // Set loading to true when submitting

    const donationData = {
      name: formData.name,
      amount: parseFloat(formData.quantity),
      expirationDate: formData.date,
      image: formData.profilePic || "https://via.placeholder.com/100", // Add default image
      status: "pending",
      foodBank: formData.foodBank,
      donorUser: currentUserID,
    };

    console.log("Submitting donation data:", donationData);

    try {
      const response = await axios.post(
        "http://localhost:8080/donations", 
        donationData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      onSave(donationData);
      setFormData({ profilePic: "", name: "", quantity: "", date: "", foodBank: ""});
      onClose();
    } catch (error) {
      console.error("Error submitting donation:", error);
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };

  if (!show) return null;

  return (
    <div className="donation-modal">
      <div className="donation-modal-content">
        <button className="donation-close" onClick={onClose} disabled={loading}>
          &times;
        </button>
        <h2
          style={{
            fontWeight: "bold",
            fontSize: "25px",
            textAlign: "center",
            paddingBottom: "20px",
            paddingTop: "20px",
          }}
        >
          Add New Donation
        </h2>
        <form className="donation-form" onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.name && <div className="donation-error">{errors.name}</div>}
          </label>

          <label>
            Amount:
            <input
              type="text"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.quantity && (
              <div className="donation-error">{errors.quantity}</div>
            )}
          </label>

          <label>
            Expiration Date:
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.date && <div className="donation-error">{errors.date}</div>}
          </label>

          <label>
            Profile Picture URL:
            <input
              type="text"
              name="profilePic"
              value={formData.profilePic}
              onChange={handleChange}
              disabled={loading}
              placeholder="https://example.com/image.jpg"
            />
          </label>

          <label>
            Food Bank:
            <select
              name="foodBank"
              value={formData.foodBank}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Select a food bank</option>
              {foodBanks.map((foodBank) => (
                <option key={foodBank.userID} value={foodBank.userID}>
                  {foodBank.name}
                </option>
              ))}
            </select>
            {errors.foodBank && (
              <div className="donation-error">{errors.foodBank}</div>
            )}
          </label>

          <button type="submit" className="donation-submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className="donation-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default Modal;