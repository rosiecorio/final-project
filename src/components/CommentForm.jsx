import { useAuth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import pg from "pg";

export default function CommentForm({ postId }) {
  async function handleSubmit({ formData }) {
    "use server";

    const db = new pg.Pool({
      connectionString: process.env.DB_CONN,
    });

    const { userId } = await auth();

    const content = formData.get("comment");

    if (!content.trim()) return;

    try {
      await db.query(
        `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)`,
        [postId, userId, content]
      );
      revalidatePath("/timeline");
    } catch (error) {
      console.error("Error adding comment", error);
    }
  }

  return (
    <form action={handleSubmit} className="mt-4">
      <textarea
        name="content"
        placeholder="Write a comment..."
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-orange-500 text-white rounded"
      >
        Post Comment
      </button>
    </form>
  );
}
