import React from "react";
import { Link } from "react-router-dom";

function HomeWord({
  id,
  idleText,
  idleContent,
  revealedText,
  to,
  active,
  onEnter,
  onLeave,
  onReveal,
}) {
  const isActive = active === id;
  const isDimmed = active !== null && !isActive;

  if (isActive) {
    return (
      <h1 onMouseEnter={onEnter} onMouseLeave={onLeave}>
        <Link to={to} className="wordLink" onClick={(e) => e.stopPropagation()}>
          <span className="desktopOnly">{revealedText}</span>
          <span className="mobileOnly">
            {idleText} → {revealedText}
          </span>
        </Link>
      </h1>
    );
  }

  return (
    <h1
      className={isDimmed ? "wordDim" : ""}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={(e) => {
        e.stopPropagation();
        onReveal();
      }}
    >
      {idleContent || idleText}
    </h1>
  );
}

export default HomeWord;
