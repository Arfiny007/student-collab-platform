"use client";

import {
  useEffect,
  useState,
} from "react";

import API from "../../../lib/api";

import {
  useParams,
} from "next/navigation";

export default function PublicProfile() {
  const params =
    useParams();

  const [user, setUser] =
    useState<any>(
      null,
    );

  const [posts, setPosts] =
    useState<any[]>(
      [],
    );

  const [followers, setFollowers] =
    useState<any[]>(
      [],
    );

  const [following, setFollowing] =
    useState<any[]>(
      [],
    );

  const [showFollowers, setShowFollowers] =
    useState(
      false,
    );

  const [showFollowing, setShowFollowing] =
    useState(
      false,
    );

  useEffect(() => {
    const load =
      async () => {
        const id =
          params.id;

        const profile =
          await API.get(
            `/users/${id}`,
          );

        const posts =
          await API.get(
            `/users/${id}/posts`,
          );

        const followers =
          await API.get(
            `/follow/${id}/followers`,
          );

        const following =
          await API.get(
            `/follow/${id}/following`,
          );

        setUser(
          profile.data,
        );

        setPosts(
          posts.data,
        );

        setFollowers(
          followers.data,
        );

        setFollowing(
          following.data,
        );
      };

    load();
  }, []);

  if (!user)
    return (
      <div>
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100">

      {/* COVER */}
      <div className="h-64 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500" />

      <div className="max-w-6xl mx-auto px-5">

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 -mt-24">

          {/* HEADER */}
          <div className="flex gap-6">

            <img
              src={
                user.avatar
                  ? `http://localhost:5000/${user.avatar}`
                  : "https://placehold.co/200"
              }
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
            />

            <div>

              <h1 className="text-4xl font-bold">
                {
                  user.username
                }
              </h1>

              <p className="text-gray-500">
                {
                  user.email
                }
              </p>

              <p className="mt-2">
                {user.bio ||
                  "No bio yet"}
                  <button
  onClick={() => {
    localStorage.setItem(
      "chatUser",
      JSON.stringify(
        user,
      ),
    );

    window.dispatchEvent(
      new Event(
        "open-chat",
      ),
    );
  }}
  className="mt-4 bg-gradient-to-r from-green-500 to-blue-600 text-white px-5 py-2 rounded-xl"
>
  Message
</button>
              </p>

            </div>

          </div>

          {/* STATS */}
          <div className="grid grid-cols-3 gap-5 mt-8">

            <div className="bg-blue-50 p-5 rounded-2xl text-center">
              <p className="text-3xl font-bold">
                {
                  posts.length
                }
              </p>

              <p>
                Posts
              </p>
            </div>

            <div
              onClick={() =>
                setShowFollowers(
                  true,
                )
              }
              className="bg-purple-50 p-5 rounded-2xl text-center cursor-pointer"
            >
              <p className="text-3xl font-bold">
                {
                  followers.length
                }
              </p>

              <p>
                Followers
              </p>
            </div>

            <div
              onClick={() =>
                setShowFollowing(
                  true,
                )
              }
              className="bg-pink-50 p-5 rounded-2xl text-center cursor-pointer"
            >
              <p className="text-3xl font-bold">
                {
                  following.length
                }
              </p>

              <p>
                Following
              </p>
            </div>

          </div>

          {/* POSTS GRID */}
          <div className="grid grid-cols-3 gap-5 mt-10">

            {posts.map(
              (
                post,
              ) => (
                <div
                  key={
                    post.id
                  }
                  className="bg-white rounded-2xl shadow p-4"
                >

                  {post.image && (
                    <img
                      src={`http://localhost:5000/${post.image}`}
                      className="rounded-xl mb-3"
                    />
                  )}

                  <p className="font-semibold">
                    {
                      post.title
                    }
                  </p>

                </div>
              ),
            )}

          </div>

        </div>

      </div>

      {/* FOLLOWERS MODAL */}
      {showFollowers && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

          <div className="bg-white rounded-3xl p-6 w-[400px]">

            <h2 className="text-xl font-bold mb-4">
              Followers
            </h2>

            {followers.map(
              (
                f,
              ) => (
                <p
                  key={
                    f.id
                  }
                  className="py-2"
                >
                  {
                    f.follower
                      .username
                  }
                </p>
              ),
            )}

          </div>

        </div>
      )}

      {/* FOLLOWING */}
      {showFollowing && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

          <div className="bg-white rounded-3xl p-6 w-[400px]">

            <h2 className="text-xl font-bold mb-4">
              Following
            </h2>

            {following.map(
              (
                f,
              ) => (
                <p
                  key={
                    f.id
                  }
                  className="py-2"
                >
                  {
                    f.following
                      .username
                  }
                </p>
              ),
            )}

          </div>

        </div>
      )}

    </div>
  );
}