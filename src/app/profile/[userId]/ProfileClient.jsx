// src/app/profile/[userId]/ProfileClient.jsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Import CSS
import './profile.css';

export function ProfileClient({ userData, userPosts, isOwnProfile, userId }) {
  const [user, setUser] = useState(userData);
  const [posts, setPosts] = useState(userPosts);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState(userData);
  
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
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user.id,
          bio: editFormData.bio,
          location: editFormData.location
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      // Update the user state with the new data
      setUser(editFormData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user data:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  if (!user) {
    return <div className="loading">User not found</div>;
  }

  return (
    <div className="profile-page">
      {/* The rest of your UI remains the same */}
      {/* Just reference user, posts, isOwnProfile, etc. */}
      {/* ... */}
    </div>
  );
}