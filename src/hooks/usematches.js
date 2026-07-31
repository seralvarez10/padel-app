import { useEffect, useState } from "react";
import { getMatches } from "../services/matchService";
import useRealtimeMatches from "./useRealtimeMatches";

export default function useMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadMatches() {
    try {
      setLoading(true);

      const data = await getMatches();

      setMatches(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMatches();
  }, []);

  useRealtimeMatches(loadMatches);

  return {
    matches,
    loading,
    error,
    reload: loadMatches,
  };
}