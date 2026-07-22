import PropTypes from "prop-types";
import Avatar from "../../common/Avatar";

import styles from "./Header.module.css";

export default function Header({
  name,
  avatar,
}) {
  return (
    <header className={styles.header}>

      <div className={styles.content}>

        <p className={styles.greeting}>
          Hola 👋
        </p>

        <h1 className={styles.name}>
          {name}
        </h1>

        <p className={styles.subtitle}>
          Encuentra tu próximo partido
        </p>

      </div>

      <div className={styles.avatar}>
        <Avatar
          src={avatar}
          size="md"
        />
      </div>

    </header>
  );
}

Header.propTypes = {
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string,
};