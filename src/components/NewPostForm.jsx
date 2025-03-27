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

        const threadNumber = (await db.query(`SELECT id FROM threads WHERE type = $1`, [thread_id])).rows[0].thread_id
        console.log(threadNumber)
        const user_id = (await db.query(`SELECT id FROM users WHERE clerk_id = $1`, [userId])).rows[0].id
        
        await db.query(`INSERT INTO posts (user_id, thread_id, content) VALUES ($1, $2, $3)`, [user_id, threadNumber, content])
        revalidatePath('/timeline')
    }

    return (
            <form action={handleSubmit} 
            className="h-[87vh] w-[93vw] bg-[#292728] border border-black  rounded-xl p-6 text-[#f0dddf]">
                <div className="flex flex-col gap-6">
                    <section className="flex flex-col">
                        <label className="text-lg font-lora font-semibold text-center" htmlFor="content">
                            Write a Post..
                        </label>
                        <textarea className="h-[40vh] w-full rounded-md bg-[#F0DDDF] font-inter text-black p-3 border border-[#292728] focus:outline-none focus:ring-2 focus:ring-[#ed6044] mt-2" 
                        id="content" 
                        name="content"></textarea>
                    </section>
                    {/*Radio Button*/}                
                    <section className="flex flex-col">
                        <label className="text-lg font-semibold text-center underline mb-3 font-lora" htmlFor="thread_id">
                            Category:
                        </label>       
                        <div className="grid grid-cols-2 gap-3 text-sm p-5 font-inter">
                        <div className="flex items-center gap-4">
                            <input type="radio" name="thread_id" id="Discussion" value="General Discussion"></input>
                            <label htmlFor="Discussion">General Discussion</label>
                        </div>
                        <div className="flex items-center gap-4">
                            <input type="radio" name="thread_id" id="Collaboration" value="Music Collaboration"></input>
                            <label htmlFor="Collaboration">Music Collaboration</label> 
                        </div>
                        <div className="flex items-center gap-4">
                            <input type="radio" name="thread_id" id="Gear" value="Gear Talk"></input>
                            <label htmlFor="Gear">Gear Talk</label>
                        </div>
                        <div className="flex items-center gap-4">
                            <input type="radio" name="thread_id" id="Tips" value="Performance Tips"></input>
                            <label htmlFor="Tips">Performance Tips</label>
                        </div>
                        <div className="flex items-center gap-4">
                            <input type="radio" name="thread_id" id="Theory" value="Music Theory"></input>
                            <label htmlFor="Theory">Music Theory</label> 
                        </div>    
                        </div>                                                                                                                                                                       
                    </section>
                </div>
                <div className="flex justify-center">
                    <button 
                className="mt-2 w-[15vh] bg-[#ed6044] font-lora italic text-white py-2 rounded-md font-semibold hover:bg-[#e6c2ac] hover:text-[#292728] transition duration-200" 
                type="submit">
                    Submit
                </button> 
                </div>                
                               
            </form>
    )
}