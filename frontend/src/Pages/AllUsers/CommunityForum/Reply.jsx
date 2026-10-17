import replyStyles from './Reply.module.css'
import postStyles from './Post.module.css'
import expandedStyles from './ExpandedPost.module.css'
import { useNavigate } from 'react-router-dom';

function Reply({ reply }) {

    const navigate = useNavigate();
    const openProfile = () => {
        navigate(`/profile/${reply.authorID}`); // navigate to that post's page
    }


    return (
        <div className={replyStyles.replyContainer}>
            <img className={`${expandedStyles.replyProfilePic} ${replyStyles.replyProfilePic}`} src={reply.authorProfilePic} onClick={openProfile} />
            <div className={replyStyles.replyPostNameDateContianer}>
                <div className={replyStyles.replyNameDateContianer}>
                    <h1 className={`${postStyles.authorName} ${replyStyles.replyAuthorName}`} onClick={openProfile} >{reply.authorName}</h1>
                    <h1 className={replyStyles.replyAuthorDateSeperator}>•</h1>
                    <h2 className={`${postStyles.date} ${replyStyles.replyDate}`}>{new Date(reply.replyDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    })}
                    </h2>
                </div>
                <p className={replyStyles.replyText}>{reply.replyBody}</p>
            </div>
        </div>
    )
}

export default Reply