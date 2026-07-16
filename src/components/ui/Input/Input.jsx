import PropTypes from "prop-types";
import styles from "./Input.module.css";

export default function Input({
  label,
  icon: Icon,
  error,
  ...props
}) {
  return (
    <div className={styles.container}>

      {label && (
        <label className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.inputWrapper}>

        {Icon && (
          <Icon
            size={18}
            className={styles.icon}
          />
        )}

        <input
          className={styles.input}
          {...props}
        />

      </div>

      {error && (
        <span className={styles.error}>
          {error}
        </span>
      )}

    </div>
  );
}

Input.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.elementType,
  error: PropTypes.string,
};