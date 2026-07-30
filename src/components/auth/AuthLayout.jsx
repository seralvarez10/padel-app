import styles from "./AuthLayout.module.css";

export default function AuthLayout({
  title,
  subtitle,
  children,
}) {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>
            🎾
          </div>

          <h1 className={styles.title}>
            {title}
          </h1>

          {subtitle && (
            <p className={styles.subtitle}>
              {subtitle}
            </p>
          )}
        </div>

        <div className={styles.content}>
          {children}
        </div>
      </div>
    </main>
  );
}