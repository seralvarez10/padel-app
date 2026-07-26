import { useState } from "react";
import { leaveMatch } from "../services/matchService";

export default function useLeaveMatch() {
  const [loading, setLoading] = useState(false);

  async function leave(matchId) {
    try {
      setLoading(true);

      await leaveMatch(matchId);

      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }

  return {
    leave,
    loading,
  };
}