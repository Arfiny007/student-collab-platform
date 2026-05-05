"use client";

import {
  useEffect,
  useState,
} from "react";

import API from "../../lib/api";

export default function AnalyticsPage() {
  const [data, setData] =
    useState<any>(
      null,
    );

  useEffect(() => {
    API.get(
      "/users/analytics",
    ).then(
      (
        res,
      ) =>
        setData(
          res.data,
        ),
    );
  }, []);

  if (
    !data
  ) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-10 min-h-screen bg-gray-100 dark:bg-gray-950">

      <h1 className="text-5xl font-bold mb-10">
        Analytics
      </h1>

      <div className="grid grid-cols-3 gap-8">

        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow">

          <p className="text-gray-400">
            Profile Views
          </p>

          <h2 className="text-5xl font-bold mt-3">
            {
              data.views
            }
          </h2>

        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow">

          <p className="text-gray-400">
            Followers
          </p>

          <h2 className="text-5xl font-bold mt-3">
            {
              data.followers
            }
          </h2>

        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow">

          <p className="text-gray-400">
            Posts
          </p>

          <h2 className="text-5xl font-bold mt-3">
            {
              data.posts
            }
          </h2>

        </div>

      </div>

    </div>
  );
}