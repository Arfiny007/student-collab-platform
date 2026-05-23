import { io, Socket } from "socket.io-client";
import { getSocketUrl } from "./env";

type SocketHandler = (...args: unknown[]) => void;

const SOCKET_EVENTS = [
  "message",
  "typing",
  "notification",
  "online-users",
] as const;

type SocketEvent = (typeof SOCKET_EVENTS)[number];

let socket: Socket | null = null;
let currentToken: string | null = null;
let globalListenersAttached = false;
let visibilityListenerAttached = false;

const handlerSets = new Map<string, Set<SocketHandler>>();

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function dispatchWindowEvent(event: string, detail: unknown) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(`socket:${event}`, { detail }),
  );
}

function fanOut(event: string, args: unknown[]) {
  dispatchWindowEvent(event, args.length === 1 ? args[0] : args);

  const handlers = handlerSets.get(event);
  if (!handlers) return;

  for (const handler of handlers) {
    try {
      handler(...args);
    } catch (err) {
      console.error(`socket handler error (${event})`, err);
    }
  }
}

function attachGlobalListeners(sock: Socket) {
  if (globalListenersAttached) return;
  globalListenersAttached = true;

  for (const event of SOCKET_EVENTS) {
    sock.on(event, (...args: unknown[]) => {
      fanOut(event, args);
    });
  }

  sock.io.on("reconnect", () => {
    const token = getToken();
    if (token) {
      sock.auth = { token };
    }
  });
}

function attachVisibilityHandler() {
  if (visibilityListenerAttached || typeof document === "undefined") {
    return;
  }
  visibilityListenerAttached = true;

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") return;

    const token = getToken();
    if (!token) return;

    const sock = ensureSocket();
    if (!sock) return;

    const latest = getToken();
    if (latest && latest !== currentToken) {
      resetSocket();
      ensureSocket();
      return;
    }

    sock.auth = { token };
    if (!sock.connected) {
      sock.connect();
    }
  });
}

function ensureSocket(): Socket | null {
  const token = getToken();
  if (!token) {
    return null;
  }

  if (socket && currentToken !== token) {
    resetSocket();
  }

  if (!socket) {
    currentToken = token;
    socket = io(getSocketUrl(), {
      transports: ["websocket"],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
    });
    attachGlobalListeners(socket);
    attachVisibilityHandler();
  }

  return socket;
}

/** Connect (or reconnect) the shared socket when a token is present. */
export function connectSocket(): Socket | null {
  return ensureSocket();
}

/** Subscribe to a socket event with isolated cleanup (safe across components). */
export function subscribeSocketEvent(
  event: string,
  handler: SocketHandler,
): () => void {
  ensureSocket();

  let set = handlerSets.get(event);
  if (!set) {
    set = new Set();
    handlerSets.set(event, set);
  }
  set.add(handler);

  return () => {
    const handlers = handlerSets.get(event);
    if (!handlers) return;
    handlers.delete(handler);
    if (handlers.size === 0) {
      handlerSets.delete(event);
    }
  };
}

/** Returns the shared socket instance, or null when unauthenticated. */
export function getSocket(): Socket | null {
  return ensureSocket();
}

/** Call on logout or account switch. */
export function resetSocket() {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
  currentToken = null;
  globalListenersAttached = false;
  handlerSets.clear();
}

/** Whether the message belongs to a 1:1 thread with activeChatUserId. */
export function isMessageForChat(
  msg: { sender?: { id?: number }; receiver?: { id?: number } },
  myId: number,
  activeChatUserId: number,
): boolean {
  const senderId = msg.sender?.id;
  const receiverId = msg.receiver?.id;
  if (!senderId || !receiverId || !myId || !activeChatUserId) {
    return false;
  }
  return (
    (senderId === myId && receiverId === activeChatUserId) ||
    (senderId === activeChatUserId && receiverId === myId)
  );
}

export function appendUniqueMessage<T extends { id: number }>(
  prev: T[],
  msg: T,
): T[] {
  if (prev.some((m) => m.id === msg.id)) {
    return prev;
  }
  return [...prev, msg];
}

export function emitChatUserChanged(user: unknown) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("chat:user-changed", { detail: user }),
  );
}

export function emitChatMessagesSynced(
  userId: number,
  messages: unknown[],
) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("chat:messages-synced", {
      detail: { userId, messages },
    }),
  );
}

export function emitNotificationsMarkAll() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("notifications:mark-all"));
}

export function emitNotificationsMarkOne(id: number) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("notifications:mark-one", { detail: { id } }),
  );
}

export function emitNotificationsRefresh() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("notifications:refresh"));
}
