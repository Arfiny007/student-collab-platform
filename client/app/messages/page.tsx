"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import API from "../../lib/api";

export default function MessagesPage() {
  const scrollRef =
    useRef<any>(
      null,
    );

  const [messages, setMessages] =
    useState<any[]>(
      [],
    );

  const [text, setText] =
    useState("");

  const [chatUser, setChatUser] =
    useState<any>(
      null,
    );

  const [typing, setTyping] =
    useState(
      false,
    );

  const [onlineUsers, setOnlineUsers] =
    useState<
      number[]
    >([]);

  const [myId, setMyId] =
    useState(
      0,
    );

  useEffect(() => {
    let socket: any;

    const init =
      async () => {
        const me =
          Number(
            localStorage.getItem(
              "userId",
            ),
          );

        setMyId(
          me,
        );

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

        const history =
          await API.get(
            `/chat/${user.id}`,
          );

        setMessages(
          history.data,
        );

        const {
          io,
        } =
          await import(
            "socket.io-client"
          );

        socket =
          io(
            "http://localhost:5000",
            {
              query:
                {
                  userId:
                    me,
                },
            },
          );

        socket.on(
          "message",
          (
            msg: any,
          ) => {
            setMessages(
              (
                prev,
              ) => [
                ...prev,
                msg,
              ],
            );
          },
        );

        socket.on(
          "typing",
          () => {
            setTyping(
              true,
            );

            setTimeout(
              () =>
                setTyping(
                  false,
                ),
              1000,
            );
          },
        );

        socket.on(
          "online-users",
          (
            users: number[],
          ) =>
            setOnlineUsers(
              users,
            ),
        );
      };

    init();

    return () => {
      if (
        socket
      )
        socket.disconnect();
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView(
      {
        behavior:
          "smooth",
      },
    );
  }, [messages]);

  const send =
    async () => {
      if (
        !text.trim()
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
    <div className="h-screen flex bg-gray-100">

      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <div className="bg-white p-4 shadow">

          <p className="font-bold">
            {
              chatUser.username
            }
          </p>

          <p className="text-xs text-green-500">
            {onlineUsers.includes(
              chatUser.id,
            )
              ? "Online"
              : "Offline"}
          </p>

        </div>

        {/* BODY */}
        <div className="flex-1 p-6 overflow-y-auto">

          {messages.map(
            (
              m,
            ) => (
              <div
                key={
                  m.id
                }
                className={`mb-3 flex ${
                  m.sender
                    ?.id ===
                  myId
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div className="max-w-[70%]">

                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      m.sender
                        ?.id ===
                      myId
                        ? "bg-blue-600 text-white"
                        : "bg-white"
                    }`}
                  >
                    {
                      m.text
                    }
                  </div>

                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(
                      m.createdAt,
                    ).toLocaleTimeString()}
                    {" • "}
                    {m.seen
                      ? "Seen"
                      : "Delivered"}
                  </p>

                </div>

              </div>
            ),
          )}

          {typing && (
            <p className="text-sm text-gray-400">
              typing...
            </p>
          )}

          <div
            ref={
              scrollRef
            }
          />

        </div>

        {/* INPUT */}
        <div className="p-4 bg-white flex gap-3">

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
            className="flex-1 border rounded-xl px-4"
            placeholder="Type..."
          />

          <button
            onClick={
              send
            }
            className="bg-blue-600 text-white px-6 rounded-xl"
          >
            Send
          </button>

        </div>

      </div>

    </div>
  );
}