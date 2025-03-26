"use client";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

export default function CommentForm({ postId }) {
  const [comment, setComment] = useState("");
  const { userId } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!comment.trim()) return;

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, userId, content: comment }),
      });

      if (response.ok) {
        setComment("");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
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
