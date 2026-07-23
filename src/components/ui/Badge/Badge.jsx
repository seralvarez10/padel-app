import PropTypes from "prop-types";
import styles from "./Badge.module.css";

export default function Badge({
  children,
  variant = "primary",
}) {
  return (
    <span
      className={`${styles.badge} ${styles[variant]}`}
    >
      {children}
    </span>
  );
}

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    "primary",
    "success",
    "warning",
    "danger",
    "gray",
  ]),
};