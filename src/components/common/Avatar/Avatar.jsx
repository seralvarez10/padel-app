import PropTypes from "prop-types";
import styles from "./Avatar.module.css";

export default function Avatar({
  src,
  alt = "Avatar",
  size = "md",
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={`${styles.avatar} ${styles[size]}`}
    />
  );
}

Avatar.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
};