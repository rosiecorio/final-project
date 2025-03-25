'use client'
import { useState } from "react"

export default function NewPostButton({children}) {

    const [showModal, setShowModal] = useState(false)

    function toggleModal() {
        setShowModal(!showModal)
    }

    return (
        <>
            <button onClick={toggleModal}>Make a Post</button>
            {showModal && (<div>{children}</div>)}
        </>
    )
}