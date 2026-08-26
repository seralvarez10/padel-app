import styles from "./AuthButton.module.css";

export default function AuthButton({
  children,
  loading = false,
  ...props
}) {
  return (
    <button
      className={styles.button}
      disabled={loading}
      {...props}
    >
      <span>
        {loading
          ? "Cargando..."
          : children}
      </span>

      {!loading && (
        <span className={styles.arrow}>
          →
        </span>
      )}
    </button>
  );
}