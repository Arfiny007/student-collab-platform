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
  Send,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import API from "../../../lib/api";
import {
  appendUniqueMessage,
  emitChatMessagesSynced,
  emitChatUserChanged,
  getSocket,
  isMessageForChat,
  subscribeSocketEvent,
} from "../../../lib/socket";
import {
  DEFAULT_AVATAR,
  getAvatarUrl,
  getMediaUrl,
} from "@/lib/media";

const EMOJIS = ["❤️", "🔥", "😂", "👍", "🚀"];

const IMAGE_EXT = /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i;

function isImageFile(filePath: string) {
  return IMAGE_EXT.test(filePath);
}

function getFileName(filePath: string) {
  const name = filePath.split("/").pop() || "Attachment";
  return decodeURIComponent(name);
}

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
  const name = getFileName(filePath);

  if (!url) return null;

  if (isImageFile(filePath)) {
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
          className="max-h-40 w-full object-cover transition-transform duration-[var(--duration-fast)] hover:scale-[1.02]"
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
        "mt-2 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors",
        mine
          ? "bg-white/15 hover:bg-white/25"
          : "bg-background/60 hover:bg-background/80 ring-1 ring-border/60",
      )}
    >
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg",
          mine ? "bg-white/20" : "bg-muted",
        )}
      >
        <Paperclip className="size-3.5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium">{name}</span>
        <span
          className={cn(
            "text-xs",
            mine ? "text-white/70" : "text-muted-foreground",
          )}
        >
          Open file
        </span>
      </span>
    </a>
  );
}

