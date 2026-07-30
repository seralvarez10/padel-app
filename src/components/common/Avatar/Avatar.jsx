import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./Avatar.module.css";

export default function Avatar({
  src,
  name = "",
  alt = "Avatar",
  size = "md",
  className = "",
}) {
  const [imageError, setImageError] = useState(false);

  const safeName = name ?? "";

  const initials = safeName
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  if (!src || imageError) {
    return (
      <div
        className={`${styles.avatar} ${styles[size]} ${styles.placeholder} ${className}`}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${styles.avatar} ${styles[size]} ${className}`}
      onError={() => setImageError(true)}
    />
  );
}

Avatar.propTypes = {
  src: PropTypes.string,
  name: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  className: PropTypes.string,
};