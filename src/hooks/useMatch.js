import { useEffect, useState } from "react";
import { getMatchById } from "../services/matchService";

export default function useMatch(id) {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMatch();
  }, [id]);

  async function loadMatch() {
    try {
      setLoading(true);

      const data = await getMatchById(id);

      setMatch(data);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return {
    match,
    loading,
    error,
    reload: loadMatch,
  };
}