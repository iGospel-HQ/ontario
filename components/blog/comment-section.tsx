"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api-client";
import type { Comment } from "@/types/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/**
 * Comments arrive server-rendered with the post; new comments are appended
 * locally because the cached post page only refreshes periodically.
 */
export function CommentSection({
  comments: initialComments = [],
  postId,
}: {
  comments?: Comment[];
  postId: string;
}) {
  const [comments, setComments] = useState(initialComments);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");

  const { mutate: submitComment, isPending } = useMutation({
    mutationFn: async () => {
      const res = await api.post<Comment>(`/blog/comments/`, {
        content_type: "post",
        post: postId,
        content: comment,
        name,
      });
      return res.data;
    },
    onSuccess: (created) => {
      setComments((current) => [...current, { ...created, name: created.name ?? name }]);
      setName("");
      setComment("");
    },
  });

  return (
    <section className="space-y-10" aria-labelledby="comments-heading">
      {/* Comment Form */}
      <div className="bg-secondary p-6 rounded-xl border border-border/40 my-5">
        <h2 className="text-xl text-accent font-semibold mb-4">Leave a Comment</h2>

        <div className="space-y-4">
          <Input
            className="border-accent"
            placeholder="Your name"
            aria-label="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Textarea
            placeholder="Your comment..."
            aria-label="Your comment"
            className="min-h-[120px] border-accent"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <Button
            className="w-full bg-accent text-md py-5"
            disabled={isPending || !name || !comment}
            onClick={() => submitComment()}
          >
            {isPending ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div>
        <h2 id="comments-heading" className="text-xl font-semibold mb-4">
          {comments.length} Comment{comments.length === 1 ? "" : "s"}
        </h2>

        {comments.length > 0 && (
          <div className="space-y-6">
            {comments.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-4 bg-secondary rounded-xl border border-border/40"
              >
                <Avatar>
                  <AvatarImage src={item.author_avatar || undefined} />
                  <AvatarFallback>{item.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <time dateTime={item.created_at} suppressHydrationWarning>
                      {new Date(item.created_at).toLocaleDateString()}
                    </time>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {comments.length === 0 && (
          <p className="text-muted-foreground">No comments yet — be the first!</p>
        )}
      </div>
    </section>
  );
}
