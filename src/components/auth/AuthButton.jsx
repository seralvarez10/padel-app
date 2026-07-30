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
      {loading ? "Cargando..." : children}
    </button>
  );
}