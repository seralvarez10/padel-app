import { useEffect, useState } from "react";
import { getMyMatches } from "../services/matchService";

export default function useMyMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMatches();
  }, []);

  async function loadMatches() {
    try {
      setLoading(true);

      const data = await getMyMatches();

      setMatches(data);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return {
    matches,
    loading,
    error,
    reload: loadMatches,
  };
}