import PropTypes from "prop-types";
import Avatar from "../../common/Avatar";

import styles from "./ChatMessage.module.css";

export default function ChatMessage({ message }) {
  return (
    <div className={styles.message}>
      <Avatar
        src={message.profiles.avatar_url}
        name={message.profiles.display_name}
        size="sm"
      />

      <div className={styles.content}>
        <div className={styles.header}>
          <strong>{message.profiles.display_name}</strong>

          <span>
            {new Date(message.created_at).toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <p>{message.message}</p>
      </div>
    </div>
  );
}

ChatMessage.propTypes = {
  message: PropTypes.object.isRequired,
};