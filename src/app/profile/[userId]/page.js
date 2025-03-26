'use client'
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import pg from "pg";
import { useAuth } from '@clerk/nextjs';

// Import CSS
import './profile.css';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  
  // Get userId from the route
  const params = useParams();
  const pageUserId = params.userId;
  
  // Get the currently logged-in user's clerk ID
  const { userId: clerkUserId } = useAuth();
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Create database connection
        const db = new pg.Pool({
          connectionString: process.env.NEXT_PUBLIC_DB_CONN
        });
        
        // First, find the database user ID that corresponds to this clerk ID
        let queryUserId = pageUserId;
        let databaseUserId;
        
        // Get the user from the database - might be the current user or another user we're viewing
        const userResult = await db.query(
          'SELECT u.*, i.instrument, i.level, g.name as genre_name FROM users u ' +
          'LEFT JOIN instrument i ON u.id = i.user_id ' +
          'LEFT JOIN genres g ON i.genre = g.id ' +
          'WHERE u.id = $1 OR u.clerk_id = $1',
          [pageUserId]
        );
        
        // Determine if this is the user's own profile
        if (userResult.rows.length > 0) {
          databaseUserId = userResult.rows[0].id;
          const currentUserClerkId = userResult.rows[0].clerk_id;
          setIsOwnProfile(currentUserClerkId === clerkUserId);
        }
        
        // Fetch user posts
        const postsResult = await db.query(
          'SELECT p.*, COUNT(c.id) as comments FROM posts p ' +
          'LEFT JOIN comments c ON p.id = c.post_id ' +
          'WHERE p.user_id = $1 ' +
          'GROUP BY p.id',
          [databaseUserId]
        );
        
        if (userResult.rows.length > 0) {
          const userData = userResult.rows[0];
          
          // Collect all instruments and genres from the result
          const instruments = [];
          const genres = [];
          
          userResult.rows.forEach(row => {
            if (row.instrument && !instruments.includes(row.instrument)) {
              instruments.push(row.instrument);
            }
            if (row.genre_name && !genres.includes(row.genre_name)) {
              genres.push(row.genre_name);
            }
          });
          
          // Format the user data
          const formattedUser = {
            id: userData.id,
            username: userData.username || '',
            name: userData.username || '',  // Using username as name since there's no name field
            bio: userData.bio || '',
            profilePic: '/images/profile-placeholder.jpg',  // Default since there's no profile pic field
            genres: genres,
            instruments: instruments,
            location: userData.post_code || '',
            links: {
              soundcloud: '',  // These fields don't exist in your schema
              bandcamp: '',
              instagram: ''
            },
            posts: postsResult.rows.map(post => ({
              id: post.id,
              title: `Post #${post.id}`,  // No title field in your schema
              content: post.content,
              date: new Date().toISOString().split('T')[0],  // No date field in your schema
              likes: 0,  // No likes field in your schema
              comments: parseInt(post.comments) || 0
            }))
          };
          
          setUser(formattedUser);
          setEditFormData(formattedUser);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };
  
    if (pageUserId) {
      fetchUserData();
    }
  }, [pageUserId, clerkUserId]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested objects (for links)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEditFormData({
        ...editFormData,
        [parent]: {
          ...editFormData[parent],
          [child]: value
        }
      });
    } else {
      setEditFormData({
        ...editFormData,
        [name]: value,
      });
    }
  };

  const handleArrayInputChange = (e, field) => {
    const { value } = e.target;
    const valuesArray = value.split(',').map(item => item.trim());
    setEditFormData({
      ...editFormData,
      [field]: valuesArray,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create database connection
      const db = new pg.Pool({
        connectionString: process.env.NEXT_PUBLIC_DB_CONN
      });
      
      // Update user basic data
      await db.query(
        `UPDATE users 
         SET bio = $1, post_code = $2
         WHERE id = $3`,
        [
          editFormData.bio,
          editFormData.location,
          user.id
        ]
      );
      
      // Update the user state with the new data
      setUser(editFormData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user data:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      {/* Nav Bar */}
      <nav className="navbar">
        <div className="logo">
          <Link href="/timeline">MusicConnect</Link>
        </div>
        <div className="nav-links">
          <Link href="/timeline">Timeline</Link>
          <Link href="/services">Services</Link>
          <Link href="/profile">Profile</Link>
          <button className="logout-btn">Logout</button>
        </div>
      </nav>

      {/* Profile Content */}
      <div className="profile-content">
        {/* Profile Header */}
        <div className="profile-header">
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
}


import { ProfileClient } from './ProfileClient';
import pg from 'pg';
import { auth } from '@clerk/nextjs/server';

export default async function ProfilePage({ params }) {
  const resolvedParams = await params;
  const pageUserId = resolvedParams.userId;
  const { userId: clerkUserId } = await auth();
  
  // Create database connection (similar to your working example)
  const db = new pg.Pool({
    connectionString: process.env.DB_CONN
  });
  
  
  // Get the user from the database
  const userResult = await db.query(
    'SELECT u.*, i.instrument FROM users u ' +
    'LEFT JOIN instrument i ON u.id = i.user_id ' +
    'WHERE u.clerk_id = $1',
    [pageUserId]
  );
  
  let userData = null;
  let userPosts = [];
  let isOwnProfile = false;
  
  if (userResult.rows.length > 0) {
    const databaseUserId = userResult.rows[0].id;
    
    // Fetch user posts
    const postsResult = await db.query(
      'SELECT p.*, COUNT(c.id) as comments FROM posts p ' +
      'LEFT JOIN comments c ON p.id = c.post_id ' +
      'WHERE p.user_id = $1 ' +
      'GROUP BY p.id',
      [databaseUserId]
    );
    
    // Process user data
    const rawUserData = userResult.rows[0];
    isOwnProfile = rawUserData.clerk_id === clerkUserId;
    
    // Collect instruments and genres
    const instruments = [];
    const genres = [];
    
    userResult.rows.forEach(row => {
      if (row.instrument && !instruments.includes(row.instrument)) {
        instruments.push(row.instrument);
      }
      if (row.genre_name && !genres.includes(row.genre_name)) {
        genres.push(row.genre_name);
      }
    });
    
    // Format user data
    userData = {
      id: rawUserData.id,
      clerk_id: rawUserData.clerk_id,
      username: rawUserData.username || '',
      name: rawUserData.username || '',
      bio: rawUserData.bio || '',
      profilePic: '/images/profile-placeholder.jpg',
      genres: genres,
      instruments: instruments,
      location: rawUserData.post_code || '',
      links: {
        soundcloud: '',
        bandcamp: '',
        instagram: ''
      }
    };
    
    // Format posts
    userPosts = postsResult.rows.map(post => ({
      id: post.id,
      title: `Post #${post.id}`,
      content: post.content,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      comments: parseInt(post.comments) || 0
    }));
  }
  
  // Pass data to client component
  return <ProfileClient 
    userData={userData} 
    userPosts={userPosts} 
    isOwnProfile={isOwnProfile} 
    userId={pageUserId}
  />;
}
