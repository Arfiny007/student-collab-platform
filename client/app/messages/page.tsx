"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Check,
  CheckCheck,
  MessageCircle,
  Paperclip,
  Pencil,
  Search,
  Send,
  Trash2,
} from "lucide-react";
import API from "@/lib/api";
import {
  appendUniqueMessage,
  emitChatMessagesSynced,
  emitChatUserChanged,
  getSocket,
  isMessageForChat,
  subscribeSocketEvent,
} from "@/lib/socket";
import { getMediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";
import Sidebar from "../dashboard/components/Sidebar";
import Navbar from "../dashboard/components/Navbar";
import AvatarImage from "@/components/AvatarImage";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const EMOJIS = ["❤️", "🔥", "😂", "👍", "🚀"];
const IMAGE_EXT = /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i;

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function TypingIndicator() {
  return (
    <div
      className="flex items-center gap-1 px-3 py-2"
      aria-live="polite"
      aria-label="Contact is typing"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce motion-reduce:animate-none"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}

function FilePreview({
  filePath,
  mine,
}: {
  filePath: string;
  mine: boolean;
}) {
  const url = getMediaUrl(filePath);
  const name = filePath.split("/").pop() || "Attachment";

  if (!url) return null;

  if (IMAGE_EXT.test(filePath)) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 block overflow-hidden rounded-xl ring-1 ring-black/5 dark:ring-white/10"
      >
        <img
          src={url}
          alt={name}
          className="max-h-48 w-full object-cover"
          loading="lazy"
        />
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "mt-2 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm",
        mine
          ? "bg-white/15 hover:bg-white/25"
          : "bg-background/60 ring-1 ring-border/60",
      )}
    >
      <Paperclip className="size-3.5 shrink-0" aria-hidden="true" />
      <span className="truncate font-medium">{decodeURIComponent(name)}</span>
    </a>
  );
}

