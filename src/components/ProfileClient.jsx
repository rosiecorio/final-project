// ProfileClient.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@clerk/nextjs";

// import css
import "./profile.css";

const ProfileClient = ({ initialUser, initialPosts }) => {
  const [user, setUser] = useState(initialUser || null);
  const [posts, setPosts] = useState(initialPosts || []);
  const [loading, setLoading] = useState(!initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState(initialUser || {});

  // get userId from the route
  const params = useParams();
  const pageUserId = params.userId;

  // get current user's clerk id
  const { userId: clerkUserId } = useAuth();

  // determine if this is the user's own profile
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    // fetch user data if not provided initially
    if (!initialUser) {
      fetch(`/api/users/${pageUserId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
            setEditFormData(data.user);
            setIsOwnProfile(data.user.clerk_id === clerkUserId);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("error fetching profile:", error);
          setLoading(false);
        });
    } else {
      // set isOwnProfile based on clerk id
      setIsOwnProfile(initialUser.clerk_id === clerkUserId);
    }
  }, [pageUserId, clerkUserId, initialUser]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // handle nested objects (for links)
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setEditFormData({
        ...editFormData,
        [parent]: {
          ...editFormData[parent],
          [child]: value,
        },
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
    const valuesArray = value.split(",").map((item) => item.trim());
    setEditFormData({
      ...editFormData,
      [field]: valuesArray,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // send updated profile to api
      const response = await fetch(`/api/users/${pageUserId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        throw new Error("failed to update profile");
      }

      // update the user state with the new data
      setUser(editFormData);
      setIsEditing(false);
    } catch (error) {
      console.error("error updating profile:", error);
      alert("failed to update profile. please try again.");
    }
  };

  if (loading) {
    return <div className="loading">loading profile...</div>;
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

      {/* profile content */}
      <div className="profile-content">
        {/* profile header */}
        <div className="profile-header">
          <div className="profile-pic">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={user.profilePic}
                alt={`${user.name}'s profile`}
              />
              <AvatarFallback>
                {user.name.charAt(0)}
                {user.name.split(" ")[1]?.charAt(0)}
              </AvatarFallback>
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

        {/* profile details */}
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
                  {user.genres &&
                    user.genres.map((genre, index) => (
                      <span key={index} className="tag">
                        {genre}
                      </span>
                    ))}
                </div>
              </div>

              <div className="instruments">
                <h2>Instruments</h2>
                <div className="tags">
                  {user.instruments &&
                    user.instruments.map((instrument, index) => (
                      <span key={index} className="tag">
                        {instrument}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            <div className="music-links">
              <h2>Links</h2>
              <div className="link-buttons">
                {user.links && user.links.soundcloud && (
                  <a
                    href={user.links.soundcloud}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="music-link soundcloud"
                  >
                    SoundCloud
                  </a>
                )}
                {user.links && user.links.bandcamp && (
                  <a
                    href={user.links.bandcamp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="music-link bandcamp"
                  >
                    Bandcamp
                  </a>
                )}
                {user.links && user.links.instagram && (
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
          /* edit profile form */
          <form className="edit-profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editFormData.name || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={editFormData.bio || ""}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={editFormData.location || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="genres">Genres (comma-separated)</label>
              <input
                type="text"
                id="genres"
                name="genres"
                value={(editFormData.genres || []).join(", ")}
                onChange={(e) => handleArrayInputChange(e, "genres")}
              />
            </div>

            <div className="form-group">
              <label htmlFor="instruments">Instruments (comma-separated)</label>
              <input
                type="text"
                id="instruments"
                name="instruments"
                value={(editFormData.instruments || []).join(", ")}
                onChange={(e) => handleArrayInputChange(e, "instruments")}
              />
            </div>

            <div className="form-group">
              <label htmlFor="soundcloud">SoundCloud URL</label>
              <input
                type="url"
                id="soundcloud"
                name="links.soundcloud"
                value={editFormData.links?.soundcloud || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="bandcamp">Bandcamp URL</label>
              <input
                type="url"
                id="bandcamp"
                name="links.bandcamp"
                value={editFormData.links?.bandcamp || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="instagram">Instagram URL</label>
              <input
                type="url"
                id="instagram"
                name="links.instagram"
                value={editFormData.links?.instagram || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">
                Save Changes
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={handleEditToggle}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* posts section */}
        <div className="posts-section">
          <h2>Posts</h2>
          {user.posts && user.posts.length > 0 ? (
            <div className="posts-list">
              {user.posts.map((post) => (
                <div key={post.id} className="post-card">
                  <h3>{post.title}</h3>
                  <p className="post-date">
                    {new Date(post.date).toLocaleDateString()}
                  </p>
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
            <p className="no-posts">no posts yet.</p>
          )}

          {isOwnProfile && (
            <button className="new-post-btn">Create New Post</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileClient;
