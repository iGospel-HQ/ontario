"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api-client";
import type { Comment } from "@/types/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ShownComment = Comment & { pending?: boolean };

/**
 * Approved comments arrive server-rendered with the post. A newly posted
 * comment needs approval in the admin, so it's shown only to its author,
 * marked as awaiting moderation; once approved, Django refreshes the page.
 */
export function CommentSection({
  comments: initialComments = [],
  postId,
}: {
  comments?: Comment[];
  postId: string;
}) {
  const [comments, setComments] = useState<ShownComment[]>(initialComments);
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
      setComments((current) => [...current, { ...created, name: created.name ?? name, pending: true }]);
      setName("");
      setComment("");
    },
  });

  return (
    <section className="space-y-10 border-t border-rule pt-10" aria-labelledby="comments-heading">
      {/* Comments list */}
      <div>
        <h2 id="comments-heading" className="widget-title">
          <span>
            {comments.length} Comment{comments.length === 1 ? "" : "s"}
          </span>
        </h2>

        {comments.length > 0 ? (
          <ol className="divide-y divide-rule">
            {comments.map((item) => (
              <li key={item.id} className="flex gap-4 py-5 first:pt-0">
                <Avatar className="h-12 w-12 rounded-none">
                  <AvatarImage src={item.author_avatar || undefined} />
                  <AvatarFallback className="rounded-none bg-shade font-bold text-meta">
                    {item.name?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <p className="font-bold text-text">{item.name}</p>
                  <p className="entry-meta">
                    <time dateTime={item.created_at} suppressHydrationWarning>
                      {new Date(item.created_at).toLocaleDateString()}
                    </time>
                  </p>
                  {item.pending && (
                    <p className="mt-1 text-[13px] italic text-accent">Your comment is awaiting moderation.</p>
                  )}
                  <p className="mt-2 text-[15px] leading-relaxed text-[#444]">{item.content}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-meta">No comments yet — be the first!</p>
        )}
      </div>

      {/* Comment form */}
      <div>
        <h2 className="widget-title">
          <span>Leave a Comment</span>
        </h2>

        <div className="space-y-4 [&_input]:rounded-none [&_textarea]:rounded-none">
          <Input
            className="h-11 border-rule bg-white focus-visible:border-accent"
            placeholder="Your name"
            aria-label="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Textarea
            placeholder="Your comment..."
            aria-label="Your comment"
            className="min-h-[140px] border-rule bg-white focus-visible:border-accent"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <Button
            className="h-11 rounded-none bg-accent px-8 text-[13px] font-bold uppercase tracking-wider hover:bg-topbar"
            disabled={isPending || !name || !comment}
            onClick={() => submitComment()}
          >
            {isPending ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </div>
    </section>
  );
}
