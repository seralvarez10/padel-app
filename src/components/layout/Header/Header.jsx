import PropTypes from "prop-types";
import Avatar from "../../common/Avatar";

import styles from "./Header.module.css";

export default function Header({
  name,
  avatar,
}) {
  return (
    <header className={styles.header}>

      <div>

        <p className={styles.greeting}>
          Hola 👋
        </p>

        <h2>
          {name}
        </h2>

      </div>

      <Avatar
        src={avatar}
        size="md"
      />

    </header>
  );
}

Header.propTypes = {
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
};