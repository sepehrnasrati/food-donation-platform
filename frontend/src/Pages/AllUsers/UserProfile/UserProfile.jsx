import styles from "./UserProfile.module.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faShop, faWheatAwn, faCalendar, faEnvelope, faComments, faHandshakeSimple } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function UserProfile({ token, currentUserID }) {

    const { id } = useParams();
    const [user, setUser] = useState("");

    const [classNameVal, setClassNameVal] = useState(null);

    const fetchUser = async () => {
        // Example: http://localhost:8080/users/2
        try {
            const response = await axios.get(`http://localhost:8080/users/${id}`)
            setUser(response.data);
        } catch (error) {
            console.error('Error response:', error);
        }
    }

    const getAccountType = (accountType) => {
        switch (accountType) {
            case 'INDIVIDUAL':
                return (
                    <div className={styles.individual}>
                        <FontAwesomeIcon icon={faUser} />
                        <span className="label"> Individual</span>
                    </div>
                );
            case 'BUSINESS':
                return (
                    <div className={styles.business}>
                        <FontAwesomeIcon icon={faShop} />
                        <span className="label"> Business</span>
                    </div>
                );
            case 'FOOD_BANK':
                return (
                    <div className={styles.foodbank}>
                        <FontAwesomeIcon icon={faWheatAwn} />
                        <span className="label"> Food bank</span>
                    </div>
                );
            default:
                return (
                    <div>
                        <span className="icon">❓</span>
                        <span className="label">Unknown</span>
                    </div>
                );
        }
    };

    const navigate = useNavigate();
    /*const openChat = () => {
        navigate(`/chat`); // navigate to chat page
    }*/
    const openChat = async () => {
        if (currentUserID !== null) {
            try {
                const response = await axios.post(`http://localhost:8080/chat/conversations?userId1=${currentUserID}&userId2=${user.userID}`, null, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: { currentUserID: currentUserID }
                });

                // pass conversation and accountID via state when navigating to /chat
                navigate(`/chat`, { state: { 
                    conversationID: response.data, 
                    accountID: id
                  }});

            } catch (error) {
                console.error('Error:', error);
                alert('Error fetching conversation.');
            }
        } else {
            alert('Please sign in to start a chat.');
        }
    };

    useEffect(() => {
        fetchUser();
    }, [])

    useEffect(() => {
        if (currentUserID === null) {
            setClassNameVal(`${styles.signedOutView} ${styles.mainContainer}`); // This className will set the width of the main to 100% since there will be no sidebars
        } else {
            setClassNameVal(styles.mainContainer)
        }
    }, [])

    return (
        <main className={classNameVal}>
            <div className={styles.contentContainer}>
                {user ? <div className={styles.profileContainer}>
                    <div className={styles.banner} />

                    <div className={styles.accountInfoContainer}>
                        <div className={styles.contactInfoContainer}>

                            <img className={styles.profilePic} src={user.profilePic} />
                            <div className={styles.accountTypeLabel}>
                                {getAccountType(user.accountType)}
                            </div>

                            <div className={styles.dateEmailContainer}>
                                <div>
                                    <FontAwesomeIcon icon={faCalendar} />
                                    <p>Joined {new Date(user.createdAt).toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    })}</p>
                                </div>

                                <div>
                                    <FontAwesomeIcon icon={faEnvelope} />
                                    <p>{user.email}</p>
                                </div>

                                {user.accountType === "FOOD_BANK" &&
                                    <button className={styles.donateButton}><FontAwesomeIcon icon={faHandshakeSimple} /> Donate</button>
                                }
                                <button className={styles.chatButton} onClick={openChat}><FontAwesomeIcon icon={faComments} /> Chat</button>
                            </div>
                        </div>

                        <div className={styles.nameAboutContainer}>
                            <h1>{user.name}</h1>
                            <h2>About</h2>
                            <p>{user.about}</p>
                        </div>
                    </div>

                </div>
                    : <h2>User not found.</h2>}

            </div>
        </main>
    )
}

export default UserProfile;