import { useState } from "react";
import { joinMatch } from "../services/matchService";

export default function useJoinMatch() {
  const [loading, setLoading] = useState(false);

  async function join(matchId) {
    try {
      setLoading(true);

      await joinMatch(matchId);

      return true;
    } catch (err) {
      console.error(err);
      alert(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  return {
    join,
    loading,
  };
}