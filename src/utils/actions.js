'use server'

import pg from "pg"
import { revalidatePath } from "next/cache"

export async function handlePostDelete({id}) {

    const db = new pg.Pool({
        connectionString: process.env.DB_CONN
    })
  
    await db.query(`DELETE FROM posts WHERE id = $1`, [id])

    revalidatePath('/timeline')
    
}