export default function MessagesPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [chatUser, setChatUser] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const [typing, setTyping] = useState(false);
  const [search, setSearch] = useState("");
  const [text, setText] = useState("");
  const [myId, setMyId] = useState(0);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);

  const chatUserRef = useRef<any>(null);
  const myIdRef = useRef(0);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    chatUserRef.current = chatUser;
  }, [chatUser]);

  useEffect(() => {
    myIdRef.current = myId;
  }, [myId]);

  const openChat = useCallback(async (user: any) => {
    setChatUser(user);
    chatUserRef.current = user;
    setLoadingChat(true);
    localStorage.setItem("chatUser", JSON.stringify(user));
    emitChatUserChanged(user);

    try {
      const res = await API.get(`/chat/${user.id}`);
      setMessages(res.data);
      emitChatMessagesSynced(user.id, res.data);
    } finally {
      setLoadingChat(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const me = Number(localStorage.getItem("userId"));
    setMyId(me);
    myIdRef.current = me;

    const init = async () => {
      try {
        const chats = await API.get("/chat");
        if (cancelled) return;
        setConversations(chats.data);

        const saved = localStorage.getItem("chatUser");
        if (saved) {
          const user = JSON.parse(saved);
          await openChat(user);
        }
      } catch {
        if (!cancelled) {
          setConversations([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingList(false);
        }
      }
    };

    init();

    const unsubMessage = subscribeSocketEvent("message", (msg) => {
      const message = msg as {
        id: number;
        sender?: { id?: number };
        receiver?: { id?: number };
      };
      const active = chatUserRef.current;
      if (
        !active ||
        !isMessageForChat(
          message,
          myIdRef.current,
          active.id,
        )
      ) {
        return;
      }
      setMessages((prev) =>
        appendUniqueMessage(prev, message as (typeof prev)[0]),
      );
    });

    const unsubTyping = subscribeSocketEvent("typing", () => {
      if (!chatUserRef.current) return;
      setTyping(true);
      if (typingTimer.current) {
        clearTimeout(typingTimer.current);
      }
      typingTimer.current = setTimeout(() => setTyping(false), 1000);
    });

    const unsubOnline = subscribeSocketEvent(
      "online-users",
      (users) => {
        setOnlineUsers(users as number[]);
      },
    );

    const onUserChanged = (e: Event) => {
      const user = (e as CustomEvent).detail;
      if (!user?.id) return;
      setChatUser(user);
      chatUserRef.current = user;
    };

    const onMessagesSynced = (e: Event) => {
      const { userId, messages } = (e as CustomEvent).detail ?? {};
      const active = chatUserRef.current;
      if (!active || active.id !== userId) return;
      setMessages(messages);
    };

    window.addEventListener("chat:user-changed", onUserChanged);
    window.addEventListener("chat:messages-synced", onMessagesSynced);

    return () => {
      cancelled = true;
      if (typingTimer.current) {
        clearTimeout(typingTimer.current);
      }
      window.removeEventListener("chat:user-changed", onUserChanged);
      window.removeEventListener("chat:messages-synced", onMessagesSynced);
      unsubMessage();
      unsubTyping();
      unsubOnline();
    };
  }, [openChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = async () => {
    if (!text.trim() || !chatUser) return;

    const res = await API.post(`/chat/${chatUser.id}`, { text });
    setMessages((prev) => appendUniqueMessage(prev, res.data));
    setText("");
  };

  const sendFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !chatUser) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await API.post(`/chat/${chatUser.id}`, formData);
    setMessages((prev) => appendUniqueMessage(prev, res.data));
    e.target.value = "";
  };

  const react = async (id: number, emoji: string) => {
    const res = await API.patch(`/chat/${id}/react`, { emoji });
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? res.data : m)),
    );
  };

  const remove = async (id: number) => {
    const res = await API.delete(`/chat/${id}`);
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? res.data : m)),
    );
  };

  const edit = async (id: number, oldText: string) => {
    const updated = prompt("Edit message", oldText);
    if (!updated) return;

    const res = await API.patch(`/chat/${id}`, { text: updated });
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? res.data : m)),
    );
  };

  const filtered = conversations.filter((c) =>
    c.user.username?.toLowerCase().includes(search.toLowerCase()),
  );

  const isOnline = chatUser
    ? onlineUsers.includes(chatUser.id)
    : false;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex min-h-screen flex-1 flex-col">
        <Navbar />

        <div
          className={cn(
            "mx-auto flex w-full max-w-[1700px] flex-1 flex-col overflow-hidden p-4 sm:p-6",
            "lg:flex-row lg:gap-0",
          )}
        >
          {/* Conversation list */}
          <aside
            className={cn(
              "glass-panel flex w-full flex-col overflow-hidden rounded-2xl border border-border/80 shadow-elevated-lg",
              "lg:mr-0 lg:w-[min(100%,380px)] lg:rounded-r-none",
              chatUser ? "hidden lg:flex" : "flex",
            )}
            aria-label="Conversations"
          >
            <div className="border-b border-border/80 px-4 py-4 sm:px-5">
              <div className="flex items-center gap-2">
                <MessageCircle
                  className="size-5 text-primary"
                  aria-hidden="true"
                />
                <h1 className="text-title">Messages</h1>
              </div>
              <p className="mt-1 text-caption text-muted-foreground">
                Chat with classmates in real time
              </p>
              <label className="relative mt-4 block">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search conversations…"
                  aria-label="Search conversations"
                  className={cn(
                    "w-full rounded-xl border border-border/80 bg-background/80 py-2.5 pl-10 pr-3 text-sm",
                    "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  )}
                />
              </label>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain">
              {loadingList &&
                Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex gap-3 border-b border-border/60 px-4 py-4"
                  >
                    <Skeleton className="size-12 shrink-0 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}

              {!loadingList && filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                  <span
                    className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"
                    aria-hidden="true"
                  >
                    <MessageCircle className="size-6" />
                  </span>
                  <p className="text-title">No conversations yet</p>
                  <p className="mt-1 text-body text-muted-foreground">
                    Start a chat from someone&apos;s profile
                  </p>
                </div>
              )}

              {filtered.map((c) => {
                const active = chatUser?.id === c.user.id;
                const online = onlineUsers.includes(c.user.id);

                return (
                  <button
                    key={c.user.id}
                    type="button"
                    onClick={() => openChat(c.user)}
                    className={cn(
                      "flex w-full gap-3 border-b border-border/60 px-4 py-4 text-left transition-colors",
                      "hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                      active && "bg-primary/5",
                    )}
                  >
                    <div className="relative shrink-0">
                      <AvatarImage
                        src={c.user.avatar}
                        userId={c.user.id}
                        alt=""
                        size={48}
                      />
                      {online && (
                        <span
                          className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-500 ring-2 ring-background"
                          aria-label="Online"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-foreground">
                        {c.user.username}
                      </p>
                      <p className="truncate text-sm text-muted-foreground">
                        {c.lastMessage || "No messages yet"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Chat panel */}
          <section
            className={cn(
              "glass-panel flex min-h-[min(70dvh,720px)] flex-1 flex-col overflow-hidden rounded-2xl border border-border/80 shadow-elevated-lg",
              "lg:rounded-l-none lg:border-l-0",
              !chatUser ? "hidden lg:flex" : "flex",
            )}
            aria-label={chatUser ? `Chat with ${chatUser.username}` : "Chat"}
          >
            {!chatUser ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <span
                  className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-brand text-brand-foreground shadow-glow-brand"
                  aria-hidden="true"
                >
                  <MessageCircle className="size-8" />
                </span>
                <h2 className="text-title">Select a conversation</h2>
                <p className="mt-2 max-w-sm text-body text-muted-foreground">
                  Pick someone from the list to open your premium messaging
                  workspace.
                </p>
              </div>
            ) : (
              <>
                <header className="flex items-center gap-3 border-b border-border/80 px-4 py-3 sm:px-5">
                  <button
                    type="button"
                    className="text-sm text-primary lg:hidden"
                    onClick={() => setChatUser(null)}
                  >
                    ← Back
                  </button>
                  <AvatarImage
                    src={chatUser.avatar}
                    userId={chatUser.id}
                    alt=""
                    size={44}
                    priority
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-title">{chatUser.username}</p>
                    <p
                      className={cn(
                        "text-caption",
                        isOnline
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-muted-foreground",
                      )}
                    >
                      {isOnline ? "Online" : "Offline"}
                    </p>
                  </div>
                </header>

                <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-5">
                  {loadingChat && (
                    <div className="space-y-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton
                          key={i}
                          className={cn(
                            "h-14 max-w-[70%] rounded-2xl",
                            i % 2 === 0 ? "ml-auto" : "",
                          )}
                        />
                      ))}
                    </div>
                  )}

                  {!loadingChat && messages.length === 0 && !typing && (
                    <div className="flex h-full min-h-[240px] flex-col items-center justify-center text-center">
                      <p className="text-title">No messages yet</p>
                      <p className="mt-1 text-muted-foreground">
                        Say hello to start the conversation
                      </p>
                    </div>
                  )}

                  {!loadingChat &&
                    messages.map((m) => {
                      const mine = m.sender?.id === myId;

                      return (
                        <div
                          key={m.id}
                          className={cn(
                            "mb-3 flex",
                            mine ? "justify-end" : "justify-start",
                          )}
                        >
                          <div className="group max-w-[min(85%,420px)]">
                            <div
                              className={cn(
                                "px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
                                mine
                                  ? "rounded-2xl rounded-br-md bg-gradient-brand text-brand-foreground"
                                  : "glass-panel rounded-2xl rounded-bl-md",
                                m.deleted && "italic opacity-60",
                              )}
                            >
                              {m.deleted ? (
                                <span>Message deleted</span>
                              ) : (
                                <>
                                  {m.text && (
                                    <p className="whitespace-pre-wrap break-words">
                                      {m.text}
                                    </p>
                                  )}
                                  {m.file && (
                                    <FilePreview
                                      filePath={m.file}
                                      mine={mine}
                                    />
                                  )}
                                </>
                              )}
                              {m.reaction && !m.deleted && (
                                <span className="mt-1 block text-base">
                                  {m.reaction}
                                </span>
                              )}
                            </div>

                            <div
                              className={cn(
                                "mt-1 flex flex-wrap items-center gap-1.5 px-1 text-[0.65rem] text-muted-foreground",
                                mine && "justify-end",
                              )}
                            >
                              {!m.deleted && (
                                <div className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                                  {EMOJIS.map((emoji) => (
                                    <button
                                      key={emoji}
                                      type="button"
                                      aria-label={`React with ${emoji}`}
                                      onClick={() => react(m.id, emoji)}
                                      className="rounded-md px-1 py-0.5 hover:bg-muted/80"
                                    >
                                      {emoji}
                                    </button>
                                  ))}
                                  {mine && (
                                    <>
                                      <button
                                        type="button"
                                        aria-label="Edit message"
                                        onClick={() => edit(m.id, m.text)}
                                        className="rounded-md p-1 hover:bg-muted/80"
                                      >
                                        <Pencil className="size-3" />
                                      </button>
                                      <button
                                        type="button"
                                        aria-label="Delete message"
                                        onClick={() => remove(m.id)}
                                        className="rounded-md p-1 hover:bg-destructive/10"
                                      >
                                        <Trash2 className="size-3 text-destructive" />
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}
                              <span>{formatTime(m.createdAt)}</span>
                              {mine && (
                                <span className="inline-flex items-center gap-0.5">
                                  {m.seen ? (
                                    <>
                                      <CheckCheck
                                        className="size-3 text-primary"
                                        aria-hidden="true"
                                      />
                                      <span>Seen</span>
                                    </>
                                  ) : (
                                    <>
                                      <Check
                                        className="size-3"
                                        aria-hidden="true"
                                      />
                                      <span>Delivered</span>
                                    </>
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                  {typing && (
                    <div className="flex justify-start">
                      <div className="glass-panel rounded-2xl rounded-bl-md">
                        <TypingIndicator />
                      </div>
                    </div>
                  )}

                  <div ref={scrollRef} aria-hidden="true" />
                </div>

                <footer className="border-t border-border/80 p-3 sm:p-4">
                  <div className="flex items-end gap-2">
                    <Button
                      type="button"
                      variant="glass"
                      size="icon-sm"
                      aria-label="Attach file"
                      onClick={() => fileRef.current?.click()}
                      className="shrink-0 rounded-xl"
                    >
                      <Paperclip className="size-4" aria-hidden="true" />
                    </Button>
                    <input
                      hidden
                      type="file"
                      ref={fileRef}
                      onChange={sendFile}
                    />
                    <input
                      value={text}
                      onChange={(e) => {
                        setText(e.target.value);
                        getSocket()?.emit("typing", {
                          receiverId: chatUser.id,
                        });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          send();
                        }
                      }}
                      placeholder="Type a message…"
                      aria-label="Message"
                      className={cn(
                        "flex-1 rounded-xl border border-border/80 bg-background/80 px-3.5 py-2.5 text-sm",
                        "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                      )}
                    />
                    <Button
                      type="button"
                      variant="brand"
                      size="icon-sm"
                      aria-label="Send message"
                      onClick={send}
                      className="shrink-0 rounded-xl"
                    >
                      <Send className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                </footer>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
