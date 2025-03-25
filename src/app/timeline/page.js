import pg from "pg"

export default async function Page() {

    const db = new pg.Pool({
        connectionString: process.env.DB_CONN
    })

    const allPosts = (await db.query(`SELECT * FROM posts`)).rows
    console.log(allPosts)

    return (
        <div className="flex flex-col items-center">
            <section className="flex flex-col h-[80vh] w-[90vw] bg-slate-700">
                {allPosts.map((item) => (
                    <div className="text-white" key={item.id}>
                        <p>profile picture</p>
                        <p>{item.content}</p>
                    </div>
                ))}
            </section>
            <section>
                <button>Create New Post</button>
            </section>
        </div>
    )
}