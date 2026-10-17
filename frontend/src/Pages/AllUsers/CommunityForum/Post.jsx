import styles from './Post.module.css'
import rewriteAnimationStyles from './Animations/RewriteAnimation.module.css'
import { APIProvider, Map, AdvancedMarker, ColorScheme } from '@vis.gl/react-google-maps'; // google maps
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShop, faWheatAwn, faThumbsUp, faShareFromSquare, faComment, faListUl, faCircle } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TextGeneratingAnimation from './Animations/TextGeneratingAnimation';

function Post({ post: postProp, currentUserID, token }) {

    const [post, setPost] = useState(postProp); // needs to be state so like information can be updated on click

    const [summary, setSummary] = useState("");
    const [summaryLoading, setSummaryLoading] = useState(false);

    const likePost = async () => {
        if (currentUserID !== null) {
            try {
                await axios.post(`http://localhost:8080/forum/posts/${post.postID}/like`, null, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: { currentUserID: currentUserID }
                });
                fetchPost(); // refresh post data after liking
            } catch (error) {
                console.error('Error liking the post:', error);
                alert('Error liking post');
            }
        } else {
            alert('Please sign in to like this post.');
        }
    };

    const removeLike = async () => {
        try {
            if (currentUserID !== null) {
                await axios.delete(`http://localhost:8080/forum/posts/${post.postID}/like`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: { currentUserID: currentUserID }
                });
                fetchPost(); // refresh post data after removing like
            } else {
                alert('Please sign in to like this post');
            }
        } catch (error) {
            console.error('Error unliking post:', error);
            alert('Error unliking post');
        }
    };

    const fetchPost = async () => {
        try {
            let params = {};
            if (currentUserID !== null) {
                params.currentUserID = currentUserID;
            }
            const response = await axios.get(`http://localhost:8080/forum/posts/${post.postID}`, { params });
            setPost(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const navigate = useNavigate();
    const openPost = () => {
        navigate(`/community/post/${post.postID}`); // navigate to that post's page
    }
    const openProfile = () => {
        navigate(`/profile/${post.authorID}`); // navigate to that post's page
    }

    var likeButton = null;
    if (post.likedByCurrentUser) {
        likeButton =
            <button className={`${styles.interactionButton} ${styles.removeLike}`} onClick={() => removeLike()}>
                <FontAwesomeIcon icon={faThumbsUp} />
                <h3>{post.numLikes}</h3>
            </button>
    } else {
        likeButton =
            <button className={`${styles.interactionButton} ${styles.addLike}`} onClick={() => likePost()}>
                <FontAwesomeIcon icon={faThumbsUp} />
                <h3>{post.numLikes}</h3>
            </button>

    }

    const getAccountType = (accountType) => {
        switch (accountType) {
            case 'INDIVIDUAL':
                return (
                    <div className="account-type">
                        <FontAwesomeIcon icon={faUser} />
                        <span className="label"> Individual</span>
                    </div>
                );
            case 'BUSINESS':
                return (
                    <div className="account-type">
                        <FontAwesomeIcon icon={faShop} />
                        <span className="label"> Business</span>
                    </div>
                );
            case 'FOOD_BANK':
                return (
                    <div className="account-type">
                        <FontAwesomeIcon icon={faWheatAwn} />
                        <span className="label"> Food bank</span>
                    </div>
                );
            default:
                return (
                    <div className="account-type">
                        <span className="icon">❓</span>
                        <span className="label">Unknown</span>
                    </div>
                );
        }
    };

    const setPostClassName = (accountType) => {
        switch (accountType) {
            case 'INDIVIDUAL':
                return styles.individual;
            case 'BUSINESS':
                return styles.business;
            case 'FOOD_BANK':
                return styles.foodBank;
            default:
                return styles.individual;
        }
    };


    const generateSummary = async () => {
        try {
            setSummaryLoading(true);
            const response = await axios.post('http://localhost:8080/forum/ai-summary', {
                postBody: post.postBody,
                authorID: post.authorID
            },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setSummary(response.data["post summary"]);
        } catch (error) {
            console.error('Error:', error);
            if (error.response) {
                // error is from the API
                alert("Backend error: " + error.response.data.message);
            } else { // other errors
                alert("An error occurred. See console for more details.");
            }
        }
    }

    return (
        <section className={`${styles.postContainer} ${setPostClassName(post.authorAccountType)}`}>

            <img className={styles.profilePic} src={post.authorProfilePic} onClick={openProfile} />

            <div className={styles.mainContentVertical}>
                <div className={styles.nameDateContianer}>
                    <div>
                        <h1 className={styles.authorName} onClick={openProfile}>{post.authorName}</h1>
                        <h4 className={styles.accountType}>{getAccountType(post.authorAccountType)}</h4>
                    </div>
                    <h2 className={styles.date}>{new Date(post.postDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    })}
                    </h2>
                </div>

                {/* The main post */}
                <p className={styles.postBodyText}>{post.postBody}</p>

                {/* (optional) post image */}
                {post.postImage &&
                    <div className={styles.postImageContainer}><img className={styles.postImage} src={post.postImage}/></div>
                }

                {/* (optional) map display */}
                {(post.eventLatitude !== undefined && post.eventLongitude !== undefined) && (post.eventLatitude !== null && post.eventLongitude !== null) &&
                    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API} onLoad={() => console.log('Initialsing Maps API. This might fail if the API key is missing in frontend/.env')}>
                        <Map
                            className={styles.map}
                            
                            defaultCenter={{ lat: post.eventLatitude, lng: post.eventLongitude }}
                            disableDefaultUI={true}
                            defaultZoom={14.1}
                            colorScheme={ColorScheme.FOLLOW_SYSTEM}
                            mapId={"DEMO_MAP_ID"} >
                            <AdvancedMarker position={{ lat: post.eventLatitude, lng: post.eventLongitude }} />
                        </Map>
                    </APIProvider>
                }

                {/* AI summary */}
                {summaryLoading && (
                    <div className={styles.postSummaryContainer}>
                        <div className={styles.postSummaryTitleContainer}>
                            <FontAwesomeIcon icon={faListUl} /> <h3>AI Summary</h3>
                        </div>

                        {summary.trim().length > 0 ? (<TextGeneratingAnimation text={summary} />)
                            /* show "Working on it" while the summary loads */
                            : (<p className={rewriteAnimationStyles.loading}>Working on it... <FontAwesomeIcon icon={faCircle} /></p>)}
                    </div>)
                }

                <div className={styles.likeShareReply}>
                    <div className={styles.likeShareReplyContainer}>
                        {likeButton}

                        <button className={`${styles.interactionButton} ${styles.share}`}>
                            <FontAwesomeIcon icon={faShareFromSquare} />
                            <h3>Share</h3>
                        </button>

                        <button onClick={openPost} className={`${styles.interactionButton} ${styles.replyButton}`}>
                            <FontAwesomeIcon icon={faComment} />
                            <h3>Reply</h3>
                        </button>
                    </div>

                    <button onClick={generateSummary} className={styles.summariseButton}>
                        <FontAwesomeIcon icon={faListUl} />
                        <h3>Summarise</h3>
                    </button>
                </div>
            </div>
        </section>
    )
}

export default Post