import pg from "pg"

export default async function NewPostForm(){

    async function handleSubmit(formData) {
        'use server'

        const db = new pg.Pool({
            connectionString: process.env.DB_CONN
        })

        const data = Object.fromEntries(formData)
        const {content} = data
        
        await db.query(`INSERT INTO posts (user_id, thread_id, content) VALUES ($1, $2, $3)`, [user_id, thread_id, content])
        
    }

    return (
        <form action={handleSubmit}>
            <label htmlFor="content">Write a post..</label>
            <textarea name="content" id="content"></textarea>
        </form>
    )
}