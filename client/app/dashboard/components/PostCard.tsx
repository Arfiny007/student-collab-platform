"use client";

import CommentSection from "./CommentSection";
import API from "../../../lib/api";
import { useEffect, useState } from "react";

export default function PostCard({ post }: any) {
  const [count, setCount] = useState(post.likeCount || 0);
  const [liked, setLiked] = useState(post.liked || false);

  const [polls, setPolls] = useState(post.polls || []);
  const [selected, setSelected] = useState(post.userVote || null);

  const [voting, setVoting] = useState(false);

  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isFollowing, setIsFollowing] = useState(post.isFollowing || false);
  console.log("POST OBJECT:", post);

  // ✅ FIX: get userId AFTER mount
  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (id) setCurrentUserId(Number(id));
  }, []);

  // ✅ VOTE
  const votePoll = async (pollId: number) => {
    if (voting) return;

    try {
      setVoting(true);
      const res = await API.post(`/posts/vote/${pollId}`);
      setPolls(res.data);
      setSelected(pollId);
    } catch {
      console.error("Vote failed");
    } finally {
      setVoting(false);
    }
  };

  const totalVotes = polls.reduce(
    (sum: number, p: any) => sum + p.votes,
    0
  );

  // ✅ FOLLOW
 const [followingLoading, setFollowingLoading] = useState(false);

const handleFollow = async () => {
  if (followingLoading) return;

  try {
    setFollowingLoading(true);

    const res = await API.post(`/follow/${post.author.id}`);
    setIsFollowing(res.data.following);
  } finally {
    setFollowingLoading(false);
  }
};

  const toggleLike = async () => {
    const res = await API.patch(`/posts/${post.id}/toggle-like`);
    setLiked(res.data.liked);
    setCount(res.data.count);
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-5 mb-6 transition hover:shadow-xl">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold">
            {post.author?.email[0].toUpperCase()}
          </div>

          <div>
            <p className="font-semibold">{post.author?.email}</p>
            <p className="text-xs text-gray-400">Just now</p>
          </div>
        </div>

        {/* ✅ FOLLOW BUTTON FIXED */}
        {typeof window !== "undefined" &&
  currentUserId &&
  post?.author?.id &&
  currentUserId !== post.author.id && (
    <button
      onClick={handleFollow}
      className={`text-sm px-3 py-1 rounded-full transition ${
        isFollowing
          ? "bg-gray-200 text-gray-700"
          : "bg-blue-500 text-white"
      }`}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
)}
      </div>

      {/* TITLE */}
      <h2 className="text-lg font-bold mb-2">{post.title}</h2>

      {/* CONTENT */}
      <p className="text-gray-600 mb-3">{post.content}</p>

      {/* IMAGE */}
      {post.image && (
        <img
          src={`http://localhost:5000/${post.image}`}
          className="rounded-xl mb-3 w-full"
        />
      )}

      {/* FILE */}
      {post.file && (
        <a
          href={`http://localhost:5000/${post.file}`}
          target="_blank"
          className="text-blue-600 underline"
        >
          📄 Download File
        </a>
      )}

      {/* POLL */}
      {polls.length > 0 && (
        <div className="mt-4 space-y-3">
          {polls.map((p: any) => {
            const percent = totalVotes
              ? Math.round((p.votes / totalVotes) * 100)
              : 0;

            return (
              <div key={p.id}>
                <button
                  disabled={voting}
                  onClick={() => votePoll(p.id)}
                  className={`w-full text-left p-2 rounded-lg border transition ${
                    selected === p.id
                      ? "bg-blue-100 border-blue-400"
                      : "bg-gray-50 hover:bg-gray-100"
                  } ${voting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {p.option}
                </button>

                <div className="w-full bg-gray-200 h-2 rounded mt-1 overflow-hidden">
                  <div
                    className="bg-blue-500 h-2 rounded transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <p className="text-xs text-gray-500">
                  {percent}% ({p.votes} votes)
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex justify-between mt-4 border-t pt-3">
        <button
          onClick={toggleLike}
          className={`transition ${
            liked ? "text-red-500" : "text-gray-500 hover:text-red-400"
          }`}
        >
          ❤️ {count}
        </button>

        <span className="text-sm text-gray-400">
          Comments
        </span>
      </div>

      <CommentSection postId={post.id} />
    </div>
  );
}