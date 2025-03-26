'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfileRedirect() {
  const { userId } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (userId) {
      // Redirect to the user's profile using their clerk ID
      router.push(`/profile/${userId}`);
    } else {
      // If not signed in, redirect to sign-in
      router.push('/sign-in');
    }
  }, [userId, router]);
  
  return (
    <div className="flex justify-center items-center h-screen">
      <p>Loading your profile...</p>
    </div>
  );
}