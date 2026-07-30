import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { deleteMatch } from "../services/matchService";

export default function useDeleteMatch(matchId) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  async function remove() {

    try {
      setLoading(true);

      await deleteMatch(matchId);

      toast.success("Partido eliminado correctamente");

      navigate("/explore");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return {
    remove,
    loading,
  };
}