import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "../pages/Home/Home";
import Projects from "../pages/Projects/Projects";
import About from "../pages/About Me/About";
import Services from "../pages/Services/Services";
import Blog from "../pages/Blog/Blog";
import BlogPost from "../pages/Blog/BlogPost";
import { AnimatePresence } from "framer-motion";
import Nav from "./Nav";
function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) return;
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return (
    <AnimatePresence>
      <Nav />
      <Routes location={location} key={location.pathname}>
        <Route index element={<Home />} />
        <Route path="/Projects/" element={<Projects />} />
        <Route path="/About/" element={<About />} />
        <Route path="/Services/" element={<Services />} />
        <Route path="/Blogs/" element={<Blog />} />
        <Route path="/Blogs/:slug" element={<BlogPost />} />
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
