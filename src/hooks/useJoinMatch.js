import { useState } from "react";
import { joinMatch } from "../services/matchService";

export default function useJoinMatch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function join(matchId) {
    try {
      setLoading(true);
      setError(null);

      await joinMatch(matchId);

      return true;
    } catch (err) {
      console.error(err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  return {
    join,
    loading,
    error,
  };
}
async function handleJoin() {
  const ok = await join(match.id);

  if (ok) {
    await reload();
  }
}