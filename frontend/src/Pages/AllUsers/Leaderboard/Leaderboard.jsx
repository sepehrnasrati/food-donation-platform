import './Leaderboard.css';
import { useEffect, useState, useRef } from 'react';
import { 
  FaTrophy, 
  FaChartLine, 
  FaDonate, 
  FaWifi, 
  FaExclamationTriangle, 
  FaCalendarWeek,
  FaCalendarAlt,
  FaCalendarDay,
  FaArrowUp,
  FaArrowDown,
  FaMedal,
  FaHeart,
  FaThumbsUp,
  FaEdit,
  FaTrash,
  FaPaperPlane,
  FaShare,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaWhatsapp,
  FaEnvelope,
  FaTimes,
  FaCopy
} from 'react-icons/fa';
import axios from 'axios';
import { Client } from '@stomp/stompjs';
import confetti from 'canvas-confetti';

function Leaderboard({ currentUserID, token }) {
  const [classNameVal, setClassNameVal] = useState(null);
  const [activePeriod, setActivePeriod] = useState('year');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalDonations, setTotalDonations] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [newEntry, setNewEntry] = useState(null);
  const [businessOnly, setBusinessOnly] = useState(true);
  const [userRank, setUserRank] = useState(null);
  const [showShareButtons, setShowShareButtons] = useState(false);
  const [userName, setUserName] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  
  // Comments state
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState(null);
  
  // Connection states
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  
  // References for WebSocket
  const stompClient = useRef(null);
  const headerRef = useRef(null);
  const commentSectionRef = useRef(null);

  useEffect(() => {
    if (currentUserID === null) {
      setClassNameVal("signedOutView");
    } else {
      setClassNameVal("leaderboard-main");
      // If user is logged in, get their rank
      fetchUserRank();
    }
  }, [currentUserID, activePeriod, businessOnly]);

  // Calculate totals in a separate effect
  useEffect(() => {
    if (Array.isArray(leaderboardData) && leaderboardData.length > 0) {
      const donationsSum = leaderboardData.reduce(
        (sum, item) => sum + (Number(item.donations) || 0), 
        0
      );
      setTotalDonations(donationsSum);
      
      const amountSum = leaderboardData.reduce(
        (sum, item) => sum + (Number(item.amount) || 0), 
        0
      );
      setTotalAmount(amountSum);
      
      // Get user name from leaderboard data if user is logged in
      if (currentUserID) {
        const userData = leaderboardData.find(entry => entry.id === currentUserID);
        if (userData) {
          setUserName(userData.donorName);
        }
      }
    } else {
      setTotalDonations(0);
      setTotalAmount(0);
    }
  }, [leaderboardData, currentUserID]);

  // Function to handle real-time updates
  const handleLeaderboardUpdate = (update) => {
    // Trigger confetti animation
    triggerConfetti();
    
    setLeaderboardData(prevData => {
      // Create a deep copy of the existing data
      const updatedData = [...prevData];
      
      // Find if the donor already exists in the leaderboard
      const existingDonorIndex = updatedData.findIndex(
        entry => entry.id === update.donorId
      );
      
      if (existingDonorIndex >= 0) {
        // Save for highlighting
        setNewEntry(update.donorId);
        
        // Update existing donor's data
        updatedData[existingDonorIndex] = {
          ...updatedData[existingDonorIndex],
          donations: (updatedData[existingDonorIndex].donations || 0) + (update.donations || 1),
          amount: (updatedData[existingDonorIndex].amount || 0) + (update.amount || 0)
        };
      } else {
        // Add new donor to leaderboard
        setNewEntry(update.donorId);
        
        updatedData.push({
          id: update.donorId,
          donorName: update.donorName,
          donations: update.donations || 1,
          amount: update.amount || 0
        });
      }
      
      // Sort the updated data by amount (descending)
      return updatedData.sort((a, b) => (b.amount || 0) - (a.amount || 0));
    });
    
    // Update totals
    setTotalDonations(prev => prev + (update.donations || 1));
    setTotalAmount(prev => prev + (update.amount || 0));
  };

  // Clear new entry highlight after 3 seconds
  useEffect(() => {
    if (newEntry) {
      const timer = setTimeout(() => {
        setNewEntry(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [newEntry]);

  // Trigger confetti animation
  const triggerConfetti = (origin = {}) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: origin.y ? origin : { y: 0.6 },
      colors: ['#FFA500', '#4CAF50', '#2196F3'],
      disableForReducedMotion: true
    });
  };

  // Specific confetti for when sharing
  const triggerShareConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1da1f2', '#1877f2', '#0077b5', '#25d366', '#ea4335'],
      disableForReducedMotion: true
    });
  };

  // Set up WebSocket connection
  useEffect(() => {
    // Skip if not logged in
    if (!currentUserID) {
      return;
    }
    
    // Connect to WebSocket with improved reconnection logic
    const client = new Client({
      brokerURL: "ws://localhost:8080/fds-websocket",
      reconnectDelay: 1000,
      
      onConnect: () => {
        console.log("Connected to leaderboard WebSocket");
        setConnectionStatus('connected');
        
        // Subscribe to leaderboard updates
        client.subscribe('/topic/leaderboard', (message) => {
          try {
            const update = JSON.parse(message.body);
            console.log("Received real-time leaderboard update:", update);
            
            // Update leaderboard data if relevant to current period or if "all"
            if (update.period === activePeriod || update.period === "all") {
              handleLeaderboardUpdate(update);
            }
          } catch (error) {
            console.error("Error processing WebSocket message:", error);
          }
        });
      },
      
      onDisconnect: () => {
        console.log("Disconnected from WebSocket");
        setConnectionStatus('disconnected');
      },
      
      onStompError: (frame) => {
        console.error('WebSocket error:', frame);
        setConnectionStatus('error');
      }
    });
    
    client.activate();
    stompClient.current = client;
    
    // Cleanup on unmount
    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [currentUserID, activePeriod]);

  // Fetch leaderboard data
  const fetchLeaderboardData = async () => {
    setLoading(true);
    try {
      console.log("Fetching leaderboard data for period:", activePeriod);
      
      let url = `http://localhost:8080/api/leaderboard/${activePeriod}`;
      if (businessOnly) {
        url = `http://localhost:8080/api/leaderboard/business-only/${activePeriod}`;
      }
      
      const response = await axios.get(url);
      
      console.log("API response data:", response.data);
      
      // Ensure we're setting an array
      setLeaderboardData(Array.isArray(response.data) ? response.data : []);
      setError(null);
      
      // After updating leaderboard data, update user rank if logged in
      if (currentUserID) {
        fetchUserRank();
      }
    } catch (err) {
      console.error('Error fetching leaderboard data:', err);
      
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        console.error('Response headers:', err.response.headers);
        
        if (err.response.status === 403) {
          setError('Access denied. This data might require you to be logged in.');
        } else {
          setError(`Server error: ${err.response.status}`);
        }
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('No response from server. Please check if the backend is running.');
      } else {
        console.error('Error setting up request:', err.message);
        setError(`Error: ${err.message}`);
      }
      
      setLeaderboardData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user rank
  const fetchUserRank = async () => {
    if (!currentUserID) return;
    
    try {
      const response = await axios.get(
        `http://localhost:8080/api/leaderboard/rank/${currentUserID}/${activePeriod}`,
        {
          params: { businessOnly },
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      setUserRank(response.data);
      
      // Get user name from leaderboard data
      const userData = leaderboardData.find(entry => entry.id === currentUserID);
      if (userData) {
        setUserName(userData.donorName);
      }
    } catch (err) {
      console.error('Error fetching user rank:', err);
      setUserRank(null);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchLeaderboardData();
    fetchComments();
  }, [activePeriod, businessOnly]);

  // Comments functions
  const fetchComments = async () => {
    setCommentsLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/leaderboard/comments', {
        params: { currentUserId: currentUserID },
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      setComments(response.data);
      setCommentsError(null);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setCommentsError('Failed to load comments. Please try again later.');
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    if (!currentUserID) {
      alert('Please log in to post a comment');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8080/api/leaderboard/comments',
        { content: newComment },
        {
          params: { userId: currentUserID },
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      setComments([response.data, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Failed to post comment. Please try again.');
    }
  };

  const handleEditComment = async (id) => {
    if (!editText.trim()) return;

    try {
      const response = await axios.put(
        `http://localhost:8080/api/leaderboard/comments/${id}`,
        { content: editText },
        {
          params: { userId: currentUserID },
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      setComments(comments.map(comment => 
        comment.id === id ? response.data : comment
      ));
      setEditingComment(null);
      setEditText('');
    } catch (err) {
      console.error('Error updating comment:', err);
      alert('Failed to update comment. Please try again.');
    }
  };

  const handleDeleteComment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await axios.delete(`http://localhost:8080/api/leaderboard/comments/${id}`, {
        params: { userId: currentUserID },
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setComments(comments.filter(comment => comment.id !== id));
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert('Failed to delete comment. Please try again.');
    }
  };

  const handleLikeComment = async (id, isLiked) => {
    if (!currentUserID) {
      alert('Please log in to like comments');
      return;
    }

    try {
      const url = `http://localhost:8080/api/leaderboard/comments/${id}/like`;
      const method = isLiked ? 'delete' : 'post';
      
      const response = await axios({
        method,
        url,
        params: { userId: currentUserID },
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setComments(comments.map(comment => 
        comment.id === id ? response.data : comment
      ));
    } catch (err) {
      console.error('Error liking/unliking comment:', err);
      alert('Failed to update like. Please try again.');
    }
  };

  // Get medal badge for top positions
  const getMedalBadge = (position) => {
    if (position === 0) {
      return <div className="medal-badge gold"><FaMedal className="medal-icon" /><span>1st</span></div>;
    } else if (position === 1) {
      return <div className="medal-badge silver"><FaMedal className="medal-icon" /><span>2nd</span></div>;
    } else if (position === 2) {
      return <div className="medal-badge bronze"><FaMedal className="medal-icon" /><span>3rd</span></div>;
    }
    return <div className="position-badge">{position + 1}</div>;
  };

  // Calculate the percentage for progress bars
  const calculatePercentage = (amount) => {
    if (!leaderboardData.length) return 0;
    const maxAmount = leaderboardData[0].amount || 0;
    if (maxAmount === 0) return 0;
    return (amount / maxAmount) * 100;
  };

  // Format date for comments
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Social Media Sharing
  const getShareUrl = () => {
    return window.location.href;
  };
  
  const getShareTitle = () => {
    if (!userRank) return "Check out our food donation leaderboard!";
    return `${userName ? userName + " is" : "We're"} ranked #${userRank} on the food donation leaderboard! 🏆`;
  };

  const handleShare = (shareFunction) => {
    triggerShareConfetti();
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
        triggerShareConfetti();
        setTimeout(() => setCopySuccess(''), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        setCopySuccess('Failed to copy');
      });
  };

  // Render the connection status indicator
  const renderConnectionStatus = () => {
    if (!currentUserID) return null;
    
    let icon = null;
    let statusText = "";
    let statusClass = "";
    
    if (connectionStatus === 'connected') {
      icon = <FaWifi className="connection-icon connected" />;
      statusText = "Live Updates";
      statusClass = "connection-status-connected";
    } else if (connectionStatus === 'connecting') {
      icon = <FaWifi className="connection-icon connecting" />;
      statusText = "Connecting...";
      statusClass = "connection-status-connecting";
    } else {
      icon = <FaExclamationTriangle className="connection-icon error" />;
      statusText = "Connection issue";
      statusClass = "connection-status-error";
    }
    
    return (
      <div className={`connection-status ${statusClass}`}>
        {icon}
        <span>{statusText}</span>
      </div>
    );
  };

  // Get period icon
  const getPeriodIcon = (period) => {
    switch(period) {
      case 'week':
        return <FaCalendarDay />;
      case 'month':
        return <FaCalendarWeek />;
      case 'year':
        return <FaCalendarAlt />;
      default:
        return <FaCalendarAlt />;
    }
  };

  return (
    <main className={classNameVal}>
      <div className="leaderboard-container">
        <header ref={headerRef} className="leaderboard-header">
          <div className="header-content">
            <div className="header-top">
              <div className="header-title-group">
                <div className="trophy-icon-container">
                  <FaTrophy className="trophy-icon" />
                </div>
                <h1>Community Impact Leaders</h1>
              </div>
              {renderConnectionStatus()}
            </div>
            <p className="header-description">
              Honoring the exceptional donors making a difference in our community.
              <span className="header-highlight">Every donation counts!</span>
            </p>
            
            {/* Enhanced social media sharing for users with ranking */}
            {currentUserID && userRank && (
              <div className="social-share-wrapper">
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
                      if (!showShareButtons) triggerShareConfetti();
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
                        <FaWhatsapp /> WhatsApp
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
              </div>
            )}
          </div>
        </header>

        <div className="leaderboard-card">
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-icon-container">
                <FaChartLine className="stat-icon" />
              </div>
              <div className="stat-content">
                <h3>Total Donations</h3>
                <p className="stat-value">{loading ? 'Loading...' : totalDonations}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-container">
                <FaDonate className="stat-icon" />
              </div>
              <div className="stat-content">
                <h3>Total Amount</h3>
                <p className="stat-value">{loading ? 'Loading...' : `${totalAmount.toFixed(1)} kg`}</p>
              </div>
            </div>
          </div>

          <div className="filter-section">
            <h2>Time Period</h2>
            <div className="filter-buttons">
              {[
                { id: 'week', label: 'This Week' },
                { id: 'month', label: 'This Month' },
                { id: 'year', label: 'This Year' }
              ].map((period) => (
                <button
                  key={period.id}
                  className={`filter-btn ${activePeriod === period.id ? 'active' : ''}`}
                  onClick={() => setActivePeriod(period.id)}
                >
                  {getPeriodIcon(period.id)}
                  <span>{period.label}</span>
                </button>
              ))}
              
              <button
                className={`filter-btn ${businessOnly ? 'active' : ''}`}
                onClick={() => setBusinessOnly(!businessOnly)}
              >
                <FaDonate className="filter-icon" />
                <span>Business Only</span>
              </button>
            </div>
          </div>

          <div className={`interactive-content ${currentUserID === null ? 'disabled' : ''}`}>
            <div className="table-container">
              {loading ? (
                <div className="loader-container">
                  <div className="loader"></div>
                  <p>Loading leaderboard data...</p>
                </div>
              ) : error ? (
                <div className="error-container">
                  <FaExclamationTriangle className="error-icon" />
                  <p className="error-message">{error}</p>
                  <p>Troubleshooting steps:</p>
                  <ul>
                    <li>Make sure you're logged in</li>
                    <li>Check that your Spring Boot application is running</li>
                    <li>Verify the backend server is configured correctly</li>
                  </ul>
                </div>
              ) : leaderboardData.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon-container">
                    <FaDonate className="empty-icon" />
                  </div>
                  <p>No leaderboard data available for this period.</p>
                  <p className="empty-subtext">Be the first to donate and make an impact!</p>
                </div>
              ) : (
                <div className="modern-leaderboard">
                  <div className="leaderboard-headers">
                    <div className="header-rank">Rank</div>
                    <div className="header-donor">Donor</div>
                    <div className="header-donations">Donations</div>
                    <div className="header-amount">Amount (kg)</div>
                  </div>
                  
                  <div className="leaderboard-rows">
                    {leaderboardData.map((item, index) => {
                      const percentage = calculatePercentage(item.amount || 0);
                      const isNew = item.id === newEntry;
                      const isCurrentUser = item.id === currentUserID;
                      
                      return (
                        <div 
                          key={item?.id || index} 
                          className={`leaderboard-row ${index < 3 ? `top-${index + 1}` : ''} ${isNew ? 'new-entry' : ''} ${isCurrentUser ? 'current-user' : ''}`}
                        >
                          <div className="rank-cell">
                            {getMedalBadge(index)}
                          </div>
                          <div className="donor-cell">
                            <div className="donor-info">
                              <span className="donor-name">{item?.donorName || 'Unknown Donor'}</span>
                              {isNew && <div className="new-badge"><FaHeart /> New</div>}
                              {isCurrentUser && <div className="user-badge">You</div>}
                            </div>
                            <div className="progress-container">
                              <div 
                                className="progress-bar" 
                                style={{width: `${percentage}%`}}
                              ></div>
                            </div>
                          </div>
                          <div className="donations-cell">
                            <span className="donation-count">{item?.donations || 0}</span>
                          </div>
                          <div className="amount-cell">
                            <span className="amount-value">{(Number(item?.amount) || 0).toFixed(1)}</span>
                            <span className="amount-unit">kg</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="leaderboard-footer">
                    <div className="total-row">
                      <div className="total-label">Total</div>
                      <div className="total-donations">{totalDonations}</div>
                      <div className="total-amount">{totalAmount.toFixed(1)} kg</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div ref={commentSectionRef} className="comments-section">
              <h2 className="comments-title">Community Discussion</h2>
              
              {currentUserID ? (
                <div className="comment-form">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts with the community..."
                    className="comment-input"
                  ></textarea>
                  <button 
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim()}
                    className="comment-submit-btn"
                  >
                    <FaPaperPlane /> Post
                  </button>
                </div>
              ) : (
                <div className="login-prompt">
                  <p>Please log in to join the discussion</p>
                </div>
              )}
              
              {commentsLoading ? (
                <div className="comments-loader">
                  <div className="loader"></div>
                  <p>Loading comments...</p>
                </div>
              ) : commentsError ? (
                <div className="comments-error">
                  <FaExclamationTriangle className="error-icon" />
                  <p>{commentsError}</p>
                </div>
              ) : comments.length === 0 ? (
                <div className="no-comments">
                  <p>No comments yet. Be the first to start the conversation!</p>
                </div>
              ) : (
                <div className="comments-list">
                  {comments.map((comment) => (
                    <div key={comment.id} className="comment">
                      <div className="comment-header">
                        <div className="comment-user">
                          <img 
                            src={comment.userProfilePic} 
                            alt={comment.userName} 
                            className="comment-user-avatar"
                          />
                          <div className="comment-user-info">
                            <span className="comment-user-name">{comment.userName}</span>
                            <span className="comment-date">{formatDate(comment.createdAt)}</span>
                            {comment.updatedAt !== comment.createdAt && 
                              <span className="comment-edited">(edited)</span>
                            }
                          </div>
                        </div>
                        
                        {currentUserID === comment.userId && (
                          <div className="comment-actions">
                            <button
                            
                            onClick={() => {
                              setEditingComment(comment.id);
                              setEditText(comment.content);
                            }}
                            className="comment-edit-btn"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            onClick={() => handleDeleteComment(comment.id)}
                            className="comment-delete-btn"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {editingComment === comment.id ? (
                      <div className="comment-edit-form">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="comment-edit-input"
                        ></textarea>
                        <div className="comment-edit-actions">
                          <button 
                            onClick={() => handleEditComment(comment.id)}
                            disabled={!editText.trim()}
                            className="comment-save-btn"
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => {
                              setEditingComment(null);
                              setEditText('');
                            }}
                            className="comment-cancel-btn"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="comment-content">{comment.content}</p>
                    )}
                    
                    <div className="comment-footer">
                      <button 
                        onClick={() => handleLikeComment(comment.id, comment.likedByCurrentUser)}
                        className={`comment-like-btn ${comment.likedByCurrentUser ? 'liked' : ''}`}
                        disabled={!currentUserID}
                      >
                        <FaThumbsUp /> 
                        <span className="like-count">{comment.likeCount}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="donate-section">
            <div className="donate-content">
              <h2>Make a Difference Today</h2>
              <p>Join our community of donors and help fight food insecurity</p>
              <button className="donate-button">
                <FaDonate className="donate-icon" /> 
                <span>Start Donating</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
);
}

export default Leaderboard;