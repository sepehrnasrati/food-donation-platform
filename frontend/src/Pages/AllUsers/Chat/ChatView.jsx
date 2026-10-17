import { useState, useEffect, useRef } from "react";
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import layoutStyles from './ChatLayout.module.css'
import styles from './ChatView.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faUser, faShop, faWheatAwn } from '@fortawesome/free-solid-svg-icons';

function ChatView({ token, currentUserID, messagedUserID, conversationID }) {

    const [client, setClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState([]); // message history
    const [message, setMessage] = useState(''); // message that user types

    const [user, setUser] = useState(null); // user being messaged

    //ref for the chat container (for auto-scroll to the bottom)
    const chatContainerRef = useRef(null);
    useEffect(() => {
        // scroll to the bottom whenever messages change
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const loadPreviousMessages = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/chat/${conversationID}/messages`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setMessages(response.data);
        } catch (error) {
            console.error('Error:', error);
            alert("An error has occurred.");
        }
    }

    // initialise WebSocket client
    useEffect(() => {
        loadPreviousMessages();

        const stompClient = new Client({
            brokerURL: "ws://localhost:8080/fds-websocket", // WebSocket endpoint
            reconnectDelay: 5000, // reconnect attempt 5 seconds if connection drops

            onConnect: () => {
                fetchUserInfo();

                console.log("\nConnected to WebSocket");
                setConnected(true);

                // subscribe to the chat conversation between users
                stompClient.subscribe(`/topic/chat/${conversationID}`, (message) => {
                    const messageBody = JSON.parse(message.body); // this will be either a messageDTO body or an error body

                    if (messageBody.error) {
                        alert(messageBody.error);
                    } else if (messageBody.content) {
                        setMessages((prev) => [...prev, messageBody]);
                    } else {
                        alert("An error has occurred.");
                    }
                });
            },

            onDisconnect: () => {
                console.log("Disconnected from WebSocket");
                setConnected(false);
            },

            onStompError: (frame) => {
                alert("An error has occurred. Please see console.")
                console.error("STOMP Error:", frame);
            },
        });

        stompClient.activate();
        setClient(stompClient);

        return () => stompClient.deactivate(); // deactivates on unmount
    }, [conversationID]);

    const fetchUserInfo = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/users/${messagedUserID}`);
            setUser(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const sendMessage = () => {
        if (client && client.connected && message.trim()) {
            // this is the MessageDTO object to send
            const messageDTO = {
                conversationID: conversationID,
                senderID: currentUserID,
                content: message.trim()
            };

            // send message to the WebSocket server
            client.publish({
                destination: `/app/chat/${conversationID}/send`,
                body: JSON.stringify(messageDTO)
            });

            setMessage("");
        }
    };

    const getAccountType = (accountType) => {
        switch (accountType) {
            case 'INDIVIDUAL':
                return (
                    <div className={`${styles.accountType} ${styles.individual}`}>
                        <FontAwesomeIcon icon={faUser} /> Individual
                    </div>
                );
            case 'BUSINESS':
                return (
                    <div className={`${styles.accountType} ${styles.business}`}>
                        <FontAwesomeIcon icon={faShop} /> Business
                    </div>
                );
            case 'FOOD_BANK':
                return (
                    <div className={`${styles.accountType} ${styles.foodBank}`}>
                        <FontAwesomeIcon icon={faWheatAwn} /> Food bank
                    </div>
                );
            default:
                return (
                    <div className="account-type">
                        ❓Unknown
                    </div>
                );
        }
    };

    const navigate = useNavigate();
    const openProfile = () => {
        navigate(`/profile/${user.userID}`); // navigate to that post's page
    }

    return (
        <div className={layoutStyles.chatViewContainer}>

            <div className={styles.userInfoContainer}>
                <div className={styles.infoConatiner}>
                    <img className={styles.profilePic} src={user && user.profilePic} />
                    <div>
                        <h1 className={styles.name}>{user ? user.name : "Loading..."}</h1>
                        <div className={styles.tag}>{user && getAccountType(user.accountType)}</div>
                    </div>
                </div>
                <button onClick={openProfile} className={styles.viewProfileButton}>View Profile</button>
            </div>

            <div ref={chatContainerRef} className={styles.messagesContainer}>
                {messages.map((msg) => (
                    msg.senderID === currentUserID ? (
                        <div key={msg.messageID} className={`${styles.message} ${styles.sent}`}
                            style={{
                                marginTop: messages[0].messageID === msg.messageID ? "40px" : "15px"
                            }}>
                            {msg.content}</div>
                    ) : (
                        <div key={msg.messageID} className={`${styles.message} ${styles.received}`}
                            style={{
                                marginTop: messages[0].messageID === msg.messageID ? "40px" : "15px"
                            }}>
                            {msg.content}</div>
                    )
                ))}
            </div>

            <div className=''>
                <form onSubmit={sendMessage} className={styles.inputContainer}>
                    <label>
                        <input
                            type="text"
                            placeholder="Enter your message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                        />
                    </label>
                    <button
                        type="submit"
                        onClick={sendMessage}
                        disabled={!connected || !message.trim()}
                        style={{
                            padding: "10px",
                            backgroundColor: message.length > 0 ? "#3b80ff" : "white",
                            color: message.length > 0 ? "white" : "black",
                            border: "none",
                            cursor: message.length > 0 ? "pointer" : "not-allowed"
                        }}>
                        <FontAwesomeIcon icon={faArrowUp} />
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ChatView;