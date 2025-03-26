'use client'
import { useState } from "react"
// import { handleSubmit } from "@/utils/actions"

export default function NewPostButton({children}) {

    const [showModal, setShowModal] = useState(false)

    function toggleModal() {
        setShowModal(!showModal)
    }

    return (
        <div className="flex flex-col">
            <button className="self-center" onClick={toggleModal}>Make a Post</button>
            {showModal && (<div>{children}</div>)}
          </div>
    )
}