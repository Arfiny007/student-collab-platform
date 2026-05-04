"use client";

import {
  useEffect,
  useState,
} from "react";

import API from "../../../lib/api";

export default function FloatingMessenger() {
  const [open, setOpen] =
    useState(false);

  const [messages, setMessages] =
    useState<any[]>([]);

  const [text, setText] =
    useState("");

  const [chatUser, setChatUser] =
    useState<any>(
      null,
    );

  useEffect(() => {
    if (
      typeof window ===
      "undefined"
    )
      return;

    const load =
      async () => {
        const saved =
          localStorage.getItem(
            "chatUser",
          );

        if (
          !saved
        )
          return;

        const user =
          JSON.parse(
            saved,
          );

        setChatUser(
          user,
        );

        const res =
          await API.get(
            `/chat/${user.id}`,
          );

        setMessages(
          res.data,
        );
      };

    load();

    const openChat =
      () =>
        setOpen(
          true,
        );

    window.addEventListener(
      "open-chat",
      openChat,
    );

    return () =>
      window.removeEventListener(
        "open-chat",
        openChat,
      );
  }, []);

  const send =
    async () => {
      if (
        !text.trim() ||
        !chatUser
      )
        return;

      const res =
        await API.post(
          `/chat/${chatUser.id}`,
          {
            text,
          },
        );

      setMessages(
        (
          prev,
        ) => [
          ...prev,
          res.data,
        ],
      );

      setText(
        "",
      );
    };

  if (
    !chatUser
  )
    return null;

  return (
    <div className="fixed bottom-5 right-5 z-50">

      <button
        onClick={() =>
          setOpen(
            !open,
          )
        }
        className="w-16 h-16 rounded-full bg-blue-600 text-white text-2xl"
      >
        💬
      </button>

      {open && (
        <div className="absolute bottom-20 right-0 w-[350px] h-[500px] bg-white rounded-3xl shadow-2xl flex flex-col">

          <div className="bg-blue-600 text-white p-4">
            {
              chatUser.username
            }
          </div>

          <div className="flex-1 p-4 overflow-y-auto">

            {messages.map(
              (
                m,
              ) => (
                <div
                  key={
                    m.id
                  }
                  className="mb-2"
                >
                  {m.text}
                </div>
              ),
            )}

          </div>

          <div className="p-3 flex gap-2">

            <input
              value={
                text
              }
              onChange={(
                e,
              ) =>
                setText(
                  e.target.value,
                )
              }
              className="flex-1 border p-2 rounded-xl"
            />

            <button
              onClick={
                send
              }
              className="bg-blue-600 text-white px-4 rounded-xl"
            >
              Send
            </button>

          </div>

        </div>
      )}

    </div>
  );
}