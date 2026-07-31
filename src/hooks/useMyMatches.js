import { useEffect, useState } from "react";
import { getMyMatches } from "../services/matchService";
import useRealtimeMatches from "./useRealtimeMatches";

export default function useMyMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadMatches() {
    try {
      setLoading(true);

      const data = await getMyMatches();

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