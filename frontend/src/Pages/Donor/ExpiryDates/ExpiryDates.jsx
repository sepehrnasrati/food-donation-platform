import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ExpiryDate.css';

const ExpiryDate = () => {
  const [foodItem, setFoodItem] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [expiryList, setExpiryList] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const addOrUpdateExpiryDate = async () => {
    if (!foodItem || !expiryDate) {
      alert("Please fill in both fields!");
      return;
    }

    try {
      if (editId) {
        await axios.put(`http://localhost:8080/expiry/update/${editId}`, {
          foodItem,
          expiryDate: new Date(expiryDate).toISOString().split("T")[0],
        });
        setEditId(null);
      } else {
        await axios.post("http://localhost:8080/expiry/add", {
          foodItem,
          expiryDate: new Date(expiryDate).toISOString().split("T")[0],
        });
      }
      fetchExpiryDates();
      setFoodItem("");
      setExpiryDate("");
    } catch (error) {
      console.error("Error saving expiry item:", error);
      alert("Error saving expiry item! Check console for details.");
    }
  };

  const fetchExpiryDates = async () => {
    const res = await axios.get('http://localhost:8080/expiry/all');
    const sortedData = sortList(res.data, sortOrder);
    setExpiryList(sortedData);
  };

  const deleteItem = async (id) => {
    await axios.delete(`http://localhost:8080/expiry/delete/${id}`);
    fetchExpiryDates();
  };

  const searchItems = async () => {
    if (!searchTerm) return fetchExpiryDates();
    const res = await axios.get(`http://localhost:8080/expiry/search?query=${searchTerm}`);
    setExpiryList(sortList(res.data, sortOrder));
  };

  useEffect(() => {
    fetchExpiryDates();
  }, [sortOrder]);

  const checkExpiryAlert = (date) => {
    const today = new Date();
    const expiry = new Date(date);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (diffDays <= 3 && diffDays >= 0) {
      return `⚠️ Only ${diffDays} days left!`;
    } else if (diffDays < 0) {
      return '❌ Expired!';
    } else {
      return `${diffDays} days left`;
    }
  };

  const sortList = (list, order) => {
    return [...list].sort((a, b) => {
      const dateA = new Date(a.expiryDate);
      const dateB = new Date(b.expiryDate);
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
  };

  const checkExpiryClass = (date) => {
    const today = new Date();
    const expiry = new Date(date);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (diffDays <= 3 && diffDays >= 0) return 'warning';
    if (diffDays < 0) return 'expired';
    return 'safe';
  };

  const startEditing = (item) => {
    setEditId(item.id);
    setFoodItem(item.foodItem);
    setExpiryDate(item.expiryDate);
  };

  return (
    <div className="expiry-date-container">
      <h2>Expiry Date Tracker 🥑</h2>

      <input
        type="text"
        value={foodItem}
        onChange={(e) => setFoodItem(e.target.value)}
        placeholder="Food item name"
      />
      <input
        type="date"
        value={expiryDate}
        onChange={(e) => setExpiryDate(e.target.value)}
      />
      <button onClick={addOrUpdateExpiryDate}>{editId ? "Update" : "Add Item"}</button>

      <div className="sort-controls">
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="asc">⬆ Ascending</option>
          <option value="desc">⬇ Descending</option>
        </select>
      </div>

      <input
        type="text"
        placeholder="Search food items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && searchItems()}
      />
      <button onClick={searchItems}>Search</button>

      <h3>Your Items:</h3>
      <ul className="expiry-list">
        {expiryList.map((item) => (
          <li key={item.id} className="expiry-item">
            <span className="food-name">{item.foodItem}</span>
            <span className="expiry-info">expires on {item.expiryDate}</span>
            <span className={`expiry-alert ${checkExpiryClass(item.expiryDate)}`}>
              - {checkExpiryAlert(item.expiryDate)}
            </span>
            <button onClick={() => startEditing(item)}>✏️ Edit</button>
            <button onClick={() => deleteItem(item.id)}>🗑 Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpiryDate;
