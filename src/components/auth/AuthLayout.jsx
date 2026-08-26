import styles from "./AuthLayout.module.css";

export default function AuthLayout({
  title,
  subtitle,
  children,
}) {
  const titleParts = title.split(" ");

  const highlightedTitle =
    title === "Bienvenido de nuevo";

  return (
    <main className={styles.page}>
      {/* Decoración de fondo */}
      <div className={styles.backgroundDecoration}>
        <div className={styles.circleOne}></div>
        <div className={styles.circleTwo}></div>
        <div className={styles.dots}></div>
      </div>

      <div className={styles.wrapper}>
        <div className={styles.card}>

          <div className={styles.header}>

            <div className={styles.logo}>
              <span>🎾</span>
            </div>

            <h1 className={styles.title}>
              {highlightedTitle ? (
                <>
                  Bienvenido{" "}
                  <span>de nuevo</span>
                </>
              ) : (
                title
              )}
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

        <div className={styles.security}>
          <span>🛡️</span>
          <span>
            Tus datos están protegidos y tu información se mantiene segura.
          </span>
        </div>
      </div>
    </main>
  );
}