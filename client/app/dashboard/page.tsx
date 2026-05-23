"use client";

import {
  useEffect,
  useState,
} from "react";

import API from "../../lib/api";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import PostCard from "./components/PostCard";
import CreatePostModal from "./components/CreatePostModal";
import SearchBar from "./components/SearchBar";
import TrendingTags from "./components/TrendingTags";
import { getAvatarUrl, getMediaUrl } from "@/lib/media";
import { DEFAULT_AVATAR } from "@/lib/media";

export default function Dashboard() {
  const [posts, setPosts] =
    useState<any[]>([]);

  const [stories, setStories] =
    useState<any[]>([]);

  const [suggested, setSuggested] =
    useState<any[]>([]);

  const [selectedStory, setSelectedStory] =
    useState<any>(null);

  const [page, setPage] =
    useState(1);

  const [showModal, setShowModal] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [hasMore, setHasMore] =
    useState(true);

  const loadPosts =
    async () => {
      if (
        loading ||
        !hasMore
      )
        return;

      setLoading(true);

      try {
        const res =
          await API.get(
            `/posts?page=${page}`,
          );

        if (
          res.data
            .length ===
          0
        ) {
          setHasMore(
            false,
          );
        } else {
          setPosts(
            (
              prev,
            ) => [
              ...prev,
              ...res.data,
            ],
          );
        }
      } finally {
        setLoading(
          false,
        );
      }
    };

  useEffect(() => {
    loadPosts();
  }, [page]);

  useEffect(() => {
    API.get(
      "/users/stories",
    ).then(
      (
        res,
      ) =>
        setStories(
          res.data,
        ),
    );

    API.get(
      "/users/suggested",
    ).then(
      (
        res,
      ) =>
        setSuggested(
          res.data,
        ),
    );
  }, []);

  useEffect(() => {
    const handleScroll =
      () => {
        if (
          window
            .innerHeight +
            window.scrollY >=
          document
            .body
            .offsetHeight -
            150
        ) {
          setPage(
            (
              prev,
            ) =>
              prev +
              1,
          );
        }
      };

    window.addEventListener(
      "scroll",
      handleScroll,
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll,
      );
  }, []);

  const filtered =
    posts.filter(
      (
        p,
      ) =>
        p.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase(),
          ),
    );

  const uploadStory =
    async (
      e: any,
    ) => {
      const file =
        e.target
          .files[0];

      if (
        !file
      )
        return;

      const form =
        new FormData();

      form.append(
        "file",
        file,
      );

      await API.post(
        "/users/story",
        form,
      );

      window.location.reload();
    };

  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 bg-gray-100 dark:bg-gray-950 min-h-screen">

        <Navbar />

        <div className="max-w-[1700px] mx-auto p-6 grid grid-cols-12 gap-8">

          {/* FEED */}
          <div className="col-span-8">

            {/* STORIES */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow mb-6 flex gap-5 overflow-x-auto">

              <label className="cursor-pointer">

                <input
                  hidden
                  type="file"
                  onChange={
                    uploadStory
                  }
                />

                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-4xl flex items-center justify-center">
                  +
                </div>

              </label>

              {stories.map(
                (
                  story,
                ) => (
                  <div
                    key={
                      story.id
                    }
                    onClick={() =>
                      setSelectedStory(
                        story,
                      )
                    }
                    className="cursor-pointer"
                  >

                    <img
                      src={
                        getAvatarUrl(
                          story.user.avatar,
                          story.user.id,
                        ) || DEFAULT_AVATAR
                      }
                      loading="lazy"
                      className="w-20 h-20 rounded-full border-4 border-pink-500 object-cover"
                    />

                    <p className="text-xs text-center mt-2">

                      {
                        story
                          .user
                          .username
                      }

                    </p>

                  </div>
                ),
              )}

            </div>

            <button
              className="bg-blue-600 text-white px-4 py-3 rounded-2xl mb-5 w-full"
              onClick={() =>
                setShowModal(
                  true,
                )
              }
            >
              + Create Post
            </button>

            <SearchBar
              setSearch={
                setSearch
              }
            />

            {filtered.map(
              (
                post,
              ) => (
                <PostCard
                  key={
                    post.id
                  }
                  post={
                    post
                  }
                />
              ),
            )}

          </div>

          {/* RIGHT */}
          <div className="col-span-4 space-y-6">

            <TrendingTags />

            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow">

              <h2 className="font-bold text-xl mb-5">
                Suggested
              </h2>

              {suggested.map(
                (
                  user,
                ) => (
                  <div
                    key={
                      user.id
                    }
                    className="flex gap-4 mb-5"
                  >

                    <img
                      src={
                        getAvatarUrl(
                          user.avatar,
                          user.id,
                        ) || DEFAULT_AVATAR
                      }
                      loading="lazy"
                      className="w-14 h-14 rounded-full object-cover"
                    />

                    <div>

                      <p className="font-bold">

                        {
                          user.username
                        }

                        {user.verified && (
                          <span className="ml-2 text-blue-500">
                            ✔️
                          </span>
                        )}

                      </p>

                      <p className="text-sm text-gray-400">
                        {
                          user.email
                        }
                      </p>

                    </div>

                  </div>
                ),
              )}

            </div>

          </div>

        </div>

        {showModal && (
          <CreatePostModal
            onClose={() =>
              setShowModal(
                false,
              )
            }
            refresh={(
              newPost: any,
            ) =>
              setPosts(
                (
                  prev,
                ) => [
                  newPost,
                  ...prev,
                ],
              )
            }
          />
        )}

        {/* STORY VIEWER */}
        {selectedStory && (
          <div
            onClick={() =>
              setSelectedStory(
                null,
              )
            }
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
          >

            <img
              src={getMediaUrl(selectedStory.media) || ""}
              className="max-h-[90vh] rounded-3xl"
            />

          </div>
        )}

      </div>

    </div>
  );
}