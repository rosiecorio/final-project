import ProfileClient from '@/components/ProfileClient';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

export default async function ProfilePage() {
  const { userId } = await auth();
  
  if (!userId) {
    return redirect('/sign-in');
  }
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );
  
  try {
    // Check if user exists
    const { data: userExists, error: userExistsError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single();
    
    if (userExistsError || !userExists) {
      return (
        <div className="container mx-auto py-12 text-center">
          <h1 className="text-2xl font-bold">Profile not set up</h1>
          <p className="mt-4">You need to set up your profile first.</p>
          <a href="/userInfo" className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-md">
            Set up profile
          </a>
        </div>
      );
    }
    
    const databaseUserId = userExists.id;
    
    // Get user basic info
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', databaseUserId)
      .single();
    
    if (userError) throw new Error('Failed to fetch user data');
    
    // Get user instruments
    const { data: instrumentData, error: instrumentError } = await supabase
      .from('instrument')
      .select(`
        id,
        instrument,
        years,
        level,
        gig_ready,
        availability,
        genre
      `)
      .eq('user_id', databaseUserId);
    
    // Get genres for the instruments
    let genres = [];
    if (instrumentData && instrumentData.length > 0) {
      const genreIds = instrumentData.map(inst => inst.genre).filter(Boolean);
      if (genreIds.length > 0) {
        const { data: genreData } = await supabase
          .from('genres')
          .select('id, name')
          .in('id', genreIds);
        
        genres = genreData || [];
      }
    }
    
    // Get user posts with comment counts
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', databaseUserId)
      .order('id', { ascending: false });
    
    if (postsError) throw new Error('Failed to fetch posts');
    
    // Get comment counts for each post
    const postIds = postsData.map(post => post.id);
    let commentCounts = {};
    
    if (postIds.length > 0) {
      for (const postId of postIds) {
        const { data: commentCount, error: countError } = await supabase
          .from('comments')
          .select('id', { count: 'exact' })
          .eq('post_id', postId);
          
        if (!countError) {
          commentCounts[postId] = commentCount.length;
        }
      }
    }
    
    // Get thread types for posts
    let threadTypes = {};
    const threadIds = [...new Set(postsData.map(post => post.thread_id))];
    
    if (threadIds.length > 0) {
      const { data: threads } = await supabase
        .from('threads')
        .select('id, type')
        .in('id', threadIds);
      
      if (threads) {
        threads.forEach(thread => {
          threadTypes[thread.id] = thread.type;
        });
      }
    }
    
    // Format instruments
    const instruments = instrumentData ? instrumentData.map(inst => ({
      name: inst.instrument,
      level: inst.level,
      years: inst.years,
      gigReady: inst.gig_ready,
      availability: inst.availability
    })) : [];
    
    // Format user data
    const formattedUser = {
      id: userData.id,
      clerk_id: userData.clerk_id,
      username: userData.username || '',
      bio: userData.bio || '',
      location: userData.post_code || '',
      genres: genres.map(g => g.name),
      instruments: instruments.map(i => i.name),
      instrumentDetails: instruments,
      posts: postsData.map(post => ({
        id: post.id,
        title: threadTypes[post.thread_id] || `Post #${post.id}`,
        content: post.content,
        thread_id: post.thread_id,
        date: new Date().toISOString().split('T')[0],
        comments: commentCounts[post.id] || 0
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
  }
}