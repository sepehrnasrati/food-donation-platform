import styles from './ImageGenerationModal.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function ImageGenerating({ token, postText, currentUserID, setImageGenerationVisible, setPostImage, setImagePreview }) {

    const initialized = useRef(false)

    const [loading, setLoading] = useState(true);

    const [imagePreviewURL, setImagePreviewURL] = useState('');

    const generatePostImage = async () => {
        try {
            const response = await axios.post('http://localhost:8080/forum/ai-image', {
                postBody: postText,
                authorID: currentUserID
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                responseType: 'blob' // ensures binary data is returned
            });

            setPostImage(response.data);
            setLoading(false);
            setImagePreviewURL(URL.createObjectURL(response.data));

        } catch (error) {
            setImageGenerationVisible(false);
            console.error('Error response:', error);
            if (error.response.data && error.response.data.message) {
                // error is from the API
                alert("Backend error: " + error.response.data.message);
            } else {
                // other errors
                alert("An error occurred while generating your image. This could be due to an invalid auth token in the backend.");
            }
        }
    }

    useEffect(() => {
        if (!initialized.current) { // since the App is wrapped in <StrictMode>, this presents the requests from being sent twice from component renders.
            initialized.current = true

            generatePostImage();
        }
    }, [postText]);

    return (
        <div className={styles.popupContainer}>
            <div className={styles.imageGenerationContainer}>
                <div className={styles.header}>
                    <button onClick={() => setImageGenerationVisible(false)} className={styles.close}><FontAwesomeIcon icon={faXmark} /></button>
                    <h1 className={styles.heading}><FontAwesomeIcon icon={faWandMagicSparkles} /> Generate Image</h1>
                    <div></div> {/* empty div for flexbox */}
                </div>

                {/* generating animation */}
                {loading &&
                <>
                    <div className={styles.loadingContainer}>
                        <div className={styles.blur}></div>
                        <p className={styles.loadingText}>Your image is being generated, this can take up to 60 seconds.</p>
                    </div>
                    <div></div> {/* empty div for flexbox */}
                </>
                }

                {/* container for the generated image */}
                {!loading &&
                    <>
                        <div className={styles.imageContainer}>
                            <div className={styles.blurBorder}></div>
                            <img className={styles.image} src={imagePreviewURL}></img>
                        </div>

                        <button onClick={() => { setImagePreview(imagePreviewURL); setImageGenerationVisible(false); }} className={styles.replaceButton}>Replace</button>
                    </>
                }
            </div>
        </div>
    );
}

export default ImageGenerating