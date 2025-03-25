import pg from "pg"
import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"

export default async function NewPostForm() {
    
    async function handleSubmit(formData) {

        'use server'
    
        const db = new pg.Pool({
            connectionString: process.env.DB_CONN
        })
    
        const {userId} = await auth()    
    
        const data = Object.fromEntries(formData)
        const {content, thread_id} = data
        const user_id = await db.query(`SELECT id FROM users WHERE clerk_id = $1`, [userId])
        
        await db.query(`INSERT INTO posts (user_id, thread_id, content) VALUES ($1, $2, $3)`, [user_id, thread_id, content])
        revalidatePath('/timeline')
    }

    return (
        <form action={handleSubmit} className="flex flex-col bg-slate-300 rounded-xl p-3">
                <div className="flex flex-row items-start text-black gap-3">
                    <section className="flex flex-col">
                        <label className="self-center" htmlFor="content">Write a Post..</label>
                        <textarea className="h-[7em] rounded" id="content" name="content"></textarea>
                    </section>                
                    <section className="flex flex-col">
                        <label className="self-center underline" htmlFor="thread_id">Category:</label> 
                        <div className="flex flex-row items-center">
                            <input type="radio" name="thread_id" id="Discussion" value="General Discussion"></input>
                            <label htmlFor="Discussion">General Discussion</label>
                        </div>
                        <div className="flex flex-row items-center">
                            <input type="radio" name="thread_id" id="Collaboration" value="Music Collaboration"></input>
                            <label htmlFor="Collaboration">Music Collaboration</label> 
                        </div>
                        <div className="flex flex-row items-center">
                            <input type="radio" name="thread_id" id="Gear" value="Gear Talk"></input>
                            <label htmlFor="Gear">Gear Talk</label>
                        </div>
                        <div className="flex flex-row items-center">
                            <input type="radio" name="thread_id" id="Tips" value="Performance Tips"></input>
                            <label htmlFor="Tips">Performance Tips</label>
                        </div>
                        <div className="flex flex-row items-center">
                            <input type="radio" name="thread_id" id="Theory" value="Music Theory"></input>
                            <label htmlFor="Theory">Music Theory</label> 
                        </div>                                                                                                                                                                       
                    </section>
                </div>                
                <button className="self-center" type="submit">Submit</button>                
            </form>
    )
}