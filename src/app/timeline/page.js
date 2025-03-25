import NewPostButton from "@/components/NewPostButton"
import pg from "pg"

export default async function Page() {

    const db = new pg.Pool({
        connectionString: process.env.DB_CONN
    })

    const allPosts = (await db.query(`SELECT * FROM posts`)).rows

    return (
        <div className="flex flex-col items-center">
            <section className="flex flex-row pb-5">
                <button>General Discussion</button>
                <button>Music Collaboration</button>
                <button>Gear Talk</button>
                <button>Performance Tips</button>
                <button>Music Theory</button>
            </section>
            <section className="flex flex-col h-[70vh] w-[90vw] bg-slate-200 items-center gap-5">
                {allPosts.map((item) => (
                    <div className="text-black flex flex-row p-3" key={item.id}>
                        <p>profile picture</p>
                        <p>{item.content}</p>
                    </div>
                ))}
            </section>
            <section>
                <NewPostButton/>
            </section>
        </div>
    )
}