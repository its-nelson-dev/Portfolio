import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

function ProjectSlideshow({ images, alt, variant }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [baseIndex, setBaseIndex] = useState(0);

  const goTo = (index) => {
    setBaseIndex(currentIndex);
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => {
      goTo((currentIndex + 1) % images.length);
    }, 1800);
    return () => clearInterval(id);
  }, [images.length, currentIndex]);

  return (
    <div className="slideshow">
      <div className={`placeholderShot placeholderShot--${variant} slideshowFrame`}>
        <img src={images[baseIndex]} alt={alt} className="slideshowImg" />
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={alt}
          className="slideshowImg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
        />
      </div>
      {images.length > 1 && (
        <div className="slideshowDots">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              aria-label={`Show slide ${index + 1}`}
              className={
                index === currentIndex
                  ? "slideshowDot slideshowDot--active"
                  : "slideshowDot"
              }
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectSlideshow;
