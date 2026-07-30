import { useState } from "react";
import { joinMatch, leaveMatch } from "../services/matchService";

export default function useJoinMatch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function join(matchId, joined) {
    try {
      setLoading(true);
      setError(null);

      if (joined) {
        await leaveMatch(matchId);
      } else {
        await joinMatch(matchId);
      }

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