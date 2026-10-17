import layoutStyles from './ChatLayout.module.css'
import styles from './UserSidebar.module.css'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';

function UserSidebar({ token, currentUserID, setConversationID, setAccountID }) {

    const [chats, setChats] = useState([]);

    const loadChats = async () => {
        try {
            const response = await axios.get('http://localhost:8080/chat/conversations', {
                params: {
                    currentUserID: currentUserID
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log()
            setChats(response.data);

        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        loadChats();
    }, []);

    const handleUserSelect = (newConversationID, newAccountID) => {
        setConversationID(newConversationID); // update in ChatLayout
        setAccountID(newAccountID);
    };

    return (
        <aside className={styles.userListContainer}>
            <h1 className={styles.chatTitle}>Chat <FontAwesomeIcon icon={faComments} /></h1>
            <input className={styles.search} type="text" placeholder="Search" />

            <h2 className={styles.recentTitle}>Recent</h2>
            {chats.map((chat) => (
                <div className={styles.userContainer} key={chat.conversationID} onClick={() => handleUserSelect(chat.conversationID, chat.accountID)}>
                    <img className={styles.profilePic} src={chat.profilePic} ></img>
                    <h1 className={styles.userName}>{chat.accountName}</h1>
                </div>
            ))}
        </aside>
    )
}

export default UserSidebar;