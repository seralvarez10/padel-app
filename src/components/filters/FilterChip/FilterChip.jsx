import PropTypes from "prop-types";
import styles from "./FilterChip.module.css";

export default function FilterChip({
  label,
  active = false,
  onClick,
}) {
  return (
    <button
      type="button"
      className={`${styles.chip} ${
        active ? styles.active : ""
      }`}
      onClick={onClick}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

FilterChip.propTypes = {
  label: PropTypes.string.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func,
};