'use client'

export default function DeletePost({id}) {
    return (
        <button onClick={() => {
            handlePostDelete(id)
        }}>X</button>
    )
}