import PropTypes from "prop-types";

import ChatMessage from "../ChatMessage/ChatMessage";

import styles from "./ChatMessages.module.css";

export default function ChatMessages({ messages }) {
  if (!messages.length) {
    return (
      <div className={styles.empty}>
        Todavía no hay mensajes.
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
        />
      ))}
    </div>
  );
}

ChatMessages.propTypes = {
  messages: PropTypes.array.isRequired,
};