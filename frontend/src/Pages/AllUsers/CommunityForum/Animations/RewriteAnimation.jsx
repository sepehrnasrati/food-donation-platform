import styles from './RewriteAnimation.module.css'
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faCircle } from '@fortawesome/free-solid-svg-icons';
import TextGeneratingAnimation from './TextGeneratingAnimation';

function RewriteAnimation({ token, currentUserID, postBody, onClose, onReplace }) {
    const initialized = useRef(false)

    const [rewrittenText, setRewrittenText] = useState(''); // Response

    const rewritePost = async () => {
        try {
            const response = await axios.post('http://localhost:8080/forum/ai-rewrite', {
                postBody: postBody,
                authorID: currentUserID
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setRewrittenText(response.data["rewritten text"]);
        } catch (error) {
            onClose();
            console.error('Error:', error);
            if (error.response) {
                // error is from the API
                alert("Backend error: " + error.response.data.message);
            } else {
                // other errors
                alert("An error occurred. See console for more details.");
            }
        }
    };

    useEffect(() => {
        if (!initialized.current) { // since the App is wrapped in <StrictMode>, this presents the requests from being sent twice from component renders.
            initialized.current = true

            rewritePost();
        }
    }, [postBody]);

    return (
        <div className={styles.rewriteContainer}>
            <div className={styles.rotatingBackground}></div>
            <div className={styles.contentContainer}>

                {/* show this while the response loads */}
                {(rewrittenText.length === 0) && (
                    <p className={styles.loading}>Working on it... <FontAwesomeIcon icon={faCircle} /></p>)
                }

                <div className={styles.content}>
                    <TextGeneratingAnimation text={rewrittenText} />
                </div>

                <div className={styles.buttonContainer}>
                    <button className={styles.backButton} onClick={onClose}><FontAwesomeIcon icon={faChevronLeft} /> Back</button>
                    <button className={styles.replaceButton} onClick={() => { onReplace(rewrittenText) }}>Replace</button>
                </div>
            </div>
        </div>
    );
}

export default RewriteAnimation