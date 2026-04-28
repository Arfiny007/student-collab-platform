"use client";

import { useEffect, useState } from "react";
import API from "../../lib/api";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import PostCard from "./components/PostCard";
import CreatePostModal from "./components/CreatePostModal";
import SearchBar from "./components/SearchBar";

export default function Dashboard() {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [messages, setMessages] = useState<string[]>([]);

  // 🔥 LOAD POSTS
  const loadPosts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const res = await API.get(`/posts?page=${page}`);

      if (res.data.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...res.data]);
      }
    } catch (err) {
      console.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  // 📦 FETCH POSTS
  useEffect(() => {
    loadPosts();
  }, [page]);

  // 🔔 FETCH NOTIFICATIONS (FIXED)
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const res = await API.get("/notifications");
        setMessages(res.data.map((n: any) => n.message));
      } catch (err) {
        console.log("No notifications or not logged in");
      }
    };

    loadNotifications();
  }, []);

  // 🔥 INFINITE SCROLL
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 150
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔍 SEARCH
  const filtered = posts.filter((p: any) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-6 max-w-2xl mx-auto">

          {/* CREATE BUTTON */}
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded mb-4 w-full hover:bg-blue-700 transition"
            onClick={() => setShowModal(true)}
          >
            + Create Post
          </button>

          <SearchBar setSearch={setSearch} />

          {/* POSTS */}
          {filtered.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))}

          {/* LOADING */}
          {loading && (
            <p className="text-center text-gray-400 mt-4">
              Loading...
            </p>
          )}

          {!hasMore && (
            <p className="text-center text-gray-400 mt-4">
              No more posts
            </p>
          )}
        </div>

        {/* MODAL */}
        {showModal && (
          <CreatePostModal
            onClose={() => setShowModal(false)}
            refresh={(newPost: any) => {
              setPosts((prev) => [newPost, ...prev]);
            }}
          />
        )}
      </div>
    </div>
  );
}