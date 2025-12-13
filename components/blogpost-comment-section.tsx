"use client";

import { useState } from "react";
import api from "@/lib/api-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function CommentSection({ comments = [], postId }: { comments: any[]; postId: string }) {
  const queryClient = useQueryClient();

  

  // Form State
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");

  // Submit Comment (Correct API)
  const { mutate: submitComment, isPending } = useMutation({
    mutationFn: async () => {
      return api.post(`/blog/comments/`, {
        content_type: "post",
        post: postId,
        content: comment,
        name,
      });
    },
    onSuccess: () => {
      setName("");
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  return (
    <div className="space-y-10">

      {/* Comment Form */}
      <div className="bg-secondary p-6 rounded-xl border border-border/40 my-5">
        <h3 className="text-xl text-accent font-semibold mb-4">Leave a Comment</h3>

        <div className="space-y-4">
          <Input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Textarea
            placeholder="Your comment..."
            className="min-h-[120px]"
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
        <h3 className="text-xl font-semibold mb-4">
          {comments?.length || 0} Comment{comments?.length === 1 ? "" : "s"}
        </h3>


        {/* Comments */}
        {comments?.length > 0 && (
          <div className="space-y-6">
            {comments.map((item: any) => (
              <div
                key={item.id}
                className="flex gap-3 p-4 bg-secondary rounded-xl border border-border/40"
              >
                <Avatar>
                  <AvatarImage src={item.author_avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {item.name?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.content}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {comments?.length === 0 && (
          <p className="text-muted-foreground">No comments yet — be the first!</p>
        )}
      </div>
    </div>
  );
}
