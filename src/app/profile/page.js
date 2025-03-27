import ProfileClient from '@/components/ProfileClient';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import pg from 'pg';

// This is the profile page for the currently logged-in user
export default async function ProfilePage() {
  // Get current logged-in user's ID
  const { userId } = await auth();
  
  // If not logged in, redirect to sign-in
  if (!userId) {
    return redirect('/sign-in');
  }
  
  // Create database connection
  const db = new pg.Pool({
    connectionString: process.env.DB_CONN
  });
  
  try {
    // Check if user exists in database
    const userExistsQuery = await db.query(
      'SELECT id FROM users WHERE clerk_id = $1 LIMIT 1',
      [userId]
    );
    
    // If user hasn't set up their profile, show link to userInfo page
    if (userExistsQuery.rowCount === 0) {
      return (
        <div className="container mx-auto py-12 text-center">
          <h1 className="text-2xl font-bold">Profile not set up</h1>
          <p className="mt-4">You need to set up your profile first.</p>
          <a 
            href="/userInfo" 
            className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Set up profile
          </a>
        </div>
      );
    }
    
    const databaseUserId = userExistsQuery.rows[0].id;
    
    // Now fetch complete user data
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
      WHERE u.clerk_id = $1`,
      [userId]
    );
    
    // Fetch user posts
    const postsResult = await db.query(
      `SELECT
        p.*,
        COUNT(c.id) as comments
      FROM posts p
      LEFT JOIN comments c ON p.id = c.post_id
      WHERE p.user_id = $1
      GROUP BY p.id
      ORDER BY p.id DESC`,  // Ordering by ID instead of timestamp
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
      isOwnProfile: true,
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
        <p className="mt-4">We couldn't load your profile. Please try again later.</p>
      </div>
    );
  } finally {
    await db.end();
  }
}