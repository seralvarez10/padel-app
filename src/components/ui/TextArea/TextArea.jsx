import PropTypes from "prop-types";

import styles from "./Textarea.module.css";

export default function Textarea({
  label,
  error,
  className = "",
  ...props
}) {
  return (
    <div className={`${styles.container} ${className}`}>
      {label && (
        <label
          htmlFor={props.id}
          className={styles.label}
        >
          {label}
        </label>
      )}

      <textarea
        className={`${styles.textarea} ${
          error ? styles.textareaError : ""
        }`}
        {...props}
      />

      {error && (
        <span className={styles.error}>
          {error}
        </span>
      )}
    </div>
  );
}

Textarea.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
};