import communityStyles from './CommunityForum.module.css'
import expandedStyles from './ExpandedPost.module.css'
import Post from './Post.jsx'
import Reply from './Reply.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';

// View for single post with comments
function ExpandedPost({ currentUserID, token }) {

    const { postID } = useParams(); // get the postID from path
    const [post, setPost] = useState(null);

    const [replyText, setReplyText] = useState('');
    const [replies, setReplies] = useState([]);

    const [classNameVal, setClassNameVal] = useState(null);
    useEffect(() => {
        if (currentUserID === null) {
            setClassNameVal(`${communityStyles.signedOutView} ${communityStyles.communityMain}`); // This className will set the width of the main to 100% since there will be no sidebars
        } else {
            setClassNameVal(communityStyles.communityMain);
        }
    }, [])

    const fetchPost = async () => {
        try {
            let params = {};
            if (currentUserID !== null) {
                params.currentUserID = currentUserID;
            }
            const response = await axios.get(`http://localhost:8080/forum/posts/${postID}`, { params });
            setPost(response.data);

            fetchReplies();
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const fetchReplies = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/forum/posts/${postID}/replies`);
            setReplies(response.data);
        } catch (error) {
            console.error('Error fetching replies:', error);
        }
    }

    const postReply = async () => {
        if (replyText.trim().length > 0) {
            try {
                if (currentUserID !== null) {
                    await axios.post(`http://localhost:8080/forum/posts/${postID}/replies`, {
                        authorID: currentUserID,
                        replyBody: replyText,
                    }, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    fetchReplies(); //  fetch replies again after posting
                } else {
                    alert('Please sign in to reply to this post');
                }
            } catch (error) {
                console.error('Error posting reply:', error);
                alert('Error submitting reply');
            }
        } else {
            alert("Your reply cannot be empty")
        }
    }

    useEffect(() => {
        fetchPost();
    }, [])

    const updateReplyText = (event) => {
        setReplyText(event.target.value);
    };

    return (
        <main className={classNameVal}>
            {post ? ( // If post exists, show it
                <div className={expandedStyles.fullPostContainer}>

                    <h1 className={communityStyles.generalCommunityTitle}>Post <FontAwesomeIcon icon={faComments} /></h1>

                    <Post post={post} currentUserID={currentUserID} token={token} />

                    <section className={expandedStyles.writeReplyContainer}>
                        <img className={expandedStyles.replyProfilePic} src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" />
                        <div className={expandedStyles.writeReply}>
                            <textarea
                                className={expandedStyles.postReplyTextfield}
                                placeholder="Post your reply to keep the discussion going..."
                                value={replyText} // Bind the value to the state
                                onChange={updateReplyText} // Update state when the text changes
                            />
                            <button onClick={postReply} className={expandedStyles.postReplyButton}><FontAwesomeIcon icon={faPaperPlane} /></button>
                        </div>
                    </section>

                    {
                        replies.length === 0 ? // This div is rendered if there are no replies.
                            <div className={expandedStyles.noRepliesContainer}>
                                <img className={expandedStyles.noRepliesImage} src="https://cdn3d.iconscout.com/3d/premium/thumb/no-message-3d-icon-download-in-png-blend-fbx-gltf-file-formats--chat-bubble-communication-comment-slash-user-interface-pack-icons-4652963.png"></img>
                                <p className={expandedStyles.noRepliesMessage}>No replies yet</p>
                            </div>
                            :
                            <section className={expandedStyles.postRepliesSection}>
                                {replies.map((reply) => (
                                    <Reply
                                        key={reply.replyID}
                                        reply={reply}
                                    />
                                ))}
                            </section>
                    }
                </div>
                // post ? () : show this error
            ) : <h1>This post does not exist</h1>}

        </main>
    )
}

export default ExpandedPost