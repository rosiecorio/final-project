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

export default async function Page() {
  const db = new pg.Pool({
    connectionString: process.env.DB_CONN,
  });

  const allPosts = (
    await db.query(`SELECT * FROM posts JOIN users ON posts.user_id = users.id`)
  ).rows;

  //   Threads Buttons section

  return (
    <div className="flex flex-col items-center w-full">
      <section className="flex flex-row gap-2 md:gap-5 w-full max-w-4xl py-4 overflow-x-auto">
        <Button variant="outline">General Discussion</Button>
        <Button variant="outline">Music Collaboration</Button>
        <Button variant="outline">Gear Talk</Button>
        <Button variant="outline">Performance Tips</Button>
        <Button variant="outline">Music Theory</Button>
      </section>

      {/* Posts section to display all posts */}
      <section className="flex flex-col w-full max-w-4xl gap-4">
        {allPosts.map((item) => (
          <PostItem key={item.id} item={item} />
        ))}
      </section>

      {/* NEW Post Section  */}

      <section className="py-4">
        <NewPostButton>
          <NewPostForm />
        </NewPostButton>
      </section>
    </div>
  );
}

async function PostItem({ item }) {
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
        <div className="flex gap-2 mt-2">
          <CommentForm postId={item.id} />
        </div>
      </CardContent>
    </Card>
  );
}

/* //           <div className="text-black flex flex-row p-3 gap-5" key={item.id}>
//             <div className="flex flex-row gap-5">
//               <p>profile picture</p>
//               <p>{item.content}</p>
//               <DeletePost />
//             </div>
//             <div>
//               <CommentForm postId={item.id} />
//             </div>
//           </div>
//         ))}
//       </section>

//       <section>
//         <NewPostButton>
//           <NewPostForm />
//         </NewPostButton>
//       </section>

//     </div>
//   );
// } */
