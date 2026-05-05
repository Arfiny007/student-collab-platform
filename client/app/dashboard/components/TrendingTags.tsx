"use client";

import {
  useEffect,
  useState,
} from "react";

import API from "../../../lib/api";

export default function TrendingTags() {
  const [tags, setTags] =
    useState<any[]>([]);

  useEffect(() => {
    API.get(
      "/posts/trending",
    ).then(
      (res) =>
        setTags(
          res.data,
        ),
    );
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow">

      <h2 className="font-bold mb-5 text-xl">
        Trending
      </h2>

      <div className="space-y-4">

        {tags.map(
          (
            tag,
            i,
          ) => (
            <div
              key={i}
              className="flex justify-between"
            >
              <p>
                {tag[0]}
              </p>

              <p className="text-gray-400">
                {tag[1]}
              </p>
            </div>
          ),
        )}

      </div>

    </div>
  );
}