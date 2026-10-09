import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { fetchPosts, findPost, formatDate } from "../../utils/blogPosts";
import "./Blog.css";

function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;
    fetchPosts()
      .then((data) => {
        if (!active) return;
        setPost(findPost(data, slug));
        setStatus("ready");
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <motion.div
      className="blogPage"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.18 }}
    >
      <div className="blogContainer postContainer">
        <Link className="blogBack" to="/Portfolio/Blogs">
          ← All posts
        </Link>

        {status === "loading" && <p className="blogState">Loading post…</p>}
        {status === "error" && (
          <p className="blogState">Unable to load this post right now.</p>
        )}
        {status === "ready" && !post && (
          <p className="blogState">This post could not be found.</p>
        )}

        {post && (
          <article className="blogArticle">
            <div className="blogDate">{formatDate(post.date)}</div>
            <h1 className="blogPostTitle">{post.title}</h1>
            {post.body.split("\n").map((line, index) =>
              line.trim() === "" ? (
                <div className="blogSpacer" key={index} />
              ) : (
                <p className="blogParagraph" key={index}>
                  {line}
                </p>
              )
            )}
          </article>
        )}
      </div>
    </motion.div>
  );
}

export default BlogPost;