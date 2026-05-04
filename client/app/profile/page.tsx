"use client";

import {
  useEffect,
  useState,
} from "react";

import API from "../../lib/api";
import EditProfileModal from "../dashboard/components/EditProfileModal";
export default function ProfilePage() {
  const [user, setUser] =
    useState<any>(null);

  const [editing, setEditing] =
    useState(false);

  const loadProfile =
    async () => {
      const res =
        await API.get(
          "/users/me",
        );

      setUser(res.data);
    };

  useEffect(() => {
    loadProfile();
  }, []);

  if (!user) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  const fields = [
    user.avatar,
    user.bio,
    user.university,
    user.department,
    user.location,
    user.github,
    user.linkedin,
    user.portfolio,
    user.skills,
  ];

  const completed =
    fields.filter(
      Boolean,
    ).length;

  const completion =
    Math.round(
      (completed /
        fields.length) *
        100,
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100">

      {/* COVER */}
      <div className="h-60 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500" />

      <div className="max-w-5xl mx-auto px-5">

        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl -mt-24 p-8">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row gap-6">

            <img
              src={
                user.avatar
                  ? `http://localhost:5000/${user.avatar}`
                  : "https://placehold.co/200"
              }
              className="w-36 h-36 rounded-full border-4 border-white object-cover shadow-lg"
            />

            <div className="flex-1">

              <h1 className="text-4xl font-bold">
                {user.username}
              </h1>

              <p className="text-gray-500">
                {user.email}
              </p>

              <p className="mt-3 text-gray-700">
                {user.bio ||
                  "Tell the world about yourself"}
              </p>

              <button
                onClick={() =>
                  setEditing(
                    true,
                  )
                }
                className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-xl"
              >
                Edit Profile
              </button>

            </div>

            {/* COMPLETION */}
            <div className="text-center">

              <div className="w-24 h-24 rounded-full border-4 border-blue-500 flex items-center justify-center text-xl font-bold">
                {
                  completion
                }
                %
              </div>

              <p className="text-sm mt-2 text-gray-500">
                Complete
              </p>

            </div>

          </div>

          {/* STATS */}
          <div className="grid grid-cols-3 gap-4 mt-10">

            {[
              [
                "Posts",
                user.posts,
              ],
              [
                "Followers",
                user.followers,
              ],
              [
                "Following",
                user.following,
              ],
            ].map(
              (
                item,
              ) => (
                <div
                  key={
                    item[0]
                  }
                  className="bg-gradient-to-r from-blue-50 to-purple-50 p-5 rounded-2xl text-center"
                >
                  <p className="text-3xl font-bold">
                    {
                      item[1]
                    }
                  </p>

                  <p className="text-gray-500">
                    {
                      item[0]
                    }
                  </p>

                </div>
              ),
            )}

          </div>

          {/* SKILLS */}
          {user.skills && (
            <div className="mt-10">

              <h2 className="font-bold text-xl mb-3">
                Skills
              </h2>

              <div className="flex flex-wrap gap-3">

                {user.skills
                  .split(
                    ",",
                  )
                  .map(
                    (
                      skill: string,
                    ) => (
                      <span
                        key={
                          skill
                        }
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full"
                      >
                        {
                          skill
                        }
                      </span>
                    ),
                  )}

              </div>

            </div>
          )}

          {/* LINKS */}
          <div className="flex gap-4 mt-8">

            {user.github && (
              <a
                href={
                  user.github
                }
                target="_blank"
                className="text-blue-600"
              >
                GitHub
              </a>
            )}

            {user.linkedin && (
              <a
                href={
                  user.linkedin
                }
                target="_blank"
                className="text-blue-600"
              >
                LinkedIn
              </a>
            )}

            {user.portfolio && (
              <a
                href={
                  user.portfolio
                }
                target="_blank"
                className="text-blue-600"
              >
                Portfolio
              </a>
            )}

          </div>

        </div>

      </div>

      {editing && (
        <EditProfileModal
          user={user}
          onClose={() =>
            setEditing(
              false,
            )
          }
          refresh={
            loadProfile
          }
        />
      )}

    </div>
  );
}