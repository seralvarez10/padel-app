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
      console.table(data);
      console.log(data[0]);
      setPlayers(data);
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