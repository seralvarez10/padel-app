import PropTypes from "prop-types";

import styles from "./FormSection.module.css";

export default function FormSection({
  title,
  icon: Icon,
  children,
}) {
  return (
    <section className={styles.section}>

      <div className={styles.header}>
        {Icon && (
          <Icon
            size={19}
            className={styles.icon}
          />
        )}

        <h3>
          {title}
        </h3>
      </div>

      <div className={styles.content}>
        {children}
      </div>

    </section>
  );
}

FormSection.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  children: PropTypes.node.isRequired,
};