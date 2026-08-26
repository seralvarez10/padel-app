import PropTypes from "prop-types";
import styles from "./Layout.module.css";

export default function Layout({
  children,
  className = "",
}) {
  return (
    <main
      className={`${styles.layout} ${className}`}
    >
      {children}
    </main>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,

  className: PropTypes.string,
};