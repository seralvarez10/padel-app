import { useEffect, useState } from "react";
import { getMatchResult } from "../services/matchService";

export default function useMatchResult(matchId) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadResult() {
    try {
      setLoading(true);
      setError(null);

      const data = await getMatchResult(matchId);

      setResult(data);
    } catch (err) {
      console.error("Error al cargar resultado:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!matchId) return;

    loadResult();
  }, [matchId]);

  return {
    result,
    loading,
    error,
    reload: loadResult,
  };
}