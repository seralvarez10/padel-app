import { useState } from "react";
import { createMatch } from "../services/matchService";

export default function useCreateMatch() {
  const [form, setForm] = useState({
    title: "",
    location: "",
    city: "",
    match_date: "",
    match_time: "",
    level_min: 2,
    level_max: 4,
    occupied_slots: 1,
    match_type: "Libre",
    court_type: "Indoor",
    duration: 90,
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function submit() {
    try {
      setLoading(true);
      setError(null);

      const { error } = await createMatch(form);

      if (error) throw error;

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
    form,
    loading,
    error,
    handleChange,
    submit,
  };
}