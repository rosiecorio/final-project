
import { auth } from "@clerk/nextjs/server";
import pg from "pg"
import { redirect } from "next/navigation";
import EditUi from "@/components/editprofile";

export default async function Page() {
         async function submitForm(formData) {
        'use server'
        const db = new pg.Pool({
            connectionString: process.env.DB_CONN
        })
    
        const {userId} = await auth()    
    
        
        const {username, bio, post_code, instrument, years, level, gig_ready, availability, genre} = formData
        const gigReadyBool = gig_ready === "Yes"
        const availBool = availability === "Yes"
        
         await db.query(`UPDATE users SET username = $1, bio = $2, post_code = $3 WHERE clerk_id = $4`,  [username, bio, post_code, userId])
            const user_id = (await db.query(`SELECT id FROM users WHERE clerk_id = $1`, [userId])).rows[0].id
          await db.query(`UPDATE instrument SET instrument = $1,  years = $2, level = $3, gig_ready = $4, availability = $5, genre = $6 WHERE user_id = $7`,
          [instrument, years, level, gigReadyBool, availBool, genre, user_id])
        redirect('/profile')
    }
  
     
        return(
            <EditUi submitForm={submitForm}/>
        )
}