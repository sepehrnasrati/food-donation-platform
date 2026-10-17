import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './DonorHome.module.css';
import { Card, CardContent, CardHeader, CardTitle } from "../../../Components/ui/card";
import { Button } from "../../../Components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "../../../Components/ui/alert";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faBox, faCalendar, faChevronRight, faChartLine, faHeart } from '@fortawesome/free-solid-svg-icons';

function DonorHome({ currentUserID, token }) {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentDonations, setRecentDonations] = useState([]);
  const [nearExpiryItems, setNearExpiryItems] = useState([]);
  const [leaderboardPosition, setLeaderboardPosition] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUserID || !token) {
        setLoading(false);
        return;
      }
      
      try {
        // Fetch basic home data
        const homeResponse = await axios.get(
          `http://localhost:8080/home/donor/${currentUserID}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        setHomeData(homeResponse.data);
        
        // Fetch recent donations (mock data for now)
        // In a real implementation, you would have an API endpoint for this
        setRecentDonations([
          {
            id: 1,
            foodBank: "The Trussell Trust",
            items: "Mixed canned goods",
            date: "19 Mar 2025",
            amount: "3.2 kg",
            logo: "https://www.hilbre.wirral.sch.uk/_site/data/files/images/auto_upload/7C40E4A3187A5634D746D8D3942BB261.png"
          },
          {
            id: 2,
            foodBank: "The Felix Project",
            items: "Pasta and sauce",
            date: "15 Mar 2025",
            amount: "2.5 kg",
            logo: "https://thefelixproject.org/uploads/branding/Felix-Signature.png"
          }
        ]);
        
        // Fetch items near expiry (mock data for now)
        setNearExpiryItems([
          { id: 1, name: "Milk", expiryDate: "2025-03-22", daysLeft: 2 },
          { id: 2, name: "Yogurt", expiryDate: "2025-03-23", daysLeft: 3 },
          { id: 3, name: "Bread", expiryDate: "2025-03-24", daysLeft: 4 }
        ]);
        
        // Get leaderboard position
        try {
          const leaderboardResponse = await axios.get(
            `http://localhost:8080/api/leaderboard/month`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          
          const position = leaderboardResponse.data.findIndex(entry => entry.id === currentUserID) + 1;
          if (position > 0) {
            setLeaderboardPosition(position);
          }
        } catch (err) {
          console.log("Error fetching leaderboard position:", err);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load your dashboard data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentUserID, token]);
  
  if (loading) return <div className={styles.loading}>Loading your dashboard...</div>;
  if (error) return <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>;
  if (!homeData) return <div className={styles.noData}>No data available</div>;
  
  return (
    <main className={styles.donorHome}>
      <div className={styles.header}>
        <h1>Welcome, {homeData.userName}!</h1>
        <p className={styles.subtitle}>
          Here's your current impact on reducing food waste and fighting hunger
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
              <p className={styles.statValue}>{homeData.totalDonations}</p>
              <p className={styles.statDescription}>Donations made to date</p>
            </CardContent>
          </Card>
          
          <Card className={styles.statCard}>
            <CardHeader className={styles.statCardHeader}>
              <FontAwesomeIcon icon={faChartLine} className={styles.statIcon} />
              <CardTitle>Total Weight</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={styles.statValue}>{homeData.totalWeight.toFixed(1)} kg</p>
              <p className={styles.statDescription}>Food rescued from waste</p>
            </CardContent>
          </Card>
          
          <Card className={styles.statCard}>
            <CardHeader className={styles.statCardHeader}>
              <FontAwesomeIcon icon={faTrophy} className={styles.statIcon} />
              <CardTitle>Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              {leaderboardPosition ? (
                <>
                  <p className={styles.statValue}>#{leaderboardPosition}</p>
                  <p className={styles.statDescription}>Your current rank this month</p>
                </>
              ) : (
                <p className={styles.statDescription}>Make more donations to appear on the leaderboard!</p>
              )}
            </CardContent>
          </Card>
        </section>
        
        {/* Recent donations and items expiring soon */}
        <div className={styles.sections}>
          <section className={styles.recentDonations}>
            <Card>
              <CardHeader>
                <CardTitle>Recent Donations</CardTitle>
              </CardHeader>
              <CardContent>
                {recentDonations.length === 0 ? (
                  <div className={styles.noDataMessage}>You haven't made any donations yet.</div>
                ) : (
                  <div className={styles.donationsList}>
                    {recentDonations.map(donation => (
                      <div className={styles.donationItem} key={donation.id}>
                        <img src={donation.logo} alt={donation.foodBank} className={styles.donationLogo} />
                        <div className={styles.donationDetails}>
                          <h3>{donation.foodBank}</h3>
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
                  <Link to="/food-donation">
                    <Button variant="outline" className={styles.viewAllButton}>
                      <span>View all donations</span>
                      <FontAwesomeIcon icon={faChevronRight} className={styles.iconRight} />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className={styles.expiryItems}>
            <Card>
              <CardHeader>
                <CardTitle>Items Expiring Soon</CardTitle>
              </CardHeader>
              <CardContent>
                {nearExpiryItems.length === 0 ? (
                  <div className={styles.noDataMessage}>No items nearing expiration.</div>
                ) : (
                  <div className={styles.expiryItemsList}>
                    {nearExpiryItems.map(item => (
                      <div className={styles.expiryItem} key={item.id}>
                        <div className={`${styles.daysLeft} ${item.daysLeft <= 2 ? styles.urgent : ''}`}>
                          {item.daysLeft} days
                        </div>
                        <div className={styles.expiryDetails}>
                          <h3>{item.name}</h3>
                          <p className={styles.expiryDate}>Expires: {new Date(item.expiryDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className={styles.sectionFooter}>
                  <Link to="/expiries">
                    <Button variant="outline" className={styles.viewAllButton}>
                      <span>Track expiry dates</span>
                      <FontAwesomeIcon icon={faChevronRight} className={styles.iconRight} />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
        
        {/* Action cards */}
        <section className={styles.actions}>
          <Card className={styles.actionCard}>
            <CardContent>
              <div className={styles.actionContent}>
                <FontAwesomeIcon icon={faHeart} className={styles.actionIcon} />
                <div className={styles.actionText}>
                  <h3>Want to make a difference?</h3>
                  <p>Donate food to local food banks and help fight hunger in your community.</p>
                </div>
                <Link to="/food-banks">
                  <Button className={styles.actionButton}>
                    Donate Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <Card className={styles.actionCard}>
            <CardContent>
              <div className={styles.actionContent}>
                <FontAwesomeIcon icon={faCalendar} className={styles.actionIcon} />
                <div className={styles.actionText}>
                  <h3>Got ingredients about to expire?</h3>
                  <p>Use our recipe generator to make delicious meals and reduce food waste.</p>
                </div>
                <Link to="/recipes">
                  <Button className={styles.actionButton}>
                    Generate Recipes
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
        
        <section className={styles.community}>
          <Card>
            <CardHeader>
              <CardTitle>Food Waste Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.impactStats}>
                <div className={styles.impactItem}>
                  <h3>Your Contribution</h3>
                  <p className={styles.impactValue}>CO<sub>2</sub> reduction: {(homeData.totalWeight * 1.57).toFixed(1)} kg</p>
                  <p className={styles.impactDescription}>
                    By donating {homeData.totalWeight.toFixed(1)} kg of food, you've helped prevent approximately {(homeData.totalWeight * 1.57).toFixed(1)} kg of CO<sub>2</sub> emissions.
                  </p>
                </div>
                <div className={styles.impactItem}>
                  <h3>Did You Know?</h3>
                  <p className={styles.impactFact}>
                    Nearly 1/3 of all food produced globally goes to waste. Your efforts help reduce this waste and its environmental impact.
                  </p>
                </div>
              </div>
              <div className={styles.sectionFooter}>
                <Link to="/community">
                  <Button variant="outline" className={styles.viewAllButton}>
                    <span>Join community discussion</span>
                    <FontAwesomeIcon icon={faChevronRight} className={styles.iconRight} />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}

export default DonorHome;