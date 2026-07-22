import PropTypes from "prop-types";
import styles from "./FormSection.module.css";

export default function FormSection({
  title,
  children,
}) {
  return (
    <section className={styles.section}>
      <h3>{title}</h3>

      {children}
    </section>
  );
}

FormSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};