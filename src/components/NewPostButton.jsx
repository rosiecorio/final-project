'use client'
import { useState } from "react"
// import { handleSubmit } from "@/utils/actions"

export default function NewPostButton() {

    const [showModal, setShowModal] = useState(false)

    function toggleModal() {
        setShowModal(!showModal)
    }


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
    }

    return (
        <div className="flex flex-col">
            <button className="self-center" onClick={toggleModal}>Make a Post</button>
            {showModal ? 
            <form action={handleSubmit} className="flex flex-col">
                <div className="flex flex-row items-start text-black">
                    <section>
                        <label htmlFor="content">Write a Post..</label>
                        <textarea id="content" name="content"></textarea>
                    </section>                
                    <section className="flex flex-col">
                        <label htmlFor="thread_id">Category:</label> 
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
                
            </form> : ''}
        </div>
    )
}