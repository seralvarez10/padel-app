import PropTypes from "prop-types";
import styles from "./Stat.module.css";

export default function Stat({
  icon: Icon,
  value,
  label,
}) {
  return (
    <div className={styles.stat}>

      <div className={styles.icon}>
        <Icon size={22} />
      </div>

      <div>

        <h3>{value}</h3>

        <p>{label}</p>

      </div>

    </div>
  );
}

Stat.propTypes = {
  icon: PropTypes.elementType.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  label: PropTypes.string.isRequired,
};