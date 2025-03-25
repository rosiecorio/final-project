// ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProfilePage.css';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Mock data - replace with actual API calls
const MOCK_USER = {
  id: '1',
  username: 'guitargenius',
  name: 'Alex Johnson',
  bio: 'Guitarist and producer based in London.',
  profilePic: '/images/profile-placeholder.jpg',
  genres: ['Indie Rock', 'Alternative', 'Folk'],
  instruments: ['Guitar', 'Bass', 'Synth'],
  location: 'London, UK',
  links: {
    soundcloud: 'https://soundcloud.com/guitargenius',
    bandcamp: 'https://guitargenius.bandcamp.com',
    instagram: 'https://instagram.com/guitargenius'
  },
  posts: [
    {
      id: '101',
      title: 'Looking for drummer',
      content: 'Need a drummer for upcoming gig at The Continental Club on May 15th.',
      date: '2025-03-20',
      likes: 5,
      comments: 3
    },
    {
      id: '102',
      title: 'New track released',
      content: 'Just dropped a new single "Midnight Blues" - check it out on my SoundCloud!',
      date: '2025-03-15',
      likes: 12,
      comments: 7
    }
  ]
};

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const { userId } = useParams();
  const isOwnProfile = userId === '1'; 
  useEffect(() => {
    //  API call to fetch user data
    setTimeout(() => {
      setUser(MOCK_USER);
      setEditFormData(MOCK_USER);
      setLoading(false);
    }, 500);
  }, [userId]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleArrayInputChange = (e, field) => {
    const { value } = e.target;
    const valuesArray = value.split(',').map(item => item.trim());
    setEditFormData({
      ...editFormData,
      [field]: valuesArray,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //  send API request here
    setUser(editFormData);
    setIsEditing(false);
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      {/* Nav Bar */}
      <nav className="navbar">
        <div className="logo">
          <Link to="/timeline">MusicConnect</Link>
        </div>
        <div className="nav-links">
          <Link to="/timeline">Timeline</Link>
          <Link to="/services">Services</Link>
          <Link to="/profile/1">Profile</Link>
          <button className="logout-btn">Logout</button>
        </div>
      </nav>

      {/* Profile Content */}
      <div className="profile-content">
        {/* Profile Header */}
        <div className="profile-header">
          {/* Avatar api integratioon */}
          <div className="profile-pic">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.profilePic} alt={`${user.name}'s profile`} />
              <AvatarFallback>{user.name.charAt(0)}{user.name.split(' ')[1]?.charAt(0)}</AvatarFallback>

            </Avatar>
          </div>
          <div className="profile-info">
            <h1>{user.name}</h1>
            <p className="username">@{user.username}</p>
            <p className="location">{user.location}</p>
            {isOwnProfile && !isEditing && (
              <button className="edit-profile-btn" onClick={handleEditToggle}>
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Details */}
        {!isEditing ? (
          <div className="profile-details">
            <div className="bio-section">
              <h2>Bio</h2>
              <p>{user.bio}</p>
            </div>

            <div className="music-info">
              <div className="genres">
                <h2>Genres</h2>
                <div className="tags">
                  {user.genres.map((genre, index) => (
                    <span key={index} className="tag">{genre}</span>
                  ))}
                </div>
              </div>

              <div className="instruments">
                <h2>Instruments</h2>
                <div className="tags">
                  {user.instruments.map((instrument, index) => (
                    <span key={index} className="tag">{instrument}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="music-links">
              <h2>Links</h2>
              <div className="link-buttons">
                {user.links.soundcloud && (
                  <a 
                    href={user.links.soundcloud} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="music-link soundcloud"
                  >
                    SoundCloud
                  </a>
                )}
                {user.links.bandcamp && (
                  <a 
                    href={user.links.bandcamp} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="music-link bandcamp"
                  >
                    Bandcamp
                  </a>
                )}
                {user.links.instagram && (
                  <a 
                    href={user.links.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="music-link instagram"
                  >
                    Instagram
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Edit Profile Form */
          <form className="edit-profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editFormData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={editFormData.bio}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={editFormData.location}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="genres">Genres (comma-separated)</label>
              <input
                type="text"
                id="genres"
                name="genres"
                value={editFormData.genres.join(', ')}
                onChange={(e) => handleArrayInputChange(e, 'genres')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="instruments">Instruments (comma-separated)</label>
              <input
                type="text"
                id="instruments"
                name="instruments"
                value={editFormData.instruments.join(', ')}
                onChange={(e) => handleArrayInputChange(e, 'instruments')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="soundcloud">SoundCloud URL</label>
              <input
                type="url"
                id="soundcloud"
                name="links.soundcloud"
                value={editFormData.links.soundcloud}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="bandcamp">Bandcamp URL</label>
              <input
                type="url"
                id="bandcamp"
                name="links.bandcamp"
                value={editFormData.links.bandcamp}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="instagram">Instagram URL</label>
              <input
                type="url"
                id="instagram"
                name="links.instagram"
                value={editFormData.links.instagram}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">Save Changes</button>
              <button type="button" className="cancel-btn" onClick={handleEditToggle}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Posts Section */}
        <div className="posts-section">
          <h2>Posts</h2>
          {user.posts.length > 0 ? (
            <div className="posts-list">
              {user.posts.map((post) => (
                <div key={post.id} className="post-card">
                  <h3>{post.title}</h3>
                  <p className="post-date">{new Date(post.date).toLocaleDateString()}</p>
                  <p className="post-content">{post.content}</p>
                  <div className="post-stats">
                    <span>{post.likes} likes</span>
                    <span>{post.comments} comments</span>
                  </div>
                  {isOwnProfile && (
                    <div className="post-actions">
                      <button className="edit-post-btn">Edit</button>
                      <button className="delete-post-btn">Delete</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-posts">No posts yet.</p>
          )}
          
          {isOwnProfile && (
            <button className="new-post-btn">Create New Post</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;