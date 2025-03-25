'use client'
import { useState } from "react"
// import { handleSubmit } from "@/utils/actions"

export default function NewPostButton({children}) {

    const [showModal, setShowModal] = useState(false)

    function toggleModal() {
        setShowModal(!showModal)
    }


    async function handleSubmit(formData) {

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
            {showModal && (<div>{children}</div>)}
          </div>
    )
}