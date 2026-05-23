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

  const [initialLoading, setInitialLoading] =
    useState(true);

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
      } catch {
        if (page === 1) {
          setHasMore(false);
        }
      } finally {
        setLoading(
          false,
        );
        if (page === 1) {
          setInitialLoading(false);
        }
      }
    };

  useEffect(() => {
    loadPosts();
  }, [page]);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      API.get("/users/stories"),
      API.get("/users/suggested"),
    ])
      .then(([storiesRes, suggestedRes]) => {
        if (cancelled) return;
        setStories(storiesRes.data);
        setSuggested(suggestedRes.data);
      })
      .catch(() => {
        if (!cancelled) {
          setStories([]);
          setSuggested([]);
        }
      });

    return () => {
      cancelled = true;
    };
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

      <div className="flex-1 min-h-screen min-w-0 bg-gray-100 dark:bg-gray-950">

        <Navbar />

        <div className="mx-auto grid max-w-[1700px] grid-cols-1 gap-6 p-4 sm:gap-8 sm:p-6 lg:grid-cols-12">

          {/* FEED */}
          <div className="min-w-0 lg:col-span-8">

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
                      alt={`${story.user.username}'s story`}
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

            {initialLoading && (
              <PostCard loading />
            )}

            {!initialLoading &&
              filtered.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}

            {loading && !initialLoading && (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Loading more posts…
              </p>
            )}

          </div>

          {/* RIGHT */}
          <div className="min-w-0 space-y-6 lg:col-span-4">

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
                      alt={`${user.username}'s avatar`}
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
              alt={`Story by ${selectedStory.user?.username ?? "user"}`}
              className="max-h-[90vh] max-w-[min(100vw-2rem,42rem)] rounded-3xl object-contain"
            />

          </div>
        )}

      </div>

    </div>
  );
}