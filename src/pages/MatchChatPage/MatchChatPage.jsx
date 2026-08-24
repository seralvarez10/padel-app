import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Link } from "react-router-dom";

import Layout from "../../components/layout/Layout";
import BottomNavigation from "../../components/layout/BottomNavigation";

import ChatMessages from "../../components/chat/ChatMessages/ChatMessages";
import ChatInput from "../../components/chat/ChatInput/ChatInput";
import ChatHeader from "../../components/chat/ChatHeader/ChatHeader";

import {
  getMessages,
  sendMessage,
  markMessagesAsRead,
} from "../../services/chatService";

import styles from "./MatchChatPage.module.css";

export default function MatchChatPage() {
  const { matchId } = useParams();

  const [match, setMatch] = useState(null);

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
  async function loadMatch() {
    try {
      const { data, error } = await supabase
        .from("matches")
        .select(`
    *,
    match_players (
      id,
      player_id,
      role
    )
  `)
        .eq("id", matchId)
        .single();

      if (error) throw error;
      setMatch(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadMessages();
    loadMatch();
    markMessagesAsRead(matchId);

    const channel = supabase
      .channel(`chat-${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "match_messages",
          filter: `match_id=eq.${matchId}`,
        },
        () => {
          loadMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  async function handleSend(text) {
    try {
      await sendMessage(matchId, text);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Layout>
        <div className={styles.page}>
          <ChatHeader match={match} />

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