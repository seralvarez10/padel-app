import PropTypes from "prop-types";

import styles from "./Select.module.css";

export default function Select({
  label,
  options,
  error,
  className = "",
  ...props
}) {
  return (
    <div className={`${styles.container} ${className}`}>
      {label && (
        <label
          htmlFor={props.id}
          className={styles.label}
        >
          {label}
        </label>
      )}

      <select
        className={`${styles.select} ${
          error ? styles.selectError : ""
        }`}
        {...props}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <span className={styles.error}>
          {error}
        </span>
      )}
    </div>
  );
}

Select.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  error: PropTypes.string,
  className: PropTypes.string,
};