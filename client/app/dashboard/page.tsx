"use client";

import { useEffect, useState } from "react";
import API from "../../lib/api";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import PostCard from "./components/PostCard";
import CreatePostModal from "./components/CreatePostModal";
import SearchBar from "./components/SearchBar";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const loadPosts = async () => {
    const res = await API.get("/posts");
    setPosts(res.data);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const filtered = posts.filter((p: any) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-6">

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
            onClick={() => setShowModal(true)}
          >
            + Create Post
          </button>

          <SearchBar setSearch={setSearch} />

          {filtered.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))}

        </div>

        {showModal && (
          <CreatePostModal
            onClose={() => setShowModal(false)}
            refresh={loadPosts}
          />
        )}
      </div>
    </div>
  );
}