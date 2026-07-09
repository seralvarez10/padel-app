import PropTypes from "prop-types";
import styles from "./Input.module.css";

export default function Input({
  id,
  label,
  error,
  icon: Icon,
  ...props
}) {
  return (
    <div className={styles.container}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}

      <div
        className={`${styles.wrapper} ${
          error ? styles.errorState : ""
        }`}
      >
        {Icon && (
          <Icon
            size={18}
            className={styles.icon}
          />
        )}

        <input
          id={id}
          className={styles.input}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
      </div>

      {error && (
        <span
          id={`${id}-error`}
          className={styles.error}
        >
          {error}
        </span>
      )}
    </div>
  );
}

Input.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  icon: PropTypes.elementType,
};