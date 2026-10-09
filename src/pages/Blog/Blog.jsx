import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fetchPosts, formatDate, excerpt } from "../../utils/blogPosts";
import "./Blog.css";

function Blog() {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;
    fetchPosts()
      .then((data) => {
        if (!active) return;
        setPosts(data);
        setStatus("ready");
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <motion.div
      className="blogPage"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.18 }}
    >
      <header className="blogHeader">
        <h1 className="blogHeading">Blogs</h1>
        <p className="blogSubhead">Notes, updates, and lessons learned.</p>
      </header>

      <div className="blogContainer">
        {status === "loading" && <p className="blogState">Loading posts…</p>}
        {status === "error" && (
          <p className="blogState">Unable to load posts right now.</p>
        )}
        {status === "ready" && posts.length === 0 && (
          <p className="blogState">No posts yet. Check back soon.</p>
        )}
        {posts.map((post) => (
          <Link
            className="blogItem"
            key={post.id}
            to={`/Portfolio/Blogs/${post.slug}`}
          >
            <div className="blogDate">{formatDate(post.date)}</div>
            <h2 className="blogItemTitle">{post.title}</h2>
            <p className="blogExcerpt">{excerpt(post.body)}</p>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

export default Blog;