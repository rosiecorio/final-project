import { ProfileClient } from '@/components/ProfileClient';
import { auth } from '@clerk/nextjs/server';
import pg from 'pg';

// This page handles viewing other users' profiles by ID
export default async function ProfileIdPage({ params }) {
  // Get the ID from URL params
  const { userId } = await params;
  
  // Get current logged-in user's ID (if any) for comparison
  const { userId: currentUserId } = await auth();
  
  // Create database connection
  const db = new pg.Pool({
    connectionString: process.env.DB_CONN
  });
  
  try {
    // Fetch user data with instruments and genres
    const userResult = await db.query(
      `SELECT 
        u.*,
        i.instrument,
        i.years,
        i.level,
        i.gig_ready,
        i.availability,
        g.name as genre_name,
        g.id as genre_id
      FROM users u
      LEFT JOIN instrument i ON u.id = i.user_id
      LEFT JOIN genres g ON i.genre = g.id::text
      WHERE u.id = $1`,
      [userId]
    );
    
    // User not found
    if (userResult.rows.length === 0) {
      return (
        <div className="container mx-auto py-12 text-center">
          <h1 className="text-2xl font-bold">User not found</h1>
          <p className="mt-4">The user profile youre looking for doesnt exist.</p>
        </div>
      );
    }
    
    // Get user ID from database
    const databaseUserId = userResult.rows[0].id;
    
    // Fetch user posts
    const postsResult = await db.query(
      `SELECT 
        p.*,
        COUNT(c.id) as comments,
        MAX(p.created_at) as post_date
      FROM posts p
      LEFT JOIN comments c ON p.id = c.post_id
      WHERE p.user_id = $1
      GROUP BY p.id
      ORDER BY p.created_at DESC`,
      [databaseUserId]
    );
    
    // Extract user data from the first row
    const userData = userResult.rows[0];
    
    // Collect unique instruments and genres
    const instruments = [];
    const genres = [];
    
    userResult.rows.forEach(row => {
      if (row.instrument && !instruments.some(i => i.name === row.instrument)) {
        instruments.push({
          name: row.instrument,
          level: row.level,
          years: row.years,
          gigReady: row.gig_ready,
          availability: row.availability
        });
      }
      
      if (row.genre_name && !genres.some(g => g.id === row.genre_id)) {
        genres.push({
          id: row.genre_id,
          name: row.genre_name
        });
      }
    });
    
    // Check if this is the current user's own profile
    const isOwnProfile = userData.clerk_id === currentUserId;
    
    // Format user data for the client component
    const formattedUser = {
      id: userData.id,
      clerk_id: userData.clerk_id,
      username: userData.username || '',
      name: userData.name || userData.username || '',
      bio: userData.bio || '',
      profilePic: userData.profile_pic || '/images/profile-placeholder.jpg',
      genres: genres.map(g => g.name),
      instruments: instruments.map(i => i.name),
      instrumentDetails: instruments,
      location: userData.post_code || '',
      links: {
        soundcloud: userData.soundcloud_url || '',
        bandcamp: userData.bandcamp_url || '',
        instagram: userData.instagram_url || ''
      },
      isOwnProfile: isOwnProfile,
      posts: postsResult.rows.map(post => ({
        id: post.id,
        title: post.title || `Post #${post.id}`,
        content: post.content,
        date: post.post_date ? new Date(post.post_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        likes: parseInt(post.likes) || 0,
        comments: parseInt(post.comments) || 0
      }))
    };
    
    return <ProfileClient initialUser={formattedUser} initialPosts={formattedUser.posts} />;
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="mt-4">We couldnt load this profile. Please try again later.</p>
      </div>
    );
  } finally {
    await db.end();
  }
}