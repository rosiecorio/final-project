'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';

// import css
import './profile.css';

const ProfileClient = ({ initialUser, initialPosts }) => {
  const [user, setUser] = useState(initialUser || null);
  const [posts, setPosts] = useState(initialPosts || []);
  const [loading, setLoading] = useState(!initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState(initialUser || {});
  
  // States for post editing
  const [editingPostId, setEditingPostId] = useState(null);
  const [editPostContent, setEditPostContent] = useState('');
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  
  // States for new post creation
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedThread, setSelectedThread] = useState('');
  const [threadTypes, setThreadTypes] = useState([]);
  
  // State for genres dropdown
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const fetchPosts = async () => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', clerkUserId)
        .single();
  
      if (userError) throw userError;
  
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          thread_id,
          threads(type)
        `)
        .eq('user_id', userData.id);
  
      if (postsError) throw postsError;
  
      return posts.map(post => ({
        id: post.id,
        title: post.threads.type,
        content: post.content,
        date: new Date().toISOString(),
        comments: 0
      }));
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to load posts");
      return [];
    }
  };
  
  // Create Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // get userId from the route
  const params = useParams();
  const pageUserId = params.userId;
  
  // get current user's clerk id
  const { userId: clerkUserId } = useAuth();
  
  // determine if this is the user's own profile
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  
  // Debug logging
  useEffect(() => {
    console.log('Initial user data:', initialUser);
    console.log('Initial posts data:', initialPosts);
    console.log('Environment variables check:');
    console.log('- Supabase URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('- Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  }, [initialUser, initialPosts]);
  
  // Fetch genres from database
  useEffect(() => {
    async function fetchGenres() {
      try {
        const { data, error } = await supabase
          .from('genres')
          .select('id, name')
          .order('name');
          
        if (error) {
          throw new Error(error.message);
        }
        
        setGenres(data || []);
      } catch (error) {
        console.error('Error fetching genres:', error);
        setError(`Failed to fetch genres: ${error.message}`);
      }
    }
    
    fetchGenres();
  }, []);
  
  // Fetch thread types
  useEffect(() => {
    async function fetchThreadTypes() {
      try {
        const { data, error } = await supabase
          .from('threads')
          .select('id, type');
          
        if (error) {
          throw new Error(error.message);
        }
        
        setThreadTypes(data || []);
      } catch (error) {
        console.error('Error fetching thread types:', error);
      }
    }
    
    fetchThreadTypes();
  }, []);
  
  useEffect(() => {
    // set isOwnProfile based on clerk id
    setIsOwnProfile(initialUser?.clerk_id === clerkUserId);
    
    if (initialUser) {
      setEditFormData({
        username: initialUser.username || '',
        bio: initialUser.bio || '',
        location: initialUser.location || '',
        instrument: initialUser.instruments && initialUser.instruments.length > 0 
          ? initialUser.instruments[0] 
          : ''
      });
    }
  }, [clerkUserId, initialUser]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError(null);
    setStatusMessage('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setStatusMessage('Updating profile...');
    
    try {
      // Validate input
      if (!editFormData.username?.trim()) {
        throw new Error('Username is required');
      }
      
      // Get the user's database ID using clerk_id
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', clerkUserId)
        .single();
      
      if (userError) {
        throw new Error(`Failed to get user: ${userError.message}`);
      }
      
      if (!userData?.id) {
        throw new Error('User ID not found');
      }
      
      console.log('Updating profile for user ID:', userData.id);
      
      // Update user info
      const { error: updateError } = await supabase
        .from('users')
        .update({
          username: editFormData.username,
          bio: editFormData.bio,
          post_code: editFormData.location
        })
        .eq('id', userData.id);
      
      if (updateError) {
        throw new Error(`Failed to update profile: ${updateError.message}`);
      }
      
      // Update instrument and genre if selected
      if (selectedGenre && editFormData.instrument) {
        // Check if user already has an instrument entry
        const { data: instrumentData, error: instrumentError } = await supabase
          .from('instrument')
          .select('id')
          .eq('user_id', userData.id)
          .single();
        
        if (instrumentError && instrumentError.code !== 'PGRST116') {
          // PGRST116 is "no rows returned" error, which is expected if no instrument exists
          throw new Error(`Failed to check instrument: ${instrumentError.message}`);
        }
        
        if (instrumentData?.id) {
          // Update existing instrument
          const { error: updateInstrError } = await supabase
            .from('instrument')
            .update({
              instrument: editFormData.instrument,
              genre: selectedGenre
            })
            .eq('id', instrumentData.id);
          
          if (updateInstrError) {
            throw new Error(`Failed to update instrument: ${updateInstrError.message}`);
          }
        } else {
          // Insert new instrument
          const { error: insertInstrError } = await supabase
            .from('instrument')
            .insert({
              user_id: userData.id,
              instrument: editFormData.instrument,
              genre: selectedGenre
            });
          
          if (insertInstrError) {
            throw new Error(`Failed to add instrument: ${insertInstrError.message}`);
          }
        }
      }
      
      // Update local state
      setUser({
        ...user,
        username: editFormData.username,
        bio: editFormData.bio,
        location: editFormData.location,
        instruments: editFormData.instrument ? [editFormData.instrument] : user.instruments
      });
      
      setStatusMessage('Profile updated successfully!');
      setTimeout(() => {
        setIsEditing(false);
        setStatusMessage('');
      }, 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(`Failed to update profile: ${error.message}`);
      setStatusMessage('');
    }
  };
  
  // Post editing functions
  const handleEditPostClick = (post) => {
    console.log('Edit post clicked:', post);
    console.log('Current user ID:', user.id);
    setEditingPostId(post.id);
    setEditPostContent(post.content);
    setError(null);
    setStatusMessage('');
  };

  const handleCancelPostEdit = () => {
    setEditingPostId(null);
    setEditPostContent('');
    setError(null);
    setStatusMessage('');
  };

  const handlePostContentChange = (e) => {
    setEditPostContent(e.target.value);
  };

  const handleUpdatePost = async (postId) => {
    setError(null);
    setStatusMessage('Updating post...');
    
    try {
      console.log('Attempting to update post:', postId);
      console.log('New content:', editPostContent);
      
      // Verify we have the user's database ID (not clerk ID)
      if (!user.id) {
        throw new Error('User ID not found');
      }
      
      // Make sure this is the user's post before updating
      const { data: postCheck, error: checkError } = await supabase
        .from('posts')
        .select('user_id')
        .eq('id', postId)
        .single();
      
      if (checkError) {
        throw new Error(`Error checking post: ${checkError.message}`);
      }
      
      if (postCheck.user_id !== user.id) {
        throw new Error('You can only edit your own posts');
      }
      
      // Update the post
      const { error: updateError } = await supabase
        .from('posts')
        .update({ content: editPostContent })
        .eq('id', postId);
      
      if (updateError) {
        console.error('Supabase update error:', updateError);
        throw new Error(`Error updating post: ${updateError.message}`);
      }
      
      console.log('Post updated successfully');
      
      // Update posts in local state
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, content: editPostContent } : post
      ));
      
      setStatusMessage('Post updated successfully!');
      setEditingPostId(null);
      setEditPostContent('');
    } catch (error) {
      console.error('Error updating post:', error);
      setError(`Failed to update post: ${error.message}`);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }
    
    setError(null);
    setStatusMessage('Deleting post...');
    
    try {
      // Verify we have the user's database ID
      const { data: currentUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', clerkUserId)
        .single();
  
      if (userError) throw new Error(`Error getting user: ${userError.message}`);
      if (!currentUser?.id) throw new Error('User ID not found');
  
      // Delete the post
      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);
      
      if (deleteError) throw new Error(`Error deleting post: ${deleteError.message}`);
  
      // Refetch remaining posts after deletion (using your actual schema)
      const { data: remainingPosts, error: postsError } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          thread_id,
          threads(type)
        `)
        .eq('user_id', currentUser.id);
  
      if (postsError) throw new Error(`Failed to fetch updated posts: ${postsError.message}`);
  
      // Format the posts data to match your component's expectations
      const formattedPosts = remainingPosts.map(post => ({
        id: post.id,
        title: post.threads.type,
        content: post.content,
        date: new Date().toISOString(), // Using current date since you don't have created_at
        comments: 0 // Default comment count
      }));
  
      // Update the posts state
      setPosts(formattedPosts);
      setStatusMessage('Post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
      setError(`Failed to delete post: ${error.message}`);
    }
  };
  // Create new post function
  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !selectedThread) {
      setError('Please enter content and select a category');
      return;
    }
    
    setError(null);
    setStatusMessage('Creating post...');
    
    try {
      // Get the user ID from Supabase
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', clerkUserId)
        .single();
      
      if (userError) throw new Error(`Failed to get user: ${userError.message}`);
      
      // Create the new post
      const { data: newPost, error: createError } = await supabase
        .from('posts')
        .insert({
          user_id: userData.id,
          thread_id: parseInt(selectedThread),
          content: newPostContent
        })
        .select();
      
      if (createError) throw new Error(`Failed to create post: ${createError.message}`);
  
      // Refetch all posts after creation (using your actual schema)
      const { data: updatedPosts, error: postsError } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          thread_id,
          threads(type)
        `)
        .eq('user_id', userData.id);
  
      if (postsError) throw new Error(`Failed to fetch updated posts: ${postsError.message}`);
  
      // Format the posts data to match your component's expectations
      const formattedPosts = updatedPosts.map(post => ({
        id: post.id,
        title: post.threads.type,
        content: post.content,
        date: new Date().toISOString(), // Using current date since you don't have created_at
        comments: 0 // Default comment count
      }));
  
      // Update the posts state
      setPosts(formattedPosts);
      setStatusMessage('Post created successfully!');
      setNewPostContent('');
      setSelectedThread('');
      setIsCreatingPost(false);
    } catch (error) {
      console.error('Error creating post:', error);
      setError(`Failed to create post: ${error.message}`);
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      {/* nav bar */}
      {/* <nav className="navbar">
        <div className="logo">
          <Link href="/timeline">Ensemble</Link>
        </div>
        <div className="nav-links">
          <Link href="/timeline">Timeline</Link>
          <Link href="/services">Services</Link>
          <Link href="/profile">Profile</Link>
          <button className="logout-btn">Logout</button>
        </div>
      </nav> */}

      {/* Status Message or Error Display */}
      {(statusMessage || error) && (
        <div className={`status-message ${error ? 'error' : 'success'}`}>
          {error || statusMessage}
        </div>
      )}

      {/* profile content */}
      <div className="profile-content">
        {/* profile header */}
        <div className="profile-header">
          <div className="profile-pic">
            <Avatar className="h-24 w-24">
              <AvatarImage alt={`${user?.username || 'User'}'s profile`} />
              <AvatarFallback>{user?.username ? user.username.charAt(0) : '?'}</AvatarFallback>
            </Avatar>
          </div>
          <div className="profile-info">
            <h1>{user?.username}</h1>
            <p className="username">@{user?.username}</p>
            <p className="location">{user?.location}</p>
            {isOwnProfile && !isEditing && (
              <button className="edit-profile-btn" onClick={handleEditToggle}>
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* profile details */}
        {!isEditing ? (
          <div className="profile-details">
            <div className="bio-section">
              <h2>Bio</h2>
              <p>{user?.bio}</p>
            </div>

            <div className="music-info">
              <div className="genres">
                <h2>Genres</h2>
                <div className="tags">
                  {user?.genres && user.genres.map((genre, index) => (
                    <span key={index} className="tag">{genre}</span>
                  ))}
                </div>
              </div>

              <div className="instruments">
                <h2>Instruments</h2>
                <div className="tags">
                  {user?.instruments && user.instruments.map((instrument, index) => (
                    <span key={index} className="tag">{instrument}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* edit profile form */
          <form className="edit-profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={editFormData.username || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={editFormData.bio || ''}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location (Post Code)</label>
              <input
                type="text"
                id="location"
                name="location"
                value={editFormData.location || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="instrument">Primary Instrument</label>
              <input
                type="text"
                id="instrument"
                name="instrument"
                value={editFormData.instrument || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="genre">Genre</label>
              <select
                id="genre"
                name="genre"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <option value="">Select a genre</option>
                {genres.map(genre => (
                  <option key={genre.id} value={genre.id}>{genre.name}</option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">Save Changes</button>
              <button type="button" className="cancel-btn" onClick={handleEditToggle}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* posts section */}
        <div className="posts-section">
          <h2>Posts</h2>
          
          {/* Create new post section */}
          {isOwnProfile && (
            <div className="create-post-section">
              {!isCreatingPost ? (
                <button 
                  className="new-post-btn"
                  onClick={() => setIsCreatingPost(true)}
                >
                  Create New Post
                </button>
              ) : (
                <div className="create-post-form">
                  <h3>Create a New Post</h3>
                  <div className="form-group">
                    <label htmlFor="post-category">Category:</label>
                    <select
                      id="post-category"
                      value={selectedThread}
                      onChange={(e) => setSelectedThread(e.target.value)}
                      className="post-category-select"
                    >
                      <option value="">Select a category</option>
                      {threadTypes.map(thread => (
                        <option key={thread.id} value={thread.id}>{thread.type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="post-content">Content:</label>
                    <textarea
                      id="post-content"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="post-content-textarea"
                      maxLength={300}
                      placeholder="What's on your mind?"
                    ></textarea>
                  </div>
                  <div className="create-post-actions">
                    <button 
                      className="post-submit-btn"
                      onClick={handleCreatePost}
                    >
                      Post
                    </button>
                    <button 
                      className="post-cancel-btn"
                      onClick={() => setIsCreatingPost(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Posts list */}
          {user?.posts && user.posts.length > 0 ? (
            <div className="posts-list">
              {user.posts.map((post) => (
                <div key={post.id} className="post-card">
                  <h3>{post.title}</h3>
                  <p className="post-date">{new Date(post.date).toLocaleDateString()}</p>
                  
                  {editingPostId === post.id ? (
                    <div className="edit-post-form">
                      <textarea
                        value={editPostContent}
                        onChange={handlePostContentChange}
                        className="edit-post-textarea"
                        maxLength={300} // Match database column size
                      ></textarea>
                      <div className="edit-post-actions">
                        <button 
                          onClick={() => handleUpdatePost(post.id)}
                          className="save-post-btn"
                        >
                          Save
                        </button>
                        <button 
                          onClick={handleCancelPostEdit}
                          className="cancel-edit-btn"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="post-content">{post.content}</p>
                  )}
                  
                  <div className="post-stats">
                    <span>{post.comments} comments</span>
                  </div>
                  
                  {isOwnProfile && editingPostId !== post.id && (
                    <div className="post-actions">
                      <button 
                        className="edit-post-btn"
                        onClick={() => handleEditPostClick(post)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-post-btn"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-posts">No posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileClient;