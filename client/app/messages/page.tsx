"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import API from "../../lib/api";

export default function MessagesPage() {
  const scrollRef =
    useRef<any>(null);

  const [messages, setMessages] =
    useState<any[]>([]);

  const [chatUser, setChatUser] =
    useState<any>(null);

  const [conversations, setConversations] =
    useState<any[]>([]);

  const [onlineUsers, setOnlineUsers] =
    useState<number[]>([]);

  const [typing, setTyping] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [text, setText] =
    useState("");

  const [myId, setMyId] =
    useState(0);

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

        setMyId(me);

        const chats =
          await API.get(
            "/chat",
          );

        setConversations(
          chats.data,
        );

        const saved =
          localStorage.getItem(
            "chatUser",
          );

        if (saved) {
          const user =
            JSON.parse(
              saved,
            );

          await openChat(
            user,
          );
        }

        const {
          io,
        } =
          await import(
            "socket.io-client",
          );

        socket =
          io(
            "http://localhost:5000",
            {
              query: {
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
      if (socket)
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

  const openChat =
    async (
      user: any,
    ) => {
      setChatUser(
        user,
      );

      localStorage.setItem(
        "chatUser",
        JSON.stringify(
          user,
        ),
      );

      const res =
        await API.get(
          `/chat/${user.id}`,
        );

      setMessages(
        res.data,
      );
    };

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

      setText("");
    };

  const filtered =
    conversations.filter(
      (
        c,
      ) =>
        c.user.username
          ?.toLowerCase()
          .includes(
            search.toLowerCase(),
          ),
    );

  return (
    <div className="h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-[340px] bg-white border-r">

        <div className="p-4">

          <input
            value={
              search
            }
            onChange={(
              e,
            ) =>
              setSearch(
                e.target.value,
              )
            }
            placeholder="Search..."
            className="w-full border rounded-xl p-3"
          />

        </div>

        {filtered.map(
          (
            c,
          ) => (
            <div
              key={
                c.user.id
              }
              onClick={() =>
                openChat(
                  c.user,
                )
              }
              className="cursor-pointer border-b p-4 hover:bg-gray-50"
            >

              <div className="flex items-center gap-2">

                <div className="w-3 h-3 rounded-full bg-green-500" />

                <p className="font-bold">
                  {
                    c.user
                      .username
                  }
                </p>

              </div>

              <p className="text-sm text-gray-500 truncate">
                {
                  c.lastMessage
                }
              </p>

            </div>
          ),
        )}

      </div>

      {/* CHAT */}
      <div className="flex-1 flex flex-col">

        {chatUser && (
          <>
            {/* HEADER */}
            <div className="bg-white shadow p-4">

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

  {m.sender?.id ===
    myId && (
    <>
      {" • "}

      {m.seen
        ? "Seen"
        : "Delivered"}
    </>
  )}

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
            <div className="bg-white p-4 flex gap-3">

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
          </>
        )}

      </div>

    </div>
  );
}