import API from "./api";

export type UserRole =
  | "user"
  | "teacher"
  | "moderator"
  | "admin";

export type AdminStats = {
  users: number;
  posts: number;
  reportedPosts: number;
  hiddenPosts: number;
  blockedUsers: number;
  mutedUsers: number;
  roleBreakdown: { role: string; count: string }[];
  postsByDay: { day: string; count: string }[];
};

export type AdminPost = {
  id: number;
  title: string;
  content: string;
  reports: number;
  hidden: boolean;
  likes: number;
  views: number;
  createdAt: string;
  author: {
    id: number;
    username: string;
    avatar?: string;
    role: UserRole;
  } | null;
};

export type AdminUser = {
  id: number;
  email: string;
  username: string;
  role: UserRole;
  avatar?: string;
  reportCount: number;
  isBlocked: boolean;
  isMuted: boolean;
  profileViews: number;
  engagementScore: number;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  hasMore: boolean;
};

export async function fetchAdminStats() {
  const res = await API.get<AdminStats>(
    "/admin/stats",
  );
  return res.data;
}

export async function fetchModerationQueue(
  page = 1,
) {
  const res = await API.get<
    Paginated<AdminPost>
  >(`/admin/moderation/posts?page=${page}`);
  return res.data;
}

export async function fetchAdminUsers(
  page = 1,
  q = "",
) {
  const res = await API.get<
    Paginated<AdminUser>
  >(
    `/admin/users?page=${page}&q=${encodeURIComponent(q)}`,
  );
  return res.data;
}

export async function updateAdminUser(
  id: number,
  body: Partial<
    Pick<
      AdminUser,
      "role" | "isBlocked" | "isMuted"
    >
  >,
) {
  const res = await API.patch<AdminUser>(
    `/admin/users/${id}`,
    body,
  );
  return res.data;
}

export async function hidePost(id: number) {
  const res = await API.patch(
    `/posts/${id}/hide`,
  );
  return res.data;
}

export async function fetchCurrentUser() {
  const res = await API.get<{
    id: number;
    role: UserRole;
    username: string;
    email: string;
  }>("/users/me");
  return res.data;
}

export function isStaffRole(
  role?: string,
): role is "admin" | "moderator" {
  return (
    role === "admin" ||
    role === "moderator"
  );
}
