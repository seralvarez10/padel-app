import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./Avatar.module.css";

export default function Avatar({
  src,
  name = "",
  alt = "Avatar",
  size = "md",
}) {
  const [imageError, setImageError] = useState(false);

  const initials = name
    .trim()
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  if (!src || imageError) {
    return (
      <div
        className={`${styles.avatar} ${styles[size]} ${styles.placeholder}`}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${styles.avatar} ${styles[size]}`}
      onError={() => setImageError(true)}
    />
  );
}

Avatar.propTypes = {
  src: PropTypes.string,
  name: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
};