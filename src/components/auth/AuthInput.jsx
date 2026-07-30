import styles from "./AuthInput.module.css";

export default function AuthInput({
  label,
  icon: Icon,
  error,
  ...props
}) {
  return (
    <div className={styles.field}>
      {label && (
        <label className={styles.label}>
          {label}
        </label>
      )}

      <div
        className={`${styles.inputContainer} ${
          error ? styles.errorBorder : ""
        }`}
      >
        {Icon && (
          <Icon
            size={20}
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