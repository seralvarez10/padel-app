import { useState } from "react";
import PropTypes from "prop-types";

import styles from "./ChatInput.module.css";

export default function ChatInput({ onSend }) {
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const text = message.trim();

    if (!text) return;

    await onSend(text);

    setMessage("");
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        placeholder="Escribe un mensaje..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button type="submit">
        Enviar
      </button>
    </form>
  );
}

ChatInput.propTypes = {
  onSend: PropTypes.func.isRequired,
};