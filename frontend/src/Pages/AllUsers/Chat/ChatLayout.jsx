import UserSidebar from "./UserSidebar";
import ChatView from "./ChatView";
import { useState } from "react";
import { useLocation } from 'react-router-dom';
import styles from './ChatLayout.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faSquareFull } from '@fortawesome/free-solid-svg-icons';

function ChatLayout({ token, currentUserID }) {
    const location = useLocation(); // used to access state passed from a previous page
    const [conversationID, setConversationID] = useState(location.state?.conversationID || null);
    const [accountID, setAccountID] = useState(location.state?.accountID || null); // this is the userID of the selected account

    return (
        <main className={styles.mainChatLayout}>
            <UserSidebar token={token} currentUserID={currentUserID} setConversationID={setConversationID} setAccountID={setAccountID} />
            {conversationID ?
                (<ChatView token={token} currentUserID={currentUserID} messagedUserID={accountID} conversationID={conversationID} />)
                :
                (<div className={styles.selectContainer}>
                    <div className={styles.iconContainer}>
                        <FontAwesomeIcon icon={faComments} mask={faSquareFull} transform="shrink-3.5"/>
                    </div>
                    <p>Please select a chat <br/>or start a new one 💬</p>
                </div>)
            }
        </main>
    )
}

export default ChatLayout;