import PropTypes from "prop-types";
import styles from "./Layout.module.css";

export default function Layout({ children }) {
  return (
    <main>
      {children}
    </main>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};