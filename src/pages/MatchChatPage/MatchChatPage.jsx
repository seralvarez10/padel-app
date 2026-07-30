import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Layout from "../../components/layout/Layout";
import BottomNavigation from "../../components/layout/BottomNavigation";

import ChatMessages from "../../components/chat/ChatMessages/ChatMessages";
import ChatInput from "../../components/chat/ChatInput/ChatInput";

import { getMessages, sendMessage } from "../../services/chatService";

import styles from "./MatchChatPage.module.css";

export default function MatchChatPage() {
  const { matchId } = useParams();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadMessages() {
    try {
      const data = await getMessages(matchId);
      setMessages(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, [matchId]);

  async function handleSend(text) {
    try {
      await sendMessage(matchId, text);
      await loadMessages();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Layout>
        <div className={styles.page}>
          <h2>Chat del partido</h2>

          {loading ? (
            <p>Cargando...</p>
          ) : (
            <ChatMessages messages={messages} />
          )}

          <ChatInput onSend={handleSend} />
        </div>
      </Layout>

      <BottomNavigation />
    </>
  );
}