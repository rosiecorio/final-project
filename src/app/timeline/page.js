import DeletePost from "@/components/DeletePost";
import NewPostButton from "@/components/NewPostButton";
import NewPostForm from "@/components/NewPostForm";
import CommentForm from "@/components/CommentForm";
import pg from "pg";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link"
import WritePostButton from "@/components/WritePostButton";

export default async function Page() {
  const db = new pg.Pool({
    connectionString: process.env.DB_CONN,
  });

  const allPosts = (
    await db.query(`SELECT posts.*,  users.username, users.id AS user_id FROM posts 
      JOIN users ON posts.user_id = users.id`)
  ).rows;

  //   Threads Buttons section

  const threads = (await db.query(`SELECT * FROM threads`)).rows

  return (
    <div className="flex flex-col items-center w-full">
      <section className="flex flex-row gap-2 md:gap-5 w-full max-w-4xl py-4 overflow-x-auto">
        {threads.map((thread) => (
          <Button key={thread.id} variant="outline" asChild><Link href={`/timeline/${thread.id}`}>{thread.type}</Link></Button>
        ))}        
      </section>

      {/* Posts section to display all posts */}
      <section className="flex flex-col w-full max-w-4xl gap-4">
        {allPosts.map((item) => (
          <PostItem key={item.id} item={item} user_id={item.user_id} />
        ))}
      </section>

      {/* NEW Post Section  */}
      <section>
      <WritePostButton />
      </section>
    </div>
  );
}

async function PostItem({ item }) {
  const db = new pg.Pool({
    connectionString: process.env.DB_CONN,
  });

  const allComments = (
    await db.query(
      `SELECT comments.*, users.username FROM comments JOIN users ON comments.user_id = users.id WHERE post_id = $1`,
      [item.id]
    )
  ).rows;

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={`https://avatar.vercel.sh/${item.username}.jpeg`} />
          <AvatarFallback>
            {item.username.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">{item.username}</h4>
          <p className="text-sm text-gray-500">Date Posted</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{item.content}</p>
        <div className="row mt-4">
          {allComments.map((comment) => (
            <div
              key={comment.id}
              className="flex items-center space-x-2 py-2 border-b last:border-b-0"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${comment.username}.jpeg`}
                />
                <AvatarFallback>
                  {comment.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <p className="text-sm font-medium leading-none">
                  {comment.username}
                </p>
                <p className="text-xs text-gray-500">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <CommentForm postId={item.id} />
        </div>
      </CardContent>
    </Card>
  );
}
