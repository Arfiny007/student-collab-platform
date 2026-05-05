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

  const fileRef =
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

  const [emojiOpen, setEmojiOpen] =
    useState(false);

  const emojis = [
    "😀",
    "❤️",
    "🔥",
    "👍",
    "😂",
    "🚀",
  ];

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

  const sendFile =
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

      const formData =
        new FormData();

      formData.append(
        "file",
        file,
      );

      const res =
        await API.post(
          `/chat/${chatUser.id}`,
          formData,
        );

      setMessages(
        (
          prev,
        ) => [
          ...prev,
          res.data,
        ],
      );
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
    const react =
  async (
    id: number,
    emoji: string,
  ) => {
    const res =
      await API.patch(
        `/chat/${id}/react`,
        {
          emoji,
        },
      );

    setMessages(
      (
        prev,
      ) =>
        prev.map(
          (
            m,
          ) =>
            m.id ===
            id
              ? res.data
              : m,
        ),
    );
  };

const remove =
  async (
    id: number,
  ) => {
    const res =
      await API.delete(
        `/chat/${id}`,
      );

    setMessages(
      (
        prev,
      ) =>
        prev.map(
          (
            m,
          ) =>
            m.id ===
            id
              ? res.data
              : m,
        ),
    );
  };

const edit =
  async (
    id: number,
    oldText: string,
  ) => {
    const updated =
      prompt(
        "Edit message",
        oldText,
      );

    if (
      !updated
    )
      return;

    const res =
      await API.patch(
        `/chat/${id}`,
        {
          text:
            updated,
        },
      );

    setMessages(
      (
        prev,
      ) =>
        prev.map(
          (
            m,
          ) =>
            m.id ===
            id
              ? res.data
              : m,
        ),
    );
  };

  return (
    <div className="h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-[350px] bg-white border-r">

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

              <div className="flex gap-3">

                <img
                  src={
                    c.user
                      .avatar
                      ? `http://localhost:5000/${c.user.avatar}`
                      : "https://placehold.co/50"
                  }
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div>

                  <div className="flex gap-2 items-center">

                    <p className="font-bold">
                      {
                        c.user
                          .username
                      }
                    </p>

                    {onlineUsers.includes(
                      c.user.id,
                    ) && (
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    )}

                  </div>

                  <p className="text-sm text-gray-500 truncate">
                    {
                      c.lastMessage
                    }
                  </p>

                </div>

              </div>

            </div>
          ),
        )}

      </div>

      {/* CHAT */}
      <div className="flex-1 flex flex-col">

        {chatUser && (
          <>
            {/* HEADER */}
            <div className="bg-white shadow p-4 flex gap-3">

              <img
                src={
                  chatUser.avatar
                    ? `http://localhost:5000/${chatUser.avatar}`
                    : "https://placehold.co/50"
                }
                className="w-12 h-12 rounded-full"
              />

              <div>

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
                    className={`mb-4 flex ${
                      m.sender
                        ?.id ===
                      myId
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    <div className="max-w-[70%]">

                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          m.sender
                            ?.id ===
                          myId
                            ? "bg-blue-600 text-white"
                            : "bg-white"
                        }`}
                      >

                        {m.text}

                        {m.file && (
                          <a
                            href={`http://localhost:5000/${m.file}`}
                            target="_blank"
                            className="block underline mt-2"
                          >
                            📎 Attachment
                          </a>
                        )}

                      </div>
                      <div className="flex gap-2 mt-1 text-xs">

  <button
    onClick={() =>
      react(
        m.id,
        "❤️",
      )
    }
  >
    ❤️
  </button>

  {m.sender?.id ===
    myId && (
    <>
      <button
        onClick={() =>
          edit(
            m.id,
            m.text,
          )
        }
      >
        ✏️
      </button>

      <button
        onClick={() =>
          remove(
            m.id,
          )
        }
      >
        🗑
      </button>
    </>
  )}

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
            <div className="bg-white p-4 flex gap-3 items-center">

              <button
                onClick={() =>
                  setEmojiOpen(
                    !emojiOpen,
                  )
                }
              >
                😊
              </button>

              <button
                onClick={() =>
                  fileRef.current.click()
                }
              >
                📎
              </button>

              <input
                type="file"
                hidden
                ref={
                  fileRef
                }
                onChange={
                  sendFile
                }
              />

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

            {emojiOpen && (
              <div className="bg-white p-3 flex gap-3">

                {emojis.map(
                  (
                    e,
                  ) => (
                    <button
                      key={
                        e
                      }
                      onClick={() =>
                        setText(
                          (
                            prev,
                          ) =>
                            prev +
                            e,
                        )
                      }
                    >
                      {e}
                    </button>
                  ),
                )}

              </div>
            )}

          </>
        )}

      </div>

    </div>
  );
}