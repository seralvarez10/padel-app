import PropTypes from "prop-types";
import styles from "./Card.module.css";

export default function Card({
  children,
  className = "",
  onClick,
}) {
  return (
    <div
      className={`${styles.card} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
};