const POSTS_URL = `${import.meta.env.BASE_URL}posts.json`;

export async function fetchPosts() {
  const res = await fetch(POSTS_URL);
  if (!res.ok) throw new Error("Failed to load posts");
  const data = await res.json();
  const posts = Array.isArray(data) ? data : data.posts || [];
  return posts
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function findPost(posts, slug) {
  return posts.find((post) => post.slug === slug) || null;
}

export function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function excerpt(body, max = 180) {
  const text = (body || "").replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}
