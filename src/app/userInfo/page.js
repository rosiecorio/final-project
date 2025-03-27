import UserInfoForm from "@/components/UserInfoForm";
import { auth } from "@clerk/nextjs/server";
import pg from "pg"
import { redirect } from "next/navigation";

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
        
         await db.query(`INSERT INTO users (clerk_id, username, bio, post_code) VALUES ($1, $2, $3, $4)`, [userId, username, bio, post_code])
            const user_id = (await db.query(`SELECT id FROM users WHERE clerk_id = $1`, [userId])).rows[0].id
          await db.query(`INSERT INTO instrument (instrument, years, level, gig_ready, availability, genre, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7)`, 
          [instrument, years, level, gigReadyBool, availBool, genre, user_id])
        redirect('/profile')
    }
  
     
        return(
                <UserInfoForm submitForm={submitForm} />
        )
}