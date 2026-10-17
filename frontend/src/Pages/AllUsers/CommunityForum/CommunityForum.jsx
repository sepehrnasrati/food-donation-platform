import communityStyles from './CommunityForum.module.css'
import imageUploadStyles from './ImageUpload.module.css'
import Post from './Post.jsx'
import RewriteAnimation from './Animations/RewriteAnimation.jsx';
import ImageGeneratingModal from './Animations/ImageGenerationModal.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faCommentDots, faPaperPlane, faWandMagicSparkles, faDesktop, faChevronLeft, faSquareFull, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { APIProvider, Map, AdvancedMarker, ColorScheme } from '@vis.gl/react-google-maps'; // google maps

function CommunityForum({ currentUserID, token }) {

    const [classNameVal, setClassNameVal] = useState(null);

    const [postText, setPostText] = useState('');

    const [postImage, setPostImage] = useState(null); // image file that can be attached with post
    const imageInputRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [posts, setPosts] = useState([]);
    
    const [sortParam, setSortParam] = useState("latest");
    const [recentButtonClassName, setRecentButtonClassName] = useState(communityStyles.recentButtonActive);
    const [popularButtonClassName, setPopularButtonClassName] = useState(communityStyles.popularButtonInactive);

    const [rewriteComponentVisible, setRewriteComponentVisible] = useState(false);
    const [imageUploadVisible, setimageUploadVisible] = useState(false);
    const [imageGenerationVisible, setImageGenerationVisible] = useState(false);

    const [locationInputVisible, setLocationInputVisible] = useState(false);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    // check if latitude and longitude are within valid range
    const isValidLocation =
        !isNaN(lat) && lat >= -90 && lat <= 90 &&
        !isNaN(lng) && lng >= -180 && lng <= 180;


    useEffect(() => {
        fetchPosts();
    }, []);

    // fetch posts whenever the sortParam changes
    useEffect(() => {
        fetchPosts(sortParam);
        if (sortParam === "likes") {
            setRecentButtonClassName(communityStyles.recentButtonInactive);
            setPopularButtonClassName(communityStyles.popularButtonActive);
        } else {
            setPopularButtonClassName(communityStyles.popularButtonInactive);
            setRecentButtonClassName(communityStyles.recentButtonActive);
        }
    }, [sortParam]);

    useEffect(() => {
        if (currentUserID === null) {
            setClassNameVal(`${communityStyles.signedOutView} ${communityStyles.communityMain}`); // This className will set the width of the main to 100% since there will be no sidebars
        } else {
            setClassNameVal(communityStyles.communityMain)
        }
    }, []);

    const fetchPosts = async () => {
        // Example: http://localhost:8080/forum/posts?sort=latest&currentUserID=2
        try {
            const params = {
                sort: sortParam,
            };

            if (currentUserID !== null) {
                params.currentUserID = currentUserID;
            }
            const response = await axios.get('http://localhost:8080/forum/posts', { params });
            setPosts(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const submitPost = async (e) => {
        if (postText.trim().length > 0) {
            e.preventDefault();
            try {
                if (currentUserID !== null) {

                    const formData = new FormData();
                    formData.append('postBody', postText);
                    formData.append('authorID', currentUserID);
                    formData.append('image', postImage);
                    if (isValidLocation) {
                        formData.append('eventLatitude', lat);
                        formData.append('eventLongitude', lng);
                    }

                    await axios.post('http://localhost:8080/forum/posts', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${token}`
                        },
                    });
                    setPostText('');
                    setPostImage(null);
                    setImagePreview(null);
                    setLatitude('');
                    setLatitude('');
                    fetchPosts();
                } else {
                    alert("Please sign in to create your post.")
                }
            } catch (error) {
                console.error('Error response:', error);
                if (error.response.data && error.response.data.message) {
                    // error is from the API
                    alert("Backend error: " + error.response.data.message);
                } else {
                    // other errors
                    alert("An error occurred. See console for more details.");
                }
            }
        } else {
            alert("Your post is too short.")
        }
    }


    const heightRef = useRef(null);
    const [height, setHeight] = useState(0);
    // the post draft container's height is dynamic and changes whenever image changes or location updates
    // height of other components (e.g. image upload, rewrite) depends on the container's height
    useEffect(() => {
        if (heightRef.current) {
            setHeight(heightRef.current.offsetHeight);
        }
    }, [postImage, isValidLocation, locationInputVisible, imagePreview]);

    const openRewriteComponent = () => {
        if (currentUserID !== null) {
            if (postText.trim().length > 20) {
                setRewriteComponentVisible(true);
            } else {
                alert("Your post is too short.");
            }
        } else {
            alert("Please sign in to use this feature.");
        }
    }

    const replacePostText = (newText) => {
        setPostText(newText); // This will replace the postText with the new rewritten text
        setRewriteComponentVisible(false); // Hide the RewriteAnimation component after replacing
    };


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPostImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
    useEffect(() => {
        setimageUploadVisible(false);
    }, [imagePreview]);

    // clean up URL when the component closes or a new image is selected
    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const validateImageGeneration = () => {
        if (currentUserID !== null) {
            if (postText.trim().length > 20) {
                setImageGenerationVisible(true);
            } else {
                alert("Your post is too short.");
            }
        } else {
            alert("Please sign in to use this feature.");
        }
    };

    // image upload or generate buttons
    const imageUploadOptionsContainer =
        <div style={{ height: `${height}px`, zIndex: '3' }} className={imageUploadStyles.container}>
            <div>
                {/* image upload button */}
                <div onClick={() => imageInputRef.current.click()} className={imageUploadStyles.uploadButton}>
                    <div className={imageUploadStyles.uploadIconContainer}><FontAwesomeIcon icon={faDesktop} mask={faSquareFull} transform="shrink-3.5" /></div>
                    <div className={imageUploadStyles.uploadTextContainer}>
                        <h1>Upload</h1>
                        <p>Upload an image from your computer.</p>
                    </div>
                </div>
                {/* hidden file input */}
                <input
                    ref={imageInputRef}
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                />

                <div className={imageUploadStyles.line}></div>

                {/* image generation button */}
                <div onClick={validateImageGeneration} className={imageUploadStyles.generateButton}>
                    <div className={imageUploadStyles.generateIconContainer}><FontAwesomeIcon icon={faWandMagicSparkles} mask={faSquareFull} transform="shrink-3.5" /></div>
                    <div className={imageUploadStyles.generateTextContainer}>
                        <h1>Generate</h1>
                        <p>Generate an image using AI for this post.</p>
                    </div>
                </div>
            </div>

            <button className={imageUploadStyles.backButton} onClick={() => setimageUploadVisible(false)}><FontAwesomeIcon icon={faChevronLeft} /> Back</button>
        </div>


    // event location coordinates input
    const locationInputForm =
        <div className={communityStyles.locationInputContainer}>
            <h4 className={communityStyles.locationInputTitle}>Enter location coordinates:</h4>

            <label className={communityStyles.locationInputLabel}>Latitude: </label>
            <input
                className={communityStyles.locationInput}
                type="number"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="Enter value"
                required
            />

            <label className={communityStyles.locationInputLabel}>Longitude: </label>
            <input
                className={communityStyles.locationInput}
                type="number"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="Enter value"
                required
            />
        </div>

    return (
        <main className={classNameVal}> {/*  before module.css:    className={${classNameVal} communityClassNameVal}> */}
            <div className={communityStyles.communityForumContainer}>
                <h1 className={communityStyles.generalCommunityTitle}>Community Forum <FontAwesomeIcon icon={faCommentDots} /></h1>

                <div style={{ height: `${height}px` }} className={communityStyles.draftingLayersContainer}>
                    <div ref={heightRef} style={{ zIndex: '0' }} className={communityStyles.postDraftContainer}>

                        <div className={communityStyles.textfieldContainer}>
                            <img className={communityStyles.profilePic} src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" />
                            <textarea
                                className={communityStyles.textfield}
                                placeholder="Share your thoughts, connect with the community..."
                                value={postText}
                                onChange={(event) => setPostText(event.target.value)}
                            />
                        </div>

                        {locationInputVisible &&
                            locationInputForm
                        }

                        {isValidLocation && (
                            <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API}>
                                <Map
                                    className={communityStyles.map}
                                    center={{ lat: lat, lng: lng }}
                                    disableDefaultUI={true}
                                    defaultZoom={13}
                                    colorScheme={ColorScheme.FOLLOW_SYSTEM}
                                    mapId={"DEMO_MAP_ID"} >
                                    <AdvancedMarker position={{ lat: lat, lng: lng }} />
                                </Map>
                            </APIProvider>)
                        }

                        {imagePreview && ( // preview of selected image
                            <img className={communityStyles.imagePreview} src={imagePreview} />)
                        }

                        <div className={communityStyles.postButtons}>
                            <div className={communityStyles.postWritingButtonsContainer}> {/* buttons for uploading image / generating image with AI */}

                                <button onClick={() => setimageUploadVisible(true)} className={communityStyles.imageButton}>
                                    <FontAwesomeIcon icon={faImage} /> Image
                                </button>

                                <button className={communityStyles.locationButton} onClick={() => setLocationInputVisible(prev => !prev)}>
                                    <FontAwesomeIcon icon={faLocationDot} /> Location
                                </button>

                                <button className={communityStyles.AIRewrite} onClick={openRewriteComponent}>
                                    <FontAwesomeIcon icon={faWandMagicSparkles} /> Rewrite AI
                                </button>
                            </div>

                            <button className={communityStyles.postButton} onClick={submitPost}>Post <FontAwesomeIcon icon={faPaperPlane} /></button>
                        </div>
                    </div>

                    {/* rewrite animation */}
                    {rewriteComponentVisible &&
                        <RewriteAnimation style={{ height: `${height}px` }} token={token} currentUserID={currentUserID} postBody={postText} onClose={() => setRewriteComponentVisible(false)} onReplace={replacePostText} />}

                    {/* image uploading and generating buttons container */}
                    {imageUploadVisible &&
                        imageUploadOptionsContainer}

                </div>

                <div className={communityStyles.optionsContainer}>
                    <button className={recentButtonClassName} onClick={() => setSortParam("latest")} >Recent</button>
                    <button className={popularButtonClassName} onClick={() => setSortParam("likes")} >Popular</button>
                </div>

                {posts.map((post) => (
                    <Post
                        key={post.postID}
                        post={post}
                        token={token}
                        currentUserID={currentUserID}
                    />
                ))}
            </div>

            {imageGenerationVisible &&
                <ImageGeneratingModal
                    token={token}
                    currentUserID={currentUserID}
                    postText={postText}
                    setImageGenerationVisible={setImageGenerationVisible}
                    setPostImage={setPostImage}
                    setImagePreview={setImagePreview}
                />
            }
        </main>
    )
}

export default CommunityForum