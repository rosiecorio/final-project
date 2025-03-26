import { ProfileClient } from '@/components/ProfileClient';
import { auth } from '@clerk/nextjs/server';
import pg from 'pg';

export default async function ProfilePage({ params }) {
  const pageUserId = params.userId; // This comes as a string from URL
  const { userId: clerkUserId } = await auth();
  
  // create database connection
  const db = new pg.Pool({
    connectionString: process.env.DB_CONN
  });
  
  try {
    // fetch user data by clerk_id 
    const userResult = await db.query(
      'SELECT u.*, i.instrument, i.level, g.name as genre_name FROM users u ' +
      'LEFT JOIN instrument i ON u.id = i.user_id ' +
      'LEFT JOIN genres g ON i.genre::integer = g.id::integer ' +
      'WHERE u.clerk_id = $1',
      [pageUserId]
    );
    
    if (userResult.rows.length === 0) {
      return <div>user not found</div>;
    }
    
    const databaseUserId = userResult.rows[0].id; // This is an INT from DB
    
    // fetch user posts - ensure we pass the ID as number
    const postsResult = await db.query(
      'SELECT p.*, COUNT(c.id) as comments FROM posts p ' +
      'LEFT JOIN comments c ON p.id = c.post_id ' +
      'WHERE p.user_id = $1 ' +
      'GROUP BY p.id',
      [databaseUserId] // This is already a number from the DB
    );
    
    // process user data
    const userData = userResult.rows[0];
    
    // collect instruments and genres
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
    
    // format user data
    const formattedUser = {
      id: userData.id,
      clerk_id: userData.clerk_id,
      username: userData.username || '',
      name: userData.username || '',
      bio: userData.bio || '',
      profilePic: '/images/profile-placeholder.jpg',
      genres: genres,
      instruments: instruments,
      location: userData.post_code || '',
      links: {
        soundcloud: '',
        bandcamp: '',
        instagram: ''
      },
      posts: postsResult.rows.map(post => ({
        id: post.id,
        title: `Post #${post.id}`,
        content: post.content,
        date: new Date().toISOString().split('T')[0],
        likes: 0,
        comments: parseInt(post.comments) || 0 // Ensure this is a number
      }))
    };
    
    return <ProfileClient initialUser={formattedUser} initialPosts={formattedUser.posts} />;
  } catch (error) {
    console.error('error fetching profile data:', error);
    return <div>error loading profile</div>;
  } finally {
    // Always close the database connection
    await db.end();
  }
}
