import DeletePost from "@/components/DeletePost"
import NewPostButton from "@/components/NewPostButton"
import NewPostForm from "@/components/NewPostForm"
import pg from "pg"

export default async function Page() {

    const db = new pg.Pool({
        connectionString: process.env.DB_CONN
    })

    const allPosts = (await db.query(`SELECT * FROM posts`)).rows

    return (
        <div className="flex flex-col items-center">
            <section className="flex flex-row gap-5 w-[90vw] pb-5">
                <button>General Discussion</button>
                <button>Music Collaboration</button>
                <button>Gear Talk</button>
                <button>Performance Tips</button>
                <button>Music Theory</button>
            </section>
            <section className="flex flex-col h-[70vh] w-[90vw] bg-slate-200 items-start gap-5">
                {allPosts.map((item) => (
                    <div className="text-black flex flex-row p-3 gap-5" key={item.id}>
                        <p>profile picture</p>
                        <p>{item.content}</p>
                        <DeletePost />
                    </div>
                ))}
            </section>
            <section>
                <NewPostButton><NewPostForm /></NewPostButton>
            </section>
        </div>
    )
}