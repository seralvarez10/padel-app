import { useEffect, useState } from "react";
import { getMatchPlayers } from "../services/matchService";

export default function useMatchPlayers(matchId) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayers();
  }, [matchId]);

  async function loadPlayers() {
    try {
      setLoading(true);

      const data = await getMatchPlayers(matchId);

      setPlayers(data);
    } finally {
      setLoading(false);
    }
  }

  return {
    players,
    loading,
    reload: loadPlayers,
  };
}