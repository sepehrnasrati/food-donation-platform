import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './FoodBankHome.module.css';
import { Card, CardContent, CardHeader, CardTitle } from "../../../Components/ui/card";
import { Button } from "../../../Components/ui/button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBox,
  faChartLine,
  faCalendar,
  faUsers,
  faChevronRight,
  faHandHoldingHeart,
  faExclamationTriangle,
  // faEnvelope, // No longer needed if modal is removed
  // faComments // No longer needed if modal is removed
} from '@fortawesome/free-solid-svg-icons';

function FoodBankHome({ currentUserID, token }) {
  const navigate = useNavigate();
  const [homeData, setHomeData] = useState(null);
  const [recentDonations, setRecentDonations] = useState([]);
  const [mostFrequentDonors, setMostFrequentDonors] = useState([]);
  const [neededItems, setNeededItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Remove modal state ---
  // const [showContactModal, setShowContactModal] = useState(false);
  // const [selectedDonor, setSelectedDonor] = useState(null);
  // --- End of removed modal state ---

  useEffect(() => {
    // ... (fetchData function remains the same) ...
     const fetchData = async () => {
      if (!currentUserID || !token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch basic home data
        const homeResponse = await axios.get(
          `http://localhost:8080/home/foodbank/${currentUserID}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        setHomeData(homeResponse.data);

        // Fetch recent donations
        const donationsResponse = await axios.get(
          `http://localhost:8080/home/foodbank/${currentUserID}/recent-donations`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        setRecentDonations(donationsResponse.data);

        // Fetch most frequent donors
        const donorsResponse = await axios.get(
          `http://localhost:8080/home/foodbank/${currentUserID}/top-donors`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        setMostFrequentDonors(donorsResponse.data);

        // Fetch needed items
        const itemsResponse = await axios.get(
          `http://localhost:8080/home/foodbank/${currentUserID}/needed-items`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        setNeededItems(itemsResponse.data);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load your dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUserID, token]);

  // Get priority color for needed items
  const getPriorityColor = (priority) => {
    // ... (remains the same) ...
    switch(priority) {
      case 'High':
        return '#ff4d4d';
      case 'Medium':
        return '#ff9f40';
      case 'Low':
        return '#ffd24d';
      default:
        return '#ffd24d';
    }
  };

  // --- Remove modal handler functions ---
  // const handleContactDonor = (donor) => { ... };
  // const handleCloseContactModal = () => { ... };
  // --- End of removed modal handlers ---

  const initiateChat = async (donor) => {
    // **Important: Add conversation creation/retrieval logic here**
    try {
      // Call backend to get or create conversation ID
      const response = await axios.post(`http://localhost:8080/chat/conversations?userId1=${currentUserID}&userId2=${donor.id}`, null, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
        // No params needed here as they are in the URL
      });

      const conversationId = response.data; // Assuming backend returns the ID

      if (conversationId) {
        // Navigate to chat page with the conversation ID and the other user's ID
        navigate('/chat', {
          state: {
            conversationID: conversationId,
            accountID: donor.id
          }
        });
      } else {
        console.error("Failed to get or create conversation ID");
        alert("Could not start chat. Please try again.");
      }
    } catch (error) {
      console.error('Error initiating chat:', error);
      alert('Error starting chat. Please try again.');
    }
  };

  // Handle update needed items
  const [showNeededItemsModal, setShowNeededItemsModal] = useState(false);
  const handleUpdateNeededItems = () => {
    setShowNeededItemsModal(true);
  };
  const handleCloseNeededItemsModal = () => {
    setShowNeededItemsModal(false);
  };


  if (loading) return <div className={styles.loading}>Loading your dashboard...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!homeData) return <div className={styles.noData}>No data available</div>;

  return (
    <main className={styles.foodBankHome}>
      {/* ... (Header and Stats Container remain the same) ... */}
       <div className={styles.header}>
        <h1>Welcome, {homeData.foodBankName}!</h1>
        <p className={styles.subtitle}>
          Here's an overview of your donation activity and impact
        </p>
      </div>

      <div className={styles.grid}>
        {/* Main stats cards */}
        <section className={styles.statsContainer}>
          <Card className={styles.statCard}>
            <CardHeader className={styles.statCardHeader}>
              <FontAwesomeIcon icon={faBox} className={styles.statIcon} />
              <CardTitle>Total Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={styles.statValue}>{homeData.totalDonationsReceived}</p>
              <p className={styles.statDescription}>Donations received to date</p>
            </CardContent>
          </Card>

          <Card className={styles.statCard}>
            <CardHeader className={styles.statCardHeader}>
              <FontAwesomeIcon icon={faChartLine} className={styles.statIcon} />
              <CardTitle>Total Weight</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={styles.statValue}>{homeData.totalWeightReceived.toFixed(1)} kg</p>
              <p className={styles.statDescription}>Food received and distributed</p>
            </CardContent>
          </Card>

          <Card className={styles.statCard}>
            <CardHeader className={styles.statCardHeader}>
              <FontAwesomeIcon icon={faCalendar} className={styles.statIcon} />
              <CardTitle>Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={styles.statValue}>{homeData.pendingDonations}</p>
              <p className={styles.statDescription}>Donations awaiting pickup/delivery</p>
            </CardContent>
          </Card>

          <Card className={styles.statCard}>
            <CardHeader className={styles.statCardHeader}>
              <FontAwesomeIcon icon={faUsers} className={styles.statIcon} />
              <CardTitle>Active Donors</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={styles.statValue}>{homeData.donorsThisMonth}</p>
              <p className={styles.statDescription}>Unique donors this month</p>
            </CardContent>
          </Card>
        </section>


      <div className={styles.sections}>
          {/* ... (Recent Donations section remains the same) ... */}
          <section className={styles.recentDonations}>
            <Card>
              <CardHeader>
                <CardTitle>Recent Donations</CardTitle>
              </CardHeader>
              <CardContent>
                {recentDonations.length === 0 ? (
                  <div className={styles.noDataMessage}>No recent donations to display.</div>
                ) : (
                  <div className={styles.donationsList}>
                    {recentDonations.map(donation => (
                      <div className={styles.donationItem} key={donation.id}>
                        <img
                          src={donation.logo || 'https://via.placeholder.com/50'}
                          alt={donation.donor}
                          className={styles.donationLogo}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/50';
                          }}
                        />
                        <div className={styles.donationDetails}>
                          <h3>{donation.donor}</h3>
                          <p className={styles.donationItems}>{donation.items}</p>
                          <div className={styles.donationMeta}>
                            <span className={styles.donationDate}>{donation.date}</span>
                            <span className={styles.donationAmount}>{donation.amount}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className={styles.sectionFooter}>
                  <Button
                    variant="outline"
                    className={styles.viewAllButton}
                    onClick={() => navigate('/incoming-donations')}
                  >
                    <span>View all donations</span>
                    <FontAwesomeIcon icon={faChevronRight} className={styles.iconRight} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className={styles.topDonors}>
            <Card>
              <CardHeader>
                <CardTitle>Most Frequent Donors</CardTitle>
              </CardHeader>
              <CardContent>
                {mostFrequentDonors.length === 0 ? (
                  <div className={styles.noDataMessage}>No donor data available.</div>
                ) : (
                  <div className={styles.donorsList}>
                    {mostFrequentDonors.map(donor => (
                      <div className={styles.donorItem} key={donor.id}>
                        <img
                          src={donor.logo || 'https://via.placeholder.com/50'}
                          alt={donor.name}
                          className={styles.donorLogo}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/50';
                          }}
                        />
                        <div className={styles.donorDetails}>
                          <h3>{donor.name}</h3>
                          <p className={styles.donorStat}>{donor.donations} donations</p>
                        </div>
                        {/* --- MODIFIED BUTTON --- */}
                        <Button
                          variant="outline"
                          size="sm"
                          className={styles.contactButton}
                          onClick={() => initiateChat(donor)} // Directly call initiateChat
                        >
                          Contact
                        </Button>
                         {/* --- END OF MODIFIED BUTTON --- */}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>

         {/* ... (Needed Items and Action Section remain the same) ... */}
          <section className={styles.neededItems}>
          <Card>
            <CardHeader>
              <CardTitle>Most Needed Items</CardTitle>
            </CardHeader>
            <CardContent>
              {neededItems.length === 0 ? (
                <div className={styles.noDataMessage}>No needed items specified.</div>
              ) : (
                <div className={styles.neededItemsList}>
                  {neededItems.map(item => (
                    <div className={styles.neededItem} key={item.id}>
                      <div
                        className={styles.itemPriority}
                        style={{backgroundColor: getPriorityColor(item.priority)}}
                      >
                        {item.priority}
                      </div>
                      <div className={styles.itemDetails}>
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className={styles.sectionFooter}>
                <Button
                  variant="outline"
                  className={styles.viewAllButton}
                  onClick={handleUpdateNeededItems}
                >
                  <span>Update needed items</span>
                  <FontAwesomeIcon icon={faChevronRight} className={styles.iconRight} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Action section */}
        <section className={styles.actionsSection}>
          <Card className={styles.actionCard}>
            <CardContent>
              <div className={styles.actionContent}>
                <FontAwesomeIcon icon={faHandHoldingHeart} className={styles.actionIcon} />
                <div className={styles.actionText}>
                  <h3>Ready to receive donations?</h3>
                  <p>Check your pending donations and schedule pickups.</p>
                </div>
                <Button
                  className={styles.actionButton}
                  onClick={() => navigate('/incoming-donations')}
                >
                  Manage Donations
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>


      {/* --- Remove Contact Donor Modal --- */}
      {/* {showContactModal && selectedDonor && ( ... modal JSX ... )} */}
      {/* --- End of removed modal --- */}


      {/* Update Needed Items Modal (remains the same) */}
      {showNeededItemsModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Update Needed Items</h2>
             {/* ... modal content ... */}
              <div className={styles.modalContent}>
              <p>Edit your needed items information:</p>

              <div className={styles.neededItemsForm}>
                {neededItems.map((item, index) => (
                  <div key={index} className={styles.neededItemInput}>
                    <input
                      type="text"
                      defaultValue={item.name}
                      placeholder="Item name"
                      className={styles.itemNameInput}
                    />
                    <select
                      defaultValue={item.priority}
                      className={styles.itemPrioritySelect}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                ))}
              </div>

              <p className={styles.noteText}>
                Note: This is a preview feature. In the full version, you'll be able to update your needed items list.
              </p>
            </div>
            <div className={styles.modalActions}>
              <Button variant="outline" onClick={handleCloseNeededItemsModal}>
                Close
              </Button>
              <Button onClick={handleCloseNeededItemsModal}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default FoodBankHome;