import PropTypes from "prop-types";
import { Search } from "lucide-react";

import styles from "./SearchBar.module.css";

export default function SearchBar({
  placeholder = "Buscar partidos...",
  value,
  onChange,
}) {
  return (
    <div className={styles.container}>
      <Search size={18} />

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={styles.input}
      />
    </div>
  );
}

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};