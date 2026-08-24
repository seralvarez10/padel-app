import { useState } from "react";
import toast from "react-hot-toast";

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
    match_type: "Libre",
    court_type: "Indoor",
    duration: 90,
    description: "",
    position: "ANY",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function submit() {
    try {
      setLoading(true);
      setError(null);

      if (!form.title.trim()) {
        throw new Error("Debes introducir un título.");
      }

      if (!form.location.trim()) {
        throw new Error("Debes indicar el club.");
      }

      if (!form.city.trim()) {
        throw new Error("Debes indicar la ciudad.");
      }

      if (!form.match_date) {
        throw new Error("Selecciona una fecha.");
      }

      if (!form.match_time) {
        throw new Error("Selecciona una hora.");
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const selectedDate = new Date(form.match_date);

      if (selectedDate < today) {
        throw new Error(
          "La fecha no puede ser anterior a hoy."
        );
      }

      const now = new Date();

      const selectedDateTime = new Date(
        `${form.match_date}T${form.match_time}`
      );

      if (selectedDateTime < now) {
        throw new Error(
          "La fecha y la hora deben ser posteriores a la actual."
        );
      }

      if (
        Number(form.level_min) >
        Number(form.level_max)
      ) {
        throw new Error(
          "El nivel mínimo no puede ser mayor que el nivel máximo."
        );
      }

      const cleanForm = {
        ...form,
        title: form.title.trim(),
        location: form.location.trim(),
        city: form.city.trim(),
        description: form.description.trim(),
      };

      const match = await createMatch(cleanForm);

      return match;
    } catch (err) {
      console.error(err);

      setError(err.message);

      toast.error(err.message);

      return null;
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