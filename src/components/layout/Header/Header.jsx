import PropTypes from "prop-types";
import Avatar from "../../common/Avatar";
import { useNavigate } from "react-router-dom";

import styles from "./Header.module.css";

export default function Header({
  name,
  avatar,
}) {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>

      <div
        className={styles.content}
        onClick={() => navigate("/profile")}
      >

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

      <div
        className={styles.avatar}
        onClick={() => navigate("/profile")}
      >
        <Avatar
          src={avatar}
          name={name}
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