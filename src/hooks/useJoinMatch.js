import { useState } from "react";
import {
  joinMatch,
  leaveMatch,
} from "../services/matchService";

export default function useJoinMatch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function join(
    matchId,
    joined,
    position = null
  ) {
    try {
      setLoading(true);
      setError(null);

      if (joined) {
        await leaveMatch(matchId);
      } else {
        if (!position) {
          throw new Error(
            "Debes seleccionar una posición"
          );
        }

        await joinMatch(
          matchId,
          position
        );
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