// 'use client'

// import { ProfileClient } from './ProfileClient';
// import pg from 'pg';
// import { auth } from '@clerk/nextjs/server';

// export default async function ProfilePage({ params }) {
//   const resolvedParams = await params;
//   const pageUserId = resolvedParams.userId;
//   const { userId: clerkUserId } = await auth();
  
//   // Create database connection (similar to your working example)
//   const db = new pg.Pool({
//     connectionString: process.env.DB_CONN
//   });
  
  
//   // Get the user from the database
//   const userResult = await db.query(
//     'SELECT u.*, i.instrument FROM users u ' +
//     'LEFT JOIN instrument i ON u.id = i.user_id ' +
//     'WHERE u.clerk_id = $1',
//     [pageUserId]
//   );
  
//   let userData = null;
//   let userPosts = [];
//   let isOwnProfile = false;
  
//   if (userResult.rows.length > 0) {
//     const databaseUserId = userResult.rows[0].id;
    
//     // Fetch user posts
//     const postsResult = await db.query(
//       'SELECT p.*, COUNT(c.id) as comments FROM posts p ' +
//       'LEFT JOIN comments c ON p.id = c.post_id ' +
//       'WHERE p.user_id = $1 ' +
//       'GROUP BY p.id',
//       [databaseUserId]
//     );
    
//     // Process user data
//     const rawUserData = userResult.rows[0];
//     isOwnProfile = rawUserData.clerk_id === clerkUserId;
    
//     // Collect instruments and genres
//     const instruments = [];
//     const genres = [];
    
//     userResult.rows.forEach(row => {
//       if (row.instrument && !instruments.includes(row.instrument)) {
//         instruments.push(row.instrument);
//       }
//       if (row.genre_name && !genres.includes(row.genre_name)) {
//         genres.push(row.genre_name);
//       }
//     });
    
//     // Format user data
//     userData = {
//       id: rawUserData.id,
//       clerk_id: rawUserData.clerk_id,
//       username: rawUserData.username || '',
//       name: rawUserData.username || '',
//       bio: rawUserData.bio || '',
//       profilePic: '/images/profile-placeholder.jpg',
//       genres: genres,
//       instruments: instruments,
//       location: rawUserData.post_code || '',
//       links: {
//         soundcloud: '',
//         bandcamp: '',
//         instagram: ''
//       }
//     };
    
//     // Format posts
//     userPosts = postsResult.rows.map(post => ({
//       id: post.id,
//       title: `Post #${post.id}`,
//       content: post.content,
//       date: new Date().toISOString().split('T')[0],
//       likes: 0,
//       comments: parseInt(post.comments) || 0
//     }));
//   }
  
//   // Pass data to client component
//   return <ProfileClient 
//     userData={userData} 
//     userPosts={userPosts} 
//     isOwnProfile={isOwnProfile} 
//     userId={pageUserId}
//   />;
// }