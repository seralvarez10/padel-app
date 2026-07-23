import PropTypes from "prop-types";
import styles from "./Section.module.css";

export default function Section({
  title,
  subtitle,
  children,
  action,
}) {
  return (
    <section className={styles.section}>

      <div className={styles.header}>

        <div>

          <h2>{title}</h2>

          {subtitle && (
            <p>{subtitle}</p>
          )}

        </div>

        {action}

      </div>

      {children}

    </section>
  );
}

Section.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  children: PropTypes.node,
  action: PropTypes.node,
};