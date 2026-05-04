"use client";

import CommentSection from "./CommentSection";
import API from "../../../lib/api";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

export default function PostCard({
  post,
}: any) {
  if (!post) return null;

  const router =
    useRouter();

  const [count, setCount] =
    useState(
      post.likeCount || 0,
    );

  const [liked, setLiked] =
    useState(
      post.liked || false,
    );

  const [polls, setPolls] =
    useState(
      post.polls || [],
    );

  const [selected, setSelected] =
    useState(
      post.userVote ||
        null,
    );

  const [voting, setVoting] =
    useState(
      false,
    );

  const [currentUserId, setCurrentUserId] =
    useState<number | null>(
      null,
    );

  const [isFollowing, setIsFollowing] =
    useState(
      post.isFollowing ||
        false,
    );

  useEffect(() => {
    const id =
      localStorage.getItem(
        "userId",
      );

    if (id) {
      setCurrentUserId(
        Number(id),
      );
    }
  }, []);

  const totalVotes =
    polls.reduce(
      (
        sum: number,
        p: any,
      ) =>
        sum +
        p.votes,
      0,
    );

  const votePoll =
    async (
      pollId: number,
    ) => {
      if (
        voting
      )
        return;

      setVoting(
        true,
      );

      const res =
        await API.post(
          `/posts/vote/${pollId}`,
        );

      setPolls(
        res.data,
      );

      setSelected(
        pollId,
      );

      setVoting(
        false,
      );
    };

  const handleFollow =
    async () => {
      const res =
        await API.post(
          `/follow/${post.author.id}`,
        );

      setIsFollowing(
        res.data.following,
      );
    };

  const toggleLike =
    async () => {
      const res =
        await API.patch(
          `/posts/${post.id}/toggle-like`,
        );

      setLiked(
        res.data.liked,
      );

      setCount(
        res.data.count,
      );
    };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 mb-6">

      {/* HEADER */}
      <div className="flex justify-between mb-4">

        <div className="flex gap-3 items-center">

          <img
            src={
              post.author
                ?.avatar
                ? `http://localhost:5000/${post.author.avatar}`
                : "https://placehold.co/100"
            }
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 cursor-pointer"
            onClick={() =>
              router.push(
                `/profile/${post.author.id}`,
              )
            }
          />

          <div>

            <p
              onClick={() =>
                router.push(
                  `/profile/${post.author.id}`,
                )
              }
              className="font-semibold cursor-pointer hover:text-blue-600"
            >
              {post.author
                ?.username}
            </p>

            <p className="text-xs text-gray-400">
              {post.author
                ?.email}
            </p>

          </div>

        </div>

        {post.author
          ?.id !==
          currentUserId && (
          <button
            onClick={
              handleFollow
            }
            className={`px-4 py-2 rounded-full text-sm ${
              isFollowing
                ? "bg-gray-200"
                : "bg-blue-600 text-white"
            }`}
          >
            {isFollowing
              ? "Following"
              : "Follow"}
          </button>
        )}

      </div>

      <h2 className="font-bold text-xl mb-2">
        {post.title}
      </h2>

      <p className="text-gray-600 mb-4">
        {post.content}
      </p>

      {post.image && (
        <img
          src={`http://localhost:5000/${post.image}`}
          className="rounded-2xl mb-4"
        />
      )}

      {post.file && (
        <a
          href={`http://localhost:5000/${post.file}`}
          target="_blank"
          className="text-blue-600"
        >
          📄 Download File
        </a>
      )}

      {/* POLL */}
      {polls.length >
        0 && (
        <div className="space-y-3 mt-4">

          {polls.map(
            (
              p: any,
            ) => {
              const percent =
                totalVotes
                  ? Math.round(
                      (p.votes /
                        totalVotes) *
                        100,
                    )
                  : 0;

              return (
                <div
                  key={
                    p.id
                  }
                >

                  <button
                    onClick={() =>
                      votePoll(
                        p.id,
                      )
                    }
                    disabled={
                      voting
                    }
                    className={`w-full p-3 rounded-xl text-left ${
                      selected ===
                      p.id
                        ? "bg-blue-100"
                        : "bg-gray-100"
                    }`}
                  >
                    {
                      p.option
                    }
                  </button>

                  <div className="h-2 bg-gray-200 rounded mt-1 overflow-hidden">

                    <div
                      className="h-2 bg-blue-500 transition-all duration-700"
                      style={{
                        width: `${percent}%`,
                      }}
                    />

                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    {
                      percent
                    }
                    % (
                    {
                      p.votes
                    }{" "}
                    votes)
                  </p>

                </div>
              );
            },
          )}

        </div>
      )}

      {/* ACTION */}
      <div className="flex justify-between mt-5 border-t pt-4">

        <button
          onClick={
            toggleLike
          }
          className={`${
            liked
              ? "text-red-500"
              : ""
          }`}
        >
          ❤️{" "}
          {
            count
          }
        </button>

      </div>

      <CommentSection
        postId={
          post.id
        }
      />

    </div>
  );
}