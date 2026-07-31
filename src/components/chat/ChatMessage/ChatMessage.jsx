import PropTypes from "prop-types";
import Avatar from "../../common/Avatar";
import { useAuth } from "../../../contexts/AuthContext";

import styles from "./ChatMessage.module.css";

export default function ChatMessage({ message }) {
  const { user } = useAuth();

  const isOwnMessage = message.profiles.id === user?.id;
  return (
    <div
      className={`${styles.message} ${isOwnMessage ? styles.own : styles.other
        }`}
    >
      {!isOwnMessage && (
        <Avatar
          src={message.profiles.avatar_url}
          name={message.profiles.display_name}
          size="sm"
        />
      )}

      <div className={styles.content}>
        {!isOwnMessage && (
          <strong className={styles.name}>
            {message.profiles.display_name}
          </strong>
        )}

        <div className={styles.bubble}>
          {message.message}
        </div>

        <span className={styles.time}>
          {new Date(message.created_at).toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

ChatMessage.propTypes = {
  message: PropTypes.object.isRequired,
};