export default function FloatingMessenger() {
  const fileRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [chatUser, setChatUser] = useState<any>(null);
  const [typing, setTyping] = useState(false);
  const [myId, setMyId] = useState(0);
  const chatUserRef = useRef<any>(null);
  const myIdRef = useRef(0);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    scrollRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    const container = listRef.current;
    if (!container) {
      scrollToBottom();
      return;
    }

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    if (distanceFromBottom < 80) {
      scrollToBottom();
    }
  }, [messages, typing, scrollToBottom]);

  useEffect(() => {
    chatUserRef.current = chatUser;
  }, [chatUser]);

  useEffect(() => {
    myIdRef.current = myId;
  }, [myId]);

  const loadChat = useCallback(async (user: any, openPanel = false) => {
    setChatUser(user);
    chatUserRef.current = user;
    localStorage.setItem("chatUser", JSON.stringify(user));
    emitChatUserChanged(user);

    const history = await API.get(`/chat/${user.id}`);
    setMessages(history.data);
    emitChatMessagesSynced(user.id, history.data);
    if (openPanel) {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    const me = Number(localStorage.getItem("userId"));
    setMyId(me);
    myIdRef.current = me;

    const init = async () => {
      try {
        const saved = localStorage.getItem("chatUser");
        if (!saved) {
          return;
        }
        const user = JSON.parse(saved);
        await loadChat(user);
      } catch (err) {
        console.error("chat init failed", err);
      }
    };

    init();

    const openChat = async () => {
      try {
        const saved = localStorage.getItem("chatUser");
        if (!saved) {
          return;
        }
        const user = JSON.parse(saved);
        await loadChat(user, true);
      } catch (err) {
        console.error("open chat failed", err);
      }
    };

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

    window.addEventListener("open-chat", openChat);
    window.addEventListener("chat:user-changed", onUserChanged);
    window.addEventListener("chat:messages-synced", onMessagesSynced);

    return () => {
      if (typingTimer.current) {
        clearTimeout(typingTimer.current);
      }
      window.removeEventListener("open-chat", openChat);
      window.removeEventListener("chat:user-changed", onUserChanged);
      window.removeEventListener("chat:messages-synced", onMessagesSynced);
      unsubMessage();
      unsubTyping();
    };
  }, [loadChat]);

  const send = async () => {
    if (!text.trim()) return;

    const res = await API.post(`/chat/${chatUser.id}`, { text });

    setMessages((prev) => appendUniqueMessage(prev, res.data));

    setText("");
  };

  const sendFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    const res = await API.post(`/chat/${chatUser.id}`, form);

    setMessages((prev) => appendUniqueMessage(prev, res.data));

    if (fileRef.current) {
      fileRef.current.value = "";
    }
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

  const handleComposerKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  if (!chatUser) return null;

  const avatarUrl =
    getAvatarUrl(chatUser.avatar, chatUser.id) || DEFAULT_AVATAR;

  return (
    <div className="fixed bottom-4 right-4 z-[999] sm:bottom-5 sm:right-5">
      <Button
        type="button"
        variant="brand"
        size="icon-lg"
        aria-label={open ? "Close messenger" : "Open messenger"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className={cn(
          "size-14 rounded-full shadow-elevated-lg ring-4 ring-primary/20",
          "transition-transform duration-[var(--duration-fast)] ease-[var(--ease-out-expo)]",
          "hover:scale-105 motion-reduce:hover:scale-100",
        )}
      >
        {open ? (
          <X className="size-5" aria-hidden="true" />
        ) : (
          <MessageCircle className="size-5" aria-hidden="true" />
        )}
      </Button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Chat with ${chatUser.username}`}
          className={cn(
            "absolute bottom-[calc(100%+0.75rem)] right-0 flex flex-col overflow-hidden",
            "glass-panel animate-scale-in rounded-2xl border border-border/80 shadow-elevated-lg",
            "w-[min(calc(100vw-2rem),420px)] h-[min(calc(100dvh-6rem),650px)]",
          )}
        >
          <div className="flex items-center justify-between gap-3 border-b border-border/80 px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative shrink-0">
                <img
                  src={avatarUrl}
                  alt={`${chatUser.username}'s avatar`}
                  className="size-10 rounded-full object-cover ring-2 ring-background"
                />
                <span
                  className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background"
                  aria-hidden="true"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-title">{chatUser.username}</p>
                <p className="text-caption text-emerald-600 dark:text-emerald-400">
                  Online
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="shrink-0 rounded-xl"
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          </div>

          <div
            ref={listRef}
            className="flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-4"
          >
            {messages.length === 0 && !typing && (
              <div className="flex h-full min-h-[200px] flex-col items-center justify-center px-6 text-center animate-fade-in">
                <span
                  className={cn(
                    "mb-3 flex size-12 items-center justify-center rounded-2xl",
                    "bg-primary/10 text-primary",
                  )}
                  aria-hidden="true"
                >
                  <MessageCircle className="size-6" />
                </span>
                <p className="text-title">No messages yet</p>
                <p className="mt-1 text-body text-muted-foreground">
                  Say hello to start the conversation
                </p>
              </div>
            )}

            {messages.map((m) => {
              const mine = m.sender?.id === myId;

              return (
                <div
                  key={m.id}
                  className={cn(
                    "mb-3 flex animate-fade-in motion-reduce:animate-none",
                    mine ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "group max-w-[min(85%,260px)] sm:max-w-[260px]",
                      mine ? "items-end" : "items-start",
                    )}
                  >
                    <div
                      className={cn(
                        "relative px-3.5 py-2.5 text-body leading-relaxed shadow-sm",
                        mine
                          ? "rounded-2xl rounded-br-md bg-gradient-brand text-brand-foreground"
                          : "glass-panel rounded-2xl rounded-bl-md text-foreground",
                        m.deleted && "opacity-60 italic",
                      )}
                    >
                      {m.deleted ? (
                        <span className="text-sm">Message deleted</span>
                      ) : (
                        <>
                          {m.text && (
                            <p className="whitespace-pre-wrap break-words">
                              {m.text}
                            </p>
                          )}
                          {m.file && (
                            <FilePreview filePath={m.file} mine={mine} />
                          )}
                        </>
                      )}

                      {m.reaction && !m.deleted && (
                        <span
                          className={cn(
                            "absolute -bottom-2 text-sm",
                            mine ? "-left-1" : "-right-1",
                          )}
                          aria-label={`Reaction: ${m.reaction}`}
                        >
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
                        <div className="flex items-center gap-0.5 opacity-0 transition-opacity duration-[var(--duration-fast)] group-hover:opacity-100 group-focus-within:opacity-100">
                          {EMOJIS.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              aria-label={`React with ${emoji}`}
                              onClick={() => react(m.id, emoji)}
                              className="rounded-md px-1 py-0.5 hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                                className="rounded-md p-1 hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              >
                                <Pencil className="size-3" aria-hidden="true" />
                              </button>
                              <button
                                type="button"
                                aria-label="Delete message"
                                onClick={() => remove(m.id)}
                                className="rounded-md p-1 hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              >
                                <Trash2
                                  className="size-3 text-destructive"
                                  aria-hidden="true"
                                />
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
                              <Check className="size-3" aria-hidden="true" />
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
              <div className="flex justify-start animate-fade-in motion-reduce:animate-none">
                <div className="glass-panel rounded-2xl rounded-bl-md px-1">
                  <TypingIndicator />
                </div>
              </div>
            )}

            <div ref={scrollRef} aria-hidden="true" />
          </div>

          <div className="border-t border-border/80 p-3 sm:p-4">
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
                onKeyDown={handleComposerKeyDown}
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
          </div>
        </div>
      )}
    </div>
  );
}
