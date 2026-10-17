// frontend/src/Pages/AllUsers/Leaderboard/SocialShareButtons.jsx
import { useState } from 'react';
import {
  FaShare,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaWhatsApp,
  FaEnvelope,
  FaTimes,
  FaCopy,
  FaTrophy
} from 'react-icons/fa';

const SocialShareButtons = ({ userRank, userName, onShare }) => {
  const [showShareButtons, setShowShareButtons] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  // URL and title for sharing
  const getShareUrl = () => {
    return window.location.href;
  };
  
  const getShareTitle = () => {
    if (!userRank) return "Check out our food donation leaderboard!";
    return `${userName ? userName : 'We\'re'} ranked #${userRank} on the food donation leaderboard! 🏆`;
  };

  // Social media sharing functions with confetti
  const handleShare = (shareFunction) => {
    if (onShare) onShare();
    shareFunction();
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareTitle())}&url=${encodeURIComponent(getShareUrl())}`;
    window.open(url, '_blank');
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}&quote=${encodeURIComponent(getShareTitle())}`;
    window.open(url, '_blank');
  };

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(getShareUrl())}&title=${encodeURIComponent(getShareTitle())}`;
    window.open(url, '_blank');
  };

  const shareToWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${getShareTitle()} ${getShareUrl()}`)}`;
    window.open(url, '_blank');
  };

  const shareByEmail = () => {
    const url = `mailto:?subject=${encodeURIComponent(getShareTitle())}&body=${encodeURIComponent(`${getShareTitle()}\n\nCheck it out: ${getShareUrl()}`)}`;
    window.location.href = url;
  };
  
  const copyToClipboard = () => {
    const textToCopy = `${getShareTitle()}\n\n${getShareUrl()}`;
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
        if (onShare) onShare();
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        setCopySuccess('Failed to copy');
      });
  };

  return (
    <div className="social-share-wrapper">
      {userRank && (
        <div className="user-rank-container">
          <div className="user-rank">
            <FaTrophy className="trophy-icon-small" />
            {userName ? `${userName}'s` : 'Your'} current rank: 
            <span className="rank-number">#{userRank}</span>
          </div>
          <button 
            className="share-rank-btn" 
            onClick={() => {
              setShowShareButtons(!showShareButtons);
              if (!showShareButtons && onShare) onShare();
            }}
          >
            {showShareButtons ? <FaTimes /> : <FaShare />} 
            {showShareButtons ? 'Close' : 'Share Your Ranking'}
          </button>
          
          {showShareButtons && (
            <div className="social-share-buttons">
              <button onClick={() => handleShare(shareToTwitter)} className="share-twitter">
                <FaTwitter /> Twitter
              </button>
              <button onClick={() => handleShare(shareToFacebook)} className="share-facebook">
                <FaFacebook /> Facebook
              </button>
              <button onClick={() => handleShare(shareToLinkedIn)} className="share-linkedin">
                <FaLinkedin /> LinkedIn
              </button>
              <button onClick={() => handleShare(shareToWhatsApp)} className="share-whatsapp">
                <FaWhatsApp /> WhatsApp
              </button>
              <button onClick={() => handleShare(shareByEmail)} className="share-email">
                <FaEnvelope /> Email
              </button>
              <button onClick={copyToClipboard} className="share-copy">
                <FaCopy /> {copySuccess || 'Copy Link'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SocialShareButtons;