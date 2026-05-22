"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import API from "../../../lib/api";
import {
  getSocket,
} from "../../../lib/socket";

export default function FloatingMessenger() {
  const fileRef =
    useRef<any>(null);

  const scrollRef =
    useRef<any>(null);

  const typingTimer =
    useRef<any>(null);

  const [open, setOpen] =
    useState(false);

  const [messages, setMessages] =
    useState<any[]>([]);

  const [text, setText] =
    useState("");

  const [chatUser, setChatUser] =
    useState<any>(null);

  const [typing, setTyping] =
    useState(false);

  const [socket, setSocket] =
    useState<any>(null);

  const [myId, setMyId] =
    useState(0);

  const emojis = [
    "❤️",
    "🔥",
    "😂",
    "👍",
    "🚀",
  ];
  useEffect(() => {
  scrollRef.current?.scrollIntoView({
    behavior:
      "smooth",
  });
}, [messages]);

  useEffect(() => {

  let liveSocket: any;

  const init =
    async () => {
      try {

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

        if (!saved) {
          return;
        }

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

        liveSocket =
          getSocket();

        liveSocket.off(
          "message",
        );

        liveSocket.off(
          "typing",
        );

        liveSocket.on(
          "message",
          (
            msg: any,
          ) => {
            setMessages(
              (
                prev,
              ) => {

                const exists =
                  prev.find(
                    (
                      x,
                    ) =>
                      x.id ===
                      msg.id,
                  );

                if (
                  exists
                ) {
                  return prev;
                }

                return [
                  ...prev,
                  msg,
                ];
              },
            );
          },
        );

        liveSocket.on(
          "typing",
          () => {

            setTyping(
              true,
            );

            clearTimeout(
              typingTimer.current,
            );

            typingTimer.current =
              setTimeout(
                () =>
                  setTyping(
                    false,
                  ),
                1000,
              );
          },
        );

        setSocket(
          liveSocket,
        );

      } catch (
        err
      ) {
        console.error(
          "chat init failed",
          err,
        );
      }
    };

  init();

  const openChat =
    async () => {
      try {

        const saved =
          localStorage.getItem(
            "chatUser",
          );

        if (!saved) {
          return;
        }

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

        setOpen(
          true,
        );

      } catch (
        err
      ) {
        console.error(
          "open chat failed",
          err,
        );
      }
    };

  window.addEventListener(
    "open-chat",
    openChat,
  );

  return () => {

    clearTimeout(
      typingTimer.current,
    );

    window.removeEventListener(
      "open-chat",
      openChat,
    );

    liveSocket?.off(
      "message",
    );

    liveSocket?.off(
      "typing",
    );

  };

}, []);

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
  ) => {
    const exists =
      prev.find(
        (
          x,
        ) =>
          x.id ===
          res.data.id,
      );

    if (
      exists
    ) {
      return prev;
    }

    return [
      ...prev,
      res.data,
    ];
  },
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

      if (!file)
        return;

      const form =
        new FormData();

      form.append(
        "file",
        file,
      );

      const res =
        await API.post(
          `/chat/${chatUser.id}`,
          form,
        );

      setMessages(
  (
    prev,
  ) => {
    const exists =
      prev.find(
        (
          x,
        ) =>
          x.id ===
          res.data.id,
      );

    if (
      exists
    ) {
      return prev;
    }

    return [
      ...prev,
      res.data,
    ];
  },
);
    };

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

  if (
    !chatUser
  )
    return null;

  return (
    <div className="fixed bottom-5 right-5 z-[999]">

      <button
        onClick={() =>
          setOpen(
            !open,
          )
        }
        className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl shadow-2xl"
      >
        💬
      </button>

      {open && (
        <div className="absolute bottom-20 right-0 w-[420px] h-[650px] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl flex flex-col border">

          <div className="p-5 border-b font-bold text-lg flex justify-between items-center">
            <div className="flex gap-3 items-center">

  <img
    src={
      chatUser.avatar
        ? `${process.env.NEXT_PUBLIC_API_URL}/${chatUser.avatar}`
        : "https://placehold.co/100"
    }
    className="w-10 h-10 rounded-full"
  />

  <div>
    <p>
      {chatUser.username}
    </p>

    <p className="text-xs text-green-500">
      Online
    </p>
  </div>

</div>

<button
  onClick={() =>
    setOpen(
      false,
    )
  }
>
  ✖
</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">

            {messages.map(
              (
                m,
              ) => {
                const mine =
                  m.sender
                    ?.id ===
                  myId;

                return (
                  <div
                    key={
                      m.id
                    }
                    className={`mb-4 flex ${
                      mine
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    <div>

                      <div
                        className={`rounded-2xl px-4 py-3 max-w-[260px] ${
                          mine
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 dark:bg-gray-800"
                        }`}
                      >

                        {
                          m.text
                        }

                        {m.file && (
                          <a
                            href={`${process.env.NEXT_PUBLIC_API_URL}/${m.file}`}
                            target="_blank"
                            className="block mt-2 underline"
                          >
                            📎 Attachment
                          </a>
                        )}

                      </div>

                      <div className="flex gap-2 mt-1 text-xs">

                        {!m.deleted &&
                          emojis.map(
                            (
                              e,
                            ) => (
                              <button
                                key={
                                  e
                                }
                                onClick={() =>
                                  react(
                                    m.id,
                                    e,
                                  )
                                }
                              >
                                {e}
                              </button>
                            ),
                          )}

                        {mine &&
                          !m.deleted && (
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

                        <span>
                          {new Date(
                            m.createdAt,
                          ).toLocaleTimeString()}
                        </span>

                        {mine && (
                          <span>
                            {m.seen
                              ? "Seen"
                              : "Delivered"}
                          </span>
                        )}

                      </div>

                      {m.reaction && (
                        <p className="text-sm mt-1">
                          {
                            m.reaction
                          }
                        </p>
                      )}

                    </div>

                  </div>
                );
              },
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

          <div className="p-4 border-t flex gap-2">

            <button
              onClick={() =>
                fileRef.current.click()
              }
            >
              📎
            </button>

            <input
              hidden
              type="file"
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
              ) => {
                setText(
                  e.target.value,
                );

                socket?.emit(
                  "typing",
                  {
                    receiverId:
                      chatUser.id,
                  },
                );
              }}
              className="flex-1 border rounded-xl px-4"
            />

            <button
              onClick={
                send
              }
              className="bg-blue-600 text-white px-5 rounded-xl"
            >
              Send
            </button>

          </div>

        </div>
      )}

    </div>
  );
}