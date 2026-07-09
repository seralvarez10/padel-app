import { useState } from "react";
import { createMatch } from "../services/matchService";
import { useNavigate } from "react-router-dom";

export default function CreateMatch() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    match_date: "",
    match_time: "",
    location: "",
    city: "",
    level_min: 2,
    level_max: 4,
    occupied_slots: 1,
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { error } = await createMatch(form);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Partido creado correctamente");

    navigate("/dashboard");
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Crear Partido</h1>

      <form onSubmit={handleSubmit}>

        <p>Fecha</p>

        <input
          type="date"
          name="match_date"
          value={form.match_date}
          onChange={handleChange}
        />

        <p>Hora</p>

        <input
          type="time"
          name="match_time"
          value={form.match_time}
          onChange={handleChange}
        />

        <p>Club</p>

        <input
          name="location"
          value={form.location}
          onChange={handleChange}
        />

        <p>Ciudad</p>

        <input
          name="city"
          value={form.city}
          onChange={handleChange}
        />

        <p>Nivel mínimo</p>

        <input
          type="number"
          step="0.5"
          name="level_min"
          value={form.level_min}
          onChange={handleChange}
        />

        <p>Nivel máximo</p>

        <input
          type="number"
          step="0.5"
          name="level_max"
          value={form.level_max}
          onChange={handleChange}
        />

        <p>¿Cuántos venís?</p>

        <select
          name="occupied_slots"
          value={form.occupied_slots}
          onChange={handleChange}
        >
          <option value="1">Voy solo</option>
          <option value="2">Ya somos dos</option>
          <option value="3">Ya somos tres</option>
        </select>

        <br />
        <br />

        <button type="submit">
          Crear Partido
        </button>

      </form>
    </div>
  );
}