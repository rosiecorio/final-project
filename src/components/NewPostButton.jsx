'use client'
import { useState } from "react"
import { handleSubmit } from "@/utils/actions"

export default function NewPostButton() {

    const [showModal, setShowModal] = useState(false)

    function toggleModal() {
        setShowModal(!showModal)
    }

    return (
        <>
            <button onClick={toggleModal}>Make a Post</button>
            {showModal ? 
            <form action={handleSubmit} className="flex flex-col items-start text-black">
                <label htmlFor="content">Write a Post..</label>
                <textarea id="content" name="content"></textarea>
                <label htmlFor="thread_id">Category:</label>                
                <input type="radio" name="thread_id" id="Discussion" value="General Discussion"></input>
                <label htmlFor="Discussion">General Discussion</label>
                <input type="radio" name="thread_id" id="Collaboration" value="Music Collaboration"></input>
                <label htmlFor="Collaboration">Music Collaboration</label>
                <input type="radio" name="thread_id" id="Gear" value="Gear Talk"></input>
                <label htmlFor="Gear">Gear Talk</label>
                <input type="radio" name="thread_id" id="Tips" value="Performance Tips"></input>
                <label htmlFor="Tips">Performance Tips</label>
                <input type="radio" name="thread_id" id="Theory" value="Music Theory"></input>
                <label htmlFor="Theory">Music Theory</label>
            </form> : ''}
        </>
    )
}