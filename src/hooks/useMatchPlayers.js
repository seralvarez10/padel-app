import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import { getMatchPlayers } from "../services/matchService";

export default function useMatchPlayers(matchId) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayers();

    const channel = supabase
      .channel(`match-${matchId}`)

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "match_players",
          filter: `match_id=eq.${matchId}`,
        },
        () => {
          loadPlayers();
        }
      )

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  async function loadPlayers() {
    try {
      setLoading(true);

      const data = await getMatchPlayers(matchId);
      console.table(data);
      console.log(data[0]);
      setPlayers(
        data.filter((player) => player.status !== "LEFT")
      );
    } finally {
      setLoading(false);
    }
  }

  return {
    players,
    loading,
    reload: loadPlayers,
    totalPlayers: players.length,
  };
}