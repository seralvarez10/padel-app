import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { getUnreadMessageCount } from "../services/chatService";

export default function useUnreadMessages(matchId) {
  const [unreadCount, setUnreadCount] = useState(0);

  async function loadUnreadCount() {
    try {
      const count = await getUnreadMessageCount(matchId);
      setUnreadCount(count);
    } catch (error) {
      console.error(
        "Error al cargar mensajes no leídos:",
        error
      );
    }
  }

  useEffect(() => {
    if (!matchId) return;

    loadUnreadCount();

    const channel = supabase
      .channel(`unread-messages-${matchId}`)

      // Nuevos mensajes
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "match_messages",
          filter: `match_id=eq.${matchId}`,
        },
        () => {
          loadUnreadCount();
        }
      )

      // Cambios en los jugadores del partido
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "match_players",
          filter: `match_id=eq.${matchId}`,
        },
        () => {
          loadUnreadCount();
        }
      )

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  return {
    unreadCount,
    reload: loadUnreadCount,
  };
}