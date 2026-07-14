import { useEffect, useState } from "react";
import { getMatches } from "../services/matchService";

export default function useMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMatches();
  }, []);

  async function loadMatches() {
    try {
      setLoading(true);

      const data = await getMatches();

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