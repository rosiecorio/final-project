import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import pg from 'pg';

// Update post
export async function PUT(request, { params }) {
  const { userId: postId } = params; // Rename to postId to avoid confusion
  const { content } = await request.json();
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const db = new pg.Pool({ connectionString: process.env.DB_CONN });
  
  try {
    // Make sure this post belongs to the current user
    const checkResult = await db.query(
      `SELECT p.id 
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = $1 AND u.clerk_id = $2`,
      [postId, userId]
    );
    
    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // Update the post
    await db.query(`UPDATE posts SET content = $1 WHERE id = $2`, [content, postId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  } finally {
    await db.end();
  }
}

// Delete post
export async function DELETE(request, { params }) {
  const { userId: postId } = params; // Rename to postId
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const db = new pg.Pool({ connectionString: process.env.DB_CONN });
  
  try {
    // Make sure this post belongs to the current user
    const checkResult = await db.query(
      `SELECT p.id 
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = $1 AND u.clerk_id = $2`,
      [postId, userId]
    );
    
    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // Delete comments first
    await db.query(`DELETE FROM comments WHERE post_id = $1`, [postId]);
    
    // Then delete post
    await db.query(`DELETE FROM posts WHERE id = $1`, [postId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  } finally {
    await db.end();
  }
}