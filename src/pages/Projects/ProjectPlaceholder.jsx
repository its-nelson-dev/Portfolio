import React from "react";

function ProjectPlaceholder({ variant, image, alt }) {
  if (image) {
    return (
      <img
        className={`placeholderShot placeholderShot--${variant}`}
        src={image}
        alt={alt || ""}
      />
    );
  }

  return <div className={`placeholderShot placeholderShot--${variant}`} />;
}

export default ProjectPlaceholder;
