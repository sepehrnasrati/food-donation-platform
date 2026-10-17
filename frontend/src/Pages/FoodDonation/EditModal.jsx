import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Modal.css";

function EditModal({show, onClose, donation, onSave }) {
  const [formData, setFormData] = useState({
    donationID: "",
    profilePic: "",
    name: "",
    quantity: "",
    date: "",
    foodBank: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (show && donation) {
      setFormData({
        donationID: donation.donationID || "",
        profilePic: donation.image || "",
        name: donation.name || "",
        quantity: donation.amount || "",
        date: donation.expirationDate || "",
        foodBank: donation.foodBank.userID || ""
      });
    }
  }, [show, donation]);

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!formData.donationID) {
      console.error("Donation ID is missing");
      return;
    }

    const updatedDonationData = {
      donationID: formData.donationID,
      name: formData.name,
      amount: parseFloat(formData.quantity),
      expirationDate: formData.date,
      image: formData.profilePic,
      foodBank: formData.foodBank,
    };

    setLoading(true);

    try {
      await axios.put(
        `http://localhost:8080/donations/${formData.donationID}`,
        updatedDonationData
      );
      onSave(updatedDonationData);
      onClose();
    } catch (error) {
      console.error("Error updating donation:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="donation-edit-modal">
      <div className="donation-edit-modal-content">
        <button
          className="donation-edit-close"
          onClick={onClose}
          disabled={loading}
        >
          &times;
        </button>
        <h2>Edit Donation</h2>
        <form onSubmit={handleSubmit} className="donation-edit-form">
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.name && (
              <div className="donation-edit-error">{errors.name}</div>
            )}
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
              <div className="donation-edit-error">{errors.quantity}</div>
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
            {errors.date && (
              <div className="donation-edit-error">{errors.date}</div>
            )}
          </label>

          <label>
            Profile Picture URL:
            <input
              type="text"
              name="profilePic"
              value={formData.profilePic}
              onChange={handleChange}
              disabled={loading}
            />
          </label>

          <button
            type="submit"
            className="donation-edit-submit"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            className="donation-edit-cancel"
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

export default EditModal;
