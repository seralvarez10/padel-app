import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

import ChatMessage from "../ChatMessage/ChatMessage";

import styles from "./ChatMessages.module.css";

export default function ChatMessages({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

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

      <div ref={bottomRef} />
    </div>
  );
}

ChatMessages.propTypes = {
  messages: PropTypes.array.isRequired,
};