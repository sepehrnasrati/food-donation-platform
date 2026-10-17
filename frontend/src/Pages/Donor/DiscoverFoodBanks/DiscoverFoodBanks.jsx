import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './DiscoverFoodBanks.module.css';

function FoodBankCard({ foodBank }) {
    // Extracts "What we need most" or "Looking for" or "In need of" section from the about text
    const getNeedsSection = (about) => {
        if (!about) return null;
        const needsMatch = about.match(/(?:What we need most:|Looking for:|In need of:)(.*?)(?=\n|$)/s);
        return needsMatch ? needsMatch[1].trim() : null;
    };

    // Gets the main description without the needs section
    const getMainDescription = (about) => {
        if (!about) return '';
        return about.split(/What we need most:|Looking for:|In need of:/)[0].trim();
    };

    const needs = getNeedsSection(foodBank.about);
    const description = getMainDescription(foodBank.about);

    return (
        <div className={styles.card}>
            <div className={styles.logoContainer}>
                <img 
                    src={foodBank.profilePic} 
                    alt={`${foodBank.name} logo`}
                    className={styles.logo}
                />
            </div>
            <div className={styles.content}>
                <h2 className={styles.foodBankName}>{foodBank.name}</h2>
                <p className={styles.description}>{description}</p>
                
                {needs && (
                    <div className={styles.needsList}>
                        <h3 className={styles.needsTitle}>Items Needed:</h3>
                        <p className={styles.needs}>{needs}</p>
                    </div>
                )}
                
                <button className={styles.donateButton}>
                    Make Donation
                </button>
            </div>
        </div>
    );
}

function DiscoverFoodBanks({ token }) {
    const [foodBanks, setFoodBanks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getFoodBanks = async () => {
            
            if (!token) {
                
                setLoading(false); // Stop loading if no token
                setError("Please log in to view food banks."); 
                return; // Exit the function early
            }
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:8080/foodbanks', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setFoodBanks(response.data);
                setError(null);
            } catch (error) {
                console.error('Failed to get food banks:', error);
                 // rror handling
                setError('Failed to load food banks. Please ensure the backend is running and you are logged in.');
                 setFoodBanks([]);
            } finally {
                setLoading(false);
            }
        };
    
        getFoodBanks();
    }, [token]); 

    if (loading) return <div className={styles.container}>Loading food banks...</div>;
    if (error) return <div className={styles.container}>{error}</div>;

    return (
        <main className={styles.container}>
            <section className={styles.header}>
                <h1 className={styles.title}>Discover Food Banks</h1>
                <p className={styles.subtitle}>
                    Connect with local food banks and make a difference in your community. 
                    Browse through available food banks and see what items they need most.
                </p>
            </section>

            <section className={styles.grid}>
                {foodBanks.map((foodBank) => (
                    <FoodBankCard key={foodBank.userID} foodBank={foodBank} />
                ))}
            </section>
        </main>
    );
}

export default DiscoverFoodBanks;