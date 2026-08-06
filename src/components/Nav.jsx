import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import "../pages/Home/Home.css";
import "./Nav.css";

function Nav() {
  const location = useLocation();
  const isHome =
    location.pathname === "/Portfolio/" || location.pathname === "/Portfolio";

  if (isHome) return null;

  return (
    <div className="topNav">
      <div className="navLinks">
        <NavLink
          to="/Portfolio/"
          end
          className={({ isActive }) => (isActive ? "navLink active" : "navLink")}
        >
          HOME
        </NavLink>
        <NavLink
          to="/Portfolio/Projects"
          className={({ isActive }) => (isActive ? "navLink active" : "navLink")}
        >
          PROJECTS
        </NavLink>
        <NavLink
          to="/Portfolio/Services"
          className={({ isActive }) => (isActive ? "navLink active" : "navLink")}
        >
          SERVICES
        </NavLink>
        <NavLink
          to="/Portfolio/About"
          className={({ isActive }) => (isActive ? "navLink active" : "navLink")}
        >
          ABOUT ME
        </NavLink>
      </div>
    </div>
  );
}

export default Nav;
