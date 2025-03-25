'use server'

import pg from "pg"
import { auth } from "@clerk/nextjs/server"

export async function handleSubmit(formData) {

    const db = new pg.Pool({
        connectionString: process.env.DB_CONN
    })

    const {userId} = await auth()    

    const data = Object.fromEntries(formData)
    const {content} = data
    const user_id = await db.query(`SELECT * FROM users WHERE clerk_id = $1`, [userId])
    const thread_id= f
    
    await db.query(`INSERT INTO posts (user_id, thread_id, content) VALUES ($1, $2, $3)`, [user_id, thread_id, content])